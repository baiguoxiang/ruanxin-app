const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../dist/images');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function createIcon(size) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7B68EE;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9B8AFE;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#grad1)" />
  <text x="50" y="62" font-size="45" font-family="Arial, sans-serif" fill="white" text-anchor="middle" font-weight="bold">暖</text>
</svg>`;
  return svg;
}

const sizes = [192, 512];
sizes.forEach(size => {
  const svgContent = createIcon(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.svg`), svgContent);
});

console.log('Icons generated successfully!');
