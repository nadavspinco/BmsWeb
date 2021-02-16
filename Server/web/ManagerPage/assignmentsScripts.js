
const addAssignmentEl = document.querySelector('#assignBoat')
addAssignmentEl.addEventListener('click',showAssignBoat)
const  showAssignmentsByDateEl = document.querySelector('#ShowAssigmentByDate')
showAssignmentsByDateEl.addEventListener('click',showAssignmentsByDateOption)
function showAssignmentsByDateOption() {
    pageContentManagerEl.innerHTML=' <label for="dateForAssignments">Select Wanted date:</label>'
        +'<input type="date" id="dateForAssignments" > '
        + '<br>'+'<button type="button" class="btn btn-primary" onclick="getAssignmentsByDate()">Select</button>';
}

function getDate(pickerSelector){
    const assigmentDatePicker = document.querySelector(pickerSelector)
    if(assigmentDatePicker!=null){
        return assigmentDatePicker.value;
    }
    return null
}

 function getAssignmentsByDate() {
    const date = getDate('#dateForAssignments');
    if (date === ' ') {
        alert("please chose a date")
        return;
    }
   showAssignmentsByDate(date);

}

async function showAssignmentsByDate(dateInput){
    pageContentManagerEl.innerHTML = ' '
    let html = ''
    const response = await fetch('../assignmentByDate?date=' + dateInput);
    const responseObj = await response.json();
    if(responseObj.errorCode ===0){
        if(responseObj.assignments == null || responseObj.assignments.length ===0){
            html = '<h3>no Assignments On This Date</h3>'
        }
        else {
            assignmentsScriptsObj.assignmentsByDate = responseObj.assignments;
            assignmentsScriptsObj.chosenDate = dateInput
            html = getHtmlForAssignmentsForm();
            responseObj.assignments.forEach(assignment=> html+=createHtmlForAssignmentRow(assignment))
            html+='</tbody>'
            html+='<button type="button" class="btn btn-danger" onclick="deleteChosenAssignment()">Delete</button>'
        }
    }
    pageContentManagerEl.innerHTML = html;
}

async function deleteChosenAssignment() {
    const index = getSelectedIndex();
    if (index === -1) {
        alert("no assignment chosen")
        return;
    }
    const toDeleteAssignment = assignmentsScriptsObj.assignmentsByDate[index];
    const toDeleteRegistarionAlso = confirm("to Delete Registation also?")
    const areYouSure = confirm("Are you sure you want to Delete?")
    if (areYouSure === true) {
        const requestObj = {
            assignment: toDeleteAssignment,
            toDeleteRegistration: toDeleteRegistarionAlso
        }
        const response = await fetch('../assignments', {
            method: 'DELETE',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(requestObj)
        })
        const responseObj =await response.json()
        if(responseObj.errorCode === 0){
            alert("assignment deleted")
            showAssignmentsByDate(assignmentsScriptsObj.chosenDate)
        }
    }
}

function getHtmlForAssignmentsForm(){
    return '<table class="table">'+
        '<thead>'+
        '<tr>'+
        '<th scope="col">#</th>'+
        '<th scope="col">StartTime </th>'+
        '<th scope="col">End Time</th>'+
        '<th scope="col">Boat Types</th>'+
        '<th scope="col">Rowers</th>'+
        '<th scope="col">Boat Id</th>'+
        '<th scope="col">Boat name</th>'+
        '<th scope="col">Boat Type</th>'+
        '</tr>'+
        '</thead>'+
        '<tbody>'
}

function createHtmlForAssignmentRow(assignment){
    return'<tr>' +
        '<th scope="row">' +
        '<div class="form-check">'+
        '<input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div>'+
        '</th>'+
        '<td>' + localDateTimeToString(assignment.registration.activityDate) + '</td>'+
        '<td>' + localDateTimeToString(assignment.registration.endTime) + '</td>'+
        '<td>' + createStringForBoatTypes(assignment.registration) + '</td>'+
        '<td>' + creatStringForMembersInRegistration(assignment.registration) + '</td>'+
        '<td>' + assignment.boat.serialBoatNumber + '</td>'+
        '<td>' + assignment.boat.boatName + '</td>'+
        '<td>' + assignment.boat.boatType + '</td>'+
        '</tr>';

}


// assignBoat code:

const assignmentsScriptsObj ={}
async function showAssignBoat() {
    pageContentManagerEl.innerHTML=''
    let html =''
    const request = {amountOfDays: 7}
    let response = await fetch('../registrationByDays',{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(request)
    })
    const responseObj =  await response.json();
    if(responseObj.errorCode ===0){
        if(responseObj.registrations.length ===0){
            html+= '<h2>No Registration Found for the next 7 days</h2>'
        }
        else {
            assignmentsScriptsObj.registrations = responseObj.registrations;
            html +='<table class="table">'+
                '<thead>'+
                '<tr>'+
                '<th scope="col">#</th>'+
                '<th scope="col">StartTime </th>'+
                '<th scope="col">End Time</th>'+
                '<th scope="col">Boat Types</th>'+
                '<th scope="col">Rowers</th>'+
                '</tr>'+
                '</thead>'+
                '<tbody>'
            assignmentsScriptsObj.registrations.forEach(registration=> html+=createHtmlForRegistrationRow(registration))
            html+= '</tbody>' + '</table>'
            html+= '<button type="button" class="btn btn-primary" onclick="selectRegistraion()">Next</button>'
        }
    }


    else {

    }
    pageContentManagerEl.innerHTML = html

}

async function makeSelectBoatForRegisration() {
    pageContentManagerEl.innerHTML = '';
    let html = ''
    const request = {registration: assignmentsScriptsObj.selectRegistraion }
    let response = await fetch('../boatSuggestion', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(request)
    })
    let responseObj =  await response.json();
    if(responseObj.errorCode ===0){
        if(responseObj.boats.length ===0){
            html+= '<h2>No Valid boats for this Registration</h2>'

        }
        else {
            assignmentsScriptsObj.boats=responseObj.boats
            html = '<table class="table">'+
                '<thead>'+
                '<tr>'+
                '<th scope="col">#</th>'+
                '<th scope="col">Boat Name</th>'+
                '<th scope="col">Serial</th>'+
                '<th scope="col">Boat Type</th>'+
                '<th scope="col">is Wide</th>'+
                '<th scope="col">is Coastal</th>'+
                '<th scope="col">is Private</th>'+
                '<th scope="col">is Available</th>'+
                '</tr>'+
                '</thead>'+
                '<tbody>'
        }
        responseObj.boats.forEach(boat => html+=createElementBoat(boat))
        html+= '</tbody>' + '</table>'
        html+='<button type="button" class="btn btn-primary" onclick="selectBoat()">Next</button>'
    }
    pageContentManagerEl.innerHTML = html
}
function selectBoat(){
    const selectedIndex = getSelectedIndex();
    if(selectedIndex === -1){
        alert("you must select Boat")
        return ;
    }
    else {
        assignmentsScriptsObj.selectBoat = assignmentsScriptsObj.boats[selectedIndex];
        showFinalDetailsBeforeAssignBoat();
    }
}

function showFinalDetailsBeforeAssignBoat() {
    pageContentManagerEl.innerHTML = ''
    let html = getRegistrationDetailsHtml(assignmentsScriptsObj.selectRegistraion);
    html+= getHtmlForBoatDetails(assignmentsScriptsObj.selectBoat)
    html+= '<button type="button" class="btn btn-primary" onclick="assignBoat(assignmentsScriptsObj.selectRegistraion,assignmentsScriptsObj.selectBoat)">Next</button>'
    pageContentManagerEl.innerHTML = html
}

async function assignBoat(registraion, boat) {
    pageContentManagerEl.innerHTML = ''
    let html =''
    const requestObj =
        {registration: registraion, boat: boat}

    let response = await fetch("../assignments", {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(requestObj)
    })
    let responseObj = await response.json();
    if(responseObj.errorCode ===0){
         html = getRegistrationDetailsHtml(assignmentsScriptsObj.selectRegistraion);
        html+= getHtmlForBoatDetails(assignmentsScriptsObj.selectBoat)
        html+= '<h3>Assignment approved!</h3>'
    }
    else {
        html = '<h3>Error<h3>'
    }
    pageContentManagerEl.innerHTML = html;

}

function getHtmlForBoatDetails (boat){
    let html = '<h3>Boat Details</h3>'
    html+=
        '<h4 scope="col">'+boat.boatName+'</h4>'+
        '<h4 scope="col">'+boat.serialBoatNumber+'</h4>'+
        '<h4 scope="col">'+boat.boatType+'</h4>'+
        '<h4 scope="col">'+wideOrNot(boat)+'</h4>'+
        '<h4 scope="col">'+costalOrNot(boat)+'</h4>'
    return html;
}
function costalOrNot(boat){
    if(boat.isCoastalBoat === true){
        return "Costal"
    }
    else return "Not Costal"

}

function wideOrNot(boat){
    if(boat.isWide == true){
        return "Wide"
    }
    else {
        return "Not Wide"
    }
}

function selectRegistraion(){
   const selectedIndex = getSelectedIndex();
   if(selectedIndex === -1){
       alert("you must select Registraion")
       return ;
   }
   else {
       assignmentsScriptsObj.selectRegistraion = assignmentsScriptsObj.registrations[selectedIndex];
       makeSelectBoatForRegisration();
   }

}

function getSelectedIndex(){
    const allRadios = document.querySelectorAll('#flexRadioDefault');
    let index = 0;
    for(let radio of allRadios){
        if(radio.checked === true){
            return index;
        }
        index++;
    }
    return -1
}

function createHtmlForRegistrationRow(registration){
    let html =
    '<tr>' +
    '<th scope="row">' +
    '<div class="form-check">'+
    '<input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
    '</div>'+
    '</th>'+
    '<td>' + localDateTimeToString(registration.activityDate) + '</td>'+
    '<td>' + localDateTimeToString(registration.endTime) + '</td>'+
    '<td>' + createStringForBoatTypes(registration) + '</td>'+
    '<td>' + creatStringForMembersInRegistration(registration) + '</td>'+
    '</tr>';
    return html;
}

function creatStringForMembersInRegistration(registration){
    let string = ''
    registration.rowersListInBoat.forEach(member=>{string+= member.nameMember +'\n'
    })
    return string;
}

function createStringForBoatTypes(registration){
    let string = ''
    registration.boatTypes.forEach(boatType=>{string+= boatType +'\n'
    })
    return string;
}


//TODO: move to another file
function localDateTimeToString(localDateTime){
    return LocalDateToString(localDateTime.date)+ ' ' + localTimeToString(localDateTime.time)
}

function localTimeToString(localTime){
    return localTime.hour + ':' +localTime.minute
}

function LocalDateToString(localDate){
    return  localDate.day +'/' +localDate.month+'/' + localDate.year
}

