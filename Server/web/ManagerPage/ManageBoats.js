const addBoatButtonEl = document.querySelector('#addBoat')
const showBoatButtonEl = document.querySelector('#showAllBoat')

const pageContentManagerEl = document.querySelector('#pageContent')
let boatListObj ={}
let globalIndexBoat;

addBoatButtonEl.addEventListener('click', addBoatForm);
showBoatButtonEl.addEventListener('click', showAllBoat)

function clearPageContent(){
    pageContentManagerEl.innerHTML = '';
}

async function addNewBoat(event) {
    const boatNameInputEl = document.querySelector('#boatNameInput')
    const name = boatNameInputEl.value;
    if (/[^A-Za-z0-9]/.test(name)) {
        alert("name with letter and numbers only")
        boatNameInputEl.value = '';
        event.preventDefault();
    }

    const boatSerialInputEl = document.querySelector('#boatSerialInput')
    const serial = boatSerialInputEl.value;
    if (/[^A-Za-z0-9]/.test(serial)) {
        boatSerialInputEl.value = '';
        alert("Serial with letter and numbers only")
        event.preventDefault();
    }
    const coastalCheckBoxEl = document.querySelector('#coastalCheckBox')
    const wideCheckBoxEl = document.querySelector('#wideCheckBox')
    const chooseBoatTypeEl = document.querySelector('#chooseBoatType')
    if (chooseBoatTypeEl.value === "Choose Boat Type"){
        alert("Boat Type required")
        event.preventDefault();
    }

    let isCoastal = coastalCheckBoxEl.checked;
    let isWide = wideCheckBoxEl.checked;

    const BoatArgs = {
        name: name,
        serial: serial,
        wide: isWide,
        coastal: isCoastal,
        boatType: chooseBoatTypeEl.value
    }

    let keepTheChanges = confirm("are you sure about boat's details");
    if (keepTheChanges === true) {
        const response = await fetch('../addBoat', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(BoatArgs)
        });

        let result = await response.text();
        if (result === 'error') {
            alert("The boat is already existed in the system")
            result = ''
            window.location.href = '/path';
        } else
            alert("The boat has added successfully")
        window.location.replace(result)
    }
}

function addBoatForm(){
    clearPageContent();
    let htmlToInsert = '<form class="row g-3">'+
        '<div class="col-md-4">'+
        '<label for="boatNameLabel" class="lbl_white" class="form-label">Boat Name</label>'+
        '<input type="text" class="form-control" id="boatNameInput">'+
        '</div>'+
        '<div class="col-md-4">'+
        '<label for="boatSerialLabel" class="lbl_white">Serial Number</label>'+
        '<input type="text" class="form-control" id="boatSerialInput">'+
        '</div>'+
        '<div class="col-12">'+
        '<div class="col-4">'+
        '<label class="visually-hidden" for="chooseBoatType">Preference</label>'+
        '<select class="form-select" id="chooseBoatType">'+
        '<option selected>Choose Boat Type</option>'+
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
        '</div>'+
        '</div>'+
        '<div class="col-12">'+
        '<div class="form-check">'+
        '<input class="form-check-input" type="checkbox" id="coastalCheckBox">'+
        '<label class="lbl_white" for="coastalCheckBoxLabel">'+
        'Coastal Boat'+
        '</label>'+
        '</div>'+
        '</div>'+
        '<div class="col-12">'+
        '<div class="form-check">'+
        '<input class="form-check-input" type="checkbox" id="wideCheckBox">'+
        '<label class="lbl_white" for="wideCheckBoxLabel">'+
        'Wide Boat'+
        '</label>'+
        '</div>'+
        '</div>'+
        '<div class="col-12">'+
        '<button type="submit" class="btn btn-primary" onclick="addNewBoat()">Confirm</button>'+
        '</div>'+
        '</form>'
    pageContentManagerEl.innerHTML = htmlToInsert;
}

async function showAllBoat(){
    const response = await fetch('../showBoats', {method: 'get'});
    const boatList = await response.json();
    boatListObj = boatList;
    clearPageContent();
    let htmlToInsert = '<table class="table">'+
        '<thead>'+
            '<tr>'+
                '<th scope="col">#</th>'+
                '<th scope="col">Boat Name</th>'+
                '<th scope="col">Serial</th>'+
                '<th scope="col">Boat Type</th>'+
                '<th scope="col">is Wide</th>'+
                '<th scope="col">is Coastal</th>'+
                '<th scope="col">is Private</th>'+
                '<th scope="col">Able To Sail</th>'+
            '</tr>'+
        '</thead>'+
        '<tbody>'
    boatList.forEach(boat => {htmlToInsert += createElementBoat(boat)});
    htmlToInsert += '</tbody></table>'+
    '<td>'+
        '<button type="submit" class="btn btn-primary" id="removeBoatButton" onclick="removeBoat()">Remove Boat</button>'+
    '</td> <td></td><td></td>'+
    '<td>'+
        '<button type="submit" class="btn btn-primary" id="editBoatButton" onclick="editBoatForm()">Edit Boat</button>'+
    '</td>';

    if (boatList === null || boatList.length === 0)
        htmlToInsert = '<h1> There are no boat in the Boat House</h1>'

    pageContentManagerEl.innerHTML = htmlToInsert;
}

function wantedBoat() {
    let index = 0;
    const selectedEl = document.querySelectorAll('#flexRadioDefaultBoat');
    for (let el of selectedEl) {
        if (el.checked === true) {
            return index;
        }
        index++;
    }
    return -1
}

function createElementBoat(boat){
    let htmlBoat = '<tr>'+
                     '<th scope="row">' +
                        '<div class="form-check">'+
                            '<input class="form-check-input" type="radio" name="flexRadioDefault" id = "flexRadioDefaultBoat">'+
                        '</div>'+
                     '</th>'+
                     '<td>' + boat.boatName + '</td>'+
                     '<td>' + boat.serialBoatNumber + '</td>'+
                     '<td>' + boat.boatType + '</td>'+
                     '<td>' + boat.isWide + '</td>'+
                     '<td>' + boat.isCoastalBoat + '</td>'+
                     '<td>' + boat.isPrivate + '</td>'+
                     '<td>' + boat.isAvailable + '</td>'+
                   '</tr>';
    return htmlBoat;
}

async function removeBoat(event){
    const boatCheckedEl = document.querySelector('#flexRadioDefaultBoat:checked')
    if(boatCheckedEl === null){
        alert("Choose boat first")
        event.preventDefault();
    }

    let indexBoat = wantedBoat();
    const response = await fetch('../removeBoat', {
        method: 'put',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(boatListObj[indexBoat])
    });

    alert("The boat has been removed successfully")

    let result = await response.text();
    window.location.replace(result)
}

function editBoatForm(event){
    const boatCheckedEl = document.querySelector('#flexRadioDefaultBoat:checked')
    if(boatCheckedEl === null){
        alert("Choose Boat first")
        event.preventDefault();
    }
    globalIndexBoat = wantedBoat();

    clearPageContent();
    let htmlToInsert = '<h2>Edit Boat Page</h2>'+
        '<div class="lbl_white"><label style="font-weight: bold"> Fill the wanted categories you want to change</label><br/><br/>'+
        '<form class="row g-3">'+
            '<div class="col-md-3">'+
                '<input class="form-check-input" type="checkbox" id="editBoatNameCheckBox" style="margin-right: 10px">'+
                    '<label for="editBoatName" class="form-label">Edit new Boat Name</label>'+
                    '<input type="text" class="form-control" id="editBoatName">'+
            '</div>'+
            '<div>'+
                '<input class="form-check-input" type="checkbox" id="editWidthCheckBox" style="margin-right: 10px">'+
                    '<label for="editWidthCheckBox" class="form-label">Change the width of the boat</label>'+
            '</div>'+
            '<div>'+
                '<input class="form-check-input" type="checkbox" id="editCoastalCheckBox" style="margin-right: 10px">'+
                '<label for="editCoastalCheckBox" class="form-label">Change the Coastal of the boat</label>'+
            '</div>'+
            '<div>'+
                '<input class="form-check-input" type="checkbox" id="disableBoatCheckBox" style="margin-right: 10px">'+
                '<label for="disableBoatCheckBox" class="form-label">Disable Boat</label>'+
            '</div>'+
            '<div class="col-12">'+
                '<button type="submit" class="btn btn-primary" onclick="fixBoatFunc()">Fix Boat</button><br/><br/>'+
                '<button type="submit" class="btn btn-primary" onclick="editBoat()" style="margin-left: 700px">Confirm</button>'+
            '</div></div>'+
        '</form>'
    pageContentManagerEl.innerHTML = htmlToInsert;
}

async function editBoat(event){
    const editBoatCheckBoxEl = document.querySelector('#editBoatNameCheckBox')
    const editBoatNameEl = document.querySelector('#editBoatName')
    let newName = editBoatNameEl.value;
    if (editBoatCheckBoxEl.checked){
        if (/[^A-Za-z]/.test(newName)) {
            alert("name with letters only")
            editBoatNameEl.value = '';
            event.preventDefault();
        }
    }
    else
        newName = null;

    const editWidthCheckBoxEl = document.querySelector('#editWidthCheckBox')
    const editCoastalCheckBoxEl = document.querySelector('#editCoastalCheckBox')
    const disableBoatCheckBoxEl = document.querySelector('#disableBoatCheckBox')

    const EditBoatArgs = {
        index: globalIndexBoat,
        name: newName,
        isWidth: editWidthCheckBoxEl.checked,
        isCoastal: editCoastalCheckBoxEl.checked,
        disableBoat: disableBoatCheckBoxEl.checked
    }

    let keepTheChanges = confirm("are you sure about boat's new details");
    if (keepTheChanges === true) {
        const response = await fetch('../editBoat', {
            method: 'put',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(EditBoatArgs)
        });

        let result = await response.text();
        if (result === 'error') {
            alert("This boat is already disable")
            alert("The boat has been edited successfully")
            window.location.replace('managerMenu.html');
        }
        alert("The boat has been edited successfully")
        window.location.replace(result)
    }
}

async function fixBoatFunc(){
    const response = await fetch('../editBoat', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(globalIndexBoat)
    });

    let result = await response.text();
    if (result === 'error') {
        alert("This boat is already fixed")
        window.location.replace('managerMenu.html');
    }

    alert("The boat has been fixed successfully")
    window.location.replace(result)
}