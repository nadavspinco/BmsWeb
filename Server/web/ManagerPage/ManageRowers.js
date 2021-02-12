const addRowerButtonEl = document.querySelector('#addBoat')
const pageContentManagerEl = document.querySelector('#pageContentManager')

addRowerButtonEl.addEventListener('click',showAddBoat);

function clearPageContent(){
    pageContentManagerEl.innerHTML = '';
}

function showAddBoat(){
    clearPageContent();
    let htmlToInsert = '<form class="row g-3">'+
        '<div class="col-md-4">'+
            '<label for="boatNameInput" class="form-label">Boat Name</label>'+
            '<input type="text" class="form-control" id="boatNameInput">'+
        '</div>'+
        '<div class="col-md-4">'+
            '<label for="boatSerialInput" class="form-label">Serial Number</label>'+
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
                    '<label class="form-check-label" for="coastalCheckBox">'+
                        'Coastal Boat'+
                    '</label>'+
            '</div>'+
        '</div>'+
        '<div class="col-12">'+
            '<div class="form-check">'+
                '<input class="form-check-input" type="checkbox" id="wideCheckBox">'+
                    '<label class="form-check-label" for="wideCheckBox">'+
                        'Wide Boat'+
                    '</label>'+
            '</div>'+
        '</div>'+
        '<div class="col-12">'+
            '<button type="submit" class="btn btn-primary">Confirm</button>'+
        '</div>'+
    '</form>'
    pageContentManagerEl.innerHTML = htmlToInsert;
}