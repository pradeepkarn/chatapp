const socket = io()

let sender;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

do {
    sender = prompt('Enter your name')
    socket.emit('new-user-joined',sender)
} while (!sender);


socket.on('user-joined',(sender)=>{
    appendUser(`${sender} joined the room`,'outgoing');
})

const appendUser = (msg,msgType) => {
    let mainDiv = document.createElement('div');
    let className = msgType;
    mainDiv.classList.add(className, 'message');

    let markup = `
    <p>${msg}</p>
    `;

    mainDiv.innerHTML = markup;

    messageArea.appendChild(mainDiv)
}

textarea.addEventListener('keyup',(e)=>{
    if (e.key==="Enter") {
        sendMessage(e.target.value)
    }
})

const sendMessage = (message)=>{
    //create msg object with user name and message
    let msg = {
        user: sender,
        message: message.trim()
    }

    // append this message in message area
    appendMessage(msg,'outgoing');
    textarea.value = null;
    scrollToBottom()
    //send these detail to server
    socket.emit('send',msg)
}

const appendMessage = (msg,msgType)=>{
    let mainDiv = document.createElement('div');
    let className = msgType;
    mainDiv.classList.add(className, 'message');

    let markup = `
    <b>${msg.user}</b>
    <p>${msg.message}</p>
    `;

    mainDiv.innerHTML = markup;

    messageArea.appendChild(mainDiv)
}

//receive msg

socket.on('broadcast-message',(msg)=>{
    // appendMessage(`${data.message}: ${data.user}`,'incoming');
    appendMessage(msg,'incoming');
    scrollToBottom()
})

//scroll msg area to bottom 

const scrollToBottom = () => {
    messageArea.scrollTop = messageArea.scrollHeight;
}