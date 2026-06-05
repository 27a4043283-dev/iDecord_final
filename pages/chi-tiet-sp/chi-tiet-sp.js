const CHI_TIET_SP_URL =
"https://script.google.com/macros/s/AKfycbxigEyl3ZW_MTnoIvLlRrmlNJetunsIrPktedxnHU3DeHVSWwy1kQqj9P0VsAh2lF_V/exec";

let currentProduct = null;
let relatedProducts = [];

/* ==========================
URL PARAM
========================== */

function getProductId() {


const query =
    window.location.hash
    .split("?")[1];

if (!query) {
    return null;
}

const params =
    new URLSearchParams(
        query
    );

return params.get("id");


}

/* ==========================
LOAD PRODUCT
========================== */

async function loadProduct() {


try {

    const response =
        await fetch(
            `${CHI_TIET_SP_URL}?action=getProducts`
        );

    const result =
        await response.json();

    if (
        !result.success
    ) {
        return;
    }

    relatedProducts =
        result.products || [];

    const productId =
        getProductId();

    currentProduct =
        relatedProducts.find(
            item =>
                item.maSP ===
                productId
        );

    if (!currentProduct) {

        document.querySelector(
            ".product-detail-page"
        ).innerHTML =

        `
        <div class="container">
            <h2>
                Không tìm thấy sản phẩm
            </h2>
        </div>
        `;

        return;
    }

    renderProduct();

    renderRelatedProducts();

    initQuantity();

    initButtons();

}
catch (error) {

    console.error(error);

}


}

/* ==========================
FORMAT PRICE
========================== */

function formatPrice(price) {


return Number(price)
.toLocaleString(
    "vi-VN"
) + " VNĐ";


}

/* ==========================
RENDER PRODUCT
========================== */

function renderProduct() {


document.getElementById(
    "product-image"
).src =
    currentProduct.hinhAnh;

document.getElementById(
    "product-name"
).textContent =
    currentProduct.tenSP;

document.getElementById(
    "product-price"
).textContent =
    formatPrice(
        currentProduct.gia
    );

document.getElementById(
    "product-short-desc"
).textContent =
    currentProduct.moTa;

document.getElementById(
    "product-description"
).textContent =
    currentProduct.moTa;

document.getElementById(
    "product-category"
).textContent =
    currentProduct.danhMuc;

document.getElementById(
    "spec-code"
).textContent =
    currentProduct.maSP;

document.getElementById(
    "spec-category"
).textContent =
    currentProduct.danhMuc;

document.getElementById(
    "spec-stock"
).textContent =
    currentProduct.soLuongTon;


}

/* ==========================
QUANTITY
========================== */

function initQuantity() {


const input =
    document.getElementById(
        "quantity"
    );

document
.getElementById(
    "minus-btn"
)
.addEventListener(
    "click",
    () => {

        if (
            Number(
                input.value
            ) > 1
        ) {

            input.value =
                Number(
                    input.value
                ) - 1;

        }

    }
);

document
.getElementById(
    "plus-btn"
)
.addEventListener(
    "click",
    () => {

        input.value =
            Number(
                input.value
            ) + 1;

    }
);


}

function getQuantity() {


return Number(
    document.getElementById(
        "quantity"
    ).value
);


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

function addToCart() {


const cart =
    getCart();

const existing =
    cart.find(
        item =>
            item.maSP ===
            currentProduct.maSP
    );

if (existing) {

    existing.soLuong +=
        getQuantity();

}
else {

    cart.push({

        maSP:
            currentProduct.maSP,

        tenSP:
            currentProduct.tenSP,

        gia:
            currentProduct.gia,

        hinhAnh:
            currentProduct.hinhAnh,

        soLuong:
            getQuantity()

    });

}

saveCart(cart);

alert(
    "Đã thêm vào giỏ hàng"
);


}

function buyNow() {


saveCart([

    {

        maSP:
            currentProduct.maSP,

        tenSP:
            currentProduct.tenSP,

        gia:
            currentProduct.gia,

        hinhAnh:
            currentProduct.hinhAnh,

        soLuong:
            getQuantity()

    }

]);

location.hash =
    "/thanh-toan";


}

/* ==========================
RELATED PRODUCTS
========================== */

function renderRelatedProducts() {


const container =
    document.getElementById(
        "related-products"
    );

if (!container) {
    return;
}

const relatedProducts =

    relatedProducts

    .filter(item =>

        item.danhMuc ===
        currentProduct.danhMuc &&

        item.maSP !==
        currentProduct.maSP

    )

    .slice(0,4);

container.innerHTML =

    relatedProducts.map(item => `

    <div
        class="related-card"
        onclick="location.hash='/chi-tiet-sp?id=${item.maSP}'"
    >

        <img
            src="${item.hinhAnh}"
            alt="${item.tenSP}"
        >

        <div
            class="related-content"
        >

            <div
                class="related-name"
            >
                ${item.tenSP}
            </div>

            <div
                class="related-price"
            >
                ${formatPrice(item.gia)}
            </div>

        </div>

    </div>

    `).join("");


}

/* ==========================
BUTTONS
========================== */

function initButtons() {


document
.getElementById(
    "add-cart-btn"
)
.addEventListener(
    "click",
    addToCart
);

document
.getElementById(
    "buy-now-btn"
)
.addEventListener(
    "click",
    buyNow
);


}

/* ==========================
INIT
========================== */

loadProduct();
