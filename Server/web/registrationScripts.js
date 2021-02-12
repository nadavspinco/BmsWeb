const addRegistrationEl = document.querySelector("#addRegistration");
addRegistrationEl.addEventListener('click', showAddRegistrationForm)
let windowRegistraions={

}
const reservationToAdd = {
    date: "",
    windowRegistrationn: {
        startTime:{},
        endTime:{}
    },
    listOfMembers : [],
    boatTypes: "",

}
function showAddRegistrationForm(){
    pageContentEl.innerHTML = ' <label for="registrationDate">Select Wanted date:</label>'
+'<input type="date" id="registrationDate" > '
    + '<br>'+'<button type="button" class="btn btn-primary" onclick="setDate()">Next</button>'

}

async function setDate (){
    const dateEl = document.querySelector("#registrationDate")
    if(dateEl!=null) {
        let date = dateEl.value;
        if(date === ""){
            alert("please chose a date ")
            return;
        }
        setDateOnObject(date);

        pageContentEl.innerHTML = ''
        let windowRegistraionRes = await fetch("windowRegistration")

        let responseObj = await windowRegistraionRes.json();
        if (responseObj != null && responseObj != undefined) {
            setWindowRegistrations(responseObj)
        } else {
            //TODO: no connection!
        }
    }

}

function setWindowRegistrations(responseObj)
{
    if(responseObj.errorCode === 0){
        let html = ''
        if(responseObj.windowRegistrations.length ===0){
            //no window registarions exists, so we let the user pick the time
            html =  '<div>'
                +'<label for="startTime">Select Wanted start time:</label>'
               + '<input type="time" id="startTime">'
            +'</div>'
            +'<div>'
               +'<label for="endTime">Select Wmanted end time: </label>'
               + '<input type="time" id="endTime">'
            +'</div>'

        }
        else {
             html= '<select class="form-select" aria-label="Select Window Registration">'
            windowRegistraions = responseObj.windowRegistrations;
             let index = 0;
            for(let window of windowRegistraions){
                html += ' <option value='+index+ '>'+makeWindowRegistrationString(window) +'</option>'
                index++;
            }
            html += '</select>'
        }
        pageContentEl.innerHTML = html
    }
}

function makeWindowRegistrationString(windowRegistration){
    let toReturnString = ""
    if(windowRegistration!=null && windowRegistration!= undefined){
        toReturnString+="from " +windowRegistration.startTime.hour + ":" +  windowRegistration.startTime.minute;
        toReturnString+= " to "+windowRegistration.endTime.hour + ":" +  windowRegistration.endTime.minute;
        if(windowRegistration.activityType != null){
            toReturnString+= "activity type: " + windowRegistration.activityType
        }
        if(windowRegistration.boatType != null){
            toReturnString+= "boat type: " + windowRegistration.boatType
        }
    }
    return toReturnString
}

function setDateOnObject(date){
        reservationToAdd.date = date;
}