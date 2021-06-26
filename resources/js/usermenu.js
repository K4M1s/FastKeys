export default function() {
    const user = document.querySelector(".navbar__user");
    const usermenu = document.querySelector(".navbar__user__menu");

    document.addEventListener("click", (evt) => {
        let targetElement = evt.target; // clicked element
    
        do {
            if (targetElement == usermenu) {
                return;
            } else if (targetElement == user) {
                user.classList.contains('navbar__user--expand') ? user.classList.remove('navbar__user--expand') : user.classList.add('navbar__user--expand')
                return;
            }
            targetElement = targetElement.parentNode;
        } while (targetElement);
    
        user.classList.remove('navbar__user--expand');
    });

    usermenu.style.height = `${usermenu.scrollHeight}px`;
}