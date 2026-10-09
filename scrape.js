const fs = require('fs');
const https = require('https');
const path = require('path');

https.get('https://www.anargyaits.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const urls = new Set();
    
    const fileRegex = /(?:https?:\/\/www\.anargyaits\.com|\/)[^\s"\'\(\)]+?\.(?:png|jpg|jpeg|webp|svg)/gi;
    let fileMatch;
    while ((fileMatch = fileRegex.exec(data)) !== null) {
      let url = fileMatch[0];
      if (!url.startsWith('http')) {
        url = 'https://www.anargyaits.com' + (url.startsWith('/') ? '' : '/') + url;
      }
      urls.add(url);
    }
    
    // Using string matching to find images
    const regex = /src=["'](\/?[^"']+\.(png|jpg|jpeg|webp|svg))["']/gi;
    let match;
    while ((match = regex.exec(data)) !== null) {
      let url = match[1];
      if (!url.startsWith('http')) {
        url = 'https://www.anargyaits.com' + (url.startsWith('/') ? '' : '/') + url;
      }
      urls.add(url);
    }

    const nextjsImageRegex = /srcSet=["']([^"']+)["']/gi;
    let nextjsMatch;
    while ((nextjsMatch = nextjsImageRegex.exec(data)) !== null) {
      const srcSet = nextjsMatch[1];
      const parts = srcSet.split(',').map(s => s.trim().split(' ')[0]);
      for (const part of parts) {
         if (part) {
           let url = part;
           if (!url.startsWith('http') && !url.startsWith('/_next/image')) {
              url = 'https://www.anargyaits.com' + (url.startsWith('/') ? '' : '/') + url;
           } else if (url.startsWith('/_next/image')) {
              url = 'https://www.anargyaits.com' + url;
           }
           urls.add(url);
         }
      }
    }

    console.log("Found URLs:");
    for (const url of urls) {
      console.log(url);
    }
    
    // Download them
    const downloadDir = path.join(__dirname, 'public', 'images', 'scraped');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    let downloaded = 0;
    for (let url of urls) {
      if(url.startsWith('https://www.anargyaits.com/_next/image')) {
         // Next.js image URL, decode the url param
         const urlObj = new URL(url);
         const decoded = urlObj.searchParams.get('url');
         if (decoded) {
            url = 'https://www.anargyaits.com' + (decoded.startsWith('/') ? '' : '/') + decoded;
         }
      }
      
      const parsedUrl = new URL(url);
      const filename = path.basename(parsedUrl.pathname);
      if (!filename || filename === '/') continue;

      const dest = path.join(downloadDir, filename);
      
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('Downloaded:', filename);
          });
        } else {
            console.log('Failed:', filename, res.statusCode);
        }
      }).on('error', (err) => {
        console.error('Error downloading', filename, err.message);
      });
    }

  });
}).on('error', (err) => {
  console.error("Failed to fetch page", err);
});
