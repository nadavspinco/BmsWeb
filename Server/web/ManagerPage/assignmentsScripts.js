
const addAssignmentEl = document.querySelector('#assignBoat')
addAssignmentEl.addEventListener('click',showAssignBoat)
const  showAssignmentsByDateEl = document.querySelector('#ShowAssigmentByDate')
showAssignmentsByDateEl.addEventListener('click',showAssignmentsByDateOption)
function showAssignmentsByDateOption() {
    pageContentManagerEl.innerHTML=' <label class="lbl_white" for="dateForAssignments">Select Wanted date:</label>'
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
            html += '</table>'
            html+='<div>'
            html+='<button type="button" class="btn btn-success" onClick="unionAssignment()" style="margin-right: 20px">Union assignment</button>'
            html+='<button type="button" class="btn btn-warning" onClick="removeRowerFromAssignment()" style="margin-right: 20px">Remove Rower</button>'
            html+='<button type="button" class="btn btn-danger" onclick="deleteChosenAssignment()">Delete</button>'+'</div>'

        }
    }
    pageContentManagerEl.innerHTML = html;
}
function removeRowerFromAssignment(){
    const selectdIndex = getSelectedIndex();
    if (selectdIndex === -1) {
        alert("no rower chosen")
        return;
    }
    const toUnionAssignment = assignmentsScriptsObj.assignmentsByDate[selectdIndex];
    if(toUnionAssignment.registration.rowersListInBoat.length < 2){
        alert("no option to delete assignment with one Rower")
        return;
    }
    assignmentsScriptsObj.choseAssignmentToChange= toUnionAssignment;
    pageContentManagerEl.innerHTML = '';
    let html ='<table class="table">'+
    '<thead>'+
    '<tr>'+
        '<th class="lbl_white" scope="col">#</th>'+
        '<th class="table-title" scope="col">Rower Name</th>'+
        '<th class="table-title" scope="col">Email</th>'+
        '<th class="table-title" scope="col">ID</th>'+
        '<th class="table-title" scope="col">is Manager</th>'+
        '<th class="table-title" scope="col">Has Private Boat</th>'+
        '<th class="table-title" scope="col">Level</th>'+
        '<th class="table-title" scope="col">Phone Number</th>'+
        '<th class="table-title" scope="col">Age</th>'+
        '<th class="table-title" scope="col">Comment</th>'+
    '</tr>'+
    '</thead>'+
    '<tbody>'
    let index = 0;
    toUnionAssignment.registration.rowersListInBoat.forEach(member=>{html += createElementMember(member, index++)})
    html+= '</tbody></table>'
    html+= '<button type="button" class="btn btn-danger" onClick="showFinalDetailsRemoveMember()">Remove</button>'
    pageContentManagerEl.innerHTML = html;
}
function showFinalDetailsRemoveMember(){
    const selectdIndex = getSelectedIndex();
    if (selectdIndex === -1) {
        alert("no assignment chosen")
        return;
    }
    assignmentsScriptsObj.memberToRemove = assignmentsScriptsObj.choseAssignmentToChange.registration.rowersListInBoat[selectdIndex];
    pageContentManagerEl.innerHTML = ''
    let html = getRegistrationDetailsHtml(assignmentsScriptsObj.choseAssignmentToChange.registration)
    html+= '<h2>Are you sure you want to remove the chosen Rower? </h2>'
     html+=getHtmlForMemberDetails(assignmentsScriptsObj.memberToRemove)
    html+= '<div class="form-check">'
       + '<input class="form-check-input" type="checkbox" value="" id="toSplitFlexCheck" checked>'
       +     '<label class="form-check-label" for="toSplitFlexCheck">'
       +        'Split Registration'
       +     '</label>'
    +'</div>'
    html+= '<button type="button" class="btn btn-danger" onclick="removeTheChosenMember()">Confirm</button>'
    pageContentManagerEl.innerHTML = html;
}

async function removeTheChosenMember(){
    const toSplitFlexCheckEl = document.querySelector('#toSplitFlexCheck');
    pageContentManagerEl.innerHTML = ''
    let toSplitRegistration = false;
    if(toSplitFlexCheckEl.checked === true){
        toSplitRegistration = true;
    }
    const request = {assignment: assignmentsScriptsObj.choseAssignmentToChange,
       member: assignmentsScriptsObj.memberToRemove,
        toSplitRegistration: toSplitRegistration
    }
    const response =  await fetch("../removeMemberFromAssignment",{method: 'DELETE',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(request)})
    const responseObj = await response.json();
    if(responseObj.errorCode ===0){
        alert("remove member succeeded");
        showAssignmentsByDate(assignmentsScriptsObj.chosenDate);
    }
    else {
        //TODO: error message
    }
}

function getHtmlForMemberDetails(member){
    return '<h3>'+member.nameMember+'</h3><h3>'+member.email+'</h3>'
}


async function unionAssignment(){
    const index = getSelectedIndex();
    if (index === -1) {
        alert("no assignment chosen")
        return;
    }
    const toUnionAssignment = assignmentsScriptsObj.assignmentsByDate[index];
    pageContentManagerEl.innerHTML = ''
    let html = ''
    const request = {assignment: toUnionAssignment}
    const response = await fetch("../unionSuggestion",{method: 'POST',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(request)})

    const responseObj = await response.json()
    if(responseObj.errorCode ===0){
        assignmentsScriptsObj.totoUnionAssignment = toUnionAssignment;
        if(responseObj.registrations ==null || responseObj.registrations.length ===0){
            html = '<h3>no valid registrations to union with the chosen assignment</h3>'
        }
        else {
            assignmentsScriptsObj.registrationsToUnion = responseObj.registrations;
            html+= getHtmlForRegistraionTbale();
            assignmentsScriptsObj.registrationsToUnion.forEach(registration=> html+=createHtmlForRegistrationRow(registration))
            html+= '</tbody></table>'
            html+='<button type="button" class="btn btn-success" onclick="showUnionFinalDetails()">Select</button>'
        }
    }
    pageContentManagerEl.innerHTML = html

}

function showUnionFinalDetails(){
    const index = getSelectedIndex()
    if(index ===-1){
        alert("no registration selected");
        return;
    }
    assignmentsScriptsObj.toUnionRegistration = assignmentsScriptsObj.registrationsToUnion[index];
    let html = '<h2>Assignment info:</h2>'
    html+=  getRegistrationDetailsHtml(assignmentsScriptsObj.totoUnionAssignment.registration);
    html+=  getHtmlForBoatDetails(assignmentsScriptsObj.totoUnionAssignment.boat);
    html += '<h2>Registaion info:</h2>'
    html+= getRegistrationDetailsHtml(assignmentsScriptsObj.toUnionRegistration)
    html += '<button type="button" class="btn btn-primary" onclick="submitUnionAssignment()">Submit</button>'
    pageContentManagerEl.innerHTML = html
}

async function submitUnionAssignment(){
    const request= { assignment: assignmentsScriptsObj.totoUnionAssignment,
        registration: assignmentsScriptsObj.toUnionRegistration}
    pageContentManagerEl.innerHTML = ''
    const response = await fetch('../assignments',{method:'PUT',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(request)})
    const responseObj = await response.json()
    let html;
    if(responseObj.errorCode ===0){
        html = '<h2>Assignment info:</h2>'
        html+=  getRegistrationDetailsHtml(assignmentsScriptsObj.totoUnionAssignment.registration);
        html+=  getHtmlForBoatDetails(assignmentsScriptsObj.totoUnionAssignment.boat);
        html += '<h2>Registaion info:</h2>'
        html+= getRegistrationDetailsHtml(assignmentsScriptsObj.toUnionRegistration)
        html+= '<h3>Union Confirmed</h3>'

    }
    else{
        html = '<h3>error</h3>'
    }
    pageContentManagerEl.innerHTML = html;
}


//delete Assignment Code:
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
        '<th class="lbl_white" scope="col">#</th>'+
        '<th class="table-title" scope="col">StartTime </th>'+
        '<th class="table-title" scope="col">End Time</th>'+
        '<th class="table-title" scope="col">Boat Types</th>'+
        '<th class="table-title" scope="col">Rowers</th>'+
        '<th class="table-title" scope="col">Boat Id</th>'+
        '<th class="table-title" scope="col">Boat name</th>'+
        '<th class="table-title" scope="col">Boat Type</th>'+
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
        '<td class="table-row">' + localDateTimeToString(assignment.registration.activityDate) + '</td>'+
        '<td class="table-row">' + localDateTimeToString(assignment.registration.endTime) + '</td>'+
        '<td class="table-row">' + createStringForBoatTypes(assignment.registration) + '</td>'+
        '<td class="table-row">' + creatStringForMembersInRegistration(assignment.registration) + '</td>'+
        '<td class="table-row">' + assignment.boat.serialBoatNumber + '</td>'+
        '<td class="table-row">' + assignment.boat.boatName + '</td>'+
        '<td class="table-row">' + assignment.boat.boatType + '</td>'+
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
            html +=getHtmlForRegistraionTbale()
            assignmentsScriptsObj.registrations.forEach(registration=> html+=createHtmlForRegistrationRow(registration))
            html+= '</tbody>' + '</table>'
            html+= '<button type="button" class="btn btn-primary" onclick="selectRegistraion()">Next</button>'
        }
    }
    pageContentManagerEl.innerHTML = html
}

function getHtmlForRegistraionTbale(){
    return '<table class="table">'+
        '<thead>'+
            '<tr>'+
                '<th class="table-row" scope="col">#</th>'+
                '<th class="table-row" scope="col">StartTime </th>'+
                '<th class="table-row" scope="col">End Time</th>'+
                '<th class="table-row" scope="col">Boat Types</th>'+
                '<th class="table-row" scope="col">Rowers</th>'+
                '</tr>'+
            '</thead>'+
        '<tbody>'
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
                '<th class="lbl_white" scope="col">#</th>'+
                '<th class="table-title" scope="col">Boat Name</th>'+
                '<th class="table-title" scope="col">Serial</th>'+
                '<th class="table-title" scope="col">Boat Type</th>'+
                '<th class="table-title" scope="col">is Wide</th>'+
                '<th class="table-title" scope="col">is Coastal</th>'+
                '<th class="table-title" scope="col">is Private</th>'+
                '<th class="table-title" scope="col">Able To Sail</th>'+
                '</tr>'+
                '</thead>'+
                '<tbody>'
            responseObj.boats.forEach(boat => html+=createElementBoat(boat))
            html+= '</tbody>' + '</table>'
            html+='<button type="button" class="btn btn-primary" onclick="selectBoat()">Next</button>'
        }
    }
    pageContentManagerEl.innerHTML = html
}
function selectBoat(){
    const selectedIndex = getSelectedIndex('#flexRadioDefaultBoat');
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
        '<h4 class="table-row" scope="col">'+boat.boatName+'</h4>'+
        '<h4 class="table-row" scope="col">'+boat.serialBoatNumber+'</h4>'+
        '<h4 class="table-row" scope="col">'+boat.boatType+'</h4>'+
        '<h4 class="table-row" scope="col">'+wideOrNot(boat)+'</h4>'+
        '<h4 class="table-row" scope="col">'+costalOrNot(boat)+'</h4>'
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

function getSelectedIndex(id = '#flexRadioDefault'){
    const allRadios = document.querySelectorAll(id);
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
    '<td class="table-row">' + localDateTimeToString(registration.activityDate) + '</td>'+
    '<td class="table-row">' + localDateTimeToString(registration.endTime) + '</td>'+
    '<td class="table-row">' + createStringForBoatTypes(registration) + '</td>'+
    '<td class="table-row">' + creatStringForMembersInRegistration(registration) + '</td>'+
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

function localDateTimeToString(localDateTime){
    return LocalDateToString(localDateTime.date)+ ' ' + localTimeToString(localDateTime.time)
}

function localTimeToString(localTime){
    return localTime.hour + ':' +localTime.minute
}

function LocalDateToString(localDate){
    return  localDate.day +'/' +localDate.month+'/' + localDate.year
}

