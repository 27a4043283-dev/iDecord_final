/* Đường dẫn API */

const DOI_PW_URL =
"https://script.google.com/macros/s/AKfycbxigEyl3ZW_MTnoIvLlRrmlNJetunsIrPktedxnHU3DeHVSWwy1kQqj9P0VsAh2lF_V/exec";

/* Biểu mẫu đổi mật khẩu */

const changePasswordForm =
document.getElementById(
"changePasswordForm"
);

const changePasswordMessage =
document.getElementById(
"changePasswordMessage"
);

/* Hiển thị thông báo */

function showChangePasswordMessage(
message,
type
) {


changePasswordMessage.textContent =
    message;

changePasswordMessage.className =
    `form-message ${type}`;


}

/* Kiểm tra mật khẩu */

function isValidPassword(
password
) {


const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;

return regex.test(
    password
);


}

/* Kiểm tra đăng nhập */

const currentUser =
JSON.parse(
localStorage.getItem(
"currentUser"
)
);

if (
!currentUser
) {


window.location.hash =
    "/dang-nhap";


}

/* Xử lý đổi mật khẩu */

changePasswordForm.addEventListener(
"submit",
async function (event) {


    event.preventDefault();

    const currentPassword =
        document
            .getElementById(
                "currentPassword"
            )
            .value;

    const newPassword =
        document
            .getElementById(
                "newPassword"
            )
            .value;

    const confirmPassword =
        document
            .getElementById(
                "confirmPassword"
            )
            .value;


    /* Kiểm tra độ mạnh */

    if (
        !isValidPassword(
            newPassword
        )
    ) {

        showChangePasswordMessage(
            "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
            "error"
        );

        return;
    }


    /* Kiểm tra xác nhận */

    if (
        newPassword !==
        confirmPassword
    ) {

        showChangePasswordMessage(
            "Mật khẩu xác nhận không khớp.",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch(
                DOI_PW_URL,
                {
                    method: "POST",

                    body: JSON.stringify({

                        action:
                            "changePassword",

                        email:
                            currentUser.email,

                        currentPassword,

                        newPassword

                    })
                }
            );

        const result =
            await response.json();


        showChangePasswordMessage(
            result.message,
            result.success
                ? "success"
                : "error"
        );


        if (
            result.success
        ) {

            currentUser.mustChangePassword =
                false;

            localStorage.setItem(
                "currentUser",
                JSON.stringify(
                    currentUser
                )
            );

            setTimeout(
                function () {

                    window.location.hash =
                        "/trang-chu";

                },
                1500
            );

        }

    }
    catch (error) {

        console.error(
            error
        );

        showChangePasswordMessage(
            "Không thể kết nối máy chủ.",
            "error"
        );

    }

}


);
