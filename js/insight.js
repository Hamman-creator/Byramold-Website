document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       SANITY CONFIGURATION
       ======================================== */

    const SANITY_PROJECT_ID = "jopbcynw";
    const SANITY_DATASET = "production";
    const SANITY_API_VERSION = "2026-09-28";

    const SANITY_BASE_URL =
        `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;


    /* ========================================
       ELEMENTS
       ======================================== */

    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    const featuredSection = document.getElementById("featured-section");
    const featuredInsight = document.getElementById("featured-insight");

    const insightsGrid = document.getElementById("insights-grid");
    const emptyState = document.getElementById("empty-state");

    const categoryButtons =
        document.querySelectorAll(".category-button");

    const whatsappButton =
        document.getElementById("whatsapp-button");

    const currentYear =
        document.getElementById("current-year");


    /* ========================================
       HEADER SCROLL
       ======================================== */

    function updateHeader() {
        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader);


    /* ========================================
       MOBILE NAVIGATION
       ======================================== */

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mainNav.classList.toggle("open");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            header?.classList.toggle(
                "menu-open",
                isOpen
            );

        });


        mainNav.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("open");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                header?.classList.remove("menu-open");

            });

        });


        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {

                mainNav.classList.remove("open");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                header?.classList.remove("menu-open");

            }

        });


        window.addEventListener("resize", () => {

            if (window.innerWidth >= 900) {

                mainNav.classList.remove("open");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                header?.classList.remove("menu-open");

            }

        });

    }


    /* ========================================
       HELPERS
       ======================================== */

    function escapeHTML(value = "") {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function formatCategory(category = "") {

        const categories = {
            agriculture: "Agriculture",
            investment: "Investment",
            business: "Business",
            technology: "Technology",
            partnerships: "Partnerships",
            company: "Company Updates"
        };

        return categories[category] || category;

    }


    function formatDate(dateString) {

        if (!dateString) {
            return "Byramold Insights";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Byramold Insights";
        }

        return new Intl.DateTimeFormat(
            "en-KE",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        ).format(date);

    }


    function articleURL(slug) {

        return `article.html?slug=${encodeURIComponent(slug)}`;

    }


    /* ========================================
       SANITY QUERY
       ======================================== */

    async function getInsights() {

        const query = `
            *[
                _type == "insight" &&
                defined(slug.current)
            ]
            | order(publishedAt desc) {
                _id,
                title,
                "slug": slug.current,
                category,
                summary,
                author,
                publishedAt,
                featured,
                "imageUrl": featuredImage.asset->url,
                "imageAlt": featuredImage.alt
            }
        `;

        const url =
            `${SANITY_BASE_URL}?query=${encodeURIComponent(query)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Sanity request failed: ${response.status}`
            );
        }

        const data = await response.json();

        return Array.isArray(data.result)
            ? data.result
            : [];

    }


    /* ========================================
       FEATURED INSIGHT
       ======================================== */

    function renderFeaturedInsight(article) {

        if (!featuredInsight || !featuredSection) {
            return;
        }


        if (!article) {

            featuredSection.style.display = "none";
            return;

        }


        featuredSection.style.display = "";


        const title = escapeHTML(article.title);
        const summary = escapeHTML(article.summary);
        const category = escapeHTML(
            formatCategory(article.category)
        );

        const slug = articleURL(article.slug);

        const imageUrl = article.imageUrl
            ? escapeHTML(article.imageUrl)
            : "";

        const imageAlt = escapeHTML(
            article.imageAlt ||
            article.title ||
            "Byramold Insight"
        );

        const date = escapeHTML(
            formatDate(article.publishedAt)
        );


        const imageMarkup = imageUrl
            ? `
                <div class="featured-image">
                    <img
                        src="${imageUrl}"
                        alt="${imageAlt}"
                        loading="lazy">
                </div>
            `
            : `
                <div class="featured-image insight-placeholder">
                    <span>BYRAMOLD</span>
                </div>
            `;


        featuredInsight.innerHTML = `

            ${imageMarkup}

            <div class="featured-content">

                <div class="article-meta">

                    <span class="article-category">
                        ${category}
                    </span>

                    <span class="meta-divider">
                        •
                    </span>

                    <span>
                        ${date}
                    </span>

                </div>

                <h2>
                    ${title}
                </h2>

                <p>
                    ${summary}
                </p>

                <a
                    href="${slug}"
                    class="text-link">

                    Read Insight

                    <span aria-hidden="true">
                        →
                    </span>

                </a>

            </div>
        `;

    }


    /* ========================================
       INSIGHT CARD
       ======================================== */

    function createInsightCard(article) {

        const card =
            document.createElement("article");

        card.className = "insight-card";

        card.dataset.category =
            article.category || "";


        const title =
            escapeHTML(article.title);

        const summary =
            escapeHTML(article.summary);

        const category =
            escapeHTML(
                formatCategory(article.category)
            );

        const url =
            articleURL(article.slug);

        const imageUrl =
            article.imageUrl
                ? escapeHTML(article.imageUrl)
                : "";

        const imageAlt =
            escapeHTML(
                article.imageAlt ||
                article.title ||
                "Byramold Insight"
            );


        const imageMarkup = imageUrl
            ? `
                <a
                    href="${url}"
                    class="insight-image">

                    <img
                        src="${imageUrl}"
                        alt="${imageAlt}"
                        loading="lazy">

                </a>
            `
            : `
                <a
                    href="${url}"
                    class="insight-placeholder">

                    <span>
                        BYRAMOLD
                    </span>

                </a>
            `;


        card.innerHTML = `

            ${imageMarkup}

            <div class="insight-content">

                <span class="article-category">
                    ${category}
                </span>

                <h3>

                    <a href="${url}">
                        ${title}
                    </a>

                </h3>

                <p>
                    ${summary}
                </p>

                <a
                    href="${url}"
                    class="text-link">

                    Read Insight

                    <span aria-hidden="true">
                        →
                    </span>

                </a>

            </div>
        `;


        return card;

    }


    /* ========================================
       RENDER INSIGHTS
       ======================================== */

    function renderInsights(articles) {

        if (!insightsGrid) {
            return;
        }


        insightsGrid.innerHTML = "";


        if (!articles.length) {

            if (emptyState) {
                emptyState.style.display = "block";
            }

            if (featuredSection) {
                featuredSection.style.display = "none";
            }

            return;

        }


        if (emptyState) {
            emptyState.style.display = "none";
        }


        /*
         * Use the newest article marked
         * "Featured Insight".
         *
         * If none is marked featured,
         * use the newest published article.
         */

        const featuredArticle =
            articles.find(
                (article) => article.featured === true
            ) || articles[0];


        renderFeaturedInsight(featuredArticle);


        /*
         * We still display all published
         * articles in Latest Insights,
         * including the featured article.
         */

        articles.forEach((article) => {

            const card =
                createInsightCard(article);

            insightsGrid.appendChild(card);

        });

    }


    /* ========================================
       CATEGORY FILTERS
       ======================================== */

    function filterInsights(category) {

        if (!insightsGrid) {
            return;
        }


        const cards =
            insightsGrid.querySelectorAll(
                ".insight-card"
            );


        let visibleCount = 0;


        cards.forEach((card) => {

            const cardCategory =
                card.dataset.category;

            const shouldShow =
                category === "all" ||
                cardCategory === category;


            card.style.display =
                shouldShow ? "" : "none";


            if (shouldShow) {
                visibleCount++;
            }

        });


        if (emptyState) {

            emptyState.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";

        }

    }


    categoryButtons.forEach((button) => {

        button.addEventListener("click", () => {

            categoryButtons.forEach((item) => {
                item.classList.remove("active");
            });


            button.classList.add("active");


            const category =
                button.dataset.category || "all";


            filterInsights(category);

        });

    });


    /* ========================================
       LOAD SANITY CONTENT
       ======================================== */

    async function initialiseInsights() {

        try {

            const articles =
                await getInsights();

            renderInsights(articles);

        } catch (error) {

            console.error(
                "Unable to load Byramold Insights:",
                error
            );


            if (insightsGrid) {
                insightsGrid.innerHTML = "";
            }


            if (featuredSection) {
                featuredSection.style.display =
                    "none";
            }


            if (emptyState) {

                emptyState.style.display =
                    "block";

                const heading =
                    emptyState.querySelector("h3");

                const paragraph =
                    emptyState.querySelector("p");


                if (heading) {
                    heading.textContent =
                        "Insights Unavailable";
                }


                if (paragraph) {
                    paragraph.textContent =
                        "We couldn't load the latest insights right now. Please try again shortly.";
                }

            }

        }

    }


    initialiseInsights();


    /* ========================================
       WHATSAPP
       ======================================== */

    if (whatsappButton) {

        

        const whatsappNumber =
            "254704317265";

        const whatsappMessage =
            "Hello Byramold Investments, I would like to discuss an opportunity.";


        whatsappButton.href =
            `https://wa.me/${whatsappNumber}` +
            `?text=${encodeURIComponent(whatsappMessage)}`;

    }


    /* ========================================
       CURRENT YEAR
       ======================================== */

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

});