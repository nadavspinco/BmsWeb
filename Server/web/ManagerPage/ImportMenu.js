const importButtonEl = document.querySelector('#importStation')

importButtonEl.addEventListener('click', showMainImportFrm);

function showMainImportFrm(){
    clearPageContent();
    let html = '<label>Choose What Type of data do you want to import</label>'+
    '<div class="col-8">'+
    '<select class="form-select" id="DataTypeSelect">'+
    '<option selected disabled >Choose Data?</option>'+
    '<option value="1">Rowers</option>'+
    '<option value="2">Boats</option>'+
    '<option value="3">Activities</option>'+
    '</select><br>'+
    '</div>'
    pageContentManagerEl.innerHTML = html;
    pageContentManagerEl.innerHTML += '<input type="Submit" class="btn btn-primary" onclick=" switgcherForm()" value="Submit"><br>'
}

function switcherForm(){
    const dataTypeSelectButtonEl = document.querySelector('#DataTypeSelect');
    const whatToImport = dataTypeSelectButtonEl.value;
    switch (whatToImport){
        case "1":
            showImportRowerForm();
            break;
        case "2":
            showImportBoatForm();
            break;
        case "3":
            showImportActivityForm();
            break;
        default:
            break;
    }
}
function showImportRowerForm(){
    clearPageContent();
    let html = '<form action="../importRower" enctype="multipart/form-data" method="POST">'+
        '<h3>Select a File:</h3>'+
        '<div class="col-md-4">'+
        '<div class="col-8">'+
            '<select class="form-select" id="deleteSelect">'+
                '<option selected disabled> Delete all existed data?</option>'+
                '<option value="1">Yes</option>'+
                '<option value="2">No</option>'+
            '</select><br>'+
        '</div>'+
        '<input type="file" class="btn btn-primary" name="file1" accept=".xml"><br><br>'+
        '<input type="Submit" class="btn btn-primary" onclick="ifDeleteRower()" value="Upload File"><br>'+
        '</div>'+
        '</form>'
    pageContentManagerEl.innerHTML = html;
}

function showImportBoatForm(){
    clearPageContent();
    let html = '<form action="../importBoat" enctype="multipart/form-data" method="POST">'+
        '<h3>Select a File:</h3>'+
        '<div class="col-md-4">'+
        '<div class="col-8">'+
        '<select class="form-select" id="deleteSelect">'+
        '<option selected disabled>Delete all existed data?</option>'+
        '<option value="1">Yes</option>'+
        '<option value="2">No</option>'+
        '</select><br>'+
        '</div>'+
        '<input type="file" class="btn btn-primary" name="file1" accept=".xml"><br><br>'+
        '<input type="Submit" class="btn btn-primary" onclick="ifDeleteBoat()" value="Upload File"><br>'+

        '</div>'+
        '</form>'
    pageContentManagerEl.innerHTML = html;
}


function showImportActivityForm(){
    clearPageContent();
    let html = '<form action="../importActivity" enctype="multipart/form-data" method="POST">'+
        '<h3>Select a File:</h3>'+
        '<div class="col-md-4">'+
        '<div class="col-8">'+
        '<select class="form-select" id="deleteSelect">'+
        '<option selected disabled>Delete all existed data?</option>'+
        '<option value="1">Yes</option>'+
        '<option value="2">No</option>'+
        '</select><br>'+
        '</div>'+
        '<input type="file" class="btn btn-primary" name="file1" accept=".xml"><br><br>'+
        '<input type="Submit" class="btn btn-primary" onclick="ifDeleteActivity()"value="Upload File"><br>'+

        '</div>'+
        '</form>'
    pageContentManagerEl.innerHTML = html;
}

async function ifDeleteRower(){
    const deleteSelectButtonEl = document.querySelector('#deleteSelect')
    let deleteAlData = deleteSelectButtonEl.value === "1" ? true : false;
    if (deleteAlData) {
        let response, answer = null;
            response = await fetch('../importRower', {method: 'put'});
            answer = await response.text();
        alert(answer);
    }
}

async function ifDeleteBoat(){
    const deleteSelectButtonEl = document.querySelector('#deleteSelect')
    let deleteAlData = deleteSelectButtonEl.value === "1" ? true : false;
    if (deleteAlData) {
        let response, answer = null;
        response = await fetch('../importBoat', {method: 'put'});
        answer = await response.text();
        alert(answer);
    }
}

async function ifDeleteActivity(){
    const deleteSelectButtonEl = document.querySelector('#deleteSelect')
    let deleteAlData = deleteSelectButtonEl.value === "1" ? true : false;
    if (deleteAlData) {
        let response, answer = null;
        response = await fetch('../importActivity', {method: 'put'});
        answer = await response.text();
        alert(answer);
    }
}
