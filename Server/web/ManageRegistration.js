showRegistrationButtonEl = document.querySelector('#showRegistration');

showRegistrationButtonEl.addEventListener('click', showAllRegistrationForm)
let chosenRegiGlobal;
let regiListObj;
let indexRegiGlobal;
let mainRowerListGlobal;

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
        '<button type="submit" class="btn btn-primary" id="editRegistrationButton" onclick="editRegistrationForm()">Edit Registration Request</button>'+
        '</td>';
    if (registrationList.length === 0)
        htmlToInsert = '<h1>You dont have any registration</h1>'

    pageContentEl.innerHTML = htmlToInsert;
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


// edit registration
function editRegistrationForm(event){
    const regiCheckedEl = document.querySelector('#flexRadioDefaultRegi:checked')
    if(regiCheckedEl === null){
        alert("Choose Registration request first")
        event.preventDefault();
    }
    indexRegiGlobal = wantedRegistration();

    clearPageContent();
    let htmlToInsert ='<h3>Edit Registration Page </h3>'+
        '<label style="font-weight: bold">choose the wanted option</label><br><br>'+
        '<button type="submit" class="btn btn-primary" id="removeRegistrationButton" onclick="AddRowerToRegistration()" style="margin-right: 10px">Add Rower To Registration</button>'+
        '<button type="submit" class="btn btn-primary" id="removeRegistrationButton" onclick="removeRowerToRegistration()" style="margin-right: 10px">Delete Rower From Registration</button>'+
        '<button type="submit" class="btn btn-primary" id="removeRegistrationButton" onclick="addBoatTypeToRegistration()" style="margin-right: 10px">Add Boat Type To Registration</button>'+
        '<button type="submit" class="btn btn-primary" id="removeRegistrationButton" onclick="removeBoatTypeToRegistration()">Remove Boat Type From Registration</button>'+
        '</td>';

    pageContentEl.innerHTML = htmlToInsert;
}

function AddRowerToRegistration(){
    clearPageContent();
    showRowerToAdd("addRower");
}

async function showRowerToAdd(flag) {
    chosenRegiGlobal = regiListObj[indexRegiGlobal]
    const response = await fetch('editRegistration', {method: 'get'});
    const rowerList = await response.json();
    mainRowerListGlobal = rowerList;

    let html = '<table class="table">' +
        '<thead>' +
        '<tr>' +
        '<th scope="col">#</th>' +
        '<th scope="col">Rower Name</th>' +
        '<th scope="col">Email</th>' +
        '<th scope="col">ID</th>' +
        '<th scope="col">is Manager</th>' +
        '<th scope="col">Has Private Boat</th>' +
        '<th scope="col">Level</th>' +
        '<th scope="col">Phone Number</th>' +
        '<th scope="col">Age</th>' +
        '<th scope="col">Comment</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>'

    var i;
    for (i = 0; i < rowerList.length; i++)
        html += createElementMember(rowerList[i])

    if (flag === "addRower") {
        html += '<label style="color: firebrick">There are the rowers in the Registration request, dont choose them again!!.</label><br><br></tbody></table>'
        html += '<button type="button" class="btn btn-danger" onClick="addRower()">Add Rower</button>'
    }
    else { // flag === removeRower
        html += '<label style="color: firebrick">Choose the rowers who are part from the registration only!!.</label><br><br></tbody></table>'
        html+= '<button type="button" class="btn btn-danger" onClick="removeRower()">Remove Rower</button>'
    }
    pageContentEl.innerHTML = html;
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


function createElementMember(member){
    let htmlMember = '<tr>'+
        '<th scope="row">' +
        '<div class="form-check">'+
        '<input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div>'+
        '</th>'+
        '<td>' + member.nameMember + '</td>'+
        '<td>' + member.email + '</td>'+
        '<td>' + member.memberSerial + '</td>'+
        '<td>' + member.isManager + '</td>'+
        '<td>' + member.hasPrivateBoat + '</td>'+
        '<td>' + member.level + '</td>'+
        '<td>' + member.phoneNumber + '</td>'+
        '<td>' + member.age + '</td>'+
        '<td>' + member.additionalDetails + '</td>'+
        '</tr>';
    return htmlMember;
}

async function addRower(){
    let indexRowerToAdd = getSelectedIndex();

    const RegiAndRowerArgs = {
        registration: chosenRegiGlobal,
        rower: mainRowerListGlobal[indexRowerToAdd]
    }

    let keepTheChanges = confirm("are you sure to add this rower?");
    if (keepTheChanges === true) {
        const response = await fetch('editRegistration', {
            method: 'put',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(RegiAndRowerArgs)
        });

        let result = await response.text();
        if (result === 'overlappingMember')
            alert("This member has an overlapping registration window, choose other one.")

        else if(result === 'errorCapacity')
            alert("Cant add another rowers. number of rowers is equal to biggest boat type capacity.")

        else if(result === 'error')
            alert("This rower is already part of the registration, choose other rower")
        else {
            alert("The Rower has been added to the registration successfully")
            window.location.replace(result)
        }
    }
}

function removeRowerToRegistration(){
    clearPageContent();
    showRowerToAdd("removeRower");
}

async function removeRower() {
    let indexRowerToAdd = getSelectedIndex();

    const RegiAndRowerArgs = {
        registration: chosenRegiGlobal,
        rower: mainRowerListGlobal[indexRowerToAdd]
    }

    let keepTheChanges = confirm("are you sure to remove this rower?");
    if (keepTheChanges === true) {
        const response = await fetch('editRegistration', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(RegiAndRowerArgs)
        });

        let result = await response.text();

        if (result === 'errorCapacity')
            alert("Cant remove rowers. There is minimal number of rowers in the registration request.")
        else if (result === 'error')
            alert("Cant remove rower who is not part from registration's rowers.")
        else {
            alert("The Rower has been removed from the registration successfully")
            window.location.replace(result)
        }
    }
}

function addBoatTypeToRegistration(){
    clearPageContent();
    showBoatTypeToAdd("addBoatType");
}

async function addBoatType() {
    let indexBoatTypeToAdd = getSelectedIndex();

    const RegiAndBoatTypeArgs = {
        registration: chosenRegiGlobal,
        boatTypeIndex: indexBoatTypeToAdd
    }

    let keepTheChanges = confirm("are you sure to add this BoatType?");
    if (keepTheChanges === true) {
        const response = await fetch('editBoatTypeInRegi', {
            method: 'put',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(RegiAndBoatTypeArgs)
        });

        let result = await response.text();

        if (result === 'error')
            alert("Boat type has already part from the registration, try another one.")
        else {
            alert("The BoatType has been added to the registration successfully")
            window.location.replace(result)
        }
    }
}

function removeBoatTypeToRegistration(){
    clearPageContent();
    showBoatTypeToAdd("removeBoatType");
}

async function removeBoatType() {
    let indexBoatTypeToAdd = getSelectedIndex();

    const RegiAndBoatTypeArgs = {
        registration: chosenRegiGlobal,
        boatTypeIndex: indexBoatTypeToAdd
    }

    let keepTheChanges = confirm("are you sure to remove this BoatType?");
    if (keepTheChanges === true) {
        const response = await fetch('editBoatTypeInRegi', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(RegiAndBoatTypeArgs)
        });

        let result = await response.text();

        if (result === 'error')
            alert("this BoatType isnt part from the registration, try another one.")
        else {
            alert("The BoatType has been removed from the registration successfully")
            window.location.replace(result)
        }
    }
}

function showBoatTypeToAdd(flag) {
    chosenRegiGlobal = regiListObj[indexRegiGlobal]

    let html = '<table class="table">' +
        '<thead><tr>' +
        '<th scope="col">#</th>' +
        '<th scope="col">Boat Type</th>' +
        '<th scope="col">Capacity</th>' +
        '</tr></thead>' +
        '<tbody>'

    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> SingleBoat </td><td>' + 1 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> DoubleBoat </td><td>' + 2 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> DoubleBoatPaddle </td><td>' + 2 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> DoubleCoxed </td><td>' + 2 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> DoublePaddleCoxed </td><td>' + 2 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> QuartetBoat </td><td>' + 4 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> QuartetBoatPaddle </td><td>' + 4 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> QuartetBoatCoxed </td><td>' + 4 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> QuartetBoatPaddleCoxed </td><td>' + 4 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> OctetBoatCoxed </td><td>' + 8 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td> OctetBoatCoxedPaddle </td><td>' + 8 + '</td></tr>';

    if (flag === "addBoatType") {
        html += '<label style="color: firebrick">There are the BoatType chosen in the Registration request, dont choose them again!!.</label><br><br></tbody></table>'
        html += '<button type="button" class="btn btn-danger" onClick="addBoatType()">Add Boat Type</button>'
    }
    else { // flag === removeBoatType
        html += '<label style="color: firebrick">Choose the BoatTypes which are part from the registration only!!.</label><br><br></tbody></table>'
        html+= '<button type="button" class="btn btn-danger" onClick="removeBoatType()">Remove Boat Type</button>'
    }
    pageContentEl.innerHTML = html;
}

