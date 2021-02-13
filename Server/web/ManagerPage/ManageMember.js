const addMemberButtonEl = document.querySelector('#addRower')


addMemberButtonEl.addEventListener('click', showAddMember);

async function addNewMember(event) {
    const emailInputEl = document.querySelector('#memberEmailInput')
    const email = emailInputEl.value
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!email.match(mailformat)){
        alert("invalid email")
        emailInputEl.value = '';
        event.preventDefault();
    }

    const passwordInputEl = document.querySelector('#memberPasswordInput')
    const password = passwordInputEl.value
    if (/[^A-Za-z0-9]/.test(password)) {
        alert("password with letter and numbers only")
        passwordInputEl.value = '';
        event.preventDefault();
    }

    const memberNameInputEl = document.querySelector('#memberNameInput')
    const name = memberNameInputEl.value;
    if (/[^A-Za-z0-9]/.test(name)) {
        alert("name with letter and numbers only")
        memberNameInputEl.value = '';
        event.preventDefault();
    }

    const memberSerialInputEl = document.querySelector('#memberSerialInput')
    const serial = memberSerialInputEl.value;
    if (/[^A-Za-z0-9]/.test(serial)) {
        memberSerialInputEl.value = '';
        alert("Serial with letter and numbers only")
        event.preventDefault();
    }

    const memberCommentInputEl = document.querySelector('#memberCommentInput')
    const comment = memberCommentInputEl.value;
    if (!(/^[0-9A-Za-z ]+$/.test(comment))) {
        memberCommentInputEl.value = '';
        alert("comment with letters only")
        event.preventDefault();
    }

    const memberPhoneInputEl = document.querySelector('#memberPhoneInput')
    const phone = memberPhoneInputEl.value;
    if (!(/^[0-9]+$/.test(phone))) {
        memberPhoneInputEl.value = '';
        alert("phone with numbers only")
        event.preventDefault();
    }

    const isManagerCheckBoxEl = document.querySelector('#managerCheckBox')
    const memberAgeInputEl = document.querySelector('#memberAgeInput')
    const chooseRowerLevelEl = document.querySelector('#chooseRowerLevel')
    if (chooseRowerLevelEl.value === "Rower Level"){
        alert("rower level required")
        event.preventDefault();
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

    let keepTheChanges = confirm("are you sure about boat's details");
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
            alert("The Rower has added successfully")
        window.location.replace(result)
    }
}

function showAddMember(){
    clearPageContent();
    let htmlToInsert = '<form class="row g-3">'+
    '<div class="col-md-4">'+
        '<label for="memberEmailInput" class="form-label">Email</label>'+
        '<input type="text" class="form-control" id="memberEmailInput">'+
    '</div>'+
    '<div class="col-md-4">'+
        '<label for="memberPasswordInput" class="form-label">Password</label>'+
        '<input type="password" class="form-control" id="memberPasswordInput">'+
    '</div>'+
    '<div>'+
        '<div class="col-md-4">'+
            '<label for="memberNameInput" class="form-label">Rower Name</label>'+
            '<input type="text" class="form-control" id="memberNameInput">'+
        '</div>'+
        '<div class="col-md-4">'+
            '<label for="memberSerialInput" class="form-label">Rower Serial</label>'+
            '<input type="text" class="form-control" id="memberSerialInput">'+
        '</div>'+
        '<div class="col-md-12">'+
            '<label for="memberCommentInput" class="form-label">Comment</label>'+
            '<input type="text" class="form-control" id="memberCommentInput">'+
        '</div>'+
        '<div class="col-md-12">'+
            '<label for="memberPhoneInput" class="form-label">Phone Number</label>'+
            '<input type="text" class="form-control" id="memberPhoneInput">'+
        '</div>'+
        '<div>'+
            '<label for="memberAgeInput">Age (13-99):</label><br>'+
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
                '<label class="form-check-label" for="managerCheckBox">'+
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
