const fs = require("fs");
const path = require("path");

/* ========================================
   BYRAMOLD SITEMAP GENERATOR
   ======================================== */

const SITE_URL = "https://byramoldinvestments.com";

const SANITY_PROJECT_ID = "jopbcynw";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2026-09-28";

const SANITY_QUERY_URL =
    `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/` +
    `v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;


/* ========================================
   STATIC WEBSITE PAGES
   ======================================== */

const staticPages = [
    {
        url: "/",
        changefreq: "monthly",
        priority: "1.0"
    },
    {
        url: "/about.html",
        changefreq: "monthly",
        priority: "0.8"
    },
    {
        url: "/services.html",
        changefreq: "monthly",
        priority: "0.9"
    },
    {
        url: "/partners.html",
        changefreq: "monthly",
        priority: "0.9"
    },
    {
        url: "/insight.html",
        changefreq: "weekly",
        priority: "0.8"
    },
    {
        url: "/contact.html",
        changefreq: "monthly",
        priority: "0.7"
    }
];


/* ========================================
   XML ESCAPING
   ======================================== */

function escapeXML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");

}


/* ========================================
   GET PUBLISHED SANITY INSIGHTS
   ======================================== */

async function getPublishedInsights() {

    const query = `
        *[
            _type == "insight" &&
            defined(slug.current)
        ]
        | order(publishedAt desc) {
            "slug": slug.current,
            publishedAt,
            _updatedAt
        }
    `;


    const requestURL =
        `${SANITY_QUERY_URL}` +
        `?query=${encodeURIComponent(query)}`;


    console.log(
        "Retrieving published Insights from Sanity..."
    );


    const response =
        await fetch(requestURL);


    if (!response.ok) {

        throw new Error(
            `Sanity request failed: ${response.status} ${response.statusText}`
        );

    }


    const data =
        await response.json();


    if (!Array.isArray(data.result)) {
        return [];
    }


    return data.result.filter(
        (article) =>
            article &&
            article.slug
    );

}


/* ========================================
   FORMAT LAST MODIFIED DATE
   ======================================== */

function formatLastModified(dateValue) {

    if (!dateValue) {
        return null;
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return null;
    }


    return date
        .toISOString()
        .split("T")[0];

}


/* ========================================
   BUILD STATIC PAGE XML
   ======================================== */

function createStaticPageXML(page) {

    return `    <url>
        <loc>${escapeXML(
            SITE_URL + page.url
        )}</loc>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;

}


/* ========================================
   BUILD ARTICLE XML
   ======================================== */

function createArticleXML(article) {

    const articleURL =
        `${SITE_URL}/article.html?slug=` +
        encodeURIComponent(
            article.slug
        );


    const lastModified =
        formatLastModified(
            article._updatedAt ||
            article.publishedAt
        );


    let xml = `    <url>
        <loc>${escapeXML(articleURL)}</loc>`;


    if (lastModified) {

        xml += `
        <lastmod>${lastModified}</lastmod>`;

    }


    xml += `
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`;


    return xml;

}


/* ========================================
   GENERATE SITEMAP
   ======================================== */

async function generateSitemap() {

    try {

        const insights =
            await getPublishedInsights();


        console.log(
            `Found ${insights.length} published Insight(s).`
        );


        const staticXML =
            staticPages
                .map(createStaticPageXML)
                .join("\n\n");


        const articleXML =
            insights
                .map(createArticleXML)
                .join("\n\n");


        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${staticXML}`;


        if (articleXML) {

            sitemap += `

${articleXML}`;

        }


        sitemap += `

</urlset>
`;


        const sitemapPath =
            path.join(
                process.cwd(),
                "sitemap.xml"
            );


        fs.writeFileSync(
            sitemapPath,
            sitemap,
            "utf8"
        );


        console.log(
            "sitemap.xml generated successfully."
        );


        console.log(
            `Total URLs: ${
                staticPages.length +
                insights.length
            }`
        );


    } catch (error) {

        console.error(
            "Unable to generate sitemap:",
            error
        );


        process.exit(1);

    }

}


/* ========================================
   RUN
   ======================================== */

generateSitemap();