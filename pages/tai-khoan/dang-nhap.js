/* Đường dẫn API */

const LOGIN_URL =
"https://script.google.com/macros/s/AKfycbxigEyl3ZW_MTnoIvLlRrmlNJetunsIrPktedxnHU3DeHVSWwy1kQqj9P0VsAh2lF_V/exec";

/* Biểu mẫu đăng nhập */

const loginForm =
document.getElementById(
"loginForm"
);

const loginMessage =
document.getElementById(
"loginMessage"
);

/* Hiển thị thông báo */

function showLoginMessage(
message,
type
) {


loginMessage.textContent =
    message;

loginMessage.className =
    `form-message ${type}`;


}

/* Xử lý đăng nhập */

loginForm.addEventListener(
"submit",
async function (event) {


    event.preventDefault();

    const username =
        document
            .getElementById(
                "username"
            )
            .value
            .trim();

    const password =
        document
            .getElementById(
                "loginPassword"
            )
            .value;


    try {

        const response =
            await fetch(
                LOGIN_URL,
                {
                    method: "POST",

                    body: JSON.stringify({

                        action:
                            "login",

                        username,

                        password

                    })
                }
            );

        const result =
            await response.json();


        if (
            !result.success
        ) {

            showLoginMessage(
                result.message,
                "error"
            );

            return;
        }


        localStorage.setItem(
            "currentUser",
            JSON.stringify(
                result.user
            )
        );


        showLoginMessage(
            "Đăng nhập thành công.",
            "success"
        );


        setTimeout(
            function () {

                if (
                    result.mustChangePassword
                ) {

                    window.location.hash =
                        "/doi-mat-khau";

                    return;
                }

                window.location.hash =
                    "/trang-chu";

            },
            1000
        );

    }
    catch (error) {

        console.error(
            error
        );

        showLoginMessage(
            "Không thể kết nối máy chủ.",
            "error"
        );

    }

}


);
