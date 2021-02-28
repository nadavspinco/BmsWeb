const sendNotificationEl = document.querySelector('#sendNotification');
const deleteNotificationEl = document.querySelector('#deleteNotification');
sendNotificationEl.addEventListener('click', showSendNotificationContent);
deleteNotificationEl.addEventListener('click',showAllNonPrivateNotifications);

function showSendNotificationContent(){
    pageContentManagerEl.innerHTML ='';
    let html =  '<label for="notificationHeader" class="form-label">Header:</label>'
    +'<input type="text" id="notificationHeader" class="form-control">'
    +'<label for="notificationContent" class="form-label">Content: </label>'
    +'<textarea class="form-control" id="notificationContent" rows="3"></textarea>'
    + '<button type="button" class="btn btn-primary" onclick="sendNotification()">Primary</button>'

    pageContentManagerEl.innerHTML = html;
}
 function sendNotification() {
    const headerEl = document.querySelector('#notificationHeader');
    const header = headerEl.value;
    const contentEl = document.querySelector('#notificationContent');
    const content = contentEl.value;
    if (header == null || header === "") {
        alert("header is empty");
        return;
    }
    if (content == null || content === "") {
        alert("content is empty");
        return;
    }
    const toSend =confirm("are you sure you want to send this notifcations to all members?")
     if(toSend === true) {
         sendNotificationToServlet(header, content);
         headerEl.value = ''
         contentEl.value = ''
     }
}

async function sendNotificationToServlet(header,content){
    const request = {
        header: header,
        content: content,
        isPrivate: false
    }
    const response = await fetch("../notifications",{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(request)
    })
    const responseObj = await response.json();
    if(response.errorCode === 0){
        pageContentManagerEl.innerHTML = '<h2>notification added successfully </h2>'
    }

}
function showAllNonPrivateNotifications(){
    pageContentManagerEl.innerHTML = ''
    let html = getHtmlForNotificationTable()
    notificationsObject.showNotifications =[]
    notificationsObject.notifications.forEach(notification=> {
        if(notification.isPrivate === false){
            notificationsObject.showNotifications.push(notification);
        }
    });
    notificationsObject.showNotifications.forEach(notification=> html+=getHtmlForNotificationRow(notification))
    html+= '</tbody>' + '</table>'
    html+= '<button type="button" class="btn btn-danger" onclick="deleteChosenNotification()">Delete</button>'
    pageContentManagerEl.innerHTML = html;
}

async function deleteChosenNotification() {
    const chosenIndex = getSelectedIndex();
    if (chosenIndex === -1) {
        alert("no notification Selected")
        return;
    }
    const isDeleted = await deleteNotification(notificationsObject.showNotifications[chosenIndex])
    if (isDeleted === true) {
        alert("notification Deleted");
        pageContentManagerEl.innerHTML = ''
    } else {
        //TODO://
    }
}

function getHtmlForNotificationRow(notification){
    return' <tr>' + '<th scope="row">' +
        '<div class="form-check">'+
        '<input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div>'+
        '</th>'+
        '<td class="table-row">' + notification.header+ '</td>'
        +'<td class="table-row">' +notification.content +'</td>'
        +'</tr>'
}

function getHtmlForNotificationTable(){
    return '<table class="table">'
        +'<thead>'
         +'<tr>'
          +'<th class="lbl_white" scope="col">#</th>'
           +'<th class="table-title" scope="col">Header</th>'
           +'<th class="table-title" scope="col">Content</th>'
            +'</tr>'
        +'</thead>'
        +'<tbody>'
}