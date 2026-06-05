/* Routes */

const routes = {
    "/trang-chu": "trang-chu",
    "/gioi-thieu": "gioi-thieu",
    "/san-pham": "san-pham",
    "/danh-muc-sp": "danh-muc-sp",
    "/chi-tiet-sp": "chi-tiet-sp",
    "/cua-hang": "cua-hang",
    "/khach-hang": "khach-hang",
    "/gio-hang": "gio-hang",
    "/dang-nhap": "dang-nhap",
    "/dang-ky": "dang-ky",
    "/reset-mk": "reset-mk",
    "/doi-mat-khau": "doi-mat-khau",
    "/thanh-toan": "thanh-toan",
    "/dieu-khoan": "dieu-khoan",
};

/* Biến toàn cục */

/* ==========================
CONFIG HỆ THỐNG
========================== */

window.IDECOR = {

    API_URL:
        "https://script.google.com/macros/s/AKfycbxigEyl3ZW_MTnoIvLlRrmlNJetunsIrPktedxnHU3DeHVSWwy1kQqj9P0VsAh2lF_V/exec",

    products: [],

    categories: [],

    cart: [],

    currentUser: null

};

/* Router assets */

let currentCss = null;
let currentJs = null;

/* Lấy route hiện tại */

function getCurrentPath() {
    const hash = window.location.hash;

    if (!hash) {
        return "/trang-chu";
    }

    const path = hash.replace("#", "");

    return routes[path] ? path : "/trang-chu";
}

/* Tải trang */

async function loadPage(path) {
    const page = routes[path];

    if (!page) {
        window.location.hash = "/trang-chu";
        return;
    }

    let htmlPath;
    let cssPath;
    let jsPath;

    /* Các trang tài khoản */

    const accountPages = [
        "dang-nhap",
        "dang-ky",
        "reset-mk",
        "doi-mat-khau",
    ];

    if (accountPages.includes(page)) {
        htmlPath = `./pages/tai-khoan/${page}.html`;
        cssPath = `./pages/tai-khoan/tai-khoan.css`;
        jsPath = `./pages/tai-khoan/${page}.js`;
    } else {
        htmlPath = `./pages/${page}/${page}.html`;
        cssPath = `./pages/${page}/${page}.css`;
        jsPath = `./pages/${page}/${page}.js`;
    }

    try {
        const response = await fetch(htmlPath);

        if (!response.ok) {
            throw new Error("Không tìm thấy trang");
        }

        const html = await response.text();

        const mainContent = document.getElementById("main-content");

        removeAssets();

        mainContent.innerHTML = html;

        updateAccountMenu();

        injectCss(cssPath);
        injectJs(jsPath);

        updateActiveLink(path);
    } catch (error) {
        console.error(error);

        document.getElementById("main-content").innerHTML = `
            <section class="section">
                <div class="container">
                    <h2>404</h2>
                    <p>Không tìm thấy trang.</p>
                </div>
            </section>
        `;
    }
}

/* Xóa CSS JS cũ */

function removeAssets() {
    if (currentCss) {
        currentCss.remove();
        currentCss = null;
    }

    if (currentJs) {
        currentJs.remove();
        currentJs = null;
    }
}

/* Nạp CSS */

function injectCss(path) {
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = path;

    document.head.appendChild(link);

    currentCss = link;
}

/* Nạp JS */

function injectJs(path) {

    if (currentJs) {

        currentJs.remove();

        currentJs = null;

    }

    const oldScript =
        document.getElementById(
            "page-script"
        );

    if (oldScript) {
        oldScript.remove();
    }

    const script =
        document.createElement(
            "script"
        );

    script.id =
        "page-script";

    script.src =
        `${path}?t=${Date.now()}`;

    document.body.appendChild(
        script
    );

    currentJs =
        script;

}

/* Active menu */

function updateActiveLink(path) {
    const links = document.querySelectorAll(".navbar a");

    links.forEach((link) => {
        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === `#${path}`) {
            link.classList.add("active");
        }
    });
}

/* Theo dõi thay đổi hash */

window.addEventListener("hashchange", () => {
    loadPage(getCurrentPath());
});

/* Khởi tạo */

window.addEventListener("DOMContentLoaded", () => {
    loadPage(getCurrentPath());

    updateAccountMenu();

    loadProducts();

    const hash = window.location.hash;

    if (hash && hash.startsWith("#section-")) {
        setTimeout(() => {
            const element = document.querySelector(hash);

            if (element) {
                const headerOffset = 90;

                const elementPosition =
                    element.getBoundingClientRect().top;

                const offsetPosition =
                    elementPosition +
                    window.pageYOffset -
                    headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        }, 200);
    }
});

/* Cập nhật menu tài khoản */

function updateAccountMenu() {
    const accountLink =
        document.getElementById("accountLink");

    const dropdown =
        document.getElementById("accountDropdown");

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (!accountLink) return;

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );

    if (!currentUser) {
        accountLink.textContent = "Tài Khoản";
        accountLink.href = "#/dang-nhap";

        if (dropdown) {
            dropdown.style.display = "none";
        }

        return;
    }

    accountLink.textContent =
        currentUser.fullName;

    accountLink.href = "#";

    if (logoutBtn) {
        logoutBtn.onclick = function () {
            localStorage.removeItem("currentUser");

            window.location.hash = "/dang-nhap";

            location.reload();
        };
    }
}

async function loadProducts() {

    try {

        const response =
            await fetch(
                `${IDECOR.API_URL}?action=getProducts`
            );

        const result =
            await response.json();

        if (
            !result.success
        ) {
            return;
        }

        IDECOR.products =
            result.products || [];

        renderCategoryMenu();

    }
    catch (error) {

        console.error(
            "Load products error:",
            error
        );

    }

}

function renderCategoryMenu() {

    const dropdown =
        document.getElementById(
            "productDropdown"
        );

    if (!dropdown) {
        return;
    }

    const categories = [

        ...new Set(

            IDECOR.products
                .map(
                    product =>
                    product.danhMuc
                )
                .filter(Boolean)

        )

    ];

    dropdown.innerHTML =
        categories
            .map(
                category => `
                    <a
                        href="#/san-pham?category=${encodeURIComponent(category)}"
                    >
                        ${category}
                    </a>
                `
            )
            .join("");

}

