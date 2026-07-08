const fs = require('fs');
const path = require('path');
const https = require('https');

const qrcodeUrl = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=WeChat%20payment%20QR%20code%20receipt%2C%20green%20gradient%20background%2C%20white%20QR%20code%20pattern%20in%20center%2C%20white%20circle%20avatar%20with%20green%20check%20mark%20in%20middle%20of%20QR%20code%2C%20text%20white%20Sail%28%2A%2A%E5%A8%A5%29%20below%20QR%20code%2C%20WeChat%20Pay%20green%20logo%20at%20bottom%2C%20Chinese%20text%20%E6%8E%A8%E8%8D%90%E4%BD%BF%E7%94%A8%E5%BE%AE%E4%BF%A1%E6%94%AF%E4%BB%98%20at%20top%2C%20professional%20payment%20code%20design%2C%20high%20quality%2C%20clear%20QR%20code&image_size=square';

const outputDir = path.join(__dirname, '../src/images');
const outputPath = path.join(outputDir, 'wechat_pay_qrcode.png');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('正在下载收款码图片...');

const file = fs.createWriteStream(outputPath);
https.get(qrcodeUrl, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    const stats = fs.statSync(outputPath);
    console.log(`收款码已下载成功: ${outputPath} (${stats.size} bytes)`);
  });
}).on('error', (err) => {
  console.error('下载失败:', err);
  process.exit(1);
});
