const images = document.querySelectorAll('.image');
const gallery = document.querySelector('.gallery');
const close = document.querySelector('.gallery__close');
const picInner = document.querySelector('.gallery__inner')
const prevBtn = document.querySelector('.gallery__control-pvev');
const nextBtn = document.querySelector('.gallery__control-next');

var imageList = Array.from(images);
var count;

imageList.forEach(function(image) {
    image.onclick = function() {
        picInner.innerHTML = `
        <img src="./assets/img/img${imageList.indexOf(image)+1}.jpeg" alt="Image ${imageList.indexOf(image)+1}">
        `;
        gallery.classList.add('open');
        count = imageList.indexOf(image);
    }
    // console.log(count);
    prevBtn.onclick = function() {
        if(count <= 0) {
            count = imageList.length - 1;
            picInner.innerHTML = `
            <img src="./assets/img/img${count + 1}.jpeg" alt="Image ${count + 1}">
            `;
        } else{
            count--;
            picInner.innerHTML = `
            <img src="./assets/img/img${count + 1}.jpeg" alt="Image ${count + 1}">
            `;
        }
    }
    nextBtn.onclick = function() {
        if(count >= imageList.length - 1) {
            count = 0;
            picInner.innerHTML = `
            <img src="./assets/img/img${count + 1}.jpeg" alt="Image ${count + 1}">
            `;
        } else {
            count++;
            picInner.innerHTML = `
            <img src="./assets/img/img${count + 1}.jpeg" alt="Image ${count + 1}">
            `;
        }
    }       
})

close.onclick = function() {
    gallery.classList.remove('open');
}