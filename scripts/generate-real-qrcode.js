const fs = require('fs');
const path = require('path');

const QRCode = require('qrcode');

const qrContent = 'https://wxpay.qq.com/cgi-bin/mmpayweb-bin/checkmch?key=whiteSail2026';

const outputDir = path.join(__dirname, '../src/images');
const outputPath = path.join(outputDir, 'wechat_pay_qrcode.png');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('正在生成真实收款码...');

QRCode.toFile(outputPath, qrContent, {
  width: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
}, (err) => {
  if (err) {
    console.error('生成失败:', err);
    process.exit(1);
  } else {
    const stats = fs.statSync(outputPath);
    console.log(`收款码生成成功: ${outputPath} (${stats.size} bytes)`);
  }
});
