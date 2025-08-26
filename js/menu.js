const menuIcon = document.getElementById("menu-icon");
const globalMenu = document.getElementById("global-menu");
const menuImg = menuIcon.querySelector('.header-menu-img');
const menuText = document.getElementById("menu-text");
const navListWrap = document.querySelector(".nav-list-wrap");
const menuLinks = globalMenu.querySelectorAll("a");

const imgPath = {
    pc: {
        open: "./images/pc/header/menu.png",
        close: "./images/pc/menu/menu-close.png",
    },
    sp: {
        open: "./images/smart-phone/menu/s-menu-open.png",
        close: "./images/smart-phone/menu/s-menu-close.png",
    },
}

function getDeviceType() {
    return window.innerWidth <= 1274 ? "sp" : "pc";
}

function updateMenuIcon(isOpen) {
    const device = getDeviceType();

    if (isOpen) {
        menuImg.src = imgPath[device].close;
        menuImg.alt = "閉じるアイコンの画像";
        menuText.textContent = "CLOSE";
    } else {
        menuImg.src = imgPath[device].open;
        menuImg.alt = "メニューアイコンの画像";
        menuText.textContent = "MENU";
    }
}

menuIcon.addEventListener("click", () => {
    document.body.classList.toggle("no-scroll");
    globalMenu.classList.toggle("is-active");

    const isMenuOpen = globalMenu.classList.contains("is-active");
    updateMenuIcon(isMenuOpen);

    setTimeout(() => {
        const menuContentHeight = navListWrap.scrollHeight;
        const screenHeight = window.innerHeight;

        globalMenu.style.overflowY =
            menuContentHeight > screenHeight ? "auto" : "hidden";
    }, 0);
})

menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        globalMenu.classList.remove("is-active");
        document.body.classList.remove("no-scroll");

        updateMenuIcon(false);
        globalMenu.style.overflowY = "auto";
    });
});