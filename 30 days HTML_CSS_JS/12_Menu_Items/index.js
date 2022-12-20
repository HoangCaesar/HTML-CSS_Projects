const menu = document.getElementById("menu");

Array.from(menu.querySelectorAll(".menu-item"))
    .forEach(
        (item, index) => {
            item.onmouseover = () => {
                menu.dataset.activeIndex = index;
            }
        })