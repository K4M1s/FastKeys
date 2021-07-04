
/**
 * Function is responsible for user menu in navbar (ex. hides menu if click was outside its content)
 * Also responsive stuff...
 */
export default function UserMenu(): void {
    const user = document.querySelector(".navbar__user");
    const usermenu = document.querySelector(".navbar__user__menu") as HTMLElement;

    // Null checks
    if (!user) return;
    if (!usermenu) return;

    document.addEventListener("click", (evt) => {

        if (window.innerWidth <= 768) {
            return;
        }

        let targetElement = evt.target as HTMLElement | null;
    
        do {
            if (targetElement == usermenu) {
                return;
            } else if (targetElement == user) {
                user.classList.contains('navbar__user--expand') ? user.classList.remove('navbar__user--expand') : user.classList.add('navbar__user--expand');
                return;
            }
            if (!targetElement) return;
            targetElement = targetElement.parentNode as HTMLElement;
        } while (targetElement);
    
        user.classList.remove('navbar__user--expand');
    });

    user.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            user.classList.contains('navbar__user--expand') ? user.classList.remove('navbar__user--expand') : user.classList.add('navbar__user--expand');
        }
    });

    if (window.innerWidth > 768) {
        usermenu.style.height = `${usermenu.scrollHeight}px`;
    }
}