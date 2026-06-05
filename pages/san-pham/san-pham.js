const SAN_PHAM_URL =
"https://script.google.com/macros/s/AKfycbxigEyl3ZW_MTnoIvLlRrmlNJetunsIrPktedxnHU3DeHVSWwy1kQqj9P0VsAh2lF_V/exec";

const PRODUCTS_PER_PAGE = 10;

let productList = [];
let filteredProducts = [];
let currentPage = 1;

/* ==========================
LOAD PRODUCTS
========================== */

async function loadProducts() {


try {

    const response =
        await fetch(
            `${SAN_PHAM_URL}?action=getProducts`
        );

    const result =
        await response.json();

    if (!result.success) {
        return;
    }

    productList =
        result.products || [];

    filteredProducts =
        [...productList];

    initCategoryFilter();

    setupCategoryFilter();

    setupSearch();

    applyQueryFilter();

    renderProducts();

    renderPagination();

}
catch (error) {

    console.error(
        "Load products error:",
        error
    );

}


}

/* ==========================
RENDER PRODUCTS
========================== */

function renderProducts() {


const grid =
    document.getElementById(
        "productGrid"
    );

if (!grid) return;

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

if (!products.length) {

    grid.innerHTML = `
        <div class="empty-products">
            Không tìm thấy sản phẩm
        </div>
    `;

    return;

}

grid.innerHTML =
    products.map(product => `

    <div class="product-card">

        <div
            class="product-image"
            onclick="openProduct('${product.maSP}')"
        >

            <img
                src="${product.hinhAnh}"
                alt="${product.tenSP}"
            >

        </div>

        <div class="product-content">

            <h3
                class="product-name"
                onclick="openProduct('${product.maSP}')"
            >
                ${product.tenSP}
            </h3>

            <div class="product-price">

                ${Number(product.gia)
                    .toLocaleString("vi-VN")}
                VNĐ

            </div>

            <input
                type="number"
                min="1"
                value="1"
                class="product-qty"
                id="qty-${product.maSP}"
            >

            <div class="product-actions">

                <button
                    class="btn btn-outline"
                    onclick="addToCart('${product.maSP}')"
                >
                    Giỏ hàng
                </button>

                <button
                    class="btn btn-primary"
                    onclick="buyNow('${product.maSP}')"
                >
                    Mua ngay
                </button>

            </div>

        </div>

    </div>

    `).join("");


}

/* ==========================
CATEGORY FILTER
========================== */

function initCategoryFilter() {


const select =
    document.getElementById(
        "categoryFilter"
    );

if (!select) return;

const categories =
    [
        ...new Set(
            productList.map(
                product =>
                    product.danhMuc
            )
        )
    ];

select.innerHTML =

    `
    <option value="">
        Tất cả danh mục
    </option>
    `

    +

    categories.map(category => `

        <option value="${category}">
            ${category}
        </option>

    `).join("");


}

function setupCategoryFilter() {


const select =
    document.getElementById(
        "categoryFilter"
    );

if (!select) return;

select.addEventListener(
    "change",
    function () {

        const category =
            this.value;

        if (!category) {

            filteredProducts =
                [...productList];

        } else {

            filteredProducts =
                productList.filter(
                    product =>
                        product.danhMuc ===
                        category
                );

        }

        currentPage = 1;

        renderProducts();

        renderPagination();

    }
);


}

/* ==========================
SEARCH
========================== */

function setupSearch() {


const input =
    document.getElementById(
        "searchInput"
    );

if (!input) return;

input.addEventListener(
    "input",
    function () {

        const keyword =
            this.value
                .trim()
                .toLowerCase();

        filteredProducts =
            productList.filter(
                product =>
                    product.tenSP
                        .toLowerCase()
                        .includes(
                            keyword
                        )
            );

        currentPage = 1;

        renderProducts();

        renderPagination();

    }
);


}

/* ==========================
URL CATEGORY
========================== */

function applyQueryFilter() {


const hash =
    window.location.hash;

const query =
    hash.split("?")[1];

if (!query) {
    return;
}

const params =
    new URLSearchParams(
        query
    );

const category =
    params.get(
        "category"
    );

if (!category) {
    return;
}

filteredProducts =
    productList.filter(
        product =>
            product.danhMuc ===
            category
    );

const select =
    document.getElementById(
        "categoryFilter"
    );

if (select) {
    select.value =
        category;
}


}

/* ==========================
PAGINATION
========================== */

function renderPagination() {


const container =
    document.getElementById(
        "pagination"
    );

if (!container) return;

const totalPages =
    Math.ceil(
        filteredProducts.length /
        PRODUCTS_PER_PAGE
    );

container.innerHTML = "";

for (
    let i = 1;
    i <= totalPages;
    i++
) {

    container.innerHTML += `

    <button
        class="page-btn ${
            i === currentPage
                ? "active"
                : ""
        }"
        onclick="changePage(${i})"
    >
        ${i}
    </button>

    `;

}


}

function changePage(page) {


currentPage = page;

renderProducts();

renderPagination();

window.scrollTo({

    top: 0,

    behavior: "smooth"

});


}

/* ==========================
PRODUCT DETAIL
========================== */

function openProduct(maSP) {


location.hash =
    `/chi-tiet-sp?id=${maSP}`;


}

/* ==========================
CART
========================== */

function getCart() {


return JSON.parse(
    localStorage.getItem(
        "cart"
    )
) || [];


}

function saveCart(cart) {


localStorage.setItem(
    "cart",
    JSON.stringify(cart)
);


}

function addToCart(productId) {


const product =
    productList.find(
        item =>
            item.maSP === productId
    );

if (!product) {
    return;
}

const quantity =
    Number(
        document.getElementById(
            `qty-${productId}`
        ).value
    );

const cart =
    getCart();

const existing =
    cart.find(
        item =>
            item.maSP === productId
    );

if (existing) {

    existing.soLuong +=
        quantity;

} else {

    cart.push({

        maSP:
            product.maSP,

        tenSP:
            product.tenSP,

        gia:
            product.gia,

        hinhAnh:
            product.hinhAnh,

        soLuong:
            quantity

    });

}

saveCart(cart);

alert(
    "Đã thêm vào giỏ hàng"
);


}

function buyNow(productId) {


const product =
    productList.find(
        item =>
            item.maSP === productId
    );

if (!product) {
    return;
}

const quantity =
    Number(
        document.getElementById(
            `qty-${productId}`
        ).value
    );

saveCart([
    {
        maSP:
            product.maSP,

        tenSP:
            product.tenSP,

        gia:
            product.gia,

        hinhAnh:
            product.hinhAnh,

        soLuong:
            quantity
    }
]);

location.hash =
    "/thanh-toan";


}

/* ==========================
INIT
========================== */

loadProducts();
