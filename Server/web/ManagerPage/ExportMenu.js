const exportButtonEl = document.querySelector('#exportStation')

exportButtonEl.addEventListener('click', showMainExportForm);

function showMainExportForm(){
    clearPageContent();
    let html =  '<h3>Export Station</h3>'+
                '<label style="font-weight: bold"> Click on the wanted data</label><br/><br/>'+
                '<button type="button" class="btn btn-primary" id="exportRower" onclick="downloadRowers()" style="margin-right: 15px">Download Rower</button>'+
                '<button type="button" class="btn btn-primary" id="exportBoat" onclick="downloadBoats()" style="margin-right: 15px">Download Boats</button>'+
                '<button type="button" class="btn btn-primary" id="exportActivity" onclick="downloadActivity()" style="margin-right: 15px">Download Activities</button>';

    pageContentManagerEl.innerHTML = html;
}


async function downloadRowers(){
    response = await fetch('../exportRower', {method: 'get'});
    answer = await response.text();
    document.getElementById("exportRower").addEventListener('click',function () {
        download("rowers.xml",answer);},false);
    alert("The Rower export has been done successfully")
}

async function downloadBoats(){
    response = await fetch('../exportBoat', {method: 'get'});
    answer = await response.text();
    document.getElementById("exportBoat").addEventListener('click',function () {
        download("boat.xml",answer);},false);
    alert("The Boat export has been done successfully")

}

async function downloadActivity(){
    response = await fetch('../exportActivity', {method: 'get'});
    answer = await response.text();
    document.getElementById("exportActivity").addEventListener('click',function () {
        download("Activity.xml",answer);},false);
    alert("The Activity export has been done successfully")
}


function download(filename, text){
    var element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charest=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}
