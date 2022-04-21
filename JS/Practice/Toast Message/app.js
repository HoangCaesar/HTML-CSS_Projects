const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const main = $('#toast');

function toast({
    title = '',
    message = '',
    type = 'info',
    duration = 3000,
}) {
    var icons = {
        success: 'fa-solid fa-circle-check',
        info: 'fa-solid fa-circle-exclamation',
        warning: 'fa-solid fa-triangle-exclamation',
        error: 'fa-solid fa-triangle-exclamation'
    }
    const delay = (duration / 1000).toFixed(2);
    var icon = icons[type];
    if(main) {
        const toast = document.createElement('div');
        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slideInLeft ease 0.3s, fadeOut linear 1s ${delay}s forwards`
        
        // auto remove toast
        const autoRemoveId = setTimeout(function() {
            main.removeChild(toast);
        }, duration + 1000)
        // remove toast by click
        toast.onclick = function(e) {
            if(e.target.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        }
        
        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__message">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fa-solid fa-xmark"></i>
            </div>
        `
        main.appendChild(toast);
        
    }
};

const successBtn = $('.btn--success');
const infoBtn = $('.btn--info');
const warningBtn = $('.btn--warning');
const errorBtn = $('.btn--error');



successBtn.onclick = () => {
    toast({ title: 'Success!', 
        message: 'You get it, bro!', 
        type: 'success', 
        duration: 2000
    })
}

infoBtn.onclick = () => {
    toast({ title: 'Success!', 
        message: 'You get it, bro!', 
        type: 'info', 
        duration: 2000
    })
}

warningBtn.onclick = () => {
    toast({ title: 'Success!', 
        message: 'You get it, bro!', 
        type: 'warning', 
        duration: 2000
    })
}

errorBtn.onclick = () => {
    toast({ title: 'Error!', 
        message: 'You fucked yourself, dog!', 
        type: 'error', 
        duration: 3000
    })
}

