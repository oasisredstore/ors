import puppeteer from 'puppeteer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES = [
  { title: "Home Page", url: "http://127.0.0.1:3000/en" },
  { title: "Products Marketplace", url: "http://127.0.0.1:3000/en/products" },
  { title: "Artisans Directory", url: "http://127.0.0.1:3000/en/artisans" },
  { title: "Shopping Cart", url: "http://127.0.0.1:3000/en/cart" }
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureScreenshots() {
  console.log("Démarrage du navigateur pour les captures...");
  const browser = await puppeteer.launch({ 
    headless: "new",
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe"
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const screenshots = [];

  for (let i = 0; i < PAGES.length; i++) {
    const { title, url } = PAGES[i];
    console.log(`Visite de ${title} (${url})...`);
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 120000 });
      // Attendre un peu plus pour les images et le rendu React
      await delay(6000);
      const filename = `screenshot_${i}.png`;
      const filepath = path.join(__dirname, filename);
      await page.screenshot({ path: filepath, fullPage: true });
      screenshots.push({ title, filepath });
      console.log(`Capture réussie pour ${title}`);
    } catch (e) {
      console.error(`Erreur lors de la capture de ${url}`, e.message);
    }
  }

  await browser.close();
  return screenshots;
}

async function createPDF(screenshots) {
  console.log("Création du document PDF...");
  const doc = new PDFDocument({ autoFirstPage: false, size: 'A4' });
  const pdfPath = path.join(__dirname, 'Guide_Utilisation_RedOasis.pdf');
  doc.pipe(fs.createWriteStream(pdfPath));

  for (const { title, filepath } of screenshots) {
    doc.addPage({ margin: 40 });
    doc.fontSize(22).fillColor('#b45309').text(title, { align: 'center' });
    doc.moveDown(1);
    
    // Calculate dimensions to fit nicely on A4
    doc.image(filepath, {
      fit: [515, 700], // A4 width is 595, minus 40*2 margins = 515. 
      align: 'center',
      valign: 'center'
    });
  }

  doc.end();
  console.log(`Guide généré avec succès: ${pdfPath}`);

  // Cleanup images
  screenshots.forEach(s => {
    try { fs.unlinkSync(s.filepath); } catch (e) {}
  });
}

async function main() {
  try {
    const screenshots = await captureScreenshots();
    if (screenshots.length > 0) {
      await createPDF(screenshots);
    } else {
      console.log("Aucune capture n'a pu être réalisée.");
    }
  } catch (err) {
    console.error("Erreur globale:", err);
  }
}

main();
