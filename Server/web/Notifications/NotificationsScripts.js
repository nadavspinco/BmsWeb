let refreshNotificationsTime = 4000; //2000 milliseconds == 4 seconds
const notificationsObject ={
    lastUpdated :null
}
window.addEventListener('load',()=>{
    setTimeout(updateNotifications,refreshNotificationsTime);
    }
)
async function updateNotifications(){
    const isUpdatedResponse = await fetch('../lastUpdatedNotifications',
        {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(notificationsObject.lastUpdated)
        })
    const isUpdatedResponseObj = await  isUpdatedResponse.json();
    if(isUpdatedResponseObj.isUpdated === false){
        fetchNotifications()
    }
    setTimeout(updateNotifications,refreshNotificationsTime);
}

async function fetchNotifications(){
    const notificationResponse =   await fetch('../notifications',
        {
            method: 'GET',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        })
    const notificationResponseObject = await notificationResponse.json();
     if(notificationResponseObject.errorCode === 0){
         notificationsObject.lastUpdated = notificationResponseObject.lastUpdated
         notificationsObject.notifications =notificationResponseObject.notifications
         setNotifications();
     }
}


function setNotifications(){
    const notifications = notificationsObject.notifications;
    const notificationsDropDownEl = document.querySelector('#notificationsDropDown');
    const notificationsElList = document.querySelector('#notificationsList');
    notificationsDropDownEl.textContent ="Notifications" +'(' +notifications.length + ')';
    let html = ''
    let index = 0;
    notifications.forEach(notification =>
    {html+=getHtmlForNotificationEl(notification,index);
       index++; })
    notificationsElList.innerHTML = html;
    const notificationsItems = document.querySelectorAll('.notificationLink');
    notificationsItems.forEach(notification=>notification.addEventListener('click',function() { showNotification(notification); } ));
}

function getHtmlForNotificationEl(notification,index){
    return  '<li class="notification"><a class="dropdown-item notificationLink"  id="notification" href="#" tabindex=' + index+ '>'+notification.header+'</a></li>'
}
function showNotification(notification){
    const notificationSelectd = notificationsObject.notifications[notification.getAttribute("tabindex")];
    pageContentEl.innerHTML = getHtmlForNotification(notificationSelectd);
    if(notificationSelectd.isPrivate === true){
        deleteNotification(notification);
    }
}

function showHtmlForEl(notificationEl){
    pageContentEl.innerHTML = notificationEl.value;
}

function getHtmlForNotification(notification){
    let html =getHtmlForNotificationHeader(notification);
     html += getHtmlForNotificationMessage(notification);
    return html;
}

function getHtmlForNotificationHeader(notification){
    return '<h2>'+notification.header+'</h2>'
}

function getHtmlForNotificationMessage(notification){
    return'<h3>'+notification.content+'</h3>'
}

async function deleteNotification(notification){
    const response = await fetch('../notifications',
        {
            method: 'DELETE',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(notification)
        })
    const responseObj = await response.json();
    if(responseObj.errorCode ===0){
        return true;
    }
    return false;
}