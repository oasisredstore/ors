const fs = require('fs');
const path = require('path');

const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="; // A 1x1 transparent/black pixel
const iconBuffer = Buffer.from(base64Png, 'base64');

const dir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'icon-192x192.png'), iconBuffer);
fs.writeFileSync(path.join(dir, 'icon-512x512.png'), iconBuffer);
console.log("Icons created!");
