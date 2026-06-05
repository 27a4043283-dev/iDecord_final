// ======================
// CONFIG
// ======================

const API_URL =
    "YOUR_GOOGLE_APPS_SCRIPT_URL";

// ======================
// STATE
// ======================

let allFeedbacks = [];
let currentPage = 1;
const feedbacksPerPage = 6;

// ======================
// DOM
// ======================

const feedbackList =
    document.getElementById("feedbackList");

const totalFeedbacks =
    document.getElementById("totalFeedbacks");

const averageRating =
    document.getElementById("averageRating");

const fiveStarPercent =
    document.getElementById("fiveStarPercent");

const loadMoreBtn =
    document.getElementById("loadMoreBtn");

// ======================
// INIT
// ======================

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadFeedbacks();
    }
);

// ======================
// LOAD FEEDBACKS
// ======================

async function loadFeedbacks() {
    try {
        const response = await fetch(
            `${API_URL}?action=getFeedbacks`
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message ||
                    "Không thể tải feedback"
            );
        }

        allFeedbacks = result.data || [];

        allFeedbacks.sort(
            (a, b) =>
                new Date(b.CreatedAt) -
                new Date(a.CreatedAt)
        );

        updateStatistics();

        renderFeedbacks();

        toggleLoadMoreButton();
    } catch (error) {
        console.error(error);

        feedbackList.innerHTML = `
            <p class="empty-message">
                Không thể tải đánh giá khách hàng.
            </p>
        `;
    }
}

// ======================
// STATISTICS
// ======================

function updateStatistics() {
    const total = allFeedbacks.length;

    const ratingSum = allFeedbacks.reduce(
        (sum, item) =>
            sum + Number(item.Rating || 0),
        0
    );

    const average =
        total > 0
            ? (ratingSum / total).toFixed(1)
            : "0.0";

    const positiveCount =
        allFeedbacks.filter(
            (item) => Number(item.Rating) >= 4
        ).length;

    const positivePercent =
        total > 0
            ? Math.round(
                  (positiveCount / total) * 100
              )
            : 0;

    totalFeedbacks.textContent = total;

    averageRating.textContent = average;

    fiveStarPercent.textContent =
        `${positivePercent}%`;
}

// ======================
// RENDER
// ======================

function renderFeedbacks() {
    const endIndex =
        currentPage * feedbacksPerPage;

    const feedbacks =
        allFeedbacks.slice(0, endIndex);

    feedbackList.innerHTML = feedbacks
        .map(createFeedbackCard)
        .join("");
}

// ======================
// CARD
// ======================

function createFeedbackCard(item) {
    const userName =
        item.UserName || "Khách hàng";

    const avatar =
        userName.charAt(0).toUpperCase();

    const rating =
        Number(item.Rating) || 0;

    const stars =
        "⭐".repeat(rating);

    const date = formatDate(
        item.CreatedAt
    );

    return `
        <div class="feedback-card">

            <div class="feedback-header">

                <div class="feedback-avatar">
                    ${avatar}
                </div>

                <div class="feedback-user">
                    <h3>${userName}</h3>

                    <div class="feedback-rating">
                        ${stars}
                    </div>
                </div>

            </div>

            <p class="feedback-comment">
                ${item.Comment || ""}
            </p>

            <span class="feedback-date">
                ${date}
            </span>

        </div>
    `;
}

// ======================
// FORMAT DATE
// ======================

function formatDate(dateString) {
    if (!dateString) return "";

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "vi-VN"
    );
}

// ======================
// LOAD MORE
// ======================

loadMoreBtn?.addEventListener(
    "click",
    () => {
        currentPage++;

        renderFeedbacks();

        toggleLoadMoreButton();
    }
);

// ======================
// BUTTON STATE
// ======================

function toggleLoadMoreButton() {
    const displayed =
        currentPage *
        feedbacksPerPage;

    if (
        displayed >=
        allFeedbacks.length
    ) {
        loadMoreBtn.style.display =
            "none";
    } else {
        loadMoreBtn.style.display =
            "inline-block";
    }
}