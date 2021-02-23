showFutureAssignmentButtonEl = document.querySelector('#futureAssignment');

showFutureAssignmentButtonEl.addEventListener('click', showFutureAssignmentForm)

async function showFutureAssignmentForm() {
    const response = await fetch('futureAssignment', {method: 'get'});
    const assignmentList = await response.json();

    clearPageContent();
    let htmlToInsert = '<table class="table">'+
        '<thead>'+
        '<tr>'+
        '<th scope="col">#</th>'+
        '<th scope="col">Main Rower</th>'+
        '<th scope="col">Activity Date</th>'+
        '<th scope="col">Activity Details</th>'+
        '<th scope="col">Rower List</th>'+
        '<th scope="col">Boat Type List</th>'+
        '</tr>'+
        '</thead>'+
        '<tbody>'
    assignmentList.forEach(assign => {htmlToInsert += createElementAssignment(assign)});
    htmlToInsert += '</tbody></table>'

    if (assignmentList.length === 0)
        htmlToInsert = '<h1>You dont have any Future Assignment</h1>'

    pageContentEl.innerHTML = htmlToInsert;
}

function createElementAssignment(regi){
    let htmlAssignment = '<tr>'+
        '<th scope="row">' +
        '<div class="form-check">'+
        '<input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefaultRegi">'+
        '</div>'+
        '</th>'+
        '<td>' + regi.rowerOfRegistration.nameMember + '</td>'+
        '<td>' + localDateTimeToString(regi.activityDate) + '</td>'+
        '<td>' + createWindowDetails(regi.windowRegistration) + '</td>'+
        '<td>' + createRowerListName(regi.rowersListInBoat) + '</td>'+
        '<td>' + createBoatTypeList(regi.boatTypes) + '</td>'+
        '</tr>';
    return htmlAssignment;
}

function clearPageContent(){
    pageContentEl.innerHTML = '';
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


function localDateTimeToString(localDateTime){
    return LocalDateToString(localDateTime.date)+ ' ' + localTimeToString(localDateTime.time)
}
