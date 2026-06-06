// Hàm tự động nhúng file CSS của trang liên hệ vào hệ thống khi chuyển trang
function tailieuCssLienHe() {
    // Kiểm tra nếu file CSS chưa tồn tại trên hệ thống thì mới thêm vào để tránh trùng lặp
    if (!document.getElementById('idecor-contact-style')) {
        const link = document.createElement('link');
        link.id = 'idecor-contact-style';
        link.rel = 'stylesheet';
        link.href = './pages/lien-he/lien-he.css'; // Đường dẫn đến file CSS liên hệ của bạn
        document.head.appendChild(link);
    }
}

// Hàm nạp giao diện HTML của trang liên hệ vào vùng nội dung chính
async function renderContactPage() {
    const appContainer = document.getElementById('main-content'); // Khung chứa nội dung chính trong index.html
    
    if (!appContainer) return;

    try {
        // 1. Tự động nạp file CSS trước để giao diện hiển thị đẹp luôn, không bị vỡ thanh cuộn
        tailieuCssLienHe();

        // 2. Gọi file HTML của trang liên hệ
        const response = await fetch('./pages/lien-he/lien-he.html');
        if (!response.ok) throw new Error("Không tìm thấy file liên hệ");
        
        appContainer.innerHTML = await response.text();
        
        // Cuộn màn hình lên đầu trang mượt mà
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 3. Kích hoạt bộ lắng nghe sự kiện gửi Form
        setupContactFormListener();
        
    } catch (err) {
        console.error("Lỗi khi tải trang liên hệ:", err);
    }
}

// Logic xử lý khi người dùng điền thông tin và bấm nút "Gửi Tin Nhắn"
function setupContactFormListener() {
    const contactForm = document.getElementById('idecorContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const subject = document.getElementById('contactSubject').value;

            alert(`Cảm ơn ${name}!\niDECOR đã nhận được yêu cầu về "${subject}". Chúng tôi sẽ liên hệ với bạn qua số ${phone} trong giây lát.`);
            contactForm.reset();
        });
    }
}

// Bộ tự động kiểm tra URL: Nếu URL chứa '#/lien-he' thì tự động render giao diện ra màn hình
function checkAndLoadContact() {
    if (window.location.hash === '#/lien-he') {
        renderContactPage();
    }
}

// Luôn lắng nghe sự kiện thay đổi hash hoặc reload trang của trình duyệt để tự chạy
window.addEventListener('hashchange', checkAndLoadContact);
window.addEventListener('DOMContentLoaded', checkAndLoadContact);