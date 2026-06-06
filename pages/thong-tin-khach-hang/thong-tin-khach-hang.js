const GET_USER_URL =
"https://script.google.com/macros/s/AKfycbxigEyl3ZW_MTnoIvLlRrmlNJetunsIrPktedxnHU3DeHVSWwy1kQqj9P0VsAh2lF_V/exec";

initCustomerPage();

async function initCustomerPage() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    console.log(
        "Current User:",
        currentUser
    );

    if (!currentUser) {

        alert(
            "Vui lòng đăng nhập."
        );

        window.location.hash =
            "/dang-nhap";

        return;
    }

    await loadUserInfo(
        currentUser.id
    );
    setupChangePassword();
    setupLogout();

}

async function loadUserInfo(
    userId
) {

    try {

        const response =
            await fetch(
                GET_USER_URL,
                {
                    method: "POST",
                    body: JSON.stringify({
                        action: "getUser",
                        userId
                    })
                }
            );

        const result =
            await response.json();

        console.log(result);

        if (!result.success) {

            return;
        }

        const user =
            result.user;

        document.getElementById(
            "fullName"
        ).textContent =
            user.fullName || "";

        document.getElementById(
            "username"
        ).textContent =
            user.email || "";

        document.getElementById(
            "email"
        ).textContent =
            user.email || "";

        document.getElementById(
            "phone"
        ).textContent =
            user.phone || "";

        document.getElementById(
            "birthday"
        ).textContent =
            "Chưa cập nhật";

        document.getElementById(
            "gender"
        ).textContent =
            "Chưa cập nhật";

    }
    catch (error) {

        console.error(error);

    }

}

function setupLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutCustomerBtn"
        );

    if (!logoutBtn) return;

    logoutBtn.onclick =
        function () {

            const confirmed =
                confirm(
                    "Bạn có chắc chắn muốn đăng xuất?"
                );

            if (!confirmed) {

                return;
            }

            localStorage.removeItem(
                "currentUser"
            );

            window.location.hash =
                "/dang-nhap";

        };

}

function setupChangePassword() {

    const menuPassword =
        document.getElementById(
            "menuPassword"
        );

    if (!menuPassword) return;

    menuPassword.onclick =
        function () {

            window.location.hash =
                "/doi-mat-khau";

        };

}