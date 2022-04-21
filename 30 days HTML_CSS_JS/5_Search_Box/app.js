const searchBtn = document.querySelector('.search-box__btn');
const searchBox = document.querySelector('.search-box');
const searchInput = document.querySelector('.search-box__input')
var flag = false;

searchBtn.addEventListener('click', function(e) {
    this.parentElement.classList.toggle('open');
    this.previousElementSibling.focus();
})