document.addEventListener(
    "DOMContentLoaded",
    initAboutPage
);

initAboutPage();

function initAboutPage() {

    animateCounter();

    revealOnScroll();

}

function animateCounter() {

    const counters =
        document.querySelectorAll(
            ".counter"
        );

    if (!counters.length) {
        return;
    }

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        const counter =
                            entry.target;

                        const target =
                            +counter.dataset.target;

                        let current = 0;

                        const step =
                            target / 100;

                        const timer =
                            setInterval(
                                () => {

                                    current += step;

                                    if (
                                        current >= target
                                    ) {

                                        counter.textContent =
                                            target.toLocaleString(
                                                "vi-VN"
                                            );

                                        clearInterval(
                                            timer
                                        );

                                        return;
                                    }

                                    counter.textContent =
                                        Math.floor(
                                            current
                                        ).toLocaleString(
                                            "vi-VN"
                                        );

                                },
                                20
                            );

                        observer.unobserve(
                            counter
                        );

                    }
                );

            },
            {
                threshold: 0.5
            }
        );

    counters.forEach(
        counter =>
        observer.observe(counter)
    );

}

function revealOnScroll() {

    const elements =
        document.querySelectorAll(
            ".intro-card, .member, .story-box, .timeline-item, .stat-card"
        );

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "show"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );

    elements.forEach(
        element =>
        observer.observe(element)
    );

}