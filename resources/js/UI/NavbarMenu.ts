export default function(): void {
    const hamburger = document.querySelector("#hamburger_checkbox");
    const menu = document.querySelector(".navbar__menu");

    // Null checks
    if (!hamburger) return;
    if (!menu) return;

    hamburger.addEventListener('change', (e) => {
        // Null check
        if (!e.target) return;

        const checkbox = e.target as HTMLInputElement;

        if(checkbox.checked) {
            menu.classList.add('navbar__menu--show');
        } else {
            if (document.querySelector('.navbar__user--expand') !== null) {
                document.querySelector('.navbar__user--expand')?.classList.remove('navbar__user--expand');
                checkbox.checked = true;
                return;
            }
            menu.classList.remove('navbar__menu--show');
        }
    })
}