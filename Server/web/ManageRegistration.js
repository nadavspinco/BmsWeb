showRegistrationButtonEl = document.querySelector('#showRegistration');

showRegistrationButtonEl.addEventListener('click', showAllRegistrationForm)
let regiListObj;

async function showAllRegistrationForm() {
    const response = await fetch('manageRegistration', {method: 'get'});
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
        htmlToInsert = '<h1>You dont have any registration</h1>'

    pageContentEl.innerHTML = htmlToInsert;
}

function createElementRegistration(regi){
    let htmlBoat = '<tr>'+
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
    return htmlBoat;
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

