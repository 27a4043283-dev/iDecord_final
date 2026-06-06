function initTrangChuAll() {
    
    // --- 1. LOGIC NÚT XEM THÊM (KHỐI TẠP CHÍ) ---
    const toggleButtons = document.querySelectorAll('.btn-readmore-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const wrapper = this.closest('.magazine-more-wrapper');
            if (!wrapper) return;
            
            const extendedContent = wrapper.querySelector('.extended-info');
            if (!extendedContent) return;
            
            if (extendedContent.classList.contains('is-open')) {
                extendedContent.style.maxHeight = null;
                extendedContent.classList.remove('is-open');
                this.innerHTML = 'Xem thêm';
            } else {
                extendedContent.classList.add('is-open');
                extendedContent.style.maxHeight = extendedContent.scrollHeight + "px";
                this.innerHTML = 'Thu gọn';
            }
        });
    });

    // --- 2. CẤU HÌNH SLIDER VÒNG LẶP VÔ TẬN SWIPER ---
    const swiperContainer = document.querySelector('.designer-horizontal-swiper');
    if (typeof Swiper !== 'undefined' && swiperContainer) {
        if (swiperContainer.swiper) {
            swiperContainer.swiper.destroy(true, true);
        }

        const watermarkElement = document.getElementById('dynamicWatermark');

        new Swiper('.designer-horizontal-swiper', {
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 0,
            loop: true,
            loopedSlides: 4,               
            loopAdditionalSlides: 2,
            watchSlidesProgress: true,     
            convertToPopoverAnimate: true, 
            observer: true,
            observeParents: true,
            speed: 600, 
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
                slideChangeTransitionStart: function () {
                    updateWatermark(this, watermarkElement);
                }
            }
        });
    }

    function updateWatermark(swiperInstance, watermarkElement) {
        if (!watermarkElement) return;
        const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
        if (activeSlide) {
            const fullname = activeSlide.querySelector('.kts-fullname')?.textContent || '';
            const spec = activeSlide.getAttribute('data-watermark') || '';
            
            if (spec && fullname) {
                watermarkElement.style.opacity = '0';
                setTimeout(() => {
                    watermarkElement.textContent = `${spec} - ${fullname}`;
                    watermarkElement.style.opacity = '0.025'; 
                }, 200);
            }
        }
    }

    // --- 3. LOGIC POPUP ƯU ĐÃI (ĐỒNG BỘ NÚT ĐĂNG KÝ NGAY CHO CẢ 3 POPUP) ---
    const offerCards = document.querySelectorAll('.ja-card[data-promo]');
    const modalOverlay = document.getElementById('offerModal');
    const modalContent = document.getElementById('modalDynamicContent');
    const modalCloseBtn = document.querySelector('.offer-modal-close');

    // Hàm đóng modal dùng chung
    const closeModal = function() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (offerCards.length > 0 && modalOverlay && modalContent) {
        offerCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.stopPropagation();
                const promoId = this.getAttribute('data-promo');
                
                // POPUP 1: GÓI THIẾT KẾ 3D
                if (promoId === 'promotion-3d') {
                    modalContent.innerHTML = `
                        <div class="popup-flex-wrapper">
                            <div class="popup-image-side" style="background-image: url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80');"></div>
                            <div class="popup-content-side">
                                <span class="card-tag-gold" style="text-transform:uppercase; display:block; margin-bottom:5px; color:#C5A880;">QUÀ TẶNG ĐẶC QUYỀN</span>
                                <h2>TẶNG GÓI THIẾT KẾ 3D TRỊ GIÁ 20 TRIỆU</h2>
                                <p>Áp dụng cho toàn bộ khách hàng đăng ký thi công nội thất trọn gói căn hộ hoặc biệt thự tại iDECOR.</p>
                                <button class="popup-btn-action js-popup-redirect" data-target="#/lien-he" style="text-align:center; display:block; margin-top:15px; width:100%; border:none; cursor:pointer;">ĐĂNG KÝ NGAY</button>
                            </div>
                        </div>
                    `;
                // POPUP 2: COMBO NỘI THẤT LUXURY
                } else if (promoId === 'promotion-combo') {
                    modalContent.innerHTML = `
                        <div class="popup-flex-wrapper">
                            <div class="popup-image-side" style="background-image: url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80');"></div>
                            <div class="popup-content-side">
                                <span class="card-tag-gold" style="display:block; margin-bottom:5px; font-weight:bold; color:#C5A880;">ƯU ĐÃI MUA SẮM</span>
                                <h2>COMBO NỘI THẤT LUXURY - GIẢM 20%</h2>
                                <p>Chương trình siêu ưu đãi tri ân giảm ngay 20% khi mua sắm trọn bộ combo phòng khách tại iDECOR.</p>
                                <button class="popup-btn-action js-popup-redirect" data-target="#/lien-he" style="text-align:center; display:block; margin-top:15px; width:100%; border:none; cursor:pointer;">ĐĂNG KÝ NGAY</button>
                            </div>
                        </div>
                    `;
                // POPUP 3: THÀNH VIÊN ELITE
                } else if (promoId === 'promotion-member') {
                    modalContent.innerHTML = `
                        <div class="popup-flex-wrapper">
                            <div class="popup-image-side" style="background-image: url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80');"></div>
                            <div class="popup-content-side">
                                <span class="card-tag-gold" style="display:block; margin-bottom:5px; font-weight:bold; color:#C5A880;">TRI ÂN KHÁCH HÀNG</span>
                                <h2>THÀNH VIÊN ELITE - LÀM MỚI MIỄN PHÍ</h2>
                                <p>Đặc quyền đỉnh cao dành riêng cho khách hàng thân thiết. Miễn phí bảo dưỡng định kỳ đồ gỗ nội thất tại nhà.</p>
                                <button class="popup-btn-action js-popup-redirect" data-target="#/lien-he" style="text-align:center; display:block; margin-top:15px; width:100%; border:none; cursor:pointer;">ĐĂNG KÝ NGAY</button>
                            </div>
                        </div>
                    `;
                }
                
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Lắng nghe sự kiện click chung cho nút hành động vừa được tạo ra
                const redirectBtn = modalContent.querySelector('.js-popup-redirect');
                if (redirectBtn) {
                    redirectBtn.addEventListener('click', function() {
                        const targetUrl = this.getAttribute('data-target');
                        
                        // 1. Đóng popup mượt mà
                        closeModal();
                        
                        // 2. Chuyển đổi trạng thái url băm (#) kích hoạt router của app
                        window.location.hash = targetUrl;
                        
                        // 3. Cuộn mượt mà lên đầu trang liên hệ mới
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                }
            });
        });

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    }
}

// Theo dõi thay đổi Router để re-init khi cần thiết
window.addEventListener('hashchange', function() {
    if(window.location.hash === '#/trang-chu' || window.location.hash === '') {
        setTimeout(initTrangChuAll, 150);
    }
});

if (document.readyState !== 'loading') {
    initTrangChuAll();
} else {
    document.addEventListener('DOMContentLoaded', initTrangChuAll);
}