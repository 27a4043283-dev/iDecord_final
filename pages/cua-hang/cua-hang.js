/* Animation xuất hiện */

const cards = document.querySelectorAll(
    ".branch-card, .stat-box"
);

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },
    {
        threshold: 0.2
    }
);

cards.forEach(card => {

    observer.observe(card);

});


/* Nút tư vấn */

const consultBtn =
    document.querySelector(".btn-consult");

if(consultBtn){

    consultBtn.addEventListener(
        "click",
        e => {

            e.preventDefault();

            alert(
                "Cảm ơn bạn đã quan tâm! Chức năng đăng ký tư vấn sẽ sớm được cập nhật."
            );

        }
    );

}


/* Hiệu ứng đếm số */

const stats =
    document.querySelectorAll(".stat-box h3");

stats.forEach(stat => {

    const target =
        parseInt(
            stat.textContent.replace(/\D/g, "")
        );

    if(!target) return;

    let current = 0;

    const increment =
        Math.ceil(target / 80);

    const timer = setInterval(() => {

        current += increment;

        if(current >= target){

            current = target;

            clearInterval(timer);

        }

        if(stat.textContent.includes("+")){

            stat.textContent =
                current.toLocaleString() + "+";

        }else{

            stat.textContent = current;

        }

    },20);

});