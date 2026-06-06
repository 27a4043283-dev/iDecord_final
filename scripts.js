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
    "/lien-he": "lien-he" // ĐÃ SỬA: Thêm trang liên hệ vào danh sách quản lý của Router chung
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
    // Cắt bỏ phần query string (ví dụ ?category=...) nếu có để router so khớp chính xác
    const path = hash.replace("#", "").split('?')[0];
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
        // ĐÃ SỬA GIAO DIỆN LỆCH: Kích hoạt tải CSS trước/đồng thời với HTML
        const cssPromise = injectCss(cssPath);
        const response = await fetch(htmlPath);
        if (!response.ok) {
            throw new Error("Không tìm thấy trang");
        }

        const html = await response.text();
        const mainContent = document.getElementById("main-content");

        // Đợi CSS tải xong hoàn toàn để trình duyệt dựng giao diện chuẩn ngay từ đầu
        await cssPromise;

        removeOldJs();
        mainContent.innerHTML = html;
        updateAccountMenu();

        // Chèn file JS xử lý logic của trang
        injectJs(jsPath);

        updateActiveLink(path);
        
        // Tự động cuộn mượt mà lên đầu trang bất kể chuyển sang mục nào
        window.scrollTo({ top: 0, behavior: "smooth" });
        
    } catch (error) {
        console.error(error);
        document.getElementById("main-content").innerHTML = `
            <section class="section">
                <div class="container" style="text-align:center; padding: 100px 20px;">
                    <h2>404</h2>
                    <p>Không tìm thấy trang hoặc cấu trúc tệp tin bị lỗi.</p>
                </div>
            </section>
        `;
    }
}

/* Xóa CSS cũ */
function removeOldCss() {
    if (currentCss) {
        currentCss.remove();
        currentCss = null;
    }
}

/* Xóa JS cũ */
function removeOldJs() {
    if (currentJs) {
        currentJs.remove();
        currentJs = null;
    }
    const oldScript = document.getElementById("page-script");
    if (oldScript) {
        oldScript.remove();
    }
}

/* Nạp CSS thông minh (Cố định phom chống lệch) */
function injectCss(path) {
    return new Promise((resolve) => {
        // Tạo một ID định danh cho file style động
        const linkId = "dynamic-page-style";
        let link = document.getElementById(linkId);
        
        if (!link) {
            link = document.createElement("link");
            link.id = linkId;
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }
        
        // Sự kiện chạy khi CSS được nạp và áp dụng thành công vào trình duyệt
        link.onload = () => resolve();
        link.onerror = () => resolve(); // Tránh treo trang nếu file CSS lỗi
        
        link.href = `${path}?t=${Date.now()}`;
        currentCss = link;
    });
}

/* Nạp JS */
function injectJs(path) {
    const script = document.createElement("script");
    script.id = "page-script";
    script.src = `${path}?t=${Date.now()}`;
    document.body.appendChild(script);
    currentJs = script;
}

/* Active menu */
function updateActiveLink(path) {
    const links = document.querySelectorAll(".navbar a");
    links.forEach((link) => {
        if (link.closest('.product-dropdown')) return;
        
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
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

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
    const accountLink = document.getElementById("accountLink");
    const dropdown = document.getElementById("accountDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!accountLink) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        accountLink.textContent = "Tài Khoản";
        accountLink.href = "#/dang-nhap";
        if (dropdown) {
            dropdown.style.display = "none";
        }
        return;
    }

    accountLink.textContent = currentUser.fullName;
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
        const response = await fetch(`${IDECOR.API_URL}?action=getProducts`);
        const result = await response.json();

        if (!result.success) {
            return;
        }

        IDECOR.products = result.products || [];
        renderCategoryMenu();
        initHeaderSearch();
    } catch (error) {
        console.error("Load products error:", error);
    }
}

function renderCategoryMenu() {
    const dropdown = document.getElementById("productDropdown");
    if (!dropdown) return;

    if (dropdown.children.length > 0) {
        return;
    }

    const categories = [
        ...new Set(
            IDECOR.products
                .map(product => product.danhMuc)
                .filter(Boolean)
        )
    ];

    dropdown.innerHTML = categories
        .map(category => `
            <a href="#/san-pham?category=${encodeURIComponent(category)}">
                ${category}
            </a>
        `)
        .join("");
}

function initHeaderSearch() {

    const input = document.getElementById("headerSearchInput");

    if (!input) return;

    let popup = document.getElementById("searchSuggestions");

    if (!popup) {

        popup = document.createElement("div");
        popup.id = "searchSuggestions";

        popup.style.position = "absolute";
        popup.style.top = "100%";
        popup.style.left = "0";
        popup.style.width = "100%";
        popup.style.background = "#fff";
        popup.style.border = "1px solid #ddd";
        popup.style.borderRadius = "8px";
        popup.style.boxShadow = "0 4px 12px rgba(0,0,0,.15)";
        popup.style.maxHeight = "300px";
        popup.style.overflowY = "auto";
        popup.style.display = "none";
        popup.style.zIndex = "9999";

        const parent = input.closest(".header-search-box");

        parent.style.position = "relative";
        parent.appendChild(popup);
    }

    input.addEventListener("input", function () {

        const keyword = this.value.trim().toLowerCase();

        if (!keyword) {
            popup.style.display = "none";
            return;
        }

        const products = IDECOR.products.filter(product =>
            (product.tenSanPham || "")
                .toLowerCase()
                .includes(keyword)
        );

        if (products.length === 0) {

            popup.innerHTML = `
                <div style="
                    padding:12px;
                    text-align:center;
                    color:#999;
                ">
                    Không có sản phẩm phù hợp
                </div>
            `;

            popup.style.display = "block";
            return;
        }

        popup.innerHTML = products
            .slice(0, 10)
            .map(product => `
                <div
                    class="search-item"
                    data-id="${product.maSanPham}"
                    style="
                        padding:10px 15px;
                        cursor:pointer;
                        border-bottom:1px solid #eee;
                    "
                >
                    ${product.tenSanPham}
                </div>
            `)
            .join("");

        popup.style.display = "block";
    });

    popup.addEventListener("click", function (e) {

        const item = e.target.closest(".search-item");

        if (!item) return;

        const id = item.dataset.id;

        window.location.hash =
            `/chi-tiet-sp?id=${id}`;

        popup.style.display = "none";
    });

    document.addEventListener("click", function (e) {

        if (!e.target.closest(".header-search-box")) {
            popup.style.display = "none";
        }
    });

    input.addEventListener("keydown", function (e) {

        if (e.key !== "Enter") return;

        const first = popup.querySelector(".search-item");

        if (!first) return;

        window.location.hash =
            `/chi-tiet-sp?id=${first.dataset.id}`;
    });
}