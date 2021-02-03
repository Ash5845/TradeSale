const loader = document.querySelector(".loader");
window.addEventListener("beforeunload", function() {
    loader.classList.remove("active");
})
window.addEventListener("load", function(){
    loader.classList.add("active");
})