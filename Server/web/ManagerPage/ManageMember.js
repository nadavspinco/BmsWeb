const addMemberButtonEl = document.querySelector('#addRower')
const showMemberButtonEl = document.querySelector('#showAllRower')


addMemberButtonEl.addEventListener('click', addMemberForm);
showMemberButtonEl.addEventListener('click', showAllMember);
let memberListObj ={}
let globalIndexMember;

async function addNewMember(event) {
    const emailInputEl = document.querySelector('#memberEmailInput')
    const email = emailInputEl.value
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!email.match(mailformat)){
        alert("invalid email")
        emailInputEl.value = '';
        // event.preventDefault();
    }

    const passwordInputEl = document.querySelector('#memberPasswordInput')
    const password = passwordInputEl.value
    if (/[^A-Za-z0-9]/.test(password) || password === '') {
        alert("password with letter and numbers only")
        passwordInputEl.value = '';
        return;
        // event.preventDefault();
    }

    const memberNameInputEl = document.querySelector('#memberNameInput')
    const name = memberNameInputEl.value;
    if (/[^A-Za-z]/.test(name) || name === '') {
        alert("name with letter and numbers only")
        memberNameInputEl.value = '';
        // event.preventDefault();
        return;
    }

    const memberSerialInputEl = document.querySelector('#memberSerialInput')
    const serial = memberSerialInputEl.value;
    if (/[^A-Za-z0-9]/.test(serial) || serial === '') {
        memberSerialInputEl.value = '';
        alert("Serial with letter and numbers only")
        return;
        // event.preventDefault();
    }

    const memberCommentInputEl = document.querySelector('#memberCommentInput')
    const comment = memberCommentInputEl.value;
    if (!(/^[0-9A-Za-z ]+$/.test(comment))) {
        memberCommentInputEl.value = '';
        alert("comment with letters only")
        return;
        // event.preventDefault();
    }

    const memberPhoneInputEl = document.querySelector('#memberPhoneInput')
    const phone = memberPhoneInputEl.value;
    if (!(/^[0-9]+$/.test(phone))) {
        memberPhoneInputEl.value = '';
        alert("phone with numbers only")
        return;
        // event.preventDefault();
    }

    const isManagerCheckBoxEl = document.querySelector('#managerCheckBox')
    const memberAgeInputEl = document.querySelector('#memberAgeInput')
    const chooseRowerLevelEl = document.querySelector('#chooseRowerLevel')
    if (chooseRowerLevelEl.value === "Rower Level"){
        alert("rower level required")
        return;
        // event.preventDefault();
    }

    if(memberAgeInputEl.value === ""){
        alert("rower age required")
        return;
        // event.preventDefault();
    }

    const MemberArgs = {
        email: email,
        password: password,
        name: name,
        serial: serial,
        comment: comment,
        phone: phone,
        age: memberAgeInputEl.value,
        level: chooseRowerLevelEl.value,
        isManager: isManagerCheckBoxEl.checked
    }

    let keepTheChanges = confirm("are you sure about rower's details");
    if (keepTheChanges === true) {
        const response = await fetch('../addMember', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(MemberArgs)
        });

        let result = await response.text();
        if (result === 'errorEmail') {
            alert("The Email is already existed in the system")
            result = ''
            window.location.href = '/path';
        }
        else if (result === 'errorSerial') {
            alert("The Serial is already existed in the system")
            result = ''
            window.location.href = '/path';
        }
        else
            pageContentManagerEl.innerHTML = "The Rower has added successfully"

        window.location.replace(result)
    }
}

function addMemberForm(){
    clearPageContent();
    let htmlToInsert = '<form class="row g-3">'+
    '<div class="col-md-4">'+
        '<label for="memberEmailInput" class="lbl_white">Email</label>'+
        '<input type="text" class="form-control" id="memberEmailInput">'+
    '</div>'+
    '<div class="col-md-4">'+
        '<label for="memberPasswordInput" class="lbl_white">Password</label>'+
        '<input type="password" class="form-control" id="memberPasswordInput">'+
    '</div>'+
    '<div>'+
        '<div class="col-md-4">'+
            '<label for="memberNameInput" class="lbl_white">Rower Name</label>'+
            '<input type="text" class="form-control" id="memberNameInput">'+
        '</div>'+
        '<div class="col-md-4">'+
            '<label for="memberSerialInput" class="lbl_white">Rower Serial</label>'+
            '<input type="text" class="form-control" id="memberSerialInput">'+
        '</div>'+
        '<div class="col-md-12">'+
            '<label for="memberCommentInput" class="lbl_white">Comment</label>'+
            '<input type="text" class="form-control" id="memberCommentInput">'+
        '</div>'+
        '<div class="col-md-12">'+
            '<label for="memberPhoneInput" class="lbl_white">Phone Number</label>'+
            '<input type="text" class="form-control" id="memberPhoneInput">'+
        '</div>'+
        '<div>'+
            '<label class="lbl_white"> Age (13-99):</label><br>'+
            '<input type="number" id="memberAgeInput" name="Age" min="13" max="100">'+
        '</div>'+
    '</div>'+
    '<div class="col-12">'+
        '<div class="col-4">'+
            '<label class="visually-hidden" for="chooseRowerLevel">Preference</label>'+
            '<select class="form-select" id="chooseRowerLevel">'+
                '<option selected>Rower Level</option>'+
                '<option value="1">Beginner</option>'+
                '<option value="2">Intermediate</option>'+
                '<option value="3">Advanced</option>'+
            '</select>'+
        '</div>'+
    '</div>'+
    '<div class="col-12">'+
        '<div class="form-check">'+
            '<input class="form-check-input" type="checkbox" id="managerCheckBox">'+
                '<label class="lbl_white" for="managerCheckBox">'+
                    'Manager Position'+
                '</label>'+
        '</div>'+
    '</div>'+
    '<div class="col-12">'+
        '<button type="submit" class="btn btn-primary" onclick="addNewMember()">Confirm</button>'+
    '</div>'+
'</form>';
    pageContentManagerEl.innerHTML = htmlToInsert;
}

async function showAllMember(){
    const response = await fetch('../showMembers', {method: 'get'});
    const memberList = await response.json();
    memberListObj = memberList;
    clearPageContent();
    let htmlToInsert = '<table class="table">'+
        '<thead>'+
        '<tr>'+
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
        '</tr>'+
        '</thead>'+
        '<tbody>'
    let index = 0;
    memberList.forEach(member => {htmlToInsert += createElementMember(member, index++)});
    htmlToInsert += '</tbody></table>'+
        '<td>'+
        '<button style="margin-left: 470px" type="submit" class="btn btn-primary" id="removeMemberButton" onclick="removeMember()">Remove Member</button>'+
        '</td> <td></td><td></td>'+
        '<td>'+
        '<button type="submit" class="btn btn-primary" id="editMemberButton" onclick="EditMemberForm()">Edit Member</button>'+
        '</td>';

    if (memberList === null || memberList.length === 0)
        htmlToInsert = '<h1> There are no rowers in the Bout House</h1>'

    pageContentManagerEl.innerHTML = htmlToInsert;
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

function wantedMember() {
    let index = 0;
    const selectedEl = document.querySelectorAll('#flexRadioDefault');
    for (let el of selectedEl) {
        if (el.checked === true) {
            return index;
        }
        index++;
    }
    return -1
}

async function removeMember(event){
    const memberCheckedEl = document.querySelector('#flexRadioDefault:checked')
    if(memberCheckedEl === null){
        alert("Choose member first")
        event.preventDefault();
    }

    let indexMember = wantedMember();
    const response = await fetch('../removeMember', {
        method: 'put',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(memberListObj[indexMember])
    });

    let result = await response.text();
    alert("The member has been removed successfully")
    window.location.replace(result)
}

function EditMemberForm(event){
    const memberCheckedEl = document.querySelector('#flexRadioDefault:checked')
    if(memberCheckedEl === null){
        alert("Choose member first")
        event.preventDefault();
    }
    globalIndexMember = wantedMember();


    clearPageContent();
    let htmlToInsert = '<h2>Edit Rower Page</h2>'+
        '<div class="lbl_white"><label class="lbl" style="font-weight: bold"> Fill the wanted categories you want to change</label><br/><br/>'+
    '<form class="row g-3">'+
    '<div class="col-md-3">'+
        '<input class="form-check-input" type="checkbox" id="editNameCheckBox" style="margin-right: 10px">'+
        '<label for="editMemberName" class="form-label">Edit new Name</label>'+
        '<input type="text" class="form-control" id="editMemberName">'+
    '</div>'+
    '<div class="col-md-3">'+
        '<input class="form-check-input" type="checkbox" id="editPhoneCheckBox" style="margin-right: 10px">'+
        '<label for="editMemberPhoneInput" class="form-label">Edit new Phone Number</label>'+
        '<input type="text" class="form-control" id="editMemberPhoneInput">'+
    '</div>'+
    '<div>'+
        '<input class="form-check-input" type="checkbox" id="editExtendDateCheckBox" style="margin-right: 10px">'+
        '<label for="editExtendMemberShip">Extend end date membership by years:</label>'+
        '<input type="number" id="editExtendMemberShip" name="Age" min="1" max="5">'+
    '</div>'+
    '<div>'+
        '<input class="form-check-input" type="checkbox" id="editAgeCheckBox" style="margin-right: 10px">'+
        '<label for="editMemberAgeInput">Edit New Age (13-99):</label>'+
        '<input type="number" id="editMemberAgeInput" name="Age" min="13" max="100">'+
    '</div>'+
'</div>'+
'</div>'+
    '<div class="col-8">'+
        '<div class="col-2">'+
            '<label class="visually-hidden" for="editRowerLevel">Preference</label>'+
            '<select class="form-select" id="editRowerLevel">'+
                '<option selected disabled value="0">Rower Level</option>'+
                '<option value="0">None</option>'+
                '<option value="1">Beginner</option>'+
                '<option value="2">Intermediate</option>'+
                '<option value="3">Advanced</option>'+
            '</select>'+
        '</div>'+
    '</div><br>'+
    '<div class="col-12">'+
        '<button type="submit" class="btn btn-primary" onclick="addPrivateBoat()">Add Private Boat</button>'+
        '<button type="submit" class="btn btn-primary" onclick="cancelPrivateBoat()" style="margin-left: 20px">Cancel Private Boat</button><br/><br/>'+
        '<button type="submit" class="btn btn-primary" onclick="editMember()" style="margin-left: 700px">Confirm</button>'+
    '</div>'+
'</form>'
    pageContentManagerEl.innerHTML = htmlToInsert;
}

async function editMember(event){
    const editNameCheckBoxEl = document.querySelector('#editNameCheckBox')
    const editNameEl = document.querySelector('#editMemberName')
    let newName = editNameEl.value;
    if (editNameCheckBoxEl.checked){
        if (/[^A-Za-z]/.test(newName)) {
            alert("name with letters only")
            editNameEl.value = '';
            event.preventDefault();
        }
    }
    else
        newName = null;

    const editPhoneCheckBoxEl = document.querySelector('#editPhoneCheckBox')
    const editPhoneEl = document.querySelector('#editMemberPhoneInput')
    let newPhone = editPhoneEl.value;
    if (editPhoneCheckBoxEl.checked){
        if (!(/^[0-9]+$/.test(newPhone))) {
            editPhoneEl.value = '';
            alert("phone with numbers only")
            event.preventDefault();
        }
    }
    else
        newPhone = null;

    const editLevelEl = document.querySelector('#editRowerLevel')
    let newLevel = null;
    if (editLevelEl.value !== "0")
        newLevel = editLevelEl.value

    const editAgeCheckBoxEl = document.querySelector('#editAgeCheckBox')
    const editAgeEl = document.querySelector('#editMemberAgeInput')
    let newAge = 0;
    if (editAgeCheckBoxEl.checked)
        newAge = editAgeEl.value

    let indexMember = globalIndexMember;

    if(!(editNameCheckBoxEl.checked || editLevelEl.value !== "0" || editNameCheckBoxEl.checked || editPhoneCheckBoxEl.checked)){
        alert("You have to fill at least one thing")
        event.preventDefault();
    }
    const EditMemberArgs = {
        index: indexMember,
        name: newName,
        phone: newPhone,
        age: newAge,
        level: newLevel,
    }

    let keepTheChanges = confirm("are you sure about rower's new details");
    if (keepTheChanges === true) {
        const response = await fetch('../editMember', {
            method: 'put',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(EditMemberArgs)
        });

        let result = await response.text();
        alert("The Rower has been edited successfully")
        window.location.replace(result)
    }
}

async function cancelPrivateBoat(){
    let index = globalIndexMember;

    let keepTheChanges = confirm("are you sure to cancel rower's private boat?");
    if (keepTheChanges === true) {
        const response = await fetch('../editPrivateBoatOfMember', {
            method: 'put',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(memberListObj[index])
        });

        let result = await response.text();
        if (result === 'error') {
            alert("This rower doesn't have private boat")
            result = ''
            window.location.replace('managerMenu.html');
        }
        alert("Cancel private boat has been done successfully")
        window.location.replace(result)
    }

}

async function addPrivateBoat(){
    clearPageContent();
    const response = await fetch('../editPrivateBoatOfMember', {method: 'get'});
    const boatList = await response.json();
    boatListObj = boatList;
    let htmlToInsert = '<label style="font-weight: bold"> Select the wanted boat! </label><br/><br/>'+
        '<table class="table">'+
        '<thead>'+
            '<tr>'+
                '<th class="lbl_white" scope="col">#</th>'+
                '<th class="table-title" scope="col">Boat Name</th>'+
                '<th class="table-title" scope="col">Serial</th>'+
                '<th class="table-title" scope="col">Boat Type</th>'+
                '<th class="table-title" scope="col">is Wide</th>'+
                '<th class="table-title" scope="col">is Coastal</th>'+
                '<th class="table-title" scope="col">is Private</th>'+
                '<th class="table-title" scope="col">Able To Sail</th>'+
            '</tr>'+
        '</thead>'+
        '<tbody>'
    boatList.forEach(boat => {htmlToInsert += createElementBoat(boat)});
    htmlToInsert += '</tbody></table>'+
        '<td>'+
        '<button style="margin-left: 470px" type="submit" class="btn btn-primary" id="addPrivateBoatButton" onclick="addPrivateBoatFunc()">Add private boat</button>'+
        '</td>';

    if (boatList === null || boatList.length === 0)
        htmlToInsert = '<h1> There are no boat in the Bout House</h1>'


    pageContentManagerEl.innerHTML = htmlToInsert;
}

async function addPrivateBoatFunc(event){
    const boatCheckedEl = document.querySelector('#flexRadioDefaultBoat:checked')
    if(boatCheckedEl === null){
        alert("Choose boat first")
        event.preventDefault();
    }

    let indexBoat = wantedBoat();

    const AddPrivatBoatArgs = {
        indexMember: globalIndexMember,
        indexBoat: indexBoat,
    }

    const response = await fetch('../editPrivateBoatOfMember', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
        body: JSON.stringify(AddPrivatBoatArgs)
    });

    let result = await response.text();
    alert("The private boat has been added successfully")
    window.location.replace(result)
}
