document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.getElementById("navToggle");
    const navbar = document.getElementById("navbar");

    navToggle.addEventListener("click", function () {
        navbar.classList.toggle("active");
    });
});