const importButtonEl = document.querySelector('#importStation')

importButtonEl.addEventListener('click', showMainImportFrm);

function showMainImportFrm(){
    clearPageContent();
    let html = '<h3 class="import">Import Station</h3><br><label class="lbl_white">Choose What Type of data do you want to import</label>'+
    '<div class="col-8">'+
    '<select class="form-select" id="DataTypeSelect">'+
    '<option selected disabled >Choose Data?</option>'+
    '<option value="1">Rowers</option>'+
    '<option value="2">Boats</option>'+
    '<option value="3">Activities</option>'+
    '</select><br>'+
    '</div>'+
    '<select class="form-select" id="deleteSelect">'+
    '<option selected disabled> Delete all existed data?</option>'+
    '<option value="1">Yes</option>'+
    '<option value="2">No</option>'+
    '</select><br>'

    html += '<input class="lbl_white" type="file" id="importRowerrr" accept=".xml">';
    html += '<input type="Submit" id="clickImport" class="btn btn-primary" onclick=" switcherForm()" value="Submit"><br>'

    pageContentManagerEl.innerHTML = html;
}

function switcherForm(){
    const dataTypeSelectButtonEl = document.querySelector('#DataTypeSelect');
    const whatToImport = dataTypeSelectButtonEl.value;
    switch (whatToImport){
        case "1":
            importRower();
            break;
        case "2":
            importBoats();
            break;
        case "3":
            importActivity();
            break;
        default:
            break;
    }
}
async function importRower(){
    ifDeleteRower();

    let inputEl = document.querySelector('#importRowerrr');
    let data = new FormData();
    data.append('file', inputEl.files[0])

    fetch('../importRower',{
        method: 'post',
        body: data,
    }).then(async function(response){
        let resAsJson = await response.text();

        if (resAsJson === null || resAsJson === "" || resAsJson === "null")
            pageContentManagerEl.innerHTML = '<label class="lbl_white"> The Rowers data has been imported successfully without any data error while importing </label>' ;
        else {
            let html = '<label class="lbl_white"> The Rowers data has been imported successfully </label><br><br>' ;
            html += '<label class="lbl_white">' + resAsJson + '</label>'
            pageContentManagerEl.innerHTML = html;
        }
    })
}

async function importBoats(){
    ifDeleteBoat();

    let inputEl = document.querySelector('#importRowerrr');
    let data = new FormData();
    data.append('file', inputEl.files[0])

    fetch('../importBoat',{
        method: 'post',
        body: data,
    }).then(async function(response){
        let resAsJson = await response.text();

        if (resAsJson === null || resAsJson === "" || resAsJson === "null")
            pageContentManagerEl.innerHTML = '<label class="lbl_white"> The Boats data has been imported successfully without any data error while importing </label>' ;
        else {
            let html = '<label class="lbl_white"> The Boats data has been imported successfully </label><br><br>' ;
            html += '<label class="lbl_white">' + resAsJson + '</label>'
            pageContentManagerEl.innerHTML = html;
        }
    })
}

async function importActivity(){
    ifDeleteActivity();

    let inputEl = document.querySelector('#importRowerrr');
    let data = new FormData();
    data.append('file', inputEl.files[0])

    fetch('../importActivity',{
        method: 'post',
        body: data,
    }).then(async function(response){
        let resAsJson = await response.text();

        if (resAsJson === null || resAsJson === "" || resAsJson === "null")
            pageContentManagerEl.innerHTML = '<label class="lbl_white"> The Activities data has been imported successfully without any data error while importing </label>' ;
        else {
            let html = '<label class="lbl_white"> The Activities data has been imported successfully </label><br><br>' ;
            html += '<label class="lbl_white">' + resAsJson + '</label>'
            pageContentManagerEl.innerHTML = html;
        }
    })
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
