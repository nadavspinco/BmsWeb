const addBoatButtonEl = document.querySelector('#addBoat')
const removeBoatButtonEl = document.querySelector('#removeBoatButton')
const editBoatButtonEl = document.querySelector('#removeBoatButton')
const showBoatButtonEl = document.querySelector('#showAllBoat')

const pageContentManagerEl = document.querySelector('#pageContentManager')
let boatListObj ={}

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
        '<label for="boatNameLabel" class="form-label">Boat Name</label>'+
        '<input type="text" class="form-control" id="boatNameInput">'+
        '</div>'+
        '<div class="col-md-4">'+
        '<label for="boatSerialLabel" class="form-label">Serial Number</label>'+
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
        '<label class="form-check-label" for="coastalCheckBoxLabel">'+
        'Coastal Boat'+
        '</label>'+
        '</div>'+
        '</div>'+
        '<div class="col-12">'+
        '<div class="form-check">'+
        '<input class="form-check-input" type="checkbox" id="wideCheckBox">'+
        '<label class="form-check-label" for="wideCheckBoxLabel">'+
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
                '<th scope="col">is Available</th>'+
            '</tr>'+
        '</thead>'+
        '<tbody>'
    let index = 0;
    boatList.forEach(boat => {htmlToInsert += createElementBoat(boat)});
    htmlToInsert += '</tbody></table>'+
    '<td>'+
        '<button type="submit" class="btn btn-primary" id="removeBoatButton" onclick="removeBoat()">Remove Boat</button>'+
    '</td> <td></td><td></td>'+
    '<td>'+
        '<button type="submit" class="btn btn-primary" id="editBoatButton" onclick="editBoat()">Edit Boat</button>'+
    '</td>';

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

    let result = await response.text();
    alert("The boat has been removed successfully")
    window.location.replace(result)
}

function editBoat(event){
    const boatCheckedEl = document.querySelector('#flexRadioDefaultBoat:checked')
}
