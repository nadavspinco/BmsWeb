
const showHistory = document.querySelector('#historyAssignmentLink')

showHistory.addEventListener('click',showHistoryFunc)

async function showHistoryFunc(){
    alert("here!")
    const  response = await fetch('fetchAssignmentHistory',{method: 'GET',
        headers: new Headers({'Content-Type': 'application/json;charset=utf-8'})})
    const text =  await response.json();
    handleResponse(text);

}

function handleResponse(response){
    if(response.errorCode === 0){
        if(response.registrationList.length ===0){
            pageContentEl.innerHTML = "<p>'no relevent history</p>"
        }
        else {
            let html = '<table class="table">'
                +'<thead>'
                 +   '<tr>'
                  +      '<th scope="col">#</th>'
                   +     '<th scope="col">First</th>'
                    +    '<th scope="col">Last</th>'
                     +   '<th scope="col">Handle</th>'
                    +'</tr>'
                +'</thead>'
                +'<tbody>'
            let i = 1;
            for (registration in response.registrationList){
                let names = ""
                for(member in response.registrationList.rowersListInBoat) {
                    names += member.nameMember +'\n';
                }
                html +=  '<tr>'
                    +'<th scope="row">+i +</th>'
                    +'<td>+names+</td>'
                    +'<td>+registration.activityDate+</td>'
                   +'<td>+registration.endTime+</td>'
               + '</tr>'
                i++;

            }
            html+= '</tbody>'
        +'</table>'
        }
    }
}

