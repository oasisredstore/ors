import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const VISITED = new Set<string>();
const TO_VISIT = ['/ar', '/en'];
const ERRORS: { url: string; type: string; message: string }[] = [];
const BROKEN_LINKS: { source: string; target: string; status: number }[] = [];
const PAGE_LOADS: { url: string; time: number }[] = [];

async function crawl() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true, executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      ERRORS.push({ url: page.url(), type: msg.type(), message: msg.text() });
    }
  });

  page.on('pageerror', err => {
    ERRORS.push({ url: page.url(), type: 'pageerror', message: err.message });
  });

  let pagesCrawled = 0;
  const MAX_PAGES = 15;

  while (TO_VISIT.length > 0 && pagesCrawled < MAX_PAGES) {
    const currentPath = TO_VISIT.shift()!;
    if (VISITED.has(currentPath)) continue;
    VISITED.add(currentPath);

    const fullUrl = `${BASE_URL}${currentPath}`;
    console.log(`Visiting (${pagesCrawled + 1}/${MAX_PAGES}): ${fullUrl}`);
    
    try {
      const startTime = Date.now();
      const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
      const loadTime = Date.now() - startTime;
      
      PAGE_LOADS.push({ url: currentPath, time: loadTime });

      if (response && !response.ok()) {
        BROKEN_LINKS.push({ source: 'Crawler', target: currentPath, status: response.status() });
        continue;
      }

      const hrefs = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors.map(a => a.getAttribute('href')).filter(href => href && href.startsWith('/'));
      });

      for (const href of hrefs) {
        if (href && !VISITED.has(href) && !TO_VISIT.includes(href)) {
          TO_VISIT.push(href);
        }
      }
      
      pagesCrawled++;
    } catch (err: any) {
      console.error(`Error visiting ${fullUrl}:`, err.message);
      ERRORS.push({ url: fullUrl, type: 'navigation_error', message: err.message });
    }
  }

  await browser.close();

  let md = `# Automated Crawler Report\n\n`;
  md += `## Summary\n`;
  md += `- Pages Crawled: ${pagesCrawled}\n`;
  md += `- Total Errors/Warnings: ${ERRORS.length}\n`;
  md += `- Broken Links: ${BROKEN_LINKS.length}\n\n`;

  md += `## Console Errors & Warnings\n`;
  if (ERRORS.length > 0) {
    // Only show unique errors to prevent massive logs
    const uniqueErrors = new Set();
    ERRORS.forEach(e => {
      const key = `${e.type}:${e.message}`;
      if (!uniqueErrors.has(key)) {
        uniqueErrors.add(key);
        md += `- **[${e.type.toUpperCase()}]** on \`${e.url.replace(BASE_URL, '')}\`: ${e.message}\n`;
      }
    });
  } else {
    md += `*No console errors found!*\n`;
  }
  md += `\n`;

  md += `## Broken Links\n`;
  if (BROKEN_LINKS.length > 0) {
    BROKEN_LINKS.forEach(b => {
      md += `- \`${b.target}\` returned status **${b.status}**\n`;
    });
  } else {
    md += `*No broken links found!*\n`;
  }
  md += `\n`;

  md += `## Performance (Top 5 Slowest Pages)\n`;
  const sortedLoads = [...PAGE_LOADS].sort((a, b) => b.time - a.time).slice(0, 5);
  sortedLoads.forEach(p => {
    md += `- \`${p.url}\`: ${p.time}ms\n`;
  });

  fs.writeFileSync(path.join(__dirname, 'crawler_results.json'), JSON.stringify({ md }));
  console.log('Crawling finished. Results saved to scratch/crawler_results.json');
}

crawl().catch(console.error);
