const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  await download('https://placehold.co/192x192/b45309/FFFFFF.png?text=RO', 'public/icons/icon-192x192.png');
  await download('https://placehold.co/512x512/b45309/FFFFFF.png?text=RO', 'public/icons/icon-512x512.png');
  console.log('Icons downloaded successfully.');
}

main();
