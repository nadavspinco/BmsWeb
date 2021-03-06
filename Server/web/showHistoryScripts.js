let showHistory = document.querySelector('#historyAssignment')

showHistory.addEventListener('click',showHistoryAssignmentForm)


async function showHistoryAssignmentForm() {
    const response = await fetch('../historyAssignment', {method: 'get'});
    const historyAssignmentList = await response.json();

    clearPageContent();
    let htmlToInsert = '<table class="table">'+
        '<thead>'+
        '<tr>'+
        '<th class="table-title" scope="col">#</th>'+
        '<th class="table-title" scope="col">Main Rower</th>'+
        '<th class="table-title" scope="col">Activity Date</th>'+
        '<th class="table-title" scope="col">Activity Details</th>'+
        '<th class="table-title" scope="col">Rower List</th>'+
        '<th class="table-title" scope="col">Boat Type List</th>'+
        '</tr>'+
        '</thead>'+
        '<tbody>'
    if (historyAssignmentList === null || historyAssignmentList.length === 0)
        htmlToInsert = '<h1>You dont have any Assignment at the last 7 days</h1>'
    else {
        historyAssignmentList.forEach(assign => { htmlToInsert += createElementAssignment(assign) });
        htmlToInsert += '</tbody></table>'
    }

    pageContentEl.innerHTML = htmlToInsert;
}

function createElementAssignment(regi){
    let htmlAssignment = '<tr>'+
        '<th scope="row">' +
        '<div class="form-check">'+
        '<input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefaultRegi">'+
        '</div>'+
        '</th>'+
        '<td class="table-row">' + regi.rowerOfRegistration.nameMember + '</td>'+
        '<td class="table-row">' + localDateTimeToString(regi.activityDate) + '</td>'+
        '<td class="table-row">' + createWindowDetails(regi.windowRegistration) + '</td>'+
        '<td class="table-row">' + createRowerListName(regi.rowersListInBoat) + '</td>'+
        '<td class="table-row">' + createBoatTypeList(regi.boatTypes) + '</td>'+
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
