document.addEventListener("DOMContentLoaded",function(){
    const doctorCards = document.querySelectorAll(".doctor-card");
    doctorCards.forEach(function (card){
        const closeButton = card.querySelector(".doctor-close");

        card.addEventListener("click", function(){
            card.classList.toggle("flipped");
        });

        if (closeButton){
            closeButton.addEventListener("click", function (event){
                event.stopPropagation();
                card.classList.remove("flipped");
            });
        }
    });
});

//Iron Crown Dentistry - Appointment Booking Page

const form = document.getElementById("bookingForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const serviceInput = document.getElementById("subject");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

//This is the error messages

const nameError= document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const serviceError = document.getElementById("serviceError");
const dateError = document.getElementById("dateError");
const timeError = document.getElementById("timeError");

//This is summary box

const summaryBox = document.getElementById("summaryBox");

//modal that will pop up
const modal = document.getElementById("modal");
const reviewView = document.getElementById("reviewView");
const successView = document.getElementById("successView");
const editBtn = document.getElementById("editBtn");
const confirmBtn = document.getElementById("confirmBtn");
const doneBtn = document.getElementById("doneBtn");
const refNumber = document.getElementById("refNumber");


const detailName = document.getElementById("detailName");
const detailEmail = document.getElementById("detailEmail");
const detailPhone = document.getElementById("detailPhone");
const detailService = document.getElementById("detailService");
const detailDate = document.getElementById("detailDate");
const detailTime = document.getElementById("detailTime");



function formatDate(dateObject){
    let year = dateObject.getFullYear();
    let month = dateObject.getMonth() + 1; //months will start at 0, this will add one
    let day = dateObject.getDate();

    if (month < 10) {
        month = "0" + month;
    }

    if (day < 10){
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}

//this function will show red under a field that is not filled
function showError(input, errorElement, message){
    errorElement.textContent = message;
    input.classList.add("input-error");
}

//This function will remove it

function clearError(input,errorElement) {
    errorElement.textContent = "";
    input.classList.remove("input-error");
}
//This will stop people from picking a date in the past
const today = new Date();
dateInput.min = formatDate(today);

//This will allow for bookings up to 3 months ahead

const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 3);
dateInput.max = formatDate(maxDate);

//This is a locak storage

function getBookings(){
    const saved = localStorage.getItem("ironCrownBookings");

    if (saved === null){
        return []; //Nothing is saved yet
    }
    return JSON.parse(saved); //The saved text will be saved into an array
}

function saveBooking(date, time){
    const bookings = getBookings();
    bookings.push({date: date, time: time});
    localStorage.setItem("ironCrownBookings", JSON.stringify(bookings));
}

function isBooked(date, time){
    const bookings = getBookings();

    for (let i=0; i < bookings.length;i++){
        if(bookings[i].date ===  date && bookings[i].time === time){
            return true;
        }
    }
    return false;
}

function updateTimes(){
    const chosenDate = dateInput.value;
    const now = new Date();

    //This is going to loop through options in the dropdown of the time

    for (let i = 1; i < timeSelect.options.length;i++){
        const option = timeSelect.options[i];
        option.disabled = false;
        
        if (chosenDate === ""){
            continue; 
        }

        if (isBooked(choseDate, option.value)){
            option.disabled = true;
        }

        if (chosenDate === formatDate(now)){
            const hour = parseInt(option.value.split(":")[0]);
            const minutes = parseInt(option.value.split(":")[1]);

            const slotTime = new Date();
            slotTime.setHours(hour, minutes, 0,0);

            if (slotTime <= now) {
                option.disabled = true;
            }
        }
    }


    if (timeSelect.selectedIndex > 0 && timeSelect.options[timeSelect.selectedIndex].disabled){
        timeSelect.value = "";
    }
}

function updateSummary(){
    if (serviceSelect.value !== "" && timeSelect.value !== ""){
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
        const timeText = timeSelect.options[timeSelect.selectedIndex].text;

        summaryBox.textContent = serviceText + " on " + prettyDate(dateInput.value) + " at " + timeText;
        summaryBox.classList.add("show");

    } else{
        summaryBox.classList.remove("show");
    }
}

function checkName(){
    const value = nameInput.value.trim();

    if (value === ""){
        showError(nameInput, nameError, "Please enter your full name.");
        return false;
    }

    clearError(nameInput, nameError);
    return true;
}

function checkEmail(){
    const value = emailInput.value.trim();

    if(value ===""){
        showError(emailInput, emailError, "Please enter your email address.");
        return false;
    }

    if (!value.includes("@") || !value.includes(".")){
        showError(emailInput, emailError, "Enter a valid email, like name@example.com.");
        return false;
    }

    clearError(emailInput, emailError);
    return true;
}

function checkPhone(){
    const value = phoneInput.value.replaceAll(" ", "");

    if (value === ""){
        clearError(phoneInput,phoneError);
        return true;
    }

    const startsWithZero = value.startsWith("0") && value.length === 10;
    const startsWith27 = value.startsWith("+27") && value.length === 12;

    if (!startsWithZero && !startsWith27) {
        showError(phoneInput,phoneError, "Enter a valid South African number, like 061 685 5391.");
        return false;
    }
    if(isNaN(value.replace("+",""))){
        showError(phoneInput,phoneError, "The phone number can only contain numbers.");
        return false;
    }
    clearError(phoneInput,phoneError);
    return true;
}

function checkService(){
    if (serviceSelect.value === ""){
        showError(serviceSelect, serviceError, "Please choose a service.");
        return false;
    }

    clearError(serviceSelect, serviceError);
    return true;
}

function checkDate(){
    if(dateInput.value === ""){
        showError(dateInput, dateError, "Please pick a date.");
        return false;
    }

    const chosen = new Date(dateInput.value + "T00:00:00");
    if (chosen.getDay() === 0){
        showError(dateInput, dateError, "We are closed on Sundays. Please pick another day.");
        return false;
    }
    if (dateInput.value < dateInput.min){
        showError(dateInput, dateError, "That date has already passed.");
        return false;
    }

    clearError(dateInput, dateError);
    return true;
}


function checkTime(){
    if(timeSelect.value === ""){
        showError(timeSelect, timeError, "Please choose a time.");
        return false;
    }
    clearError(timeSelect, timeError);
    return true;
}

nameInput.addEventListener("blur", checkName);
emailInput.addEventListener("blur", checkEmail);
phoneInput.addEventListener("blur", checkPhone);

serviceSelect.addEventListener("change", function (){
    checkService();
    updateSummary();
});

dateInput.addEventListener("change", function(){
    checkDate();
    updateTimes();
    updateSummary();
});

timeSelect.addEventListener("change", function(){
    checkTime();
    updateSummary();
});

form.addEventListener("submit", function (event){
    event.preventDefault();

    const nameOk = checkName();
    const emailOk = checkEmail();
    const phoneOk = checkPhone();
    const serviceOk = checkService();
    const dateOk = checkDate();
    const timeOk = checkTime();

    if (!nameOk || !emailOk || !phoneOk || !serviceOk || !dateOk || !timeOk){
        return;
    }

    detailName.textContent = nameInput.value.trim();
    detailEmail.textContent = emailInput.value.trim();
    detailPhone.textContent = phoneInput.value.trim() === "" ? "Not provided" : phoneInput.value.trim();
    detailService.textContent = serviceSelect.options[serviceSelect.selectedIndex].text;
    detailDate.textContent = prettyDate(dateInput.value);
    detailTime.textContent = timeSelect.options[timeSelect.selectedIndex].text;

    reviewView.classList.remove("hidden");
    successView.classList.add("hidden");
    modal.classList.add("show");

});


editBtn.addEventListener("click", function(){
    modal.classList.remove("show");
});

confirmBtn.addEventListener("click", function(){
    saveBooking(dateInput.value, timeSelect.value);
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    refNumber.textContent = "IC-" + randomNumber;

    reviewView.classList.add("hidden");
    successView.classList.remove("hidden");

    form.reset();
    summaryBox.classList.remove("show");
    updateTimes();
});

doneBtn.addEventListener("click", function(){
    modal.classList.remove("show");
});

document.addEventListener("keydown", function(event){
    if(event.key === "Escape"){
        modal.classList.remove("show");
    }
});







