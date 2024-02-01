function addChatMessage(side,userName, message) {
    const messagesContainer = document.getElementById('mesegesContainer');

    const li = document.createElement('li');
    li.className = side;

    if(side=='bot'){
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
    p.textContent = message;

    chatMessageDiv.appendChild(h5);
    chatMessageDiv.appendChild(p);

    chatBodyDiv.appendChild(chatMessageDiv);

    li.appendChild(chatBodyDiv);

    messagesContainer.appendChild(li);
}

const message = []

function buttonClicked() {
    input = document.getElementById('messageInput').value;
    if (input.value == '') {
        return;
    }
    addChatMessage('student','Student',input);
    message.push({role:"user", content: input})

    // send message to server
    fetch('http://localhost:8002/ask-query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: message })
    })
    .then(response => response.text())
    .then(data => {
        message.push({role:"assistant", content: data})

        addChatMessage('bot','Leo',data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}