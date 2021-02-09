const homeButtonEl = document.querySelector('#home')
const changeNameButtonEl = document.querySelector('#changeName')
const changePasswordButtonEl = document.querySelector('#changePassword')
const changePhoneNumberButtonEl = document.querySelector('#changePhoneNumber')
const changeEmailButtonEl = document.querySelector('#changeEmail')
const futureAssignmentButtonEl = document.querySelector('#futureAssignment')
const historyAssignmentButtonEl = document.querySelector('#historyAssignment')
const logoutButtonEl = document.querySelector('#logout')
const inputEl = document.querySelector('#managerMenuInput')

// changeEmailButtonEl.addEventListener('click',changeEmailFunc); TODO
changeNameButtonEl.addEventListener('click', changeNameFunc);
changePasswordButtonEl.addEventListener('click', changePasswordFunc);
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
    const name = inputEl.value;
    if (name.length < 3){
        alert("password should be at least 3 characters")
        event.preventDefault();
    }

    if (/[^A-Za-z0-9]/.test(name)){
        alert("The password should contains letters and digits only")
        inputEl.value = ''
        event.preventDefault();
    }
    else{
        alert("good!!")
        inputEl.value = ''
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


