(() => {
    const CSV_PATH =
    "/iDecor_final/assets/data/SanPham_300Dong.csv";

initProductDetail();

async function initProductDetail() {
    console.log("chi tiet da chay");

    const productId =
        localStorage.getItem(
            "selectedProductId"
        );

    if (!productId) {

        document.getElementById(
            "product-title-val"
        ).textContent =
            "Không tìm thấy sản phẩm";

        return;
    }

    try {

        const response =
            await fetch(CSV_PATH);

        const csv =
            await response.text();

        const products =
            parseCSV(csv);

        const product =
            products.find(
                p =>
                    p.MaSP === productId
            );

        if (!product) {

            document.getElementById(
                "product-title-val"
            ).textContent =
                "Sản phẩm không tồn tại";

            return;
        }

        renderProduct(product);

    } catch (error) {

        console.error(error);

    }

}

function parseCSV(csv) {

    const rows =
        csv.trim().split("\n");

    const headers =
        rows[0].split(",");

    return rows.slice(1).map(row => {

        const values =
            row.split(",");

        const obj = {};

        headers.forEach(
            (header, index) => {

                obj[
                    header.trim()
                ] =
                    values[index]?.trim() ||
                    "";

            }
        );

        return obj;

    });

}

function renderProduct(product) {

    document.getElementById(
        "breadcrumb-name"
    ).textContent =
        product.TenSP;

    document.getElementById(
        "breadcrumb-cat"
    ).textContent =
        product.DanhMuc;

    document.getElementById(
        "product-title-val"
    ).textContent =
        product.TenSP;

    document.getElementById(
        "product-sku-val"
    ).textContent =
        product.MaSP;

    document.getElementById(
        "product-price-val"
    ).textContent =
        Number(product.Gia)
            .toLocaleString("vi-VN")
        + " đ";

    document.getElementById(
        "quick-cat"
    ).textContent =
        product.DanhMuc;

    document.getElementById(
        "quick-status"
    ).textContent =
        product.TrangThai;

    document.getElementById(
        "quick-stock"
    ).textContent =
        product.SoLuongTon;

    document.getElementById(
        "table-sku"
    ).textContent =
        product.MaSP;

    document.getElementById(
        "table-cat"
    ).textContent =
        product.DanhMuc;

    document.getElementById(
        "table-stock"
    ).textContent =
        product.SoLuongTon;

    document.getElementById(
        "table-status"
    ).textContent =
        product.TrangThai;

    document.getElementById(
        "product-full-desc"
    ).innerHTML =
        product.MoTaChiTiet;

    setupGallery(product);

    setupQuantity();

    setupTabs();

    document
    .getElementById(
        "btn-add-to-cart-trigger"
    )
    .addEventListener(
        "click",
        () =>
            addToCart(product)
    );

    document
    .getElementById(
        "btn-buy-now-trigger"
    )
    .addEventListener(
        "click",
        () => {

            addToCart(product);

            location.hash =
                "/thanh-toan";

        }
    );

}

function setupGallery(product) {

    const images =
        product.HinhAnh
            .split("|");

    const mainImg =
        document.getElementById(
            "main-product-img"
        );

    mainImg.src =
        images[0];

    const thumbs =
        document.getElementById(
            "product-thumbnails"
        );

    thumbs.innerHTML = "";

    images.forEach(
        (image, index) => {

            const img =
                document.createElement(
                    "img"
                );

            img.src =
                image.trim();

            if (
                index === 0
            ) {
                img.classList.add(
                    "active"
                );
            }

            img.onclick =
                function () {

                    mainImg.src =
                        image.trim();

                    document
                        .querySelectorAll(
                            "#product-thumbnails img"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );

                    img.classList.add(
                        "active"
                    );

                };

            thumbs.appendChild(
                img
            );

        }
    );

}

function setupQuantity() {

    const minusBtn =
        document.getElementById(
            "qty-minus"
        );

    const plusBtn =
        document.getElementById(
            "qty-plus"
        );

    const qtyInput =
        document.getElementById(
            "product-qty"
        );

    plusBtn.addEventListener(
        "click",
        () => {

            qtyInput.value =
                Number(
                    qtyInput.value
                ) + 1;

        }
    );

    minusBtn.addEventListener(
        "click",
        () => {

            const value =
                Number(
                    qtyInput.value
                );

            if (value > 1) {

                qtyInput.value =
                    value - 1;

            }

        }
    );

}

function addToCart(product) {

    const qty =
        Number(
            document.getElementById(
                "product-qty"
            ).value
        );

    let cart =
        JSON.parse(
            localStorage.getItem(
                "cart"
            )
        ) || [];

    const existing =
        cart.find(
            item =>
                item.maSP ===
                product.MaSP
        );

    if (existing) {

        existing.soLuong += qty;

    } else {

        cart.push({

            maSP:
                product.MaSP,

            tenSP:
                product.TenSP,

            gia:
                Number(
                    product.Gia
                ),

            soLuong:
                qty,

            hinhAnh:
                product.HinhAnh
                    .split("|")[0]

        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(
        "Đã thêm vào giỏ hàng"
    );

}

function setupTabs() {

    const tabs =
        document.querySelectorAll(
            ".tab-link"
        );

    const contents =
        document.querySelectorAll(
            ".tab-content"
        );

    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                tabs.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                contents.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                tab.classList.add(
                    "active"
                );

                document
                    .getElementById(
                        tab.dataset.tab
                    )
                    .classList.add(
                        "active"
                    );

            }
        );

    });

}
})();
