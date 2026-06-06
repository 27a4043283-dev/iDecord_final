(function () {
    const BASE_TOTAL = 100;
    const BASE_AVG = 4.9;
    const BASE_POSITIVE = "100%";

    let feedbacks = [];
    
    const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Đặng", "Bùi"];
    const dem = ["Thị", "Văn", "Minh", "Thu", "Hồng", "Khánh", "Anh", "Đức", "Bích", "Phương"];
    const ten = ["Mai Anh", "Thanh Huyền", "Bích Ngọc", "Tuyết Mai", "Minh Thư", "Khánh Linh", "Hồng Nhung", "Phương Thảo", "Thu Trang", "Diễm My"];
    
    const jobs = ["Chủ căn hộ Vinhomes", "Chủ biệt thự liền kề", "Thiết kế nội thất", "Căn hộ Studio", "Chủ nhà phố tân cổ điển"];
    const tags = ["Căn hộ cao cấp", "Thi công trọn gói", "Khách hàng thân thiết", "Nhà phố / Biệt thự"];
    
    const comments = [
        "Sản phẩm hoàn thiện thực tế sắc nét, nước sơn láng mịn hoàn hảo và không hề có mùi độc hại. Rất đáng tiền!",
        "Rất hài lòng với tiến độ lắp đặt căn hộ, đội ngũ kỹ sư bàn giao khít khao tỉ mỉ. Tối ưu hóa công năng phòng khách rất thông minh.",
        "Hệ tủ âm tường và bàn ăn nguyên tấm cực kỳ tinh tế, tạo điểm nhấn ấm cúng cho cả nhà. Đường may nệm da cũng khéo léo.",
        "Sự lựa chọn đúng đắn cho không gian sống sang trọng. Đội ngũ tư vấn nhiệt tình, tận tâm chỉnh sửa từng chi tiết nhỏ theo đúng ý nguyện.",
        "Đường nét hoàn thiện tinh xảo khéo léo, vật liệu cao cấp chuẩn xuất khẩu. Tiến độ bàn giao cực kỳ chuẩn xác.",
        "Form dáng sản phẩm sang trọng vô cùng, bố trí nội thất khoa học giúp nhà rộng rãi hẳn ra. Sẽ tiếp tục ủng hộ trong các công trình tới."
    ];

    // Ngân hàng ảnh chụp không gian nội thất ngang tỉ lệ chuẩn chữ nhật ngắn
    const thumbs = [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
        "https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=600&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
    ];

    for (let i = 1; i <= 100; i++) {
        const name = ho[i % ho.length] + " " + dem[(i * 2) % dem.length] + " " + ten[i % ten.length];
        feedbacks.push({
            id: i,
            name: name,
            job: jobs[i % jobs.length],
            tag: tags[i % tags.length],
            avatar: "",
            thumb: thumbs[i % thumbs.length],
            rating: (i % 12 === 0) ? 4 : 5,
            comment: comments[i % comments.length]
        });
    }

    let visibleCount = 8;
    let addedCount = 0;
    let addedStarsSum = 0;

    function getTargetGrid() {
        return document.getElementById("feedbackList");
    }

    function updateStats() {
        const total = BASE_TOTAL + addedCount;
        let avg = BASE_AVG;
        if (addedCount > 0) {
            avg = ((BASE_TOTAL * BASE_AVG) + addedStarsSum) / total;
        }
        document.getElementById("totalFeedbacks").innerText = total;
        document.getElementById("averageRating").innerText = Number(avg).toFixed(1);
        document.getElementById("fiveStarPercent").innerText = BASE_POSITIVE;
    }

    function renderFeedbacks() {
        const grid = getTargetGrid();
        if (!grid) return;

        const currentShow = feedbacks.slice(0, visibleCount);
        if (grid.children.length === currentShow.length) return;

        grid.innerHTML = "";
        currentShow.forEach(item => {
            const stars = "★".repeat(item.rating) + "☆".repeat(5 - item.rating);
            const avatarHTML = `<div class="yenhoa-avatar">${item.name.charAt(0).toUpperCase()}</div>`;

            const card = document.createElement("div");
            card.className = "yenhoa-card";
            card.innerHTML = `
                <div class="yenhoa-thumb-wrapper">
                    <img src="${item.thumb}" class="yenhoa-thumb-img" alt="Thực tế">
                </div>
                <div class="yenhoa-card-body">
                    <div class="yenhoa-rating">${stars}</div>
                    <div class="yenhoa-user-info">
                        ${avatarHTML}
                        <div class="yenhoa-user-text">
                            <h3>${item.name}</h3>
                            <p class="customer-job">${item.job}</p>
                        </div>
                    </div>
                    <p class="yenhoa-comment">"${item.comment}"</p>
                    <div class="yenhoa-tag-wrapper">
                        <span class="yenhoa-tag">${item.tag}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        const btn = document.getElementById("loadMoreBtn");
        if (btn) {
            btn.style.display = (visibleCount >= feedbacks.length) ? "none" : "inline-flex";
        }
    }

    function initEvents() {
        const btn = document.getElementById("loadMoreBtn");
        if (btn && !btn.dataset.hooked) {
            btn.dataset.hooked = "true";
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                visibleCount += 8;
                renderFeedbacks();
            });
        }

        const form = document.getElementById("idecor-feedback-form");
        if (form && !form.dataset.hooked) {
            form.dataset.hooked = "true";
            form.addEventListener("submit", function (e) {
                e.preventDefault();

                const nameVal = document.getElementById("fb-name").value.trim();
                const jobVal = document.getElementById("fb-job").value.trim();
                const thumbVal = document.getElementById("fb-thumb").value.trim() || thumbs[0];
                const tagVal = document.getElementById("fb-type").value;
                const starsVal = parseInt(document.getElementById("fb-stars").value);
                const contentVal = document.getElementById("fb-content").value.trim();

                feedbacks.unshift({
                    id: Date.now(),
                    name: nameVal,
                    job: jobVal,
                    tag: tagVal,
                    avatar: "",
                    thumb: thumbVal,
                    rating: starsVal,
                    comment: contentVal
                });

                addedCount++;
                addedStarsSum += starsVal;
                visibleCount++;

                renderFeedbacks();
                updateStats();

                alert("Gửi đánh giá thành công!");
                form.reset();
            });
        }
    }

    function runEngine() {
        renderFeedbacks();
        updateStats();
        initEvents();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", runEngine);
    } else {
        runEngine();
    }
    setInterval(renderFeedbacks, 400);
})();