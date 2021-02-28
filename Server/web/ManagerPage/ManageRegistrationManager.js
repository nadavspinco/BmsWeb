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
    pageContentManagerEl.innerHTML = ' <label class="lbl_white" for="registrationDate">Select Wanted date:</label>'
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

async function validateMembers() {

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
        alert(responseObj.errorDetails);
        return false;
    }

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
    pageContentManagerEl.innerHTML = ''
    let html = getRegistrationDetailsHtml(reservationToAdd);
    html+='<button type="button" class="btn btn-primary" onclick="sendRegistration()">Submit! </button>'
    pageContentManagerEl.innerHTML = html;
}
// HERE
function getRegistrationDetailsHtml(reservation){
    //return the html for the Registration Details
    let html = '<h2 class="import"> Registration Info: </h2>'
        +'<h3 style="color: white">' +makeWindowRegistrationString(reservation.windowRegistration) + '</h3>'
        + '<h3 style="color: white"> RequestBoatTypes : </h3>'
    for(let boatType of reservation.boatTypes){
        html+= '<h4 style="color: white">' + boatType + '</h4>'
    }
    html+= '<h3 style="color: white"> Members: </h3>'
    if(reservation.rowersListInBoat != null && reservation.rowersListInBoat.length !==0) {
        for (let member of reservation.rowersListInBoat) {
            html += '<h4 style="color: white">' + member.nameMember + '  ' + member.email + '</h4>'
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
        html += '<h3 class="lbl_white"> Registration Added successfully</h3> '
        pageContentManagerEl.innerHTML= html;
    }
    else if(responseObj.errorCode === 2){
        html += '<h3 class="lbl_white"> The max capacity of the boatType you had choosed is smaller than the number of the rowers in the registration </h3> '
        pageContentEl.innerHTML= html;
    }
    else {
        html += '<h3 class="lbl_white"> there is a rower who is part of other registration / assignment in this time</h3> '
        pageContentManagerEl.innerHTML= html;
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
        '<th class="lbl_white" scope="col">#</th>'+
        '<th class="table-title" scope="col">Main Rower</th>'+
        '<th class="table-title" scope="col">Registration Date</th>'+
        '<th class="table-title" scope="col">Activity Date</th>'+
        '<th class="table-title" scope="col">Activity Details</th>'+
        '<th class="table-title" scope="col">Rower List</th>'+
        '<th class="table-title" scope="col">Boat Type List</th>'+
        '</tr>'+
        '</thead>'+
        '<tbody>'
    registrationList.forEach(regi => {htmlToInsert += createElementRegistration(regi)});
    htmlToInsert += '</tbody></table>'+
        '<td>'+
        '<button style="margin-left: 470px" type="submit" class="btn btn-primary" id="removeRegistrationButton" onclick="removeRegistration()">Remove Registration Request</button>'+
        '</td> <td></td><td></td>'+
        '<td>'+
        '<button type="submit" class="btn btn-primary" id="editRegistrationButton" onclick="editRegistrationForm()">Edit Registration Request</button>'+
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
        '<td class="table-row">' + regi.rowerOfRegistration.nameMember + '</td>'+
        '<td class="table-row">' + LocalDateToString(regi.orderDate) + '</td>'+
        '<td class="table-row">' + localDateTimeToString(regi.activityDate) + '</td>'+
        '<td class="table-row">' + createWindowDetails(regi.windowRegistration) + '</td>'+
        '<td class="table-row">' + createRowerListName(regi.rowersListInBoat) + '</td>'+
        '<td class="table-row">' + createBoatTypeList(regi.boatTypes) + '</td>'+
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
    const response = await fetch('../manageRegistration', {
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
        let toSend;
        if (window.activityType.toString() === null)
            toSend = "-";
        else
            toSend = window.activityType.toString();
        toSend += " at: ";
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

//                      -------------------------------------------EDIT REGISTRATION-----------------------------------

function editRegistrationForm(event){
    const regiCheckedEl = document.querySelector('#flexRadioDefaultRegi:checked')
    if(regiCheckedEl === null){
        alert("Choose Registration request first")
        event.preventDefault();
    }
    indexRegiGlobal = wantedRegistration();

    clearPageContent();
    let htmlToInsert ='<h3 class="import">Edit Registration Page </h3>'+
        '<label class="lbl_white">choose the wanted option</label><br><br>'+
        '<button type="submit" class="btn btn-primary" id="removeRegistrationButton" onclick="AddRowerToRegistration()" style="margin-right: 10px">Add Rower To Registration</button>'+
        '<button type="submit" class="btn btn-primary" id="removeRegistrationButton" onclick="removeRowerToRegistration()" style="margin-right: 10px">Delete Rower From Registration</button>'+
        '<button type="submit" class="btn btn-primary" id="removeRegistrationButton" onclick="addBoatTypeToRegistration()" style="margin-right: 10px">Add Boat Type To Registration</button>'+
        '<button type="submit" class="btn btn-primary" id="removeRegistrationButton" onclick="removeBoatTypeToRegistration()">Remove Boat Type From Registration</button>'+
        '</td>';

    pageContentManagerEl.innerHTML = htmlToInsert;
}

function AddRowerToRegistration(){
    clearPageContent();
    showRowerToAdd("addRower");
}

async function showRowerToAdd(flag) {
    chosenRegiGlobal = regiListObj[indexRegiGlobal]
    const response = await fetch('../editRegistration', {method: 'get'});
    const rowerList = await response.json();
    mainRowerListGlobal = rowerList;

    let html = '<table class="table">' +
        '<thead>' +
        '<tr>' +
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
        '</tr>' +
        '</thead>' +
        '<tbody>'

    var i;
    for (i = 0; i < rowerList.length; i++)
        html += createElementMember(rowerList[i])

    if (flag === "addRower") {
        html += '<label class="lbl_white">>There are the rowers in the Registration request, dont choose them again!!.</label><br><br></tbody></table>'
        html += '<button type="button" class="btn btn-danger" onClick="addRower()">Add Rower</button>'
    }
    else { // flag === removeRower
        html += '<label class="lbl_white">Choose the rowers who are part from the registration only!!.</label><br><br></tbody></table>'
        html+= '<button type="button" class="btn btn-danger" onClick="removeRower()">Remove Rower</button>'
    }
    pageContentManagerEl.innerHTML = html;
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
        '<td class="table-row">' + member.nameMember + '</td>'+
        '<td class="table-row">' + member.email + '</td>'+
        '<td class="table-row">' + member.memberSerial + '</td>'+
        '<td class="table-row">' + member.isManager + '</td>'+
        '<td class="table-row">' + member.hasPrivateBoat + '</td>'+
        '<td class="table-row">' + member.level + '</td>'+
        '<td class="table-row">' + member.phoneNumber + '</td>'+
        '<td class="table-row">' + member.age + '</td>'+
        '<td class="table-row">' + member.additionalDetails + '</td>'+
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
        const response = await fetch('../editRegistration', {
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
        const response = await fetch('../editRegistration', {
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
        const response = await fetch('../editBoatTypeInRegi', {
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
        const response = await fetch('../editBoatTypeInRegi', {
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
        '<th class="lbl_white" scope="col">#</th>' +
        '<th class="lbl_white" scope="col">Boat Type</th>' +
        '<th class="lbl_white" scope="col">Capacity Of Rower</th>' +
        '</tr></thead>' +
        '<tbody>'

    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> SingleBoat </td><td class="lbl_white">' + 1 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> DoubleBoat </td><td class="lbl_white">' + 2 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> DoubleBoatPaddle </td><td class="lbl_white">' + 2 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> DoubleCoxed </td><td class="lbl_white">' + 2 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> DoublePaddleCoxed </td><td class="lbl_white">' + 2 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> QuartetBoat </td><td class="lbl_white">' + 4 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> QuartetBoatPaddle </td><td class="lbl_white">' + 4 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> QuartetBoatCoxed </td><td class="lbl_white">' + 4 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> QuartetBoatPaddleCoxed </td><td class="lbl_white">' + 4 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> OctetBoatCoxed </td><td class="lbl_white">' + 8 + '</td></tr>';
    html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefault">'+
        '</div></th><td class="lbl_white"> OctetBoatCoxedPaddle </td><td class="lbl_white">' + 8 + '</td></tr>';

    if (flag === "addBoatType") {
        html += '<label class="lbl_white">There are the BoatType chosen in the Registration request, dont choose them again!!.</label><br><br></tbody></table>'
        html += '<button type="button" class="btn btn-primary" onClick="addBoatType()">Add Boat Type</button>'
    }
    else { // flag === removeBoatType
        html += '<label class="lbl_white">Choose the BoatTypes which are part from the registration only!!.</label><br><br></tbody></table>'
        html+= '<button type="button" class="btn btn-primary" onClick="removeBoatType()">Remove Boat Type</button>'
    }
    pageContentManagerEl.innerHTML = html;
}