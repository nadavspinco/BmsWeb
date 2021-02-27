const messagesContainerEl = document.querySelector('#messagesContainer');
const sendButtonEl = document.querySelector('#sendButton');

async function sendMessageToServlet(message) {
    const request = {content: message};
    const response = await fetch ('chat',
        {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(request)
        })
}

function sendMessage() {
    const textAreaEl = document.querySelector('#messageTextarea');
    const message= textAreaEl.value;
    if(message === ''){
        alert("you cant send an empty message");
        return;
    }
    textAreaEl.value = ''
    sendMessageToServlet(message)
}

sendButtonEl.addEventListener('click',sendMessage)
let updateTime = 2000;
let lestUpdateChat = null;

function getHtmlForMessage(message) {
    let html = ''
    if(message.member.isManager === true){
        html+= '<div class="container darker">'
    }
    else {
        html+='<div class="container">'
    }
    html+= '<p>'+message.content+'</p>'
    html+=  '<span class="time-left">'+localDateTimeToString(message.createdTime)+'</span>'
    html+= '<span class="time-right">'+message.member.nameMember+'</span>'
    html+= '</div>'
    return html;
}

function setMessages(messages) {
    messagesContainerEl.innerHTML = ''
    let html = ''
    if(messages == null || messages.length === 0){
        html = '<h2>no messages</h2>'
    }
    else {
        messages.forEach(message=> html+= getHtmlForMessage(message));
    }
    messagesContainerEl.innerHTML = html;
}

async function fetchChatMessages() {
    const response = await fetch('chat');
    const responseObj =  await response.json();
    if(responseObj.errorCode === 0){
        setMessages(responseObj.messages);
        lestUpdateChat = responseObj.lastUpdate;
    }
}

async function checkForNewMessages() {
 const resonse = await fetch ('lastUpdateChat',
     {
         method: 'POST',
         headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
         body: JSON.stringify(lestUpdateChat)
     })
    const responseObj = await resonse.json();
 if(responseObj.errorCode === 0){
     if(responseObj.isUpdated === false){
         fetchChatMessages()

     }
 }

    setTimeout(checkForNewMessages,updateTime);
}
setTimeout(checkForNewMessages,updateTime);
