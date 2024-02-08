var $messages = $('.messages-content'),
  d, h, m,
  i = 0;

let isRecivngMessage = false;

$(window).load(function () {
  $messages.mCustomScrollbar();
  setTimeout(function () {
    addEmptyBotMessage();
    setTimeout(function () {
      const firstMessage = 'Hey there! 🎉\nI\'m Leo your new English buddy, ready to dive into the fun side of learning. Let\'s chat, laugh, and level up your skills as if we\'re just friends hanging out.\nReady to start this awesome journey together? 😄';
      addNewDataMessage(firstMessage);
      messages.push({ role: "assistant", content: firstMessage })
    }, 1500);
  }, 100);
});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate() {
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  if (isRecivngMessage || client.readyState !== WebSocket.OPEN) {
    return;
  }
  isRecivngMessage = true;
  messages.push({ role: "user", content: msg })

  console.log(messages)
  client.send(JSON.stringify(messages));
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
  addEmptyBotMessage();

}

$('.message-submit').click(function () {
  insertMessage();
});

$(window).on('keydown', function (e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
})

function addEmptyBotMessage() {
  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="./Leo.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
}

function addNewDataMessage(data) {
  $('.message.loading').remove();
  $('<div class="message new"><figure class="avatar"><img src="./Leo.png" /></figure><span class="message_data">' + data + '</span></div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  updateScrollbar();
}

function changeLastMessage(newContent) {
  const lastMessage = $('.mCSB_container .message.new').last();
  if (lastMessage.length) {
    lastMessage.find('span').text(newContent);
  }
  updateScrollbar();
}


const client = new WebSocket('ws://localhost:8081');

client.onopen = () => {
  console.log('Connected to server.');
};

const messages = []
let buildMessage = null
client.onmessage = (message) => {
  message = JSON.parse(message.data);
  if (buildMessage == null) {
    addNewDataMessage("")
    buildMessage = "";
  }

  buildMessage += message?.message;
  if (!message?.end) {
    changeLastMessage(buildMessage)
  }
  else if (message?.end) {
    changeLastMessage(buildMessage)
    fetchAudio(buildMessage)
    messages.push({ role: "assistant", content: buildMessage })
    buildMessage = null
    isRecivngMessage = false;
  }
};
client.onclose = () => {
  console.log('Disconnected from server.');
  addNewDataMessage("Sorry, The server is closed. See you later...");
};



const voiceId = "TxGEqnHWrfWFTfGW9XjX";
const model = 'eleven_monolingual_v1';
const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}`;
const textToSpeachSocket = new WebSocket(wsUrl);

textToSpeachSocket.onopen = function (event) {
  textToSpeachSocket.send(JSON.stringify({
    "text": " ",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.8
    },
    "xi_api_key": "ac12c1b69302b01f0a81f7553c3f32e1",
  }));

  textToSpeachSocket.send(JSON.stringify({
    "text": "Hello World ",
    "try_trigger_generation": true,
  }));


  textToSpeachSocket.send(JSON.stringify({
    "text": ""
  }));
};

// 5. Handle server responses
textToSpeachSocket.onmessage = function (event) {
  const response = JSON.parse(event.data);

  console.log("Server response:", response);

  if (response.audio) {
    const audioBytes = atob(response.audio);
    const audioArray = new Uint8Array(audioBytes.length);
    for (let i = 0; i < audioBytes.length; i++) {
      audioArray[i] = audioBytes.charCodeAt(i);
    }

    const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.play()
      .then(() => console.log("Audio is playing"))
      .catch(error => console.error("Error playing audio:", error));

    console.log("Received audio chunk");
  } else {
    console.log("No audio data in the response");
  }

  if (response.isFinal) {
    // the generation is complete
  }

  if (response.normalizedAlignment) {
    // use the alignment info if needed
  }
};

// Handle errors
textToSpeachSocket.onerror = function (error) {
  console.error(`WebSocket Error: ${error}`);
};

// Handle socket closing
textToSpeachSocket.onclose = function (event) {
  if (event.wasClean) {
    console.info(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
  } else {
    console.warn('Connection died');
  }
};