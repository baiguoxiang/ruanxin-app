declare const QRCode: any;

export function generateQRCode(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof QRCode !== 'undefined') {
      QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (err: any, url: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    } else {
      reject(new Error('QRCode library not loaded'));
    }
  });
}

export function drawQRCodeSimple(canvas: HTMLCanvasElement, text: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const size = 21;
  const cellSize = canvas.width / size;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const data = text.split('').map(c => c.charCodeAt(0));
  const bits: boolean[] = [];
  
  for (const byte of data) {
    for (let i = 7; i >= 0; i--) {
      bits.push(((byte >> i) & 1) === 1);
    }
  }
  
  while (bits.length < size * size - 49 * 3 - 2 * (size - 14)) {
    bits.push(Math.random() > 0.5);
  }
  
  const maskPattern = (row: number, col: number) => {
    return ((row + col) % 2 === 0);
  };
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (
        (row < 7 && col < 7) ||
        (row < 7 && col > size - 8) ||
        (row > size - 8 && col < 7) ||
        row === 6 ||
        col === 6
      ) {
        continue;
      }
      
      const dataIndex = (row * size + col) - 
        (row < 7 ? 49 : 0) - 
        (col < 7 && row >= 7 ? 7 : 0) -
        (col > size - 8 && row >= 7 ? 7 : 0) -
        (row >= 7 ? (col === 6 ? 1 : 0) : 0);
      
      let bit = bits[dataIndex % bits.length] || false;
      if (maskPattern(row, col)) {
        bit = !bit;
      }
      
      if (bit) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
  
  ctx.fillStyle = '#000000';
  
  const drawFinder = (x: number, y: number) => {
    ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  };
  
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);
  
  ctx.fillStyle = '#000000';
  for (let i = 7; i < size - 7; i++) {
    if (i % 2 === 0) {
      ctx.fillRect(6 * cellSize, i * cellSize, cellSize, cellSize);
      ctx.fillRect(i * cellSize, 6 * cellSize, cellSize, cellSize);
    }
  }
}
