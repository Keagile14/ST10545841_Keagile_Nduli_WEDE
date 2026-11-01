//Services page javascript, this adds functionality to flip card

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

//Enquire page that checks required fields, email validation and displays a success message
document.addEventListener("DOMContentLoaded", function(){
    const enquiryForm = document.getElementById("enquireForm");
    const successMessage = document.getElementById("enquirySuccess");

    if(enquiryForm){
        enquiryForm.addEventListener("submit", function(event){
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (name === "" || email === "" || message === ""){
                alert("Please complete all the required fields");
                return;
            }

            if (!email.includes("@") || !email.includes(".")){
                alert("Please enter a valid email address. ");
                return;
            }

            successMessage.style.display = "block";
            enquiryForm.reset();
        });
    }
});

document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById("bookingForm");

    if(form){
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const phoneInput = document.getElementById("phone");
        const serviceSelect = document.getElementById("subject");
        const dateInput = document.getElementById("date");
        const timeSelect = document.getElementById("time");

        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const phoneError = document.getElementById("phoneError");
        const serviceError = document.getElementById("serviceError");
        const dateError = document.getElementById("dateError");
        const timeError = document.getElementById("timeError");

        const summaryBox = document.getElementById("summaryBox");

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

        if (isBooked(chosenDate, option.value)){
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

function prettyDate(dateText){
    const dateObject = new Date(dateText + "T00:00:00");
    return dateObject.toLocaleDateString("en-ZA",{
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function updateSummary(){
    if (serviceSelect.value !== "" && dateInput.value !== "" && timeSelect.value !== ""){
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
        updateTimes();
    }
});

document.addEventListener("DOMContentLoaded", function(){
    const reviewForm = document.getElementById("reviewForm");

    if(reviewForm){
        const reviewName = document.getElementById("name");
        const rating = document.getElementById("rating");
        const testimonial = document.getElementById("testimonial");

        const nameError = document.getElementById("nameError");
        const ratingError = document.getElementById("ratingError");
        const testimonialError = document.getElementById("testimonialError");

        const starPreview = document.getElementById("starPreview");
        const reviewGrid = document.getElementById("reviewGrid");
        const successMessage = document.getElementById("successMessage");

        function showReviewError(input, errorElement, message){
            errorElement.textContent = message;
            input.classList.add("input-error");

        }

        function clearReviewError(input, errorElement){
            errorElement.textContent = "";
            input.classList.remove("input-error");
        }

        function checkReviewName(){
            if(reviewName.value.trim() === ""){
                showReviewError(
                    reviewName,
                    nameError,
                    "Please enter your name"
                );

                return false;
            }

            clearReviewError(reviewName, nameError);
            return true;
        }

        function checkRating(){
            if(rating.value === ""){
                showReviewError(
                    rating,
                    ratingError,
                    "Please select a rating"
                );

                return false;
            }
            clearReviewError(rating, ratingError);
            return true; 
        }

        function checkTestimonial(){
            if(testimonial.value.trim() === ""){
                showReviewError(
                    testimonial,
                    testimonialError,
                    "Please write your testimonial"
                );
                return false;
            }

            if(testimonial.value.trim().length < 10){
                showReviewError(
                    testimonial,
                    testimonialError,
                    "Your testimonial must at least be 10 characters"
                );
                return false;
            }

            clearReviewError(testimonial, testimonialError);
            return true;
        }

        rating.addEventListener("change", function(){
            const stars = "★".repeat(Number(rating.value));

            starPreview.textContent = stars;

            checkRating();
        });

        reviewName.addEventListener("blur", checkReviewName);
        testimonial.addEventListener("blur", checkTestimonial);

        function getReviews(){
            const savedReviews = localStorage.getItem("ironCrownReviews");

            if(savedReviews === null){
                return [];
            }

            return JSON.parse(savedReviews);

        }

        function savedReviews(reviews){
            localStorage.setItem(
                "ironCrownReviews", JSON.stringify(reviews)
            );
        }

        function displayReview(name, stars, message){
            const reviewCard = document.createElement("article");

            reviewCard.classList.add("review-card");

            const starElement = document.createElement("div");

            starElement.classList.add("review-stars");

            starElement.textContent = "★".repeat(Number(stars));

            const messageElement = document.createElement("p");
            messageElement.textContent = message;

            const nameElement = document.createElement("h3");

            nameElement.textContent = name;

            reviewCard.appendChild(starElement);
            reviewCard.appendChild(messageElement);
            reviewCard.appendChild(nameElement);

            reviewGrid.appendChild(reviewCard);

        }

        function loadReviews(){
            const reviews = getReviews();
            for(let i = 0; i < reviews.length; i++){
                displayReview(
                    reviews[i].name,
                    reviews[i].rating,
                    reviews[i].testimonial
                );
            }
        }
        loadReviews();

        reviewForm.addEventListener("submit", function(event){
            event.preventDefault();

            const nameOk = checkReviewName();

            const ratingOk = checkRating();

            const testimonialOk = checkTestimonial();

            if(!nameOk || !ratingOk || !testimonialOk){
                return;
            }

            const newReview = {
                name: reviewName.value.trim(),
                rating: rating.value,
                testimonial: testimonial.value.trim()
            };

            const reviews = getReviews();

            reviews.push(newReview);

            savedReviews(reviews);

            displayReview(
                newReview.name,
                newReview.rating,
                newReview.testimonial
            );

            successMessage.classList.remove("hidden");

            reviewForm.reset();

            starPreview.textContent = "";

            setTimeout(function(){
                successMessage.classList.add("hidden");

            }, 4000);
        });
    }
});