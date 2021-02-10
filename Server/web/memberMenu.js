const changeNameButtonEl = document.querySelector('#changeName')
const changePasswordButtonEl = document.querySelector('#changePassword')
const changePhoneNumberButtonEl = document.querySelector('#changePhoneNumber')
const changeEmailButtonEl = document.querySelector('#changeEmail')
const futureAssignmentButtonEl = document.querySelector('#futureAssignment')
const historyAssignmentButtonEl = document.querySelector('#historyAssignment')
const inputEl = document.querySelector('#managerMenuInput')
const pageContentEl = document.querySelector('#pageContent')

// changeEmailButtonEl.addEventListener('click',changeEmailFunc); TODO
changeNameButtonEl.addEventListener('click', changeNameFunc);
changePasswordButtonEl.addEventListener('click', showChangePasswordContent);
changePhoneNumberButtonEl.addEventListener('click', changePhoneFunc);


async function changeNameFunc(event){
    const name = inputEl.value;
    if(name.length === 0){
        alert("The Name should not be empty")
        event.preventDefault();
    }
    if (/[^a-zA-Z]/.test(name)){
        alert("The Name should contains letters only")
        inputEl.value = ''
        event.preventDefault();
    }
    else{
        alert("good!!")
        inputEl.value = ''

        const response = await fetch('MemberMenuServlet', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(name)
        });
        const result = await response.text();
        console.log(result + "in java script");
        window.location.replace(result)
    }
}

async function changePasswordFunc(event){
    const newPasswordInputEl = document.querySelector("#newPasswordInput");
    if(newPasswordInputEl == null){
        return;
    }
    const newPassword = newPasswordInputEl.value;
    if (newPassword == null || newPassword.length < 3){
        alert("password should be at least 3 characters")
        event.preventDefault();
    }

    if (/[^A-Za-z0-9]/.test(newPassword)){
        alert("The password should contains letters and digits only")
        newPasswordInputEl.value = ''
        event.preventDefault();
    }

    let keepTheChanges = confirm("are you sure you want to change the password?");
    if(keepTheChanges == true){

        //TODO: reach  serlvet
        //TODO: back to main page
    }
}

async function changePhoneFunc(event){
    const name = inputEl.value;
    if (name.length < 3){
        alert("phone number should be at least 3 digits")
        event.preventDefault();
    }

    if (/[^0-9]/.test(name)){
        alert("The phone number should contains digits only")
        inputEl.value = ''
        event.preventDefault();
    }
    else{
        alert("good!!")
        inputEl.value = ''
    }
}

function clearPageContent(){
    pageContentEl.innerHTML = ''
}

function showChangePasswordContent(){
    clearPageContent();
    let htmlToInsert = '<label class="lbl"> Enter your new password </label><br>\n' +
        '<input class= "password-field" type="password" id="newPasswordInput"  autofocus/>' +
        '<br/>'+ // represent a new line
        '<button type="button" onclick="changePasswordFunc()">Save The Changes</button>'
    pageContentEl.innerHTML = htmlToInsert;
}

function showChangePasswordContent(){
    clearPageContent();
    let htmlToInsert = '<label class="lbl"> Enter your new phone number </label><br>\n' +
        '<input class= "inpt" type="text" id="newPhoneInput"  autofocus/>' +
        '<br/>'+ // represent a new line
        '<button type="button" onclick="changePhoneFunc()"> Save The Changes</button>'
    pageContentEl.innerHTML = htmlToInsert;
}

