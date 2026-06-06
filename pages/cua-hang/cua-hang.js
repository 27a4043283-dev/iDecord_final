(() => {
    document.addEventListener('click', function (e) {
    const target = e.target;

    // 1. XỬ LÝ NÚT XEM BẢN ĐỒ (HIỂN THỊ NGAY TẠI TRANG)
    if (target.classList && target.classList.contains('btn-map')) {
        e.preventDefault(); // Ngăn chặn mọi hành vi nhảy trang
        
        const card = target.closest('.branch-card');
        if (!card) return;

        // BẬT MÍ: Hãy thay các link dưới đây bằng link "Nhúng bản đồ" (Thẻ src trong iframe) thật của bạn trên Google Maps nhé!
        const realMapUrls = {
            "0": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1147656687406!2d105.83296637596956!3d21.028083887799563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab993510e1cb%3A0x6338b813bf69db00!2zMjUgTmd1eeG7headIEtodXnhur9uLCDEkOG7kW5nIMSQYSwgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1717600000000!5m2!1svi!2s", // Hà Nội
            "1": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.452345678901!2d106.680123456789!3d20.856123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjIgVHLhuqduIFBowwosIE5nbyBRdXnhu4FuLCBI4bqjaSBQaMOYbmc!5e0!3m2!1svi!2s!4v1717600000000!5m2!1svi!2s", // Hải Phòng
            "2": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.34523456789!2d107.570123456789!3d16.466123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTggTMSqIEh1w6JuLCBUaHXhuq1uIEjDsmEsIFRQLkh14bq_!5e0!3m2!1svi!2s!4v1717600000000!5m2!1svi!2s", // Huế
            "3": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.84523456789!2d108.210123456789!3d16.066123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTUwIE5ndXnhu4VuIFbEg24gTGluaCwgxJDDoCBO4bq1bmc!5e0!3m2!1svi!2s!4v1717600000000!5m2!1svi!2s", // Đà Nẵng
            "4": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.44523456789!2d106.690123456789!3d10.776123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOTIgTMSqIEzhu6NpLCBRdeG6rW4gMSwgVFAuSENN!5e0!3m2!1svi!2s!4v1717600000000!5m2!1svi!2s" // TP.HCM
        };

        const mapContainer = document.querySelector('.map-container');
        const mapTitle = document.getElementById('current-map-title');
        const branchCards = document.querySelectorAll('.branch-card');

        // Đổi trạng thái Active cho Card được chọn nhằm đổi CSS (viền, màu...)
        if (branchCards) {
            branchCards.forEach(c => c.classList.remove('active'));
        }
        card.classList.add('active');

        // Lấy data và cập nhật iframe bản đồ tại chỗ
        const mapIndex = card.getAttribute('data-map');
        const branchName = card.querySelector('h3') ? card.querySelector('h3').innerText : '';
        const selectedMapUrl = realMapUrls[mapIndex];

        if (selectedMapUrl && mapContainer) {
            // Thay đổi ruột của map-container bằng Iframe mới
            mapContainer.innerHTML = `<iframe id="live-store-map" src="${selectedMapUrl}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
            
            if (mapTitle) {
                mapTitle.innerText = 'Bản Đồ Showroom: ' + branchName;
            }
            
            // Cuộn màn hình nhẹ nhàng xuống khu vực bản đồ để người dùng nhìn thấy luôn
            const mapSection = document.querySelector('.map-section');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    // 2. XỬ LÝ NÚT CHỈ ĐƯỜNG (MỞ TAB MỚI SANG GOOGLE MAPS ĐỂ ĐI ĐƯỜNG)
    if (target.classList && target.classList.contains('btn-dir')) {
        e.preventDefault();
        
        const card = target.closest('.branch-card');
        if (!card) return;

        const destinationAddress = card.getAttribute('data-dir');
        if (destinationAddress) {
            const googleNavigationUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destinationAddress);
            window.open(googleNavigationUrl, '_blank');
        }
    }
});
})();