document.addEventListener('DOMContentLoaded', main);

function main() {

    document.querySelector('button').addEventListener('click', modalToggle);

    document.querySelector('.main-wrpr').addEventListener('click', function (e) {
        if (e.target === this && document.querySelector('.main-wrpr').classList.contains('covered') 
            && document.querySelector('.showed-modal-window')) {
            modalToggle('');
        }
    });
}

function modalToggle(modalName) {
    var MODAL_ANIM_TIME = 500;

    document.querySelector('.modal-window' + modalName).classList.toggle('fadeIn');
    document.querySelector('.modal-window' + modalName).classList.toggle('fadeOut');

    if (document.querySelector('.modal-window' + modalName).classList.contains('fadeOut')) {
        setTimeout(function () {
            document.querySelector('.modal-window' + modalName).classList.toggle('showed-modal-window');
        }, MODAL_ANIM_TIME);
    } else {
        document.querySelector('.modal-window' + modalName).classList.toggle('showed-modal-window');
    }

    document.querySelector('.main-wrpr').classList.toggle('covered');
}