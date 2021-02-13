const LoginButtonEl = document.querySelector('#LoginButton')
const emailInputEl = document.querySelector('#emailInputId')
const passwordInputEl = document.querySelector('#passwordInputId')

LoginButtonEl.addEventListener ('click', memberDetailsIn);

async function memberDetailsIn(event) {
    const email = emailInputEl.value;
    const pass = passwordInputEl.value;
    if (!ValidInputArgs(email, pass)) {
        emailInputEl.value = ''
        passwordInputEl.value = ''
        event.preventDefault();
    }
    else {
        const LoginArgs = {
            email: email,
            pass: pass
        }

        const response = await fetch('login', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json;charset=utf-8'}),
            body: JSON.stringify(LoginArgs)
        });

        const result = await response.text();
        window.location.replace(result)
    }
}

function validatorEmail(email){
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(mailformat)){
        emailInputEl.focus();
        return true;
    }
    else {
        emailInputEl.focus();
        return false;
    }
}

function ValidatorPassword(pass){
    if (pass != null && pass.length >= 3)
        return true;
    else
        return false;
}

function ValidInputArgs(email, password) {
    if (!ValidatorPassword(password)) {
        alert("password should be at least 3 characters")
        return false;
    }

    if (!validatorEmail(email)){
        alert("You have entered an invalid email address!");
        return false;
    }

    return true;
}

