
const addRegistrationWindowEl = document.querySelector('#addRegistrationWindow')
addRegistrationWindowEl.addEventListener('click',addRegistrationWindowForm)
function addRegistrationWindowForm() {
    pageContentManagerEl.innerHTML = ''
    let html ='<label for="startTimeActivity">Start time:</label>'
                +'<input type="time" id ="startTimeActivity">'
                +'<label for="endTimeActivity"> End time:</label>'
                +'<input type="time" id="endTimeActivity">'
                +'<select class="form-select" aria-label="Select Window Registration"  id="boatTypeSelectWindow"  >'
                    +'<option selected value="-1" disabled>Select Window Registration</option>'
                    +'<option value="0">None</option>'
                    +'<option value="1">SingleBoat</option>'
                    +'<option value="2">DoubleBoat</option>'
                    +'<option value="3">DoubleBoatPaddle</option>'
                    +'<option value="4">DoubleCoxed</option>'
                    +'<option value="5">DoublePaddleCoxed</option>'
                     +'<option value="6">QuartetBoat</option>'
                    +'<option value="7">QuartetBoatPaddle</option>'
                   +'<option value="8">QuartetBoatCoxed</option>'
                   +'<option value="9">QuartetBoatPaddleCoxed</option>'
                    +'<option value="10">OctetBoatCoxed</option>'
                    +'<option value="11">OctetBoatCoxedPaddle</option>'
                +'</select>'
        +'<select class="form-select" aria-label="Select activity type"  id="activityTypeSelectWindow" >'
            +'<option value="-1" selected disabled>Select activity type</option>'
            +'<option value="0">None</option>'
            +'<option value="1">Sailing</option>'
            +'<option value="2">Training</option>'
            +'</select>'
+'<button type="button" class="btn btn-primary" onclick="addRegistrationWindow()">Add</button>'
    pageContentManagerEl.innerHTML = html
}

function getBoatType() {
    return ;
}

function getActivityType() {
    return ;
}

function addRegistrationWindow() {
    const startTimeEl = document.querySelector('#startTimeActivity')
    const endTimeEl = document.querySelector('#endTimeActivity')
    //TODO: check that start time < end time

    const startTime = startTimeEl.value; //string
    const endTime = endTimeEl.value; //string
    const boatType = getBoatType();
    const activtyType = getActivityType();


}
addRegistrationWindowEl.addEventListener('click',addRegistrationWindowForm)