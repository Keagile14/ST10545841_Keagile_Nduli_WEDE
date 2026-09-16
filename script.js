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