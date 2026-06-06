(() => {

/* ==========================
   KIỂM TRA ĐĂNG NHẬP
========================== */

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );

if (!currentUser) {

    alert(
        "Vui lòng đăng nhập để thanh toán"
    );

    location.hash =
        "#/dang-nhap";

    return;
}

/* ==========================
   CONFIG
========================== */

const BANK_CODE =
    "970432";

const ACCOUNT_NO =
    "0395376628";

const ACCOUNT_NAME =
    "iDECOR";

/* ==========================
   GIỎ HÀNG
========================== */

const cart =
    JSON.parse(
        localStorage.getItem(
            "checkoutItems"
        )
    ) || [];

if (cart.length === 0) {

    alert(
        "Giỏ hàng đang trống"
    );

    location.hash =
        "#/gio-hang";

    return;
}

/* ==========================
   FORMAT
========================== */

function formatMoney(value) {

    return Number(value)
        .toLocaleString(
            "vi-VN"
        ) + " VNĐ";
}

/* ==========================
   TỔNG TIỀN
========================== */

function getSubtotal() {

    return cart.reduce(

        (sum, item) =>

            sum +
            (
                item.gia *
                item.soLuong
            ),

        0

    );
}

function getShippingFee() {

    return 50000;
}

function getGrandTotal() {

    return (
        getSubtotal() +
        getShippingFee()
    );
}

/* ==========================
   ĐƠN HÀNG
========================== */

function renderOrderSection() {

    const section =
        document.getElementById(
            "order-section"
        );

    if (!section) return;

    let html = `
        <h2>
            Thông Tin Đơn Hàng
        </h2>
    `;

    cart.forEach(item => {

        html += `

        <div class="product-item">

            <div class="product-image">

                <img
                    src="${item.hinhAnh}"
                    alt="${item.tenSP}"
                >

            </div>

            <div class="product-info">

                <h3>
                    ${item.tenSP}
                </h3>

                <p>
                    Mã SP:
                    ${item.maSP}
                </p>

                <p>
                    Số lượng:
                    ${item.soLuong}
                </p>

                <div class="product-price">

                    ${formatMoney(
                        item.gia *
                        item.soLuong
                    )}

                </div>

            </div>

        </div>

        `;
    });

    section.innerHTML =
        html;
}

/* ==========================
   NHẬN HÀNG
========================== */

function renderShippingSection() {

    const section =
        document.getElementById(
            "shipping-section"
        );

    if (!section) return;

    section.innerHTML = `

        <h2>
            Thông Tin Nhận Hàng
        </h2>

        <div class="shipping-form">

            <input
                id="customer-name"
                value="${currentUser.fullName || ""}"
                placeholder="Họ và tên"
            >

            <input
                id="customer-phone"
                value="${currentUser.phone || ""}"
                placeholder="Số điện thoại"
            >

            <input
                id="customer-email"
                value="${currentUser.email || ""}"
                placeholder="Email"
                readonly
            >

            <input
                id="address-detail"
                placeholder="Địa chỉ nhận hàng"
            >

        </div>

    `;
}

/* ==========================
   THANH TOÁN
========================== */

/* ==========================
PAYMENT METHODS
========================== */

function renderPaymentSection() {

    const section =
        document.getElementById(
            "payment-section"
        );

    if (!section) return;

    section.innerHTML = `

        <h2>
            Phương Thức Thanh Toán
        </h2>

        <div class="payment-method">

            <label class="payment-card">

                <input
                    type="radio"
                    name="payment"
                    value="vietqr"
                >

                <div>

                    <strong>
                        Thanh toán qua mã QR
                    </strong>

                    <p>
                        Quét mã QR bằng ứng dụng ngân hàng
                    </p>

                </div>

            </label>

            <label class="payment-card">

                <input
                    type="radio"
                    name="payment"
                    value="momo"
                >

                <div>

                    <strong>
                        Thanh toán bằng ví điện tử MoMo
                    </strong>

                    <p>
                        Thanh toán bằng ứng dụng MoMo
                    </p>

                </div>

            </label>

            <label class="payment-card">

                <input
                    type="radio"
                    name="payment"
                    value="card"
                >

                <div>

                    <strong>
                        Thanh toán bằng thẻ ngân hàng
                    </strong>

                    <p>
                        Chức năng đang cập nhật
                    </p>

                </div>

            </label>

            <label class="payment-card">

                <input
                    type="radio"
                    name="payment"
                    value="cod"
                >

                <div>

                    <strong>
                        Thanh toán khi nhận hàng
                    </strong>

                    <p>
                        Thanh toán sau khi nhận sản phẩm
                    </p>

                </div>

            </label>

        </div>
    `;
}

function handlePaymentMethod() {

    document.addEventListener(
        "change",
        e => {

            if (
                e.target.name !==
                "payment"
            ) return;

            const method =
                e.target.value;

            const extra =
                document.getElementById(
                    "payment-extra-section"
                );

            if (!extra) return;

            switch(method){

                case "vietqr":

                    extra.classList.add(
                        "active"
                    );

                    extra.innerHTML = `
                        <div class="payment-extra">

                            <div class="qr-box">

                                <img
                                    src="${buildVietQrUrl()}"
                                >

                            </div>

                            <div class="bank-info">

                                <p>
                                    Ngân hàng:
                                    VPBank
                                </p>

                                <p>
                                    STK:
                                    0395376628
                                </p>

                                <p>
                                    Chủ TK:
                                    iDECOR
                                </p>

                            </div>

                            <button
                                id="confirm-qr-btn"
                                class="confirm-order-btn"
                            >
                                Tôi Đã Thanh Toán
                            </button>

                        </div>
                    `;

                    document
                        .getElementById(
                            "confirm-qr-btn"
                        )
                        ?.addEventListener(
                            "click",
                            checkout
                        );
                        
                    break;

                case "momo":

                    alert(
                        "Chức năng thanh toán MoMo đang được cập nhật"
                    );

                    e.target.checked = false;

                    extra.classList.remove(
                        "active"
                    );

                    extra.innerHTML = "";

                    break;

                case "card":

                    alert(
                        "Chức năng đang cập nhật"
                    );

                    e.target.checked = false;

                    extra.classList.remove(
                        "active"
                    );

                    extra.innerHTML = "";

                    break;

                case "cod":

                    extra.classList.add(
                        "active"
                    );

                    extra.innerHTML = `

                        <div class="info-box">

                            <h4>
                                Thanh toán khi nhận hàng
                            </h4>

                            <p>
                                Quý khách sẽ thanh toán cho nhân viên giao hàng sau khi nhận sản phẩm.
                            </p>

                        </div>

                        <button
                            id="confirm-order-btn"
                            class="confirm-order-btn"
                        >
                            Xác Nhận Đơn Hàng
                        </button>

                    `;

                    document
                        .getElementById(
                            "confirm-order-btn"
                        )
                        ?.addEventListener(
                            "click",
                            checkout
                        );

                    break;
            }

        }
    );
}



/* ==========================
   TÓM TẮT
========================== */

function renderSummarySection() {

    const section =
        document.getElementById(
            "summary-section"
        );

    if (!section) return;

    section.innerHTML = `

        <h2>
            Tóm Tắt Đơn Hàng
        </h2>

        <div class="summary-box">

            <div class="summary-row">

                <span>
                    Tạm tính
                </span>

                <span>
                    ${formatMoney(
                        getSubtotal()
                    )}
                </span>

            </div>

            <div class="summary-row">

                <span>
                    Phí vận chuyển
                </span>

                <span>
                    ${formatMoney(
                        getShippingFee()
                    )}
                </span>

            </div>

            <div class="summary-total">

                <span>
                    Tổng cộng
                </span>

                <br>

                <strong>

                    ${formatMoney(
                        getGrandTotal()
                    )}

                </strong>

            </div>
        </div>

    `;
}

/* ==========================
   TẠO ĐƠN
========================== */

function createOrder() {

    const paymentMethod =
        document.querySelector(
            'input[name="payment"]:checked'
        )?.value;
    
            const status =
            paymentMethod === "cod"
                ? "Cho xac nhan"
                : "Cho thanh toan";


    const order = {

        id:
            "DH" +
            Date.now(),

        customer: {

            fullName:
                document.getElementById(
                    "customer-name"
                ).value,

            phone:
                document.getElementById(
                    "customer-phone"
                ).value,

            email:
                document.getElementById(
                    "customer-email"
                ).value,

            address:
                document.getElementById(
                    "address-detail"
                ).value

        },

        products:
            cart,

        total:
            getGrandTotal(),

        paymentMethod,

        status,

        createdAt:
            new Date()
            .toLocaleString(
                "vi-VN"
            )

    };

    const orders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];

    orders.push(order);

    localStorage.setItem(

        "orders",

        JSON.stringify(
            orders
        )

    );

    return order;
}

/* ==========================
   CHECKOUT
========================== */

function checkout() {

    const address =
        document.getElementById(
            "address-detail"
        ).value.trim();

    if (!address) {

        alert(
            "Vui lòng nhập địa chỉ nhận hàng"
        );

        return;
    }

    const fullName =
    document
        .getElementById(
            "customer-name"
        )
        .value
        .trim();

    const phone =
        document
            .getElementById(
                "customer-phone"
            )
            .value
            .trim();

    if (!fullName) {

        alert(
            "Vui lòng nhập họ tên"
        );

        return;
    }

    if (!phone) {

        alert(
            "Vui lòng nhập số điện thoại"
        );

        return;
    }

    const paymentMethod =
    document.querySelector(
        'input[name="payment"]:checked'
    )?.value;

    if (!paymentMethod) {

        alert(
            "Vui lòng chọn phương thức thanh toán"
        );

        return;
    }

    const order =
        createOrder();

    alert(
        "Đặt hàng thành công"
    );

    const fullCart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    const checkoutItems =
        JSON.parse(
            localStorage.getItem("checkoutItems")
        ) || [];

    const remainCart =
        fullCart.filter(
            item =>
                !checkoutItems.some(
                    c => c.maSP === item.maSP
                )
        );

    localStorage.setItem(
        "cart",
        JSON.stringify(remainCart)
    );

    localStorage.removeItem(
        "checkoutItems"
    );
    location.hash =
        "#/hoan-tat";
}

function buildVietQrUrl() {

    const orderId =
        "DH" + Date.now();

    return `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NO}-compact2.png?amount=${getGrandTotal()}&addInfo=${orderId}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
}

/* ==========================
   INIT
========================== */

renderOrderSection();

renderShippingSection();

renderPaymentSection();

renderSummarySection();

handlePaymentMethod();

})();

