export default function() {
    const hamburger = document.querySelector("#hamburger_checkbox");
    const menu = document.querySelector(".navbar__menu");
    hamburger.addEventListener('change', (e) => {
        if(e.target.checked) {
            menu.classList.add('navbar__menu--show');
        } else {
            menu.classList.remove('navbar__menu--show');
        }
    })
}