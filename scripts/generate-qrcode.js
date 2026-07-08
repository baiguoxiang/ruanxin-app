const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const paymentData = 'https://wxpay.qq.com/cgi-bin/mmpayweb-bin/checkmch?key=white%20Sail';

const outputDir = path.join(__dirname, '../src/images');
const outputPath = path.join(outputDir, 'wechat_pay_qrcode.png');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

QRCode.toFile(outputPath, paymentData, {
  width: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
}, (err) => {
  if (err) {
    console.error('生成二维码失败:', err);
    process.exit(1);
  }
  console.log('收款码已生成:', outputPath);
});
