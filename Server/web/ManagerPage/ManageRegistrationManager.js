const addRegistrationEl = document.querySelector("#addRegistrationManager");
showRegistrationButtonEl = document.querySelector('#showRegistrationManager');

showRegistrationButtonEl.addEventListener('click', showAllRegistrationForm)
addRegistrationEl.addEventListener('click', showAddRegistrationForm)
let regiListObj;
let members = [];
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
    pageContentManagerEl.innerHTML = ' <label for="registrationDate">Select Wanted date:</label>'
        +'<input type="date" id="registrationDate" > '
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
        clearTimeOffsetOnDate(date)
        clearTimeOffsetOnDate(currentDate)
        if(date == null){
            alert("please chose a date ")
            return;
        }
        else if(date < currentDate)
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
    pageContentManagerEl.innerHTML = ''
    let windowRegistraionRes = await fetch("../windowRegistration")

    let responseObj = await windowRegistraionRes.json();
    if (responseObj != null && responseObj != undefined) {
        setWindowRegistrations(responseObj)
    } else
        alert("No Connection!");
}


function setWindowRegistrations(responseObj){
    //get the response object from the servlet and Set the html code for the time selection
    //if there is window Registrations exists the user will to select one
    //else : the user will pick the time
    if(responseObj.errorCode === 0){
        let html = ''
        if(responseObj.windowRegistrations.length ===0){
            //no window registrations exists, so we let the user pick the time
            html =  '<div>'
                +'<label for="startTime">Select Wanted start time:</label>'
                + '<input type="time" id="startTime">'
                +'</div>'
                +'<div>'
                +'<label for="endTime">Select Wanted end time: </label>'
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
        pageContentManagerEl.innerHTML = html
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
    pageContentManagerEl.innerHTML = ''
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
    pageContentManagerEl.innerHTML = html
}

async function makeMembersSelection(){
    //get Members suggestion from the servlet and generate the html code
    pageContentManagerEl.innerHTML = ''
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
    pageContentManagerEl.innerHTML = html;
}

function pickMembers(){
    // add to the Object all the chosen Members and call to showFinalDetails
    reservationToAdd.members =[] //reset
    const selectedEl = document.querySelectorAll('#membersSelect option:checked')
    const membersIndexValues = Array.from(selectedEl).map(el => el.value);
    for(let value of membersIndexValues){
        reservationToAdd.members.push(members[value])
    }
    showFinalDetails();
}

function showFinalDetails(){
    //show the final details before submitting the Registration
    pageContentManagerEl.innerHTML = ''
    let html = getRegistrationDetailsHtml(reservationToAdd);
    html+='<button type="button" class="btn btn-primary" onclick="sendRegistration()">Submit! </button>'
    pageContentManagerEl.innerHTML = html;
}

function getRegistrationDetailsHtml(reservation){
    //return the html for the Registration Details
    let html = '<h2> Registration Info: </h2>'
        +'<h3>' +makeWindowRegistrationString(reservation.windowRegistration) + '</h3>'
        + '<h3> RequestBoatTypes : </h3>'
    for(let boatType of reservation.boatTypes){
        html+= '<h4>' + boatType + '</h4>'
    }
    html+= '<h3>Members: </h3>'
    if(reservation.members!= null && reservation.members.length !==0) {
        for (let member of reservation.members) {
            html += '<h4>' + member.nameMember + '  ' + member.email + '</h4>'
        }
    }
    return html;
}

async function sendRegistration(){
    //send the Registration to the servlet and show the result
    pageContentManagerEl.innerHTML= ' '
    const response = await fetch("../addRegistration", {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(reservationToAdd)})
    const responseObj = await response.json();
    let html='';
    if(responseObj.errorCode ===0){
        html= getRegistrationDetailsHtml(reservationToAdd);
        html += '<h3> Registration Added successfully</h3> '
        pageContentManagerEl.innerHTML= html;
    }
    else {
        html += '<h3> there is a rower who is part of other registration / assignment in this time</h3> '
        pageContentManagerEl.innerHTML= html;
    }
}

function setBoatTypes() {
    //set all the chosen boat types on the object and call makeMembersSelection
    const selectedEl = document.querySelectorAll('#boatTypeSelect option:checked')
    const values = Array.from(selectedEl).map(el => el.textContent);
    reservationToAdd.boatTypes = [] //reset
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
    //set a date On the Reservation object
    reservationToAdd.date =  date
}

async function showAllRegistrationForm() {
    const response = await fetch('../manageRegistration', {method: 'get'});
    const registrationList = await response.json();
    regiListObj = registrationList;

    clearPageContent();
    let htmlToInsert = '<table class="table">'+
        '<thead>'+
        '<tr>'+
        '<th scope="col">#</th>'+
        '<th scope="col">Main Rower</th>'+
        '<th scope="col">Registration Date</th>'+
        '<th scope="col">Activity Date</th>'+
        '<th scope="col">Activity Details</th>'+
        '<th scope="col">Rower List</th>'+
        '<th scope="col">Boat Type List</th>'+
        '</tr>'+
        '</thead>'+
        '<tbody>'
    registrationList.forEach(regi => {htmlToInsert += createElementRegistration(regi)});
    htmlToInsert += '</tbody></table>'+
        '<td>'+
        '<button type="submit" class="btn btn-primary" id="removeRegistrationButton" onclick="removeRegistration()">Remove Registration Request</button>'+
        '</td> <td></td><td></td>'+
        '<td>'+
        '<button type="submit" class="btn btn-primary" id="editRegistrationButton" onclick="editBoatForm()">Edit Registration Request</button>'+
        '</td>';
    if (registrationList.length === 0)
        htmlToInsert = '<h1> You dont have any registration</h1>'

    pageContentManagerEl.innerHTML = htmlToInsert;
}

function createElementRegistration(regi){
    let htmlRegi = '<tr>'+
        '<th scope="row">' +
        '<div class="form-check">'+
        '<input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefaultRegi">'+
        '</div>'+
        '</th>'+
        '<td>' + regi.rowerOfRegistration.nameMember + '</td>'+
        '<td>' + LocalDateToString(regi.orderDate) + '</td>'+
        '<td>' + localDateTimeToString(regi.activityDate) + '</td>'+
        '<td>' + createWindowDetails(regi.windowRegistration) + '</td>'+
        '<td>' + createRowerListName(regi.rowersListInBoat) + '</td>'+
        '<td>' + createBoatTypeList(regi.boatTypes) + '</td>'+
        '</tr>';
    return htmlRegi;
}

async function removeRegistration(event){
    const regiCheckedEl = document.querySelector('#flexRadioDefaultRegi:checked')
    if(regiCheckedEl === null){
        alert("Choose Registration request first")
        event.preventDefault();
    }

    let indexRegi = wantedRegistration();
    const response = await fetch('manageRegistration', {
        method: 'put',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(regiListObj[indexRegi])
    });

    let result = await response.text();
    alert("The Registration Request has been removed successfully")
    window.location.replace(result)
}

function clearPageContent(){
    pageContentManagerEl.innerHTML = '';
}

function createRowerListName (rowerList){
    let toSend ='';
    rowerList.forEach(rower => {toSend += rower.nameMember += ', '})
    return toSend;
}

function createBoatTypeList(boatTypes){
    let toSend ='';
    boatTypes.forEach(boatType => {toSend += boatType.toString(); toSend += ', '})
    return toSend;
}

function createWindowDetails(window){
    let toSend = window.activityType.toString();
    toSend += "at: ";
    toSend += localTimeToString(window.startTime);
    toSend += "-";
    toSend += localTimeToString(window.endTime);
    return toSend;
}

function wantedRegistration() {
    let index = 0;
    const selectedEl = document.querySelectorAll('#flexRadioDefaultRegi');
    for (let el of selectedEl) {
        if (el.checked === true) {
            return index;
        }
        index++;
    }
    return -1
}

function localDateTimeToString(localDateTime){
    return LocalDateToString(localDateTime.date)+ ' ' + localTimeToString(localDateTime.time)
}

function localTimeToString(localTime){
    return localTime.hour + ':' +localTime.minute
}

function LocalDateToString(localDate){
    return  localDate.day +'/' +localDate.month+'/' + localDate.year
}

