document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       SANITY CONFIGURATION
       ======================================== */

    const SANITY_PROJECT_ID = "jopbcynw";
    const SANITY_DATASET = "production";
    const SANITY_API_VERSION = "2026-09-28";

    const SANITY_BASE_URL =
        `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;


    /* ========================================
       ELEMENTS
       ======================================== */

    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    const articleCategory =
        document.getElementById("article-category");

    const articleDate =
        document.getElementById("article-date");

    const articleTitle =
        document.getElementById("article-title");

    const articleSummary =
        document.getElementById("article-summary");

    const articleAuthor =
        document.getElementById("article-author");

    const articleImage =
        document.getElementById("article-image");

    const articleBody =
        document.getElementById("article-body");

    const relatedInsights =
        document.getElementById("related-insights");

    const shareLinkedIn =
        document.getElementById("share-linkedin");

    const shareWhatsApp =
        document.getElementById("share-whatsapp");

    const copyLinkButton =
        document.getElementById("copy-link");

    const copyMessage =
        document.getElementById("copy-message");

    const whatsappButton =
        document.getElementById("whatsapp-button");

    const currentYear =
        document.getElementById("current-year");


    /* ========================================
       GET ARTICLE SLUG
       ======================================== */

    const params =
        new URLSearchParams(window.location.search);

    const slug =
        params.get("slug");


    /* ========================================
       HEADER
       ======================================== */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader
    );


    /* ========================================
       MOBILE NAVIGATION
       ======================================== */

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mainNav.classList.toggle("open");

            menuToggle.classList.toggle(
                "active",
                isOpen
            );

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

                menuToggle.classList.remove(
                    "active"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                header?.classList.remove(
                    "menu-open"
                );

            });

        });


        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {

                    mainNav.classList.remove(
                        "open"
                    );

                    menuToggle.classList.remove(
                        "active"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    header?.classList.remove(
                        "menu-open"
                    );

                }

            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (window.innerWidth >= 900) {

                    mainNav.classList.remove(
                        "open"
                    );

                    menuToggle.classList.remove(
                        "active"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    header?.classList.remove(
                        "menu-open"
                    );

                }

            }
        );

    }


    /* ========================================
       HELPERS
       ======================================== */

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
            return "";
        }

        const date =
            new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "";
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


    function articleURL(articleSlug) {

        return (
            "article.html?slug=" +
            encodeURIComponent(articleSlug)
        );

    }


    function optimiseSanityImage(
        url,
        width = 1200
    ) {

        if (!url) {
            return "";
        }

        if (!url.includes("cdn.sanity.io")) {
            return url;
        }

        const separator =
            url.includes("?")
                ? "&"
                : "?";

        return (
            url +
            separator +
            `w=${width}&auto=format&q=80`
        );

    }


    /* ========================================
       SANITY ARTICLE QUERY
       ======================================== */

    async function getArticle(articleSlug) {

        const query = `
            *[
                _type == "insight" &&
                slug.current == $slug
            ][0] {
                _id,
                title,
                "slug": slug.current,
                category,
                summary,
                author,
                publishedAt,
                seoTitle,
                seoDescription,

                "imageUrl": featuredImage.asset->url,
                "imageAlt": featuredImage.alt,

                body[] {
                    ...,

                    _type == "image" => {
                        ...,
                        "imageUrl": asset->url
                    }
                }
            }
        `;


        const url =
            `${SANITY_BASE_URL}` +
            `?query=${encodeURIComponent(query)}` +
            `&$slug=${encodeURIComponent(JSON.stringify(articleSlug))}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Sanity request failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        return data.result;

    }


    /* ========================================
       RELATED INSIGHTS QUERY
       ======================================== */

    async function getRelatedInsights(
        currentSlug,
        category
    ) {

        const query = `
            *[
                _type == "insight" &&
                slug.current != $slug
            ]
            | order(
                category == $category desc,
                publishedAt desc
            )[0...3] {
                title,
                "slug": slug.current,
                category,
                "imageUrl": featuredImage.asset->url,
                "imageAlt": featuredImage.alt
            }
        `;


        const url =
            `${SANITY_BASE_URL}` +
            `?query=${encodeURIComponent(query)}` +
            `&$slug=${encodeURIComponent(JSON.stringify(currentSlug))}` +
            `&$category=${encodeURIComponent(JSON.stringify(category || ""))}`;


        const response =
            await fetch(url);


        if (!response.ok) {
            return [];
        }


        const data =
            await response.json();


        return Array.isArray(data.result)
            ? data.result
            : [];

    }


    /* ========================================
       PORTABLE TEXT
       ======================================== */

    function renderPortableText(blocks) {

        if (!articleBody) {
            return;
        }

        if (!Array.isArray(blocks)) {
            return;
        }


        articleBody.innerHTML = "";


        let activeList = null;
        let activeListType = null;


        function closeList() {

            activeList = null;
            activeListType = null;

        }


        blocks.forEach((block, index) => {

            /*
             * ARTICLE IMAGE
             */

            if (
                block._type === "image" &&
                block.imageUrl
            ) {

                closeList();


                const figure =
                    document.createElement("figure");

                figure.className =
                    "article-inline-image";


                const image =
                    document.createElement("img");

                image.src =
                    optimiseSanityImage(
                        block.imageUrl,
                        1000
                    );

                image.alt =
                    block.alt || "";

                image.loading =
                    "lazy";

                image.decoding =
                    "async";


                figure.appendChild(image);


                if (block.caption) {

                    const caption =
                        document.createElement(
                            "figcaption"
                        );

                    caption.textContent =
                        block.caption;

                    figure.appendChild(
                        caption
                    );

                }


                articleBody.appendChild(
                    figure
                );

                return;

            }


            if (block._type !== "block") {
                return;
            }


            /*
             * LIST ITEMS
             */

            if (block.listItem) {

                const requiredType =
                    block.listItem === "number"
                        ? "ol"
                        : "ul";


                if (
                    !activeList ||
                    activeListType !== requiredType
                ) {

                    activeList =
                        document.createElement(
                            requiredType
                        );

                    activeListType =
                        requiredType;

                    articleBody.appendChild(
                        activeList
                    );

                }


                const listItem =
                    document.createElement("li");


                appendSpans(
                    listItem,
                    block.children,
                    block.markDefs
                );


                activeList.appendChild(
                    listItem
                );

                return;

            }


            closeList();


            /*
             * REGULAR BLOCKS
             */

            let element;


            switch (block.style) {

                case "h2":

                    element =
                        document.createElement("h2");

                    break;


                case "h3":

                    element =
                        document.createElement("h3");

                    break;


                case "blockquote":

                    element =
                        document.createElement(
                            "blockquote"
                        );

                    const quoteParagraph =
                        document.createElement("p");

                    appendSpans(
                        quoteParagraph,
                        block.children,
                        block.markDefs
                    );

                    element.appendChild(
                        quoteParagraph
                    );

                    articleBody.appendChild(
                        element
                    );

                    return;


                default:

                    element =
                        document.createElement("p");


                    if (
                        index === 0 ||
                        !articleBody.querySelector("p")
                    ) {

                        element.classList.add(
                            "article-lead"
                        );

                    }

            }


            appendSpans(
                element,
                block.children,
                block.markDefs
            );


            articleBody.appendChild(
                element
            );

        });

    }


    /* ========================================
       PORTABLE TEXT SPANS
       ======================================== */

    function appendSpans(
        parent,
        children = [],
        markDefs = []
    ) {

        children.forEach((child) => {

            if (child._type !== "span") {
                return;
            }


            let node =
                document.createTextNode(
                    child.text || ""
                );


            const marks =
                Array.isArray(child.marks)
                    ? child.marks
                    : [];


            /*
             * Bold
             */

            if (marks.includes("strong")) {

                const strong =
                    document.createElement(
                        "strong"
                    );

                strong.appendChild(node);

                node = strong;

            }


            /*
             * Italic
             */

            if (marks.includes("em")) {

                const em =
                    document.createElement("em");

                em.appendChild(node);

                node = em;

            }


            /*
             * Links
             */

            marks.forEach((markKey) => {

                const definition =
                    markDefs.find(
                        (definition) =>
                            definition._key ===
                            markKey
                    );


                if (
                    definition &&
                    definition._type === "link" &&
                    definition.href
                ) {

                    const link =
                        document.createElement("a");

                    link.href =
                        definition.href;


                    if (
                        definition.href.startsWith(
                            "http"
                        )
                    ) {

                        link.target =
                            "_blank";

                        link.rel =
                            "noopener noreferrer";

                    }


                    link.appendChild(node);

                    node = link;

                }

            });


            parent.appendChild(node);

        });

    }


    /* ========================================
       DISPLAY ARTICLE
       ======================================== */

    function renderArticle(article) {

        if (!article) {
            showNotFound();
            return;
        }


        const category =
            formatCategory(
                article.category
            );


        const title =
            article.title ||
            "Byramold Insight";


        const seoTitle =
            article.seoTitle ||
            title;


        const description =
            article.seoDescription ||
            article.summary ||
            "Insights and perspectives from Byramold Investments Ltd.";


        const author =
            article.author ||
            "Byramold Investments Ltd";


        const canonicalURL =
            "https://byramoldinvestments.com/article.html?slug=" +
            encodeURIComponent(
                article.slug
            );


        const defaultImage =
            "https://byramoldinvestments.com/images/Byramold_Logo-removebg-preview.png";


        const socialImage =
            article.imageUrl ||
            defaultImage;


        /* ========================================
           DISPLAY CONTENT
           ======================================== */

        if (articleCategory) {

            articleCategory.textContent =
                category;

        }


        if (articleDate) {

            articleDate.textContent =
                formatDate(
                    article.publishedAt
                );

        }


        if (articleTitle) {

            articleTitle.textContent =
                title;

        }


        if (articleSummary) {

            articleSummary.textContent =
                article.summary ||
                description;

        }


        if (articleAuthor) {

            articleAuthor.textContent =
                author;

        }


        if (articleImage) {

            if (article.imageUrl) {

                articleImage.src =
                    optimiseSanityImage(
                        article.imageUrl,
                        1400
                    );

                articleImage.alt =
                    article.imageAlt ||
                    title;

                articleImage.decoding =
                    "async";

            } else {

                const imageSection =
                    document.querySelector(
                        ".article-image-section"
                    );

                if (imageSection) {

                    imageSection.style.display =
                        "none";

                }

            }

        }


        renderPortableText(
            article.body || []
        );


        /* ========================================
           PAGE TITLE
           ======================================== */

        document.title =
            `${seoTitle} | Byramold Investments Ltd`;


        /* ========================================
           META DESCRIPTION
           ======================================== */

        const metaDescription =
            document.getElementById(
                "meta-description"
            );


        if (metaDescription) {

            metaDescription.setAttribute(
                "content",
                description
            );

        }


        /* ========================================
           CANONICAL URL
           ======================================== */

        const canonical =
            document.getElementById(
                "canonical-url"
            );


        if (canonical) {

            canonical.setAttribute(
                "href",
                canonicalURL
            );

        }


        /* ========================================
           OPEN GRAPH
           ======================================== */

        const ogTitle =
            document.getElementById(
                "og-title"
            );

        const ogDescription =
            document.getElementById(
                "og-description"
            );

        const ogURL =
            document.getElementById(
                "og-url"
            );

        const ogImage =
            document.getElementById(
                "og-image"
            );

        const ogImageAlt =
            document.getElementById(
                "og-image-alt"
            );

        const publishedTime =
            document.getElementById(
                "article-published-time"
            );

        const articleSectionMeta =
            document.getElementById(
                "article-section-meta"
            );


        if (ogTitle) {

            ogTitle.setAttribute(
                "content",
                seoTitle
            );

        }


        if (ogDescription) {

            ogDescription.setAttribute(
                "content",
                description
            );

        }


        if (ogURL) {

            ogURL.setAttribute(
                "content",
                canonicalURL
            );

        }


        if (ogImage) {

            ogImage.setAttribute(
                "content",
                socialImage
            );

        }


        if (ogImageAlt) {

            ogImageAlt.setAttribute(
                "content",
                article.imageAlt ||
                title
            );

        }


        if (
            publishedTime &&
            article.publishedAt
        ) {

            publishedTime.setAttribute(
                "content",
                article.publishedAt
            );

        }


        if (articleSectionMeta) {

            articleSectionMeta.setAttribute(
                "content",
                category
            );

        }


        /* ========================================
           TWITTER / X
           ======================================== */

        const twitterTitle =
            document.getElementById(
                "twitter-title"
            );

        const twitterDescription =
            document.getElementById(
                "twitter-description"
            );

        const twitterImage =
            document.getElementById(
                "twitter-image"
            );

        const twitterImageAlt =
            document.getElementById(
                "twitter-image-alt"
            );


        if (twitterTitle) {

            twitterTitle.setAttribute(
                "content",
                seoTitle
            );

        }


        if (twitterDescription) {

            twitterDescription.setAttribute(
                "content",
                description
            );

        }


        if (twitterImage) {

            twitterImage.setAttribute(
                "content",
                socialImage
            );

        }


        if (twitterImageAlt) {

            twitterImageAlt.setAttribute(
                "content",
                article.imageAlt ||
                title
            );

        }


        /* ========================================
           ARTICLE STRUCTURED DATA
           ======================================== */

        const schemaElement =
            document.getElementById(
                "article-schema"
            );


        if (schemaElement) {

            const articleSchema = {

                "@context":
                    "https://schema.org",

                "@type":
                    "Article",

                headline:
                    title,

                description:
                    description,

                url:
                    canonicalURL,

                mainEntityOfPage: {

                    "@type":
                        "WebPage",

                    "@id":
                        canonicalURL

                },

                author: {

                    "@type":
                        "Organization",

                    name:
                        author

                },

                publisher: {

                    "@type":
                        "Organization",

                    name:
                        "Byramold Investments Ltd",

                    url:
                        "https://byramoldinvestments.com/",

                    logo: {

                        "@type":
                            "ImageObject",

                        url:
                            "https://byramoldinvestments.com/images/Byramold_Logo-removebg-preview.png"

                    }

                }

            };


            if (article.publishedAt) {

                articleSchema.datePublished =
                    article.publishedAt;

            }


            if (article.imageUrl) {

                articleSchema.image =
                    [
                        article.imageUrl
                    ];

            }


            if (category) {

                articleSchema.articleSection =
                    category;

            }


            schemaElement.textContent =
                JSON.stringify(
                    articleSchema
                );

        }

    }


    /* ========================================
       ARTICLE NOT FOUND
       ======================================== */

    function showNotFound() {

        document.title =
            "Insight Not Found | Byramold Investments Ltd";


        if (articleCategory) {

            articleCategory.textContent =
                "Byramold Insights";

        }


        if (articleDate) {

            articleDate.textContent =
                "";

        }


        if (articleTitle) {

            articleTitle.textContent =
                "Insight Not Found";

        }


        if (articleSummary) {

            articleSummary.textContent =
                "The insight you are looking for could not be found.";

        }


        if (articleBody) {

            articleBody.innerHTML =
                "";

            const paragraph =
                document.createElement("p");

            paragraph.textContent =
                "The article may have been removed, unpublished, or the link may be incorrect.";

            articleBody.appendChild(
                paragraph
            );

        }


        const imageSection =
            document.querySelector(
                ".article-image-section"
            );


        if (imageSection) {

            imageSection.style.display =
                "none";

        }


        /*
         * Prevent invalid/missing articles from
         * being treated as normal indexable pages.
         */

        const robots =
            document.querySelector(
                'meta[name="robots"]'
            );

        if (robots) {

            robots.setAttribute(
                "content",
                "noindex, follow"
            );

        }

    }


    /* ========================================
       RELATED INSIGHTS
       ======================================== */

    function renderRelatedInsights(articles) {

        if (!relatedInsights) {
            return;
        }


        relatedInsights.innerHTML =
            "";


        if (!articles.length) {

            const relatedSection =
                document.querySelector(
                    ".related-section"
                );


            if (relatedSection) {

                relatedSection.style.display =
                    "none";

            }


            return;

        }


        articles.forEach((article) => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "related-card";


            const url =
                articleURL(
                    article.slug
                );


            let media;


            if (article.imageUrl) {

                media =
                    document.createElement(
                        "a"
                    );

                media.href =
                    url;

                media.className =
                    "related-image";


                const image =
                    document.createElement(
                        "img"
                    );

                image.src =
                    optimiseSanityImage(
                        article.imageUrl,
                        700
                    );

                image.alt =
                    article.imageAlt ||
                    article.title ||
                    "";

                image.loading =
                    "lazy";

                image.decoding =
                    "async";


                media.appendChild(
                    image
                );

            } else {

                media =
                    document.createElement(
                        "div"
                    );

                media.className =
                    "related-placeholder";


                const brand =
                    document.createElement(
                        "span"
                    );

                brand.textContent =
                    "BYRAMOLD";


                media.appendChild(
                    brand
                );

            }


            const content =
                document.createElement(
                    "div"
                );

            content.className =
                "related-content";


            const category =
                document.createElement(
                    "span"
                );

            category.className =
                "article-category";

            category.textContent =
                formatCategory(
                    article.category
                );


            const heading =
                document.createElement(
                    "h3"
                );


            const link =
                document.createElement(
                    "a"
                );

            link.href =
                url;

            link.textContent =
                article.title;


            heading.appendChild(
                link
            );


            content.appendChild(
                category
            );

            content.appendChild(
                heading
            );


            card.appendChild(
                media
            );

            card.appendChild(
                content
            );


            relatedInsights.appendChild(
                card
            );

        });

    }


    /* ========================================
       LOAD ARTICLE
       ======================================== */

    async function initialiseArticle() {

        if (!slug) {

            showNotFound();
            return;

        }


        try {

            const article =
                await getArticle(
                    slug
                );


            if (!article) {

                showNotFound();
                return;

            }


            renderArticle(
                article
            );


            const related =
                await getRelatedInsights(
                    article.slug,
                    article.category
                );


            renderRelatedInsights(
                related
            );


        } catch (error) {

            console.error(
                "Unable to load Byramold Insight:",
                error
            );


            showNotFound();

        }

    }


    initialiseArticle();


    /* ========================================
       SHARE - LINKEDIN
       ======================================== */

    if (shareLinkedIn) {

        shareLinkedIn.addEventListener(
            "click",
            () => {

                const shareURL =
                    encodeURIComponent(
                        window.location.href
                    );


                window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${shareURL}`,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* ========================================
       SHARE - WHATSAPP
       ======================================== */

    if (shareWhatsApp) {

        shareWhatsApp.addEventListener(
            "click",
            () => {

                const text =
                    `${document.title}\n${window.location.href}`;


                window.open(
                    `https://wa.me/?text=${encodeURIComponent(text)}`,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* ========================================
       COPY LINK
       ======================================== */

    if (copyLinkButton) {

        copyLinkButton.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );


                    if (copyMessage) {

                        copyMessage.textContent =
                            "Link copied.";

                    }

                } catch (error) {

                    if (copyMessage) {

                        copyMessage.textContent =
                            "Unable to copy the link. Please copy it from your browser.";

                    }

                }


                if (copyMessage) {

                    setTimeout(
                        () => {

                            copyMessage.textContent =
                                "";

                        },
                        3000
                    );

                }

            }
        );

    }


    /* ========================================
       BYRAMOLD WHATSAPP
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