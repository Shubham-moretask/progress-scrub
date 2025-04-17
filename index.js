





// //Text -solution
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const puppeteer = require('puppeteer');

// async function scrapeWebsite(url) {
//     try {
//         // Launch browser (for JavaScript-rendered pages)
//         const browser = await puppeteer.launch({ headless: 'new' });
//         const page = await browser.newPage();
//         await page.goto(url, { waitUntil: 'networkidle2' });
//         const html = await page.content();
//         await browser.close();

        
//         const $ = cheerio.load(html);
        
//         // Extract data
//         const title = $('title').text().trim();
        
//         // Extract all headings (h1-h6)
//         const headings = [];
//         $('h1, h2, h3, h4, h5, h6').each((i, el) => {
//             headings.push({
//                 level: el.name,
//                 text: $(el).text().trim()
//             });
//         });
        
//         // Extract paragraphs
//         const paragraphs = [];
//         $('p').each((i, el) => {
//             paragraphs.push($(el).text().trim());
//         });
        
//         // Extract links
//         const links = [];
//         $('a').each((i, el) => {
//             const href = $(el).attr('href');
//             if (href && !href.startsWith('javascript:')) {
//                 links.push({
//                     text: $(el).text().trim(),
//                     href: href
//                 });
//             }
//         });
        
//         // Prepare text content
//         let textContent = `=== Scraped Data from: ${url} ===\n\n`;
//         textContent += `Page Title: ${title}\n\n`;
        
//         textContent += '=== HEADINGS ===\n';
//         headings.forEach(h => {
//             textContent += `${h.level.toUpperCase()}: ${h.text}\n`;
//         });
        
//         textContent += '\n=== PARAGRAPHS ===\n';
//         paragraphs.forEach(p => {
//             textContent += `${p}\n\n`;
//         });
        
//         textContent += '\n=== LINKS ===\n';
//         links.forEach(l => {
//             textContent += `TEXT: ${l.text}\nURL: ${l.href}\n\n`;
//         });
        
//         // Generate filename
//         const domain = new URL(url).hostname.replace('www.', '');
//         const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//         const filename = `scraped_${domain}_${timestamp}.txt`;
        
//         // Save to file
//         fs.writeFileSync(filename, textContent);
//         console.log(`Data saved to ${filename}`);
        
//         return { success: true, filename };
//     } catch (error) {
//         console.error('Error scraping website:', error);
//         return { success: false, error: error.message };
//     }
// }

// // Get URL from command line
// const url = process.argv[2];
// if (!url) {
//     console.log('Usage: node scraper.js <URL>');
//     process.exit(1);
// }

// // Run the scraper
// scrapeWebsite(url)
//     .then(result => {
//         if (result.success) {
//             console.log(`Successfully scraped data from ${url}`);
//             console.log(`Saved to file: ${result.filename}`);
//         } else {
//             console.error('Scraping failed:', result.error);
//         }
//     });








// const express = require('express');
// const puppeteer = require('puppeteer');
// const cheerio = require('cheerio');

// const app = express();
// const PORT = process.env.PORT || 6000;

// async function scrapeWebsite(url) {
//     try {
//         const browser = await puppeteer.launch({ headless: 'new' });
//         const page = await browser.newPage();
//         await page.goto(url, { waitUntil: 'networkidle2' });
//         const html = await page.content();
//         await browser.close();

//         const $ = cheerio.load(html);

//         const title = $('title').text().trim();

//         const headings = [];
//         $('h1, h2, h3, h4, h5, h6').each((i, el) => {
//             headings.push({
//                 level: el.name,
//                 text: $(el).text().trim(),
//             });
//         });

//         const paragraphs = [];
//         $('p').each((i, el) => {
//             paragraphs.push($(el).text().trim());
//         });

//         const links = [];
//         $('a').each((i, el) => {
//             const href = $(el).attr('href');
//             if (href && !href.startsWith('javascript:')) {
//                 links.push({
//                     text: $(el).text().trim(),
//                     href: href,
//                 });
//             }
//         });

//         return {
//             success: true,
//             data: {
//                 url,
//                 title,
//                 headings,
//                 paragraphs,
//                 links,
//             },
//         };
//     } catch (error) {
//         console.error('Error scraping website:', error);
//         return { success: false, error: error.message };
//     }
// }

// // API Endpoint: /scrape?url=https://example.com
// app.get('/scrape', async (req, res) => {
//     const url = req.query.url;
//     if (!url) {
//         return res.status(400).json({ success: false, message: 'URL parameter is required.' });
//     }

//     const result = await scrapeWebsite(url);
//     if (result.success) {
//         res.json(result.data);
//     } else {
//         res.status(500).json({ success: false, error: result.error });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Scraper API running at http://localhost:${PORT}`);
// });



//final
const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 6000;

async function scrapeWebsite(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: null,
            executablePath:"/usr/bin/google-chrome-stable"
        });

        const page = await browser.newPage();

        // Optional: Set a higher timeout and user-agent
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36');
        await page.setDefaultNavigationTimeout(60000); // 60 seconds

        try {
            // Try with full wait
            await page.goto(url, { waitUntil: 'networkidle2' });
        } catch (err) {
            console.warn("networkidle2 timed out. Trying again with 'domcontentloaded'...");
            // Retry with lighter wait condition
            await page.goto(url, { waitUntil: 'domcontentloaded' });
        }

        const html = await page.content();
        const $ = cheerio.load(html);

        const title = $('title').text().trim();

        const headings = [];
        $('h1, h2, h3, h4, h5, h6').each((i, el) => {
            headings.push({
                level: el.name,
                text: $(el).text().trim(),
            });
        });

        const paragraphs = [];
        $('p').each((i, el) => {
            paragraphs.push($(el).text().trim());
        });

        const links = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && !href.startsWith('javascript:')) {
                links.push({
                    text: $(el).text().trim(),
                    href: href,
                });
            }
        });

        return {
            success: true,
            data: {
                url,
                title,
                headings,
                paragraphs,
                links,
            },
        };
    } catch (error) {
        console.error('Error scraping website:', error);
        return { success: false, error: error.message };
    } finally {
        if (browser) await browser.close();
    }
}

app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ success: false, message: 'URL parameter is required.' });
    }

    const result = await scrapeWebsite(url);
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(500).json({ success: false, error: result.error });
    }
});

app.listen(PORT, () => {
    console.log(`Scraper API running at http://localhost:${PORT}`);
});
