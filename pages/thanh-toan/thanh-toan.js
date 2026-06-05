/* ==========================
   CONFIG
========================== */

const API_URL =
"https://script.google.com/macros/s/AKfycbxigEyl3ZW_MTnoIvLlRrmlNJetunsIrPktedxnHU3DeHVSWwy1kQqj9P0VsAh2lF_V/exec";

const BANK_CODE = "VPBANK";
const ACCOUNT_NO = "0395376628";
const ACCOUNT_NAME = "iDECOR";

/* ==========================
   DATA
========================== */

let cart =
JSON.parse(
localStorage.getItem("cart")
) || [];

let currentOrderId = null;

let qrRefreshCount = 0;

let timerInterval = null;

/* ==========================
   FORMAT
========================== */

function formatMoney(value){

    return Number(value)
    .toLocaleString("vi-VN")
    + " VNĐ";

}

/* ==========================
   RENDER CART
========================== */

function renderCart(){

    const container =
    document.getElementById(
    "checkout-products"
    );

    if(!container) return;

    let subtotal = 0;

    container.innerHTML = "";

    cart.forEach(item=>{

        const total =
        item.gia *
        item.soLuong;

        subtotal += total;

        container.innerHTML += `

        <div class="product-item">

            <div class="product-image">

                <img
                src="${item.hinhAnh}"
                alt="${item.tenSP}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                ">

            </div>

            <div class="product-info">

                <h3>${item.tenSP}</h3>

                <p>
                    Số lượng:
                    ${item.soLuong}
                </p>

                <p>
                    Đơn giá:
                    ${formatMoney(item.gia)}
                </p>

                <p class="product-price">
                    ${formatMoney(total)}
                </p>

            </div>

        </div>

        `;

    });

    const shipping = 50000;

    const grandTotal =
    subtotal + shipping;

    document.getElementById(
    "subtotal"
    ).textContent =
    formatMoney(subtotal);

    document.getElementById(
    "shipping-fee"
    ).textContent =
    formatMoney(shipping);

    document.getElementById(
    "grand-total"
    ).textContent =
    formatMoney(grandTotal);

}

/* ==========================
   TỔNG TIỀN
========================== */

function getTotalAmount(){

    const subtotal =
    cart.reduce(
        (sum,item)=>

        sum +
        item.gia *
        item.soLuong,

        0
    );

    return subtotal + 50000;

}

/* ==========================
   VALIDATE
========================== */

function validateCheckout(){

    const payment =
    document.querySelector(
    'input[name="payment"]:checked'
    );

    if(!payment){

        alert(
        "Vui lòng chọn phương thức thanh toán"
        );

        return false;

    }

    if(
        payment.value !==
        "vietqr"
    ){

        alert(
        "Chức năng đang nâng cấp"
        );

        return false;

    }

    if(
        !document.getElementById(
        "agree-info"
        ).checked
    ){

        alert(
        "Bạn chưa xác nhận thông tin"
        );

        return false;

    }

    if(
        !document.getElementById(
        "agree-policy"
        ).checked
    ){

        alert(
        "Bạn chưa đồng ý chính sách"
        );

        return false;

    }

    return true;

}

/* ==========================
   TẠO ĐƠN HÀNG
========================== */

async function createOrder(){

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    const data = {

        action:
            "createOrder",

        sessionId:
            currentUser?.id || "guest",

        hoTen:
            document.getElementById(
                "customer-name"
            ).value,

        sdt:
            document.getElementById(
                "customer-phone"
            ).value,

        email:
            document.getElementById(
                "customer-email"
            ).value,

        diaChi:
            document.getElementById(
                "address-detail"
            ).value,

        tongDon:
            getTotalAmount(),

        products:
            cart

    };

    const response =
    await fetch(
        API_URL,
        {
            method:"POST",
            body:JSON.stringify(
                data
            )
        }
    );

    const result =
    await response.json();

    if(
        !result.success
    ){

        throw new Error(
        result.message
        );

    }

    return result.maDH;

}

/* ==========================
   TẠO THANH TOÁN
========================== */

async function createPayment(
    maDH
){

    const response =
    await fetch(
        API_URL,
        {
            method:"POST",

            body:JSON.stringify({

                action:
                "createPayment",

                maDH,

                soTien:
                getTotalAmount()

            })

        }
    );

    return await response.json();

}

/* ==========================
   TẠO QR
========================== */

function generateQR(
    maDH
){

    const qrImage =
    document.getElementById(
    "qr-image"
    );

    const amount =
    getTotalAmount();

    qrImage.src =

`https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${maDH}&accountName=${ACCOUNT_NAME}`;

    document
    .getElementById(
    "qr-payment"
    )
    .classList
    .add(
    "active"
    );

}

/* ==========================
   TIMER
========================== */

function startTimer(){

    clearInterval(
    timerInterval
    );

    let seconds = 600;

    timerInterval =
    setInterval(()=>{

        const min =
        Math.floor(
        seconds / 60
        );

        const sec =
        seconds % 60;

        document.querySelector(
        ".qr-timer"
        ).textContent =

        `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

        seconds--;

        if(
            seconds < 0
        ){

            clearInterval(
            timerInterval
            );

            refreshQR();

        }

    },1000);

}

/* ==========================
   REFRESH QR
========================== */

async function refreshQR(){

    qrRefreshCount++;

    if(
        qrRefreshCount >= 3
    ){

        alert(
        "Phiên thanh toán đã hết hạn"
        );

        localStorage.removeItem(
        "cart"
        );

        location.hash =
        "/gio-hang";

        return;

    }

    generateQR(
        currentOrderId
    );

    startTimer();

}

/* ==========================
   THANH TOÁN
========================== */

async function checkout(){

    try{

        if(
            !validateCheckout()
        ) return;

        const maDH =
        await createOrder();

        currentOrderId =
        maDH;

        await createPayment(
            maDH
        );

        generateQR(
            maDH
        );

        startTimer();

        alert(
        "Đơn hàng đã được tạo"
        );

    }
    catch(error){

        console.error(
        error
        );

        alert(
        error.message
        );

    }

}

/* ==========================
   BUTTON
========================== */

const button =
    document.getElementById(
        "generate-qr-btn"
    );

if (button) {
    button.addEventListener(
        "click",
        checkout
    );
}

renderCart();