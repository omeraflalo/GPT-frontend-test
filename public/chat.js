function addChatMessage(side, userName, message) {
    const messagesContainer = document.getElementById('mesegesContainer');

    const li = document.createElement('li');
    li.className = side;

    if (side == 'bot') {
        const chatImgDiv = document.createElement('div');
        chatImgDiv.className = 'chat-img';
        const img = document.createElement('img');
        img.alt = 'Avatar';
        img.src = 'Leo.png';
        chatImgDiv.appendChild(img);
        li.appendChild(chatImgDiv);
    }


    const chatBodyDiv = document.createElement('div');
    chatBodyDiv.className = 'chat-body';

    const chatMessageDiv = document.createElement('div');
    chatMessageDiv.className = 'chat-message';

    const h5 = document.createElement('h5');
    h5.textContent = userName;

    const p = document.createElement('p');
    p.className = 'message-text'
    p.textContent = message;

    chatMessageDiv.appendChild(h5);
    chatMessageDiv.appendChild(p);

    chatBodyDiv.appendChild(chatMessageDiv);

    li.appendChild(chatBodyDiv);

    messagesContainer.appendChild(li);

    scrollMessages();

    return p;
}

function scrollMessages(){
    const messagesContainer = document.getElementById('mesegesContainer');
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
}

function serverIsOfflineMessage() {
    const serverOfflineMessage = document.getElementById('serverOfflineMessage');
    const mainCard = document.getElementById('mainCard');
    serverOfflineMessage.style.display = 'block';
    mainCard.style.display = 'none';
}

const messages = []

const client = new WebSocket('ws://localhost:8081');

client.onopen = () => {
    console.log('Connected to server.');
};

let messageElement = null
let isRecivngMessage = false;
client.onmessage = (message) => {
    message = JSON.parse(message.data);
    if (messageElement == null) {
        messageElement = addChatMessage('bot', 'Leo', '')
    }

    if (!message?.end) {
        messageElement.textContent += message?.message
    }
    else if (message?.end) {
        messageElement.textContent += message?.message
        messages.push({ role: "assistant", content: messageElement.textContent })
        messageElement = null
        isRecivngMessage = false;
    }
    scrollMessages();
};
client.onclose = () => {
    console.log('Disconnected from server.');
    serverIsOfflineMessage();
};


function buttonClicked() {
    if(!isRecivngMessage){
        isRecivngMessage = true;
        input = document.getElementById('messageInput');
        textValue = input.value;
        input.value = "";
        if (textValue == '') {
            return;
        }
        addChatMessage('student', 'Student', textValue);
        messages.push({ role: "user", content: textValue })

        console.log(messages)
        client.send(JSON.stringify(messages));
    }
}


// export {buttonClicked}