const addRegistrationEl = document.querySelector("#addRegistration");
addRegistrationEl.addEventListener('click', showAddRegistrationForm)
let members = []
let windowRegistrations={}

const reservationToAdd = {
    date: "",
    windowRegistration: {
        startTime:{
            hour:"",
            minute:""
        },
        endTime:{
            hour:"",
            minute:""
        },
        activityType:null,
        boatType:null
    },
    members : [],
    boatTypes: [],
    fromWindowRegistration: true,
    startTime: "",
    endTime: "",
}

function showAddRegistrationForm(){
    pageContentEl.innerHTML = ' <label class="lbl_white" for="registrationDate">Select Wanted date:</label>'
        +'<input style="margin-left: 20px" type="date" id="registrationDate" > '
        + '<br>'+'<button type="button" class="btn btn-primary" onclick="setDate()">Next</button>'

}

function clearTimeOffsetOnDate(date){
    date.setHours(0,0,0,0)
}

 function setDate (){
    //set the date on the Reservation object and call makeWindowRegistrationSelection
    const dateEl = document.querySelector("#registrationDate")
    if(dateEl!=null) {
        let date = dateEl.valueAsDate;
        let currentDate = new Date(Date.now());
        if(date == null){
            alert("please chose a date ")
            return;
        }
        clearTimeOffsetOnDate(date)
        clearTimeOffsetOnDate(currentDate)

        if(date < currentDate)
        {
            console.log(date)
            console.log(new Date(Date.now()))

            alert("you can't chose a day that past")
            return;
        }
        setDateOnObject(dateEl.value);
        makeWindowRegistrationSelection();
    }

}

async function makeWindowRegistrationSelection(){
    pageContentEl.innerHTML = ''
    let windowRegistraionRes = await fetch("../windowRegistration")

    let responseObj = await windowRegistraionRes.json();
    if (responseObj != null && responseObj != undefined) {
        setWindowRegistrations(responseObj)
    } else {
        alert("connection lost")
    }
}

function setWindowRegistrations(responseObj)
{
    //get the response object from the servlet and Set the html code for the time selection
    //if there is window Registrations exists the user will to select one
    //else : the user will pick the time
    if(responseObj.errorCode === 0){
        let html = ''
        if(responseObj.windowRegistrations.length ===0){
            //no window registrations exists, so we let the user pick the time
            html =  '<div>'
                +'<label class="lbl_white" for="startTime">Select Wanted start time:</label>'
               + '<input type="time" id="startTime">'
            +'</div>'
            +'<div>'
               +'<label class="lbl_white" for="endTime">Select Wanted end time: </label>'
               + '<input type="time" id="endTime">'
            +'</div>'
                +'<br>'
            + '<button type="button" class="btn btn-primary" onclick="setTimeFromPickers()">next</button>'

        }
        else {
             html= '<select class="form-select" aria-label="Select Window Registration" id="selectWindowRegistration">'
            windowRegistrations = responseObj.windowRegistrations;
             let index = 0;
            for(let window of windowRegistrations){
                html += ' <option value='+index+ '>'+makeWindowRegistrationString(window) +'</option>'
                index++;
            }
            html += '</select>' + '<br>'
            +'<button type="button" class="btn btn-primary" onclick="setTimeFromWindow()">next</button>'
        }
        pageContentEl.innerHTML = html
    }
}

function setTimeFromPickers(){
    const startTimeEl = document.querySelector('#startTime')
    const endTimeEl = document.querySelector('#endTime')
    if(startTimeEl!= null && endTimeEl!= null){
        const startTime = startTimeEl.valueAsDate
        const endTime = endTimeEl.valueAsDate
        console.log(startTime)
        console.log(endTime)
        if(startTime == null) {
            alert("please chose start time")
            return ;
        }
        if(endTime == null){
            alert("please chose end time")
            return ;
        }
         if(startTime >= endTime){ //invalid time selection
             alert("start time should be before end time!")
             return ;
         }

        reservationToAdd.fromWindowRegistration = false;
        reservationToAdd.startTime = startTimeEl.value;
        reservationToAdd.endTime = endTimeEl.value
        reservationToAdd.windowRegistration = null
        makeBoatTypeSelection()
    }
}

function makeBoatTypeSelection(){
    //set the html code for the Boat type selection
    pageContentEl.innerHTML = ''
        let html =
       '<select class="form-select" aria-label="Select Window Registration"  id="boatTypeSelect" multiple>'
    +'<option value="0">SingleBoat</option>'
    +'<option value="1">DoubleBoat</option>'
    +'<option value="2">DoubleBoatPaddle</option>'
    +'<option value="3">DoubleCoxed</option>'
    +'<option value="4">DoublePaddleCoxed</option>'
    +'<option value="5">QuartetBoat</option>'
    +'<option value="6">QuartetBoatPaddle</option>'
   +'<option value="7">QuartetBoatCoxed</option>'
   +'<option value="8">QuartetBoatPaddleCoxed</option>'
   +'<option value="9">OctetBoatCoxed</option>'
    +'<option value="10">OctetBoatCoxedPaddle</option>'
+'</select>'
    +'<button type="button" class="btn btn-primary" onclick="setBoatTypes()">next</button>'
    pageContentEl.innerHTML = html
}

async function makeMembersSelection(){
    //get Members suggestion from the servlet and generate the html code
    pageContentEl.innerHTML = ''
    let html = '<select class="form-select" aria-label="Select Members"  id="membersSelect" multiple>'
    // Error after the first time!
    let response = await fetch("../membersSuggestion",{
        method: 'POST',
    headers: new Headers({'Content-Type': 'application/json;charset=utf-8'})
    })
    let responseObject = await response.json();
    members = responseObject.members;
    let index =0;
    for(let memberSuggestion of members){
        html+= '<option value='+index+'>' + memberSuggestion.nameMember + '</option>';
        index++;
    }
    html+= '</select>' + '<button type="button" class="btn btn-primary" onclick="pickMembers()">next</button>'
    pageContentEl.innerHTML = html;
}
async function validateMembers() {

    //send the Registration to the servlet and show the result

    const response = await fetch("../validateMembers", {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(reservationToAdd)})
    const responseObj = await response.json();
    let html='';
    if(responseObj.errorCode ===0){
        return true;
    }
    else {
        alert(responseObj.errorDetails)
        return false;
    }
    return false;

}

async function pickMembers(){
    // add to the Object all the chosen Members and call to showFinalDetails
    reservationToAdd.members =[] //reset
    const selectedEl = document.querySelectorAll('#membersSelect option:checked')
    const membersIndexValues = Array.from(selectedEl).map(el => el.value);
    for(let value of membersIndexValues){
        reservationToAdd.members.push(members[value])
    }
    const isValidMembers = await validateMembers();
    if( isValidMembers === false) {
        return;
    }
    showFinalDetails();
}

function showFinalDetails(){
    //show the final details before submitting the Registration
    pageContentEl.innerHTML = ''
    let html = getRegistrationDetailsHtml(reservationToAdd);
    html+='<button type="button" class="btn btn-primary" onclick="sendRegistration()">Submit! </button>'
    pageContentEl.innerHTML = html;
}
function getRegistrationDetailsHtml(reservation){
    //return the html for the Registration Details
    let html = '<h2 class="import"> Registration Info: </h2>'
        +'<h3 style="color: white">' +makeWindowRegistrationString(reservation.windowRegistration) + '</h3>'
        + '<h3 style="color: white"> RequestBoatTypes : </h3>'
    for(let boatType of reservation.boatTypes){
        html+= '<h4 style="color: white">' + boatType + '</h4>'
    }
    html+= '<h3 style="color: white"> Members: </h3>'
    if(reservation.members != null && reservation.members.length !==0) {
        for (let member of reservation.members) {
            html += '<h4 style="color: white">' + member.nameMember + '  ' + member.email + '</h4>'
        }
    }
    return html;
}

async function sendRegistration(){
    //send the Registration to the servlet and show the result
    pageContentEl.innerHTML= ' '
    const response = await fetch("../addRegistration", {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
    body: JSON.stringify(reservationToAdd)})
    const responseObj = await response.json();
    let html='';
    if(responseObj.errorCode === 0){
        html= getRegistrationDetailsHtml(reservationToAdd);
        html += '<h3 class="lbl_white"> Registration Added successfully</h3> '
        pageContentEl.innerHTML= html;
    }
    else if(responseObj.errorCode === 2){
        html += '<h3 class="lbl_white"> The max capacity of the boatType you had choosed is smaller than the number of the rowers in the registration </h3> '
        pageContentEl.innerHTML= html;
    }
    else {
        html += '<h3> assignment Rejected, you or other rower already have lapping time registration/assignments</h3> '
        pageContentEl.innerHTML= html;
    }
}


function setBoatTypes() {
    //set all the chosen boat types on the object and call makeMembersSelection
    const selectedEl = document.querySelectorAll('#boatTypeSelect option:checked')
    const values = Array.from(selectedEl).map(el => el.textContent);
    reservationToAdd.boatTypes = [] //reset
    if(values.length === 0){
        alert("you must chose at least one boat type")
        return ;
    }
    for (let value of values) {
        reservationToAdd.boatTypes.push(value)
    }
    makeMembersSelection()
}

function setTimeFromWindow(){
    //put the selected window windowRegistration on the Reservation object and call to makeBoatTypeSelection
    const selectEl = document.querySelector('#selectWindowRegistration');
    if(selectEl!= null){
        const chosenIndex = selectEl.selectedIndex;
        if(chosenIndex!== -1){
            reservationToAdd.windowRegistration =windowRegistrations[chosenIndex]
            reservationToAdd.fromWindowRegistration = true;
            makeBoatTypeSelection()
        }
        else {
            alert("you must select a window registration!")
        }
    }

}

function makeWindowRegistrationString(windowRegistration){
    //Return  string for the window Registration
    let toReturnString = ""
    if(windowRegistration!=null && windowRegistration!= undefined) {
        toReturnString += "from " + windowRegistration.startTime.hour + ":" + windowRegistration.startTime.minute;
        toReturnString += " to " + windowRegistration.endTime.hour + ":" + windowRegistration.endTime.minute;
        if (windowRegistration.activityType != null) {
            toReturnString += "activity type: " + windowRegistration.activityType
        }
        if (windowRegistration.boatType != null) {
            if (windowRegistration.boatType != null) {
                toReturnString += "boat type: " + windowRegistration.boatType
            }
        }
    }
    return toReturnString
}

function setDateOnObject(date){
    //set a date On the Reservation object
        reservationToAdd.date =  date
}