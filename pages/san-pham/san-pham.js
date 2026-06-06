(() => {
const SP_PATH = "./assets/data/SanPham_300Dong.csv";

const PRODUCTS_PER_PAGE = 30;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;

/* ==========================
ROOM ORDER
========================== */

const ROOM_ORDER = [
    "Phòng khách",
    "Phòng ngủ",
    "Phòng bếp",
    "Phòng tắm"
];

/* ==========================
LOAD CSV
========================== */

async function loadProducts() {

    try {

        const response = await fetch(SP_PATH);

        const csvText = await response.text();

        allProducts = parseCSV(csvText);

        filteredProducts = [...allProducts];

        initCategoryFilter();

        setupEvents();

        const categoryMap = {
            "living-room": "Phòng khách",
            "bed-room": "Phòng ngủ",
            "kitchen": "Phòng bếp",
            "bath-room": "Phòng tắm"
        };

        const hash = window.location.hash;
        const categoryMatch = hash.match(/category=([^&]+)/);

        if (categoryMatch) {

            const selectedCategory =
                categoryMap[categoryMatch[1]];

            if (selectedCategory) {

                document.getElementById(
                    "categoryFilter"
                ).value = selectedCategory;

                applyFilters();
            }
        }
        render();

    } catch (error) {

        console.error("Lỗi tải CSV:", error);

    }

}

/* ==========================
PARSE CSV
========================== */

function parseCSV(csv) {

    const rows = csv.trim().split("\n");

    const headers = rows[0].split(",");

    return rows.slice(1).map(row => {

        const values = row.split(",");

        const obj = {};

        headers.forEach((header, index) => {

            obj[header.trim()] =
                values[index]?.trim() || "";

        });

        obj.Gia = Number(obj.Gia) || 0;

        return obj;

    });

}

/* ==========================
CATEGORY FILTER
========================== */

function initCategoryFilter() {

    const select =
        document.getElementById(
            "categoryFilter"
        );

    const categories = [
        ...new Set(
            allProducts.map(
                p => p.DanhMuc
            )
        )
    ];

    select.innerHTML =
        '<option value="">Tất cả danh mục</option>';

    categories.forEach(category => {

        select.innerHTML += `
            <option value="${category}">
                ${category}
            </option>
        `;

    });

}

/* ==========================
EVENTS
========================== */

function setupEvents() {

    document
        .getElementById("searchInput")
        .addEventListener(
            "input",
            applyFilters
        );

    document
        .getElementById("categoryFilter")
        .addEventListener(
            "change",
            applyFilters
        );

    document
        .getElementById("priceFilter")
        .addEventListener(
            "change",
            applyFilters
        );

    document
        .getElementById("sortFilter")
        .addEventListener(
            "change",
            applyFilters
        );

    document
        .getElementById("resetFilter")
        .addEventListener(
            "click",
            resetFilters
        );

}

/* ==========================
FILTER
========================== */

function applyFilters() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    const category =
        document
            .getElementById("categoryFilter")
            .value;

    const price =
        document
            .getElementById("priceFilter")
            .value;

    filteredProducts =
        allProducts.filter(product => {

            let valid = true;

            if (keyword) {

                const searchText = `
                    ${product.TenSP || ""}
                    ${product.DanhMuc || ""}
                    ${product.ChatLieu || ""}
                    ${product.MauSac || ""}
                `
                    .toLowerCase();

                valid =
                    valid &&
                    searchText.includes(keyword);

            }

            if (category) {

                valid =
                    valid &&
                    product.DanhMuc === category;

            }

            if (price) {

                if (price === "0-10000000") {

                    valid =
                        valid &&
                        product.Gia < 10000000;

                }

                if (price === "10000000-20000000") {

                    valid =
                        valid &&
                        product.Gia >= 10000000 &&
                        product.Gia < 20000000;

                }

                if (price === "20000000-30000000") {

                    valid =
                        valid &&
                        product.Gia >= 20000000 &&
                        product.Gia < 30000000;

                }

                if (price === "30000000+") {

                    valid =
                        valid &&
                        product.Gia >= 30000000;

                }

            }

            return valid;

        });

    applySort();

}

/* ==========================
SORT
========================== */

function applySort() {

    const sort =
        document
            .getElementById("sortFilter")
            .value;

    switch (sort) {

        case "priceAsc":

            filteredProducts.sort(
                (a, b) =>
                    a.Gia - b.Gia
            );

            break;

        case "priceDesc":

            filteredProducts.sort(
                (a, b) =>
                    b.Gia - a.Gia
            );

            break;

        case "nameAsc":

            filteredProducts.sort(
                (a, b) =>
                    a.TenSP.localeCompare(
                        b.TenSP,
                        "vi"
                    )
            );

            break;

        case "nameDesc":

            filteredProducts.sort(
                (a, b) =>
                    b.TenSP.localeCompare(
                        a.TenSP,
                        "vi"
                    )
            );

            break;

    }

    currentPage = 1;

    render();

}

/* ==========================
RENDER
========================== */

function render() {

    renderCount();

    renderProducts();

    renderPagination();

}

/* ==========================
PRODUCTS
========================== */

function renderProducts() {

    const container =
        document.getElementById(
            "productContainer"
        );

    const start =
        (currentPage - 1) *
        PRODUCTS_PER_PAGE;

    const end =
        start +
        PRODUCTS_PER_PAGE;

    const products =
        filteredProducts.slice(
            start,
            end
        );

    container.innerHTML = `
        <div class="product-grid">

        ${products.map(product => {

            const imageUrl =
                product.HinhAnh
                    ? product.HinhAnh
                        .split("|")[0]
                        .trim()
                    : "";

            return `

<div
    class="product-card"
    onclick="openProductDetail('${product.MaSP}')"
>

    <div class="product-image">

        <img
            src="${imageUrl}"
            alt="${product.TenSP}"
            loading="lazy"
        >

    </div>

    <div class="product-content">

        <h3 class="product-name">
            ${product.TenSP}
        </h3>

        <div class="product-price">
            ${product.Gia.toLocaleString("vi-VN")} đ
        </div>

        <div class="product-actions">

            <button
                class="btn-cart"
                onclick="event.stopPropagation(); addToCartById('${product.MaSP}')"
            >
                Giỏ hàng
            </button>

            <button
                class="btn-buy"
                onclick="event.stopPropagation(); buyNowById('${product.MaSP}')"
            >
                Mua ngay
            </button>

        </div>

    </div>

</div>

            `;

        }).join("")}

        </div>
    `;

}

/* ==========================
COUNT
========================== */

function renderCount() {

    document.getElementById(
        "productCount"
    ).textContent =
        filteredProducts.length;

}

/* ==========================
PAGINATION
========================== */

function renderPagination() {

    const container =
        document.getElementById(
            "pagination"
        );

    const totalPages =
        Math.ceil(
            filteredProducts.length /
            PRODUCTS_PER_PAGE
        );

    let html = "";

    for (let i = 1; i <= totalPages; i++) {

        html += `
        <button
            class="page-btn ${i === currentPage ? "active" : ""}"
            onclick="changePage(${i})"
        >
            ${i}
        </button>
        `;

    }

    container.innerHTML = html;

}

function changePage(page) {

    currentPage = page;

    render();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

/* ==========================
CART
========================== */

function addToCart(product) {

    const cart =
        JSON.parse(
            localStorage.getItem(
                "cart"
            )
        ) || [];

    const existing =
        cart.find(
            item =>
                item.maSP === product.MaSP
        );

    if (existing) {

        existing.soLuong += 1;

    } else {

        cart.push({

            maSP: product.MaSP,

            tenSP: product.TenSP,

            gia: Number(product.Gia),

            hinhAnh:
                product.HinhAnh
                    ? product.HinhAnh
                        .split("|")[0]
                        .trim()
                    : "",

            soLuong: 1

        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
    
    updateCartBadge();

    alert("Đã thêm vào giỏ hàng");

}

function addToCartById(id) {

    const product =
        allProducts.find(
            p => p.MaSP === id
        );

    if (product) {

        addToCart(product);

    }

}

/* ==========================
BUY NOW
========================== */

function buyNow(product) {

    addToCart(product);

    location.hash = "#/gio-hang";

}

function buyNowById(id) {

    const product =
        allProducts.find(
            p => p.MaSP === id
        );

    if (product) {

        buyNow(product);

    }

}

/* ==========================
RESET
========================== */

function resetFilters() {

    document.getElementById(
        "searchInput"
    ).value = "";

    document.getElementById(
        "categoryFilter"
    ).value = "";

    document.getElementById(
        "priceFilter"
    ).value = "";

    document.getElementById(
        "sortFilter"
    ).value = "";

    filteredProducts =
        [...allProducts];

    currentPage = 1;

    render();

}

function openProductDetail(productId) {

    localStorage.setItem(
        "selectedProductId",
        productId
    );

    window.location.hash =
        "#/chi-tiet-sp";

}

function updateCartBadge() {

    const badge =
        document.querySelector(
            ".cart-count"
        );

    if (!badge) return;

    const cart =
        JSON.parse(
            localStorage.getItem(
                "cart"
            )
        ) || [];

    const count =
        cart.reduce(

            (total, item) =>

                total +
                item.soLuong,

            0

        );

    badge.textContent =
        count;

}


window.openProductDetail =
    openProductDetail;

window.buyNowById =
    buyNowById;

window.addToCartById =
    addToCartById;

window.changePage =
    changePage;
    
/* ==========================
INIT
========================== */

loadProducts();

})();
