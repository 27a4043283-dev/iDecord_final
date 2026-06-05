function getCart() {
    return JSON.parse(
        localStorage.getItem("cart")
    ) || [];
}

function saveCart(cart) {
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}

function formatPrice(price) {
    return Number(price).toLocaleString(
        "vi-VN"
    ) + " VNĐ";
}

function increaseQty(productId) {
    const cart = getCart();

    const item = cart.find(
        (p) => p.maSP === productId
    );

    if (!item) {
        return;
    }

    item.soLuong++;

    saveCart(cart);

    renderCart();
}

function decreaseQty(productId) {
    const cart = getCart();

    const item = cart.find(
        (p) => p.maSP === productId
    );

    if (!item) {
        return;
    }

    item.soLuong--;

    if (item.soLuong <= 0) {
        removeItem(productId);
        return;
    }

    saveCart(cart);

    renderCart();
}

function removeItem(productId) {
    const cart = getCart().filter(
        (item) =>
            item.maSP !== productId
    );

    saveCart(cart);

    renderCart();
}

function calculateTotal(cart) {
    return cart.reduce(
        (total, item) =>
            total +
            item.gia *
                item.soLuong,
        0
    );
}

function goToCheckout() {
    location.hash =
        "/thanh-toan";
}

function renderCart() {
    const container =
        document.getElementById(
            "cart-content"
        );

    if (!container) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>
                    Giỏ hàng đang trống
                </h2>

                <p>
                    Hãy thêm sản phẩm để tiếp tục mua sắm.
                </p>

            </div>
        `;

        return;
    }

    const total =
        calculateTotal(cart);

    let html = `
        <div class="cart-table-wrapper">

            <table class="cart-table">

                <thead>

                    <tr>

                        <th>
                            Sản phẩm
                        </th>

                        <th>
                            Đơn giá
                        </th>

                        <th>
                            Số lượng
                        </th>

                        <th>
                            Thành tiền
                        </th>

                        <th>
                            Xóa
                        </th>

                    </tr>

                </thead>

                <tbody>
    `;

    cart.forEach((item) => {
        const subTotal =
            item.gia *
            item.soLuong;

        html += `
            <tr>

                <td>

                    <div class="cart-product">

                        <img
                            src="${item.hinhAnh}"
                            alt="${item.tenSP}"
                        >

                        <div class="cart-product-info">

                            <div class="cart-product-name">
                                ${item.tenSP}
                            </div>

                            <div class="cart-product-id">
                                Mã:
                                ${item.maSP}
                            </div>

                        </div>

                    </div>

                </td>

                <td class="price">

                    ${formatPrice(
                        item.gia
                    )}

                </td>

                <td>

                    <div class="qty-box">

                        <button
                            class="qty-btn"
                            onclick="decreaseQty('${item.maSP}')"
                        >
                            −
                        </button>

                        <span class="qty-value">

                            ${item.soLuong}

                        </span>

                        <button
                            class="qty-btn"
                            onclick="increaseQty('${item.maSP}')"
                        >
                            +
                        </button>

                    </div>

                </td>

                <td class="subtotal">

                    ${formatPrice(
                        subTotal
                    )}

                </td>

                <td>

                    <button
                        class="remove-btn"
                        onclick="removeItem('${item.maSP}')"
                    >
                        🗑️
                    </button>

                </td>

            </tr>
        `;
    });

    html += `
                </tbody>

            </table>

        </div>

        <div class="cart-summary">

            <div class="summary-row">

                <span class="summary-label">
                    Tổng cộng
                </span>

                <span class="summary-value">

                    ${formatPrice(
                        total
                    )}

                </span>

            </div>

            <div class="cart-actions">

                <button
                    class="btn"
                    onclick="location.hash='/san-pham'"
                >
                    Tiếp tục mua
                </button>

                <button
                    class="btn btn-gold"
                    onclick="goToCheckout()"
                >
                    Thanh toán
                </button>

            </div>

        </div>
    `;

    container.innerHTML = html;
}

/* =================================
   CẬP NHẬT BADGE GIỎ HÀNG
================================= */

function getCartCount() {
    return getCart().reduce(
        (total, item) =>
            total + item.soLuong,
        0
    );
}

function updateCartBadge() {
    const badge =
        document.querySelector(
            ".cart-count"
        );

    if (!badge) {
        return;
    }

    badge.textContent =
        getCartCount();
}

renderCart();
updateCartBadge();