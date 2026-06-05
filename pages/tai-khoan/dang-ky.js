/* Đường dẫn API */

const REGISTER_URL =
"https://script.google.com/macros/s/AKfycbxigEyl3ZW_MTnoIvLlRrmlNJetunsIrPktedxnHU3DeHVSWwy1kQqj9P0VsAh2lF_V/exec";

/* Biểu mẫu đăng ký */

const registerForm =
document.getElementById(
"registerForm"
);

const registerMessage =
document.getElementById(
"registerMessage"
);

/* Kiểm tra phần tử */

if (registerForm) {


registerForm.addEventListener(
    "submit",
    handleRegister
);


}

/* Hiển thị thông báo */

function showMessage(
message,
type
) {


registerMessage.textContent =
    message;

registerMessage.className =
    `form-message ${type}`;


}

/* Kiểm tra email */

function isValidEmail(
email
) {


const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

return emailRegex.test(
    email
);


}

/* Kiểm tra số điện thoại */

function isValidPhone(
phone
) {


const phoneRegex =
    /^[0-9]{10,11}$/;

return phoneRegex.test(
    phone
);


}

/* Kiểm tra mật khẩu */

function isValidPassword(
password
) {


const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

return passwordRegex.test(
    password
);


}

/* Xử lý đăng ký */

async function handleRegister(
event
) {


event.preventDefault();

const submitButton =
    registerForm.querySelector(
        "button"
    );

const fullName =
    document
        .getElementById(
            "fullName"
        )
        .value
        .trim();

const phone =
    document
        .getElementById(
            "phone"
        )
        .value
        .trim();

const email =
    document
        .getElementById(
            "email"
        )
        .value
        .trim();

const password =
    document
        .getElementById(
            "password"
        )
        .value;

const confirmPassword =
    document
        .getElementById(
            "confirmPassword"
        )
        .value;


/* Kiểm tra họ tên */

if (!fullName) {

    showMessage(
        "Vui lòng nhập họ và tên.",
        "error"
    );

    return;
}


/* Kiểm tra số điện thoại */

if (
    !isValidPhone(
        phone
    )
) {

    showMessage(
        "Số điện thoại không hợp lệ.",
        "error"
    );

    return;
}


/* Kiểm tra email */

if (
    !isValidEmail(
        email
    )
) {

    showMessage(
        "Email không hợp lệ.",
        "error"
    );

    return;
}


/* Kiểm tra mật khẩu */

if (
    !isValidPassword(
        password
    )
) {

    showMessage(
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        "error"
    );

    return;
}


/* Kiểm tra xác nhận mật khẩu */

if (
    password !==
    confirmPassword
) {

    showMessage(
        "Mật khẩu xác nhận không khớp.",
        "error"
    );

    return;
}


try {

    submitButton.disabled = true;

    await fetch(
        REGISTER_URL,
        {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify({
                action: "register",
                fullName,
                phone,
                email,
                password
            })
        }
    );

    showMessage(
        "Đăng ký thành công.",
        "success"
    );

    registerForm.reset();

    setTimeout(() => {
        window.location.hash =
            "/dang-nhap";
    }, 1000);

}
catch(error) {

    console.error(error);

    showMessage(
        "Không thể kết nối máy chủ.",
        "error"
    );

}
finally {

    submitButton.disabled = false;

}

}
