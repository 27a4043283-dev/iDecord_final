/* Đường dẫn API */

const RESET_PW_URL =
"https://script.google.com/macros/s/AKfycbxigEyl3ZW_MTnoIvLlRrmlNJetunsIrPktedxnHU3DeHVSWwy1kQqj9P0VsAh2lF_V/exec";

/* Biểu mẫu quên mật khẩu */

const resetForm =
document.getElementById(
"resetForm"
);

const resetMessage =
document.getElementById(
"resetMessage"
);

/* Hiển thị thông báo */

function showResetMessage(
message,
type
) {


resetMessage.textContent =
    message;

resetMessage.className =
    `form-message ${type}`;


}

/* Xử lý quên mật khẩu */

resetForm.addEventListener(
"submit",
async function (event) {


    event.preventDefault();

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


    try {

        const response =
            await fetch(
                RESET_PW_URL,
                {
                    method: "POST",

                    body: JSON.stringify({

                        action:
                            "resetPassword",

                        fullName,

                        phone,

                        email

                    })
                }
            );

        const result =
            await response.json();


        showResetMessage(
            result.message,
            result.success
                ? "success"
                : "error"
        );


        if (
            result.success
        ) {

            resetForm.reset();

        }

    }
    catch (error) {

        console.error(
            error
        );

        showResetMessage(
            "Không thể kết nối máy chủ.",
            "error"
        );

    }

}


);
