const logoutButtonEl = document.querySelector('#logoutRef')
logoutButtonEl.addEventListener('click',logout)


async function logout()
{
    const response = await fetch('../logout')
}