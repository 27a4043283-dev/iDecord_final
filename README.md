I. Giới thiệu
Website iDECOR được xây dựng theo mô hình Single Page Application (SPA), trong đó toàn bộ hệ thống chỉ sử dụng một trang gốc (index.html) làm điểm khởi tạo. Các nội dung của từng chức năng như Trang chủ, Sản phẩm, Giỏ hàng hay Thanh toán sẽ được tải động thông qua JavaScript mà không cần tải lại toàn bộ website.

Việc áp dụng mô hình SPA giúp tăng tốc độ chuyển trang, giảm lượng tài nguyên phải tải lại từ máy chủ và mang lại trải nghiệm sử dụng tương tự các ứng dụng hiện đại.

Cấu trúc thư mục của hệ thống được tổ chức theo hướng module hóa, trong đó mỗi chức năng được đặt trong một thư mục riêng biệt bao gồm các thành phần HTML, CSS và JavaScript tương ứng.

iDecor-main
│
├── assets
├── pages
├── index.html
├── styles.css
└── scripts.js

Trong đó:

index.html đóng vai trò là khung giao diện chung của toàn bộ website.
styles.css quản lý các thành phần giao diện dùng chung.
scripts.js đảm nhiệm điều hướng và điều khiển luồng hoạt động của hệ thống.
Thư mục pages chứa toàn bộ các chức năng của website.

II. Phân tích các file index.html, styles.css, scripts.js (3 file cốt lõi)
1. File index.html

File index.html được đặt tại thư mục gốc của dự án và là điểm khởi đầu khi người dùng truy cập website.

Khác với cách xây dựng website truyền thống, file này không chứa nội dung riêng của từng trang mà chỉ đảm nhiệm việc xây dựng các thành phần dùng chung xuyên suốt toàn bộ hệ thống.

Cụ thể, file này bao gồm:

Thanh điều hướng (Header)
Khu vực hiển thị nội dung động (Main Content)
Chân trang (Footer)

Thanh điều hướng được sử dụng để dẫn hướng người dùng tới các chức năng chính như Trang chủ, Sản phẩm, Cửa hàng, Khách hàng và Giỏ hàng.

Ở giữa giao diện là vùng:

<main id="main-content"></main>

Đây là khu vực trung tâm của mô hình SPA. Mọi nội dung của các trang con đều được tải và hiển thị tại vị trí này thông qua JavaScript.

Phần Footer chứa các thông tin giới thiệu doanh nghiệp, liên hệ và điều khoản sử dụng, đồng thời xuất hiện thống nhất trên toàn bộ website.

Có thể xem index.html như bộ khung của ngôi nhà, trong khi các trang chức năng chỉ là những nội dung được thay đổi bên trong khung đó.

2. File styles.css

File styles.css được sử dụng để xây dựng giao diện dùng chung cho toàn bộ hệ thống.

Thay vì để mỗi trang tự định nghĩa lại các thuộc tính giao diện cơ bản, toàn bộ các thành phần có tính chất lặp lại được tập trung tại file này nhằm đảm bảo tính nhất quán và thuận tiện trong quá trình bảo trì.

Nội dung chính của file bao gồm:

Chuẩn hóa giao diện

Phần đầu của file thực hiện việc reset CSS nhằm loại bỏ sự khác biệt hiển thị giữa các trình duyệt.

Hệ thống biến màu

Website sử dụng CSS Variables để quản lý màu sắc tập trung.

Ví dụ:

:root{
    --primary:#8B6B4A;
    --secondary:#C4A484;
}

Nhờ đó, khi cần thay đổi bộ nhận diện thương hiệu, nhóm chỉ cần điều chỉnh tại một vị trí duy nhất thay vì sửa toàn bộ mã nguồn.

Các thành phần dùng chung

File này định nghĩa giao diện cho:

Header
Navigation Bar
Footer
Button
Form
Responsive Layout

Nhờ cách tổ chức này, toàn bộ website duy trì được tính đồng nhất về mặt thẩm mỹ.

3. File scripts.js

Nếu index.html là bộ khung và styles.css là lớp giao diện thì scripts.js chính là trung tâm điều khiển của toàn bộ website.

File này đảm nhận ba nhiệm vụ chính:

Điều hướng hệ thống

Website sử dụng cơ chế Hash Routing.

Mỗi địa chỉ URL được ánh xạ tới một trang tương ứng thông qua đối tượng Route.

Ví dụ:

"/trang-chu": "trang-chu",
"/san-pham": "san-pham",
"/gio-hang": "gio-hang"

Khi người dùng chuyển trang, hệ thống không tải lại website mà chỉ thay đổi nội dung trong vùng main-content.

Điều này giúp tăng đáng kể tốc độ phản hồi của giao diện.

Quản lý tài nguyên động

Hàm loadPage() có nhiệm vụ:

Nạp file HTML
Nạp file CSS
Nạp file JavaScript

của từng chức năng tương ứng.

Ví dụ khi người dùng truy cập:

#/gio-hang

hệ thống sẽ tự động tìm tới:

pages/gio-hang/gio-hang.html
pages/gio-hang/gio-hang.css
pages/gio-hang/gio-hang.js

và hiển thị nội dung lên giao diện.

Nhờ đó mỗi trang được phát triển độc lập nhưng vẫn hoạt động thống nhất trong toàn bộ hệ thống.

Kết nối dữ liệu

File này cũng đóng vai trò cầu nối giữa giao diện và backend.

Thông qua biến cấu hình:

window.IDECOR.API_URL

website có thể gửi yêu cầu tới Google Apps Script để lấy dữ liệu sản phẩm hoặc thực hiện các chức năng liên quan tới tài khoản người dùng.

4. Mối Quan Hệ Giữa Các Thành Phần

Toàn bộ hệ thống được tổ chức theo mô hình phân tầng như sau:

index.html
      │
      ▼
scripts.js
      │
      ▼
pages/*
      │
      ├── html
      ├── css
      └── js

Trong đó:

index.html cung cấp khung giao diện.
scripts.js điều phối hoạt động hệ thống.
Các thư mục trong pages cung cấp chức năng cụ thể.

Khi một người dùng truy cập bất kỳ chức năng nào, luồng xử lý sẽ diễn ra theo trình tự:

Người dùng
      │
      ▼
index.html
      │
      ▼
scripts.js
      │
      ▼
Page tương ứng
      │
      ▼
Google Apps Script
      │
      ▼
Google Sheets

Nhờ cách tổ chức này, hệ thống có tính mở rộng cao, dễ bảo trì và thuận lợi trong việc bổ sung thêm các chức năng mới.

III. Phân tích pages + features
1. Chức năng Trang Chủ

Trang chủ là điểm tiếp xúc đầu tiên giữa khách hàng và hệ thống iDECOR. Đây là khu vực giới thiệu tổng quan về thương hiệu, định hướng thiết kế cũng như các sản phẩm nổi bật mà doanh nghiệp cung cấp.

Mục tiêu chính của trang chủ là tạo ấn tượng ban đầu, giúp khách hàng nhanh chóng tiếp cận các nhóm sản phẩm và các nội dung quan trọng của website.

Các chức năng chính:

Hiển thị banner giới thiệu thương hiệu.
Hiển thị danh sách sản phẩm nổi bật.
Hiển thị các danh mục nội thất chính.
Điều hướng nhanh tới các khu vực mua sắm.
Giới thiệu các ưu điểm và dịch vụ của doanh nghiệp.

Trang chủ đóng vai trò trung tâm trong việc dẫn hướng người dùng tới các chức năng khác của hệ thống.

2. Chức năng Giới Thiệu

Trang Giới thiệu cung cấp các thông tin liên quan đến doanh nghiệp, lịch sử hình thành và định hướng phát triển của thương hiệu iDECOR.

Mục đích của trang là tăng độ tin cậy đối với khách hàng trước khi thực hiện giao dịch.

Các nội dung được cung cấp bao gồm:

Thông tin doanh nghiệp.
Sứ mệnh và tầm nhìn.
Giá trị cốt lõi.
Thành tựu đạt được.
Cam kết chất lượng sản phẩm.

Chức năng này không xử lý dữ liệu mà chủ yếu phục vụ mục đích truyền thông và xây dựng thương hiệu.

3. Chức năng Danh Sách Sản Phẩm

Đây là một trong những chức năng quan trọng nhất của hệ thống.

Trang sản phẩm cho phép khách hàng tra cứu và lựa chọn các sản phẩm nội thất phù hợp với nhu cầu sử dụng.

Các chức năng chính:

Hiển thị sản phẩm

Dữ liệu sản phẩm được lấy từ hệ thống dữ liệu trung tâm thông qua API và hiển thị dưới dạng danh sách.

Lọc theo danh mục

Người dùng có thể lựa chọn các nhóm sản phẩm như:

Nội thất phòng khách
Nội thất phòng ngủ
Nội thất phòng bếp
Nội thất phòng tắm

Việc phân loại giúp khách hàng rút ngắn thời gian tìm kiếm.

Tìm kiếm sản phẩm

Hệ thống hỗ trợ tìm kiếm theo tên sản phẩm nhằm tăng khả năng tiếp cận dữ liệu.

Chuyển tới trang chi tiết

Mỗi sản phẩm đều được liên kết với trang thông tin chi tiết để người dùng có thể xem thêm thông tin trước khi mua hàng.

4. Chức năng Chi Tiết Sản Phẩm

Trang chi tiết sản phẩm cung cấp đầy đủ thông tin về một sản phẩm cụ thể.

Thông tin hiển thị bao gồm:

Hình ảnh sản phẩm.
Tên sản phẩm.
Giá bán.
Danh mục sản phẩm.
Mô tả chi tiết.
Trạng thái sản phẩm.

Ngoài việc cung cấp thông tin, trang này còn là nơi khách hàng thực hiện hành động mua hàng.

Các chức năng chính:

Thêm sản phẩm vào giỏ hàng.
Điều chỉnh số lượng sản phẩm.
Chuyển sang quy trình thanh toán.

Trang chi tiết sản phẩm đóng vai trò cầu nối giữa giai đoạn tham khảo và giai đoạn mua hàng.

5. Chức năng Giỏ Hàng

Giỏ hàng là nơi lưu trữ tạm thời các sản phẩm mà khách hàng đã lựa chọn.

Thông tin giỏ hàng được lưu trữ thông qua Local Storage của trình duyệt nhằm duy trì dữ liệu ngay cả khi người dùng tải lại trang.

Các chức năng chính:

Hiển thị sản phẩm đã chọn

Người dùng có thể xem:

Tên sản phẩm.
Số lượng.
Đơn giá.
Thành tiền.
Quản lý số lượng

Khách hàng có thể:

Tăng số lượng.
Giảm số lượng.
Xóa sản phẩm khỏi giỏ hàng.
Tính toán tổng tiền

Hệ thống tự động cập nhật:

Tổng số lượng sản phẩm.
Tổng giá trị đơn hàng.
Tiếp tục thanh toán

Sau khi hoàn tất lựa chọn, khách hàng được chuyển sang bước nhập thông tin nhận hàng.

6. Chức năng Thanh Toán

Chức năng thanh toán hỗ trợ khách hàng hoàn tất quá trình mua sắm.

Quy trình thanh toán bao gồm:

Xác nhận đơn hàng

Hiển thị:

Danh sách sản phẩm.
Số lượng.
Tổng tiền.
Nhập thông tin nhận hàng

Người dùng cần cung cấp:

Họ tên.
Số điện thoại.
Địa chỉ nhận hàng.
Ghi chú (nếu có).
Lựa chọn phương thức thanh toán

Hệ thống hỗ trợ:

Thanh toán khi nhận hàng (COD).
Chuyển khoản ngân hàng.
Ghi nhận đơn hàng

Sau khi xác nhận, hệ thống lưu thông tin đơn hàng và chuẩn bị cho quá trình xử lý phía doanh nghiệp.

7. Chức năng Đăng Ký Tài Khoản

Chức năng đăng ký cho phép người dùng tạo tài khoản mới để sử dụng các dịch vụ của hệ thống.

Thông tin cần cung cấp:

Họ và tên.
Email.
Mật khẩu.

Sau khi đăng ký thành công, dữ liệu được gửi tới hệ thống Google Apps Script và lưu trữ trong Google Sheets.

Mục đích:

Quản lý khách hàng.
Đồng bộ thông tin người dùng.
Hỗ trợ các chức năng cá nhân hóa.
8. Chức năng Đăng Nhập

Chức năng đăng nhập cho phép người dùng truy cập tài khoản đã đăng ký.

Quy trình xử lý:

Người dùng nhập email và mật khẩu.
Hệ thống gửi yêu cầu xác thực tới backend.
Backend kiểm tra dữ liệu trong Google Sheets.
Nếu hợp lệ, thông tin người dùng được lưu vào Local Storage.

Sau khi đăng nhập thành công, giao diện sẽ hiển thị tên khách hàng thay cho nút đăng nhập.

9. Chức năng Quên Mật Khẩu

Chức năng này hỗ trợ người dùng khôi phục quyền truy cập tài khoản trong trường hợp quên mật khẩu.

Người dùng cung cấp email đã đăng ký.

Hệ thống kiểm tra sự tồn tại của tài khoản và thực hiện quy trình cập nhật mật khẩu theo quy tắc được xây dựng trên Google Apps Script.

10. Chức năng Đổi Mật Khẩu

Chức năng cho phép người dùng thay đổi mật khẩu sau khi đăng nhập.

Quá trình thực hiện gồm:

Xác thực mật khẩu hiện tại.
Nhập mật khẩu mới.
Xác nhận mật khẩu mới.

Sau khi cập nhật thành công, dữ liệu sẽ được đồng bộ lên hệ thống lưu trữ tài khoản.

11. Chức năng Thông Tin Khách Hàng

Trang thông tin khách hàng cho phép người dùng xem và quản lý các thông tin cá nhân đã lưu trên hệ thống.

Các thông tin được hiển thị:

Họ tên.
Email.
Số điện thoại.
Địa chỉ.

Mục tiêu của chức năng này là hỗ trợ khách hàng quản lý hồ sơ cá nhân phục vụ cho các lần mua hàng tiếp theo.

12. Chức năng Khách Hàng

Trang Khách hàng được xây dựng nhằm tăng tính tin cậy của thương hiệu thông qua việc giới thiệu các phản hồi, đánh giá hoặc các dự án đã thực hiện.

Các nội dung thường bao gồm:

Nhận xét của khách hàng.
Hình ảnh công trình thực tế.
Đánh giá chất lượng dịch vụ.

Chức năng này đóng vai trò hỗ trợ marketing và xây dựng uy tín doanh nghiệp.

13. Chức năng Cửa Hàng

Trang Cửa hàng cung cấp thông tin liên hệ và địa điểm hoạt động của doanh nghiệp.

Thông tin hiển thị gồm:

Địa chỉ showroom.
Số điện thoại liên hệ.
Email hỗ trợ.
Bản đồ vị trí.

Chức năng này giúp khách hàng dễ dàng tiếp cận doanh nghiệp thông qua các kênh trực tiếp.

14. Chức năng Điều Khoản Dịch Vụ

Trang Điều khoản dịch vụ trình bày các quy định áp dụng trong quá trình sử dụng website và mua sắm sản phẩm.

Nội dung bao gồm:

Quy định mua bán.
Chính sách đổi trả.
Chính sách bảo hành.
Chính sách bảo mật thông tin.

Trang này có ý nghĩa pháp lý và giúp bảo vệ quyền lợi của cả khách hàng lẫn doanh nghiệp.