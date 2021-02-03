window.addEventListener("scroll", function(){
    const flash = document.querySelector(".flash");
    flash.classList.toggle("scroll", window.scrollY > 20);
})
