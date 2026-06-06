(() => {
    console.log("=== GIO HANG JS LOADED ===");
/* ==========================
   KIỂM TRA ĐĂNG NHẬP
========================== */

const cart_user =
    JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );

if (!cart_user) {

    alert(
        "Vui lòng đăng nhập để sử dụng giỏ hàng."
    );

    location.hash =
        "/dang-nhap";
}

/* ==========================
   STORAGE
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

/* ==========================
   FORMAT GIÁ
========================== */

function formatPrice(price) {

    return Number(price)
        .toLocaleString(
            "vi-VN"
        ) + " VNĐ";

}

/* ==========================
   TĂNG GIẢM SỐ LƯỢNG
========================== */

function increaseQty(productId) {

    const cart =
        getCart();

    const item =
        cart.find(
            p =>
            p.maSP === productId
        );

    if (!item) return;

    item.soLuong++;

    saveCart(cart);

    renderCart();

}

function decreaseQty(productId) {

    const cart =
        getCart();

    const item =
        cart.find(
            p =>
            p.maSP === productId
        );

    if (!item) return;

    item.soLuong--;

    if (
        item.soLuong <= 0
    ) {

        removeItem(
            productId
        );

        return;
    }

    saveCart(cart);

    renderCart();

}

/* ==========================
   XÓA SẢN PHẨM
========================== */

function removeItem(productId) {

    const confirmed =
        confirm(
            "Xóa sản phẩm khỏi giỏ hàng?"
        );

    if (!confirmed) {

        return;

    }

    const cart =
        getCart().filter(

            item =>

            item.maSP !==
            productId

        );

    saveCart(cart);

    renderCart();

}

/* ==========================
   TÍNH TỔNG TIỀN
========================== */

function calculateTotal(cart) {

    return cart.reduce(

        (
            total,
            item
        ) =>

            total +
            (
                item.gia *
                item.soLuong
            ),

        0

    );

}

/* ==========================
   THANH TOÁN
========================== */

function goToCheckout() {

    console.log("GO TO CHECKOUT");

    const cart =
        getCart();

    console.log("Cart:", cart);

    if (cart.length === 0) {

        console.log("EMPTY CART");

        alert("Giỏ hàng đang trống.");
        return;
    }

    console.log("CHANGE HASH");

    location.hash =
        "#/thanh-toan";
}

/* ==========================
   RENDER GIỎ HÀNG
========================== */

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const emptyCart =
        document.getElementById(
            "emptyCart"
        );

    if (
        !cartItems
    ) return;

    const cart =
        getCart();

    if (
        cart.length === 0
    ) {

        cartItems.innerHTML =
            "";

        if (
            emptyCart
        ) {

            emptyCart.style.display =
                "block";
        }

        updateSummary(
            0,
            0
        );

        updateCartBadge();

        return;

    }

    if (
        emptyCart
    ) {

        emptyCart.style.display =
            "none";
    }

    let html = "";

    cart.forEach(
        item => {

            const subtotal =
                item.gia *
                item.soLuong;

            html += `

            <div class="cart-item">

                <input
                    type="checkbox"
                    checked
                >

                <img
                    src="${item.hinhAnh}"
                    alt="${item.tenSP}"
                >

                <div class="item-info">

                    <h3>
                        ${item.tenSP}
                    </h3>

                    <p>
                        Mã:
                        ${item.maSP}
                    </p>

                    <span>
                        ${formatPrice(
                            item.gia
                        )}
                    </span>

                </div>

                <div class="quantity-box">

                    <button
                        class="quantity-btn"
                        onclick="decreaseQty('${item.maSP}')"
                    >
                        -
                    </button>

                    <span
                        class="quantity-value"
                    >
                        ${item.soLuong}
                    </span>

                    <button
                        class="quantity-btn"
                        onclick="increaseQty('${item.maSP}')"
                    >
                        +
                    </button>

                </div>

                <div class="item-total">

                    <p>
                        Tạm tính
                    </p>

                    <strong>

                        ${formatPrice(
                            subtotal
                        )}

                    </strong>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeItem('${item.maSP}')"
                >

                    <i class="fa-regular fa-trash-can"></i>

                </button>

            </div>

            `;
        }
    );

    cartItems.innerHTML =
        html;

    const total =
        calculateTotal(
            cart
        );

    updateSummary(
        cart.length,
        total
    );

    updateCartBadge();

}

/* ==========================
   TÓM TẮT ĐƠN HÀNG
========================== */

function updateSummary(
    count,
    total
) {

    const summaryCount =
        document.getElementById(
            "summaryCount"
        );

    const subtotalPrice =
        document.getElementById(
            "subtotalPrice"
        );

    const totalPrice =
        document.getElementById(
            "totalPrice"
        );

    if (
        summaryCount
    ) {

        summaryCount.textContent =
            `${count} sản phẩm`;
    }

    if (
        subtotalPrice
    ) {

        subtotalPrice.textContent =
            formatPrice(
                total
            );
    }

    if (
        totalPrice
    ) {

        totalPrice.textContent =
            formatPrice(
                total
            );
    }

}

/* ==========================
   BADGE GIỎ HÀNG
========================== */

function getCartCount() {

    return getCart().reduce(

        (
            total,
            item
        ) =>

            total +
            item.soLuong,

        0

    );

}

function updateCartBadge() {

    const badge =
        document.querySelector(
            ".cart-count"
        );

    if (!badge) return;

    badge.textContent =
        getCartCount();

}

/* ==========================
   INIT
========================== */

renderCart();

updateCartBadge();

const checkoutBtn =
    document.getElementById(
        "checkoutBtn"
    );

if (checkoutBtn) {
    console.log(
    "Checkout button found"
);

    checkoutBtn.onclick =
        goToCheckout;
}

window.removeItem =
    removeItem;

window.increaseQty =
    increaseQty;

window.decreaseQty =
    decreaseQty;

})();