const addRegistrationWindowEl = document.querySelector('#addRegistrationWindow')
const showRegistrationWindowEl = document.querySelector('#showAllRegistrationWindow')

addRegistrationWindowEl.addEventListener('click',addRegistrationWindowForm)
showRegistrationWindowEl.addEventListener('click',showAllWindowsRegistration)
let windowsListObj = {}

function addRegistrationWindowForm() {
    clearPageContent();
    let html = '<label for="startTimeActivity">Start time:</label>'+
        '<input type="time" id ="startTimeActivity">'+
        '<label for="endTimeActivity"> End time:</label>'+
        '<input type="time" id="endTimeActivity">'+
        '<br><br>'+
        '<div class="col-12">'+
        '<div class="col-2">'+
        '<select class="form-select" aria-label="Select Window Registration" id="boatTypeSelectWindow">'+
            '<option selected disabled value ="0"> Select Window Registration</option>'+
            '<option value="0">None</option>'+
            '<option value="1">Single</option>'+
            '<option value="2">Double</option>'+
            '<option value="3">Coxed Double</option>'+
            '<option value="4">Pair</option>'+
            '<option value="5">Coxed Pair</option>'+
            '<option value="6">Four</option>'+
            '<option value="7">Coxed Four</option>'+
            '<option value="8">Quad</option>'+
            '<option value="9">Coxed Quad</option>'+
            '<option value="10">Octuple</option>'+
            '<option value="11">Eight</option>'+
        '</select>'+
        '<br>'+
        '<select class="form-select" aria-label="Select activity type"  id="activityTypeSelectWindow">'+
            '<option selected disabled value = 0>Select activity type</option>'+
            '<option value="1">Sailing</option>'+
            '<option value="2">Training</option>'+
        '</select>'+
        '</div>'+
        '</div>'+
        '<br>'+
        '<button type="button" class="btn btn-primary" onclick="addRegistrationWindow()">Add</button>';
    pageContentManagerEl.innerHTML = html;
}

function validTime(startTime, endTime){
    return startTime.valueAsDate < endTime.valueAsDate;
}

async function addRegistrationWindow(event) {
    const startTimeEl = document.querySelector('#startTimeActivity')
    const endTimeEl = document.querySelector('#endTimeActivity')
    const boatTypeEl = document.querySelector('#boatTypeSelectWindow')
    const activityTypeEl = document.querySelector('#activityTypeSelectWindow')

    if(activityTypeEl.value === 0 || startTimeEl.value === '' || endTimeEl.value === ''){
        alert("fill all the fields")
        event.preventDefault();
    }

    if (!validTime(startTimeEl,endTimeEl)){
        alert("end time should be /'later/' start time")
        endTimeEl.value = ''
        event.preventDefault();
    }

    const WindowArgs = {
        startTime: startTimeEl.value, //string
        endTime: endTimeEl.value, //string
        boatType: boatTypeEl.value,
        activityType: activityTypeEl.value,
    }
    startTimeEl.valueAsDate

    let keepTheChanges = confirm("are you sure about window's details");
    if (keepTheChanges === true) {
        const response = await fetch('../addWindowRegistration', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(WindowArgs)
        });

        let result = await response.text();
        if (result === 'error') {
            window.location.href = '/path';
        } else
            alert("The Window registration has been  added successfully")
        window.location.replace(result)
    }
}

async function showAllWindowsRegistration(){
    const response = await fetch('../addWindowRegistration', {method: 'get'});
    const windowsList = await response.json();
    windowsListObj = windowsList;
    clearPageContent();
    let htmlToInsert = '<table class="table">'+
        '<thead>'+
        '<tr>'+
        '<th scope="col">#</th>'+
        '<th scope="col">Activity</th>'+
        '<th scope="col">Start Time</th>'+
        '<th scope="col">End Time</th>'+
        '<th scope="col">Boat Type</th>'+
        '</tr>'+
        '</thead>'+
        '<tbody>'

    windowsList.forEach(window => {htmlToInsert += createElementWindow(window)});
    htmlToInsert += '</tbody></table>'+
        '<td>'+
        '<button type="submit" class="btn btn-primary" id="removeWindowButton" onclick="removeWindow()">Remove Window Registration</button>'+
        '</td> <td></td><td></td>'+
        '<td>'+
        '<button type="submit" class="btn btn-primary" id="editWindowButton" onclick="editWindow()">Edit Window Regiistration</button>'+
        '</td>';

    pageContentManagerEl.innerHTML = htmlToInsert;
}

function createElementWindow(window){
    let boatType;
    if (window.boatType === null)
        boatType = "No Boat Type"
    else
        boatType = window.boatType;
    let htmlBoat = '<tr>'+
        '<th scope="row">' +
        '<div class="form-check">'+
        '<input class="form-check-input" type="radio" name="flexRadioDefaultWindow" id = "flexRadioDefaultWindow">'+
        '</div>'+
        '</th>'+
        '<td>' + window.activityType + '</td>'+
        '<td>' + window.startTime + '</td>'+
        '<td>' + window.endTime + '</td>'+
        '<td>' + boatType + '</td>'+
        '</tr>';
    return htmlBoat;
}

function wantedWindow() {
    let index = 0;
    const selectedEl = document.querySelectorAll('#flexRadioDefaultWindow');
    for (let el of selectedEl) {
        if (el.checked === true) {
            return index;
        }
        index++;
    }
    return -1
}

async function removeWindow(event){
    const windowCheckedEl = document.querySelector('#flexRadioDefaultWindow:checked')
    if(windowCheckedEl === null){
        alert("Choose window registration first")
        event.preventDefault();
    }

    let indexWindow = wantedWindow();
    const response = await fetch('../addWindowRegistration', {
        method: 'put',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(indexWindow)
    });

    let result = await response.text();
    alert("The Window Registration has been removed successfully")
    window.location.replace(result)
}