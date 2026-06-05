# Đóng góp cá nhân - Nguyễn Thành Đạt

## Công việc đã thực hiện trong dự án

Trong quá trình phát triển website iDecor, tôi chịu trách nhiệm cải tiến cấu trúc mã nguồn, phát triển giao diện người dùng và tối ưu khả năng triển khai dự án.

### 1. Tái cấu trúc thư mục dự án (Refactor Project Structure)

Ban đầu dự án lưu trữ các file HTML, CSS và JavaScript theo cấu trúc phẳng, gây khó khăn trong việc quản lý và mở rộng.

Tôi đã thực hiện việc tổ chức lại toàn bộ dự án theo từng module chức năng:

```text
pages/
├── trang-chu/
├── san-pham/
├── chi-tiet-sp/
├── gio-hang/
├── thanh-toan/
├── tai-khoan/
├── gioi-thieu/
├── khach-hang/
└── cua-hang/
```

Mỗi chức năng được tách thành:

```text
ten-trang.html
ten-trang.css
ten-trang.js
```

Cách tổ chức này giúp:

* Dễ bảo trì và mở rộng.
* Tránh trùng lặp mã nguồn.
* Giúp nhiều thành viên làm việc song song mà không ảnh hưởng lẫn nhau.
* Thuận tiện khi quản lý bằng Git/GitHub.

---

### 2. Chuẩn hóa mã nguồn JavaScript

Tôi đã rà soát và sửa các lỗi phát sinh trong quá trình phát triển:

* Loại bỏ các biến khai báo trùng lặp.
* Chuẩn hóa quy tắc đặt tên biến.
* Đồng bộ tên hàm giữa các module.
* Tách riêng dữ liệu và phần xử lý giao diện.
* Giảm sự phụ thuộc giữa các file JavaScript.

Kết quả:

* Giảm lỗi runtime.
* Dễ dàng bảo trì và nâng cấp.
* Hạn chế xung đột khi merge code nhóm.

---

### 3. Phát triển các chức năng giao diện

Các module tôi trực tiếp xây dựng hoặc chỉnh sửa gồm:

#### Trang sản phẩm

* Hiển thị danh sách sản phẩm.
* Tìm kiếm sản phẩm.
* Lọc theo danh mục.
* Hiển thị dữ liệu động.

#### Trang chi tiết sản phẩm

* Hiển thị thông tin chi tiết.
* Hiển thị ảnh sản phẩm.
* Hiển thị sản phẩm liên quan.
* Chức năng mua ngay.
* Chức năng thêm vào giỏ hàng.

#### Trang giỏ hàng

* Quản lý sản phẩm đã chọn.
* Cập nhật số lượng.
* Xóa sản phẩm.
* Tính tổng tiền tự động.

#### Trang thanh toán

* Nhập thông tin khách hàng.
* Kiểm tra dữ liệu đầu vào.
* Tạo đơn hàng.

#### Trang khách hàng

* Hiển thị đánh giá khách hàng.
* Form gửi phản hồi.
* Cập nhật feedback mới lên giao diện.

---

### 4. Quản lý mã nguồn bằng Git và GitHub

Trong quá trình phát triển tôi sử dụng:

```bash
git add .
git commit -m "..."
git push
```

Mỗi chức năng được phát triển trên branch cá nhân:

```text
NguyenDat
```

Sau khi hoàn thành sẽ merge vào branch chính thông qua Pull Request nhằm đảm bảo tính ổn định của dự án.

---

## Nguyên lý hoạt động trên GitHub Pages

Dự án được triển khai bằng GitHub Pages.

### Quy trình hoạt động

1. Lập trình viên cập nhật mã nguồn lên GitHub.
2. GitHub lưu trữ mã nguồn trong repository.
3. GitHub Pages đọc nội dung từ branch được cấu hình (main hoặc gh-pages).
4. Các file tĩnh HTML, CSS và JavaScript được xuất bản thành website.
5. Người dùng truy cập website thông qua URL được GitHub cung cấp.

### Mô hình hoạt động

```text
Developer
    ↓
Git Push
    ↓
GitHub Repository
    ↓
GitHub Pages
    ↓
Website Public
```

### Đặc điểm

GitHub Pages chỉ phục vụ:

* HTML
* CSS
* JavaScript
* Hình ảnh
* File tĩnh

-link dữ liệu: https://docs.google.com/spreadsheets/d/1d5k6fgQ4NabeVkneeQqTHdH2B9sezL7XMre4AODoAMs/edit?gid=597811862#gid=597811862
Không hỗ trợ trực tiếp:

* NodeJS Server
* ExpressJS Runtime
* PHP
* Database MySQL

Do đó các chức năng backend của dự án cần được triển khai trên máy chủ riêng hoặc nền tảng khác như Render, Railway hoặc VPS.

---

## Kết quả đạt được

* Hoàn thành tái cấu trúc toàn bộ frontend.
* Chuẩn hóa quy tắc phát triển dự án.
* Xây dựng và hoàn thiện các module chính của website.
* Tối ưu khả năng làm việc nhóm bằng Git/GitHub.
* Sẵn sàng triển khai trên GitHub Pages đối với phần giao diện.
