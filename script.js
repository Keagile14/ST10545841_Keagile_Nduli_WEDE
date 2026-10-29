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
