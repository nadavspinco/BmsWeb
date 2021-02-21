
const changeNameManagerButtonEl = document.querySelector('#changeNameManagerr')
const changePasswordManagerButtonEl = document.querySelector('#changePasswordManager')
const changePhoneNumberManagerButtonEl = document.querySelector('#changePhoneManager')
const changeEmailManagerButtonEl = document.querySelector('#changeEmailManager')

changeEmailManagerButtonEl.addEventListener('click',showEmailNameContent);
changeNameManagerButtonEl.addEventListener('click', showChangeNameContent);
changePasswordManagerButtonEl.addEventListener('click', showChangePasswordContent);
changePhoneNumberManagerButtonEl.addEventListener('click', showChangePhoneContent);

async function changeEmailFunc(event){
    const nameEmailEl = document.querySelector("#newEmailInputManager");
    const email = nameEmailEl.value;
    if(!validatorEmail(email)){
        nameEmailEl.value = ''
        alert("You have entered an invalid email address!");
        event.preventDefault();
    }

    let keepTheChanges = confirm("are you sure you want to change the email?");
    if(keepTheChanges === true){
        const response = await fetch('../changeEmail', {
            method: 'put',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(email)
        });

        let result = await response.text();
        if(result === 'error') {
            alert("The Email is already existed in the system")
            result = ''
            window.location.href = '/path';
        }
        else
            alert("The email changed successfully")
        window.location.replace("managerMenu.html")
    }
}

function showEmailNameContent(){
    clearPageContent();
    let htmlToInsert = '<label class="lbl"> Enter your new email </label><br>\n' +
        '<input class= "inpt" type="text" id="newEmailInputManager"  autofocus/>' +
        '<br/>'+
        '<button type="button" onclick="changeEmailFunc()"> Save The Changes</button>'
    pageContentManagerEl.innerHTML = htmlToInsert;
}

function validatorEmail(email){
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(mailformat)){
        return true;
    }
    else {
        return false;
    }
}

async function changeNameFunc(event){
    const nameInputEl = document.querySelector("#newNameInputManager");
    const name = nameInputEl.value;
    if(name.length < 3){
        alert("The Name should be at least 3 letters")
        nameInputEl.value = ''
        event.preventDefault();
    }

    if (/[^a-zA-Z]/.test(name)){
        alert("The Name should contains letters only")
        nameInputEl.value = ''
        event.preventDefault();
    }

    let keepTheChanges = confirm("are you sure you want to change the name?");
    if(keepTheChanges === true){
        const response = await fetch('../changeName', {
            method: 'put',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(name)
        });

        let result = await response.text();
        if(result === 'error') {
            result = ''
            window.location.href = '/path';
        }
        alert("The name changed successfully")
        window.location.replace("managerMenu.html")
    }
}

function showChangeNameContent(){
    clearPageContent();
    let htmlToInsert = '<label class="lbl"> Enter your new name </label><br>\n' +
        '<input class= "inpt" type="text" id="newNameInputManager"  autofocus/>' +
        '<br/>'+
        '<button type="button" onclick="changeNameFunc()"> Save The Changes</button>'
    pageContentManagerEl.innerHTML = htmlToInsert;
}

async function changePhoneFunc(event){
    const phoneInputEl = document.querySelector("#newPhoneInputManager");
    const phone = phoneInputEl.value
    if (phone === null || phone.length < 3){
        alert("phone number should be at least 3 digits")
        phoneInputEl.value = ''
        event.preventDefault();
    }

    if (!(/^[0-9]+$/.test(phone))){
        alert("The phone number should contains digits only")
        phoneInputEl.value = ''
        event.preventDefault();
    }

    let keepTheChanges = confirm("are you sure you want to change the phone number?");
    if(keepTheChanges === true){
        const response = await fetch('../changePhone', {
            method: 'put',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(phone)
        });

        let result = await response.text();
        if(result === 'error') {
            result = ''
            window.location.href = '/path';
        }
        alert("The phone number changed successfully")
        window.location.replace("managerMenu.html")
    }
}

function showChangePhoneContent(){
    clearPageContent();
    let htmlToInsert = '<label class="lbl"> Enter your new phone number </label><br>\n' +
        '<input class= "inpt" type="text" id="newPhoneInputManager"  autofocus/>' +
        '<br/>'+ // represent a new line
        '<button type="button" onclick="changePhoneFunc()"> Save The Changes</button>'
    pageContentManagerEl.innerHTML = htmlToInsert;
}

async function changePasswordFunc(event){
    const newPasswordInputEl = document.querySelector("#newPasswordInputManager");
    if(newPasswordInputEl == null)
        return;

    const newPassword = newPasswordInputEl.value;
    if (newPassword === null || newPassword.length < 3){
        alert("password should be at least 3 characters")
        newPasswordInputEl.value = '';
        event.preventDefault();
    }

    if (/[^A-Za-z0-9]/.test(newPassword)){
        alert("The password should contains letters and digits only")
        newPasswordInputEl.value = '';
        event.preventDefault();
    }

    let keepTheChanges = confirm("are you sure you want to change the password?");
    if(keepTheChanges === true){
        const response = await fetch('../changePassword', {
            method: 'put',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(newPassword)
        });

        let result = await response.text();
        if(result === 'error') {
            result = ''
            window.location.href = '/path';
        }
        alert("The password changed successfully")
        window.location.replace("managerMenu.html")
    }
}

function showChangePasswordContent(){
    clearPageContent();
    let htmlToInsert = '<label class="lbl"> Enter your new password </label><br>\n' +
        '<input class= "password-field" type="password" id="newPasswordInputManager" autofocus/>' +
        '<br/>'+ // represent a new line
        '<button type="button" onclick="changePasswordFunc()">Save The Changes</button>' +
        '<h1 id = "answer"><h1>'

    pageContentManagerEl.innerHTML = htmlToInsert;
}

function clearPageContent(){
    pageContentManagerEl.innerHTML = '';
}