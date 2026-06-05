function initTrangChuAll() {
    
    // --- 1. LOGIC NÚT XEM THÊM (KHỐI TẠP CHÍ) - FIX GIÃN DÀI MƯỢT MÀ ---
    const toggleButtons = document.querySelectorAll('.btn-readmore-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const wrapper = this.closest('.magazine-more-wrapper');
            if (!wrapper) return;
            
            const extendedContent = wrapper.querySelector('.extended-info');
            if (!extendedContent) return;
            
            if (extendedContent.classList.contains('is-open')) {
                // Thu gọn lại
                extendedContent.style.maxHeight = null;
                extendedContent.classList.remove('is-open');
                this.innerHTML = 'Xem thêm';
            } else {
                // Mở rộng động dựa trên chiều cao thực tế của nội dung văn bản bên trong
                extendedContent.classList.add('is-open');
                extendedContent.style.maxHeight = extendedContent.scrollHeight + "px";
                this.innerHTML = 'Thu gọn';
            }
        });
    });

    // --- 2. CẤU HÌNH SLIDER VÒNG LẶP VÔ TẬN - FIX KHỰNG VÀ TRƠM TRƯỢT ---
    const swiperContainer = document.querySelector('.designer-horizontal-swiper');
    if (typeof Swiper !== 'undefined' && swiperContainer) {
        // Hủy bỏ thực thể cũ một cách an toàn để tránh rò rỉ bộ nhớ khi chuyển trang SPA
        if (swiperContainer.swiper) {
            swiperContainer.swiper.destroy(true, true);
        }

        const watermarkElement = document.getElementById('dynamicWatermark');

        new Swiper('.designer-horizontal-swiper', {
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 0,
            
            // Ép cấu hình vòng lặp mượt mà không khựng hình
            loop: true,
            loopedSlides: 4,               // Đặt bằng 4 giúp vùng đệm tính toán clone chuẩn nhất
            loopAdditionalSlides: 2,
            watchSlidesProgress: true,     // Theo dõi tiến trình dịch chuyển liên tục
            convertToPopoverAnimate: true, // Đồng bộ hóa tiến trình vẽ khung hình
            
            observer: true,
            observeParents: true,
            
            speed: 600, // Tốc độ lướt mượt đồng điệu với CSS transition
            autoplay: {
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            navigation: {
                nextEl: '.designer-horizontal-section .swiper-button-next',
                prevEl: '.designer-horizontal-section .swiper-button-prev',
            },
            on: {
                init: function () {
                    updateWatermark(this, watermarkElement);
                },
                // Sử dụng slideChangeTransitionStart thay vì slideChange để watermark đổi mượt, không giật cục
                slideChangeTransitionStart: function () {
                    updateWatermark(this, watermarkElement);
                }
            }
        });
    }

    function updateWatermark(swiperInstance, watermarkElement) {
        if (!watermarkElement) return;
        
        // Trích xuất chính xác slide đang hoạt động kể cả khi đang ở slide nhân bản (clone)
        const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
        
        if (activeSlide) {
            const fullname = activeSlide.querySelector('.kts-fullname')?.textContent || '';
            const spec = activeSlide.getAttribute('data-watermark') || '';
            
            if (spec && fullname) {
                watermarkElement.style.opacity = '0';
                setTimeout(() => {
                    watermarkElement.textContent = `${spec} - ${fullname}`;
                    watermarkElement.style.opacity = '0.025'; // Tăng nhẹ độ đậm để chữ sang trọng nổi bật trên nền kem
                }, 200);
            }
        }
    }

    // --- 3. LOGIC POPUP ƯU ĐÃI: KHỚP LAYOUT CSS ĐỂ KHÔNG TỰ HIỆN ---
    const offerCards = document.querySelectorAll('.ja-card[data-promo]');
    const modalOverlay = document.getElementById('offerModal');
    const modalContent = document.getElementById('modalDynamicContent');
    const modalCloseBtn = document.querySelector('.offer-modal-close');

    if (offerCards.length > 0 && modalOverlay && modalContent) {
        offerCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.stopPropagation();
                const promoId = this.getAttribute('data-promo');
                
                // Đồng bộ cấu trúc popup-flex-wrapper để căn đều hai bên ảnh và text ấm áp
                if (promoId === 'promotion-3d') {
                    modalContent.innerHTML = `
                        <div class="popup-flex-wrapper">
                            <div class="popup-image-side" style="background-image: url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80'); flex: 1; background-size: cover; background-position: center;"></div>
                            <div class="popup-content-side">
                                <span class="card-tag-gold" style="text-transform:uppercase; display:block; margin-bottom:5px; color:#C5A880;">QUÀ TẶNG ĐẶC QUYỀN</span>
                                <h2>TẶNG GÓI THIẾT KẾ 3D TRỊ GIÁ 20 TRIỆU</h2>
                                <p>Áp dụng cho toàn bộ khách hàng đăng ký thi công nội thất trọn gói căn hộ hoặc biệt thự tại iDECOR.</p>
                                <a href="#/lien-he" class="popup-btn-action" style="text-align:center; display:block; margin-top:15px; text-decoration: none;">ĐĂNG KÝ NGAY</a>
                            </div>
                        </div>
                    `;
                } else if (promoId === 'promotion-combo') {
                    modalContent.innerHTML = `
                        <div class="popup-flex-wrapper">
                            <div class="popup-image-side" style="background-image: url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80'); flex: 1; background-size: cover; background-position: center;"></div>
                            <div class="popup-content-side">
                                <span class="card-tag-white" style="color:var(--color-navy); display:block; margin-bottom:5px; font-weight:bold;">ƯU ĐÃI MUA SẮM</span>
                                <h2>COMBO NỘI THẤT LUXURY - GIẢM 20%</h2>
                                <p>Chương trình siêu ưu đãi tri ân giảm ngay 20% khi mua sắm trọn bộ combo phòng khách tại iDECOR.</p>
                                <a href="#/lien-he" class="popup-btn-action" style="text-align:center; display:block; margin-top:15px; text-decoration: none;">NHẬN BÁO GIÁ</a>
                            </div>
                        </div>
                    `;
                } else if (promoId === 'promotion-member') {
                    modalContent.innerHTML = `
                        <div class="popup-flex-wrapper">
                            <div class="popup-image-side" style="background-image: url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'); flex: 1; background-size: cover; background-position: center;"></div>
                            <div class="popup-content-side">
                                <span class="card-tag-dark" style="display:block; margin-bottom:5px; color:var(--color-navy); font-weight:bold;">TRI ÂN KHÁCH HÀNG</span>
                                <h2>THÀNH VIÊN ELITE - LÀM MỚI MIỄN PHÍ</h2>
                                <p>Đặc quyền đỉnh cao dành riêng cho khách hàng thân thiết. Miễn phí bảo dưỡng định kỳ đồ gỗ nội thất.</p>
                                <a href="#/lien-he" class="popup-btn-action" style="text-align:center; display:block; margin-top:15px; text-decoration: none;">ĐẶT LỊCH NGAY</a>
                            </div>
                        </div>
                    `;
                }
                
                // Kích hoạt hiển thị popup bằng class được khai báo trong CSS
                modalOverlay.classList.add('is-visible');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = function() {
            modalOverlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        };

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    }
}

// Lắng nghe sự thay đổi hash của trình duyệt (Hỗ trợ Router SPA)
window.addEventListener('hashchange', function() {
    if(window.location.hash === '#/trang-chu' || window.location.hash === '') {
        setTimeout(initTrangChuAll, 150);
    }
});

// Khởi chạy an toàn tùy thuộc trạng thái DOM
if (document.readyState !== 'loading') {
    initTrangChuAll();
} else {
    document.addEventListener('DOMContentLoaded', initTrangChuAll);
}