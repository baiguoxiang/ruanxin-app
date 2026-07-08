import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, Button } from '@tarojs/components';
import styles from './index.module.scss';

const colors = [
  '#FF6B6B', '#FF8E72', '#FFD93D', '#6BCB77', '#4D96FF', '#6B5B95',
  '#FF69B4', '#8B4513', '#00CED1', '#FFA500', '#9932CC', '#32CD32',
  '#FF4500', '#00BFFF', '#FF1493', '#808080', '#000000'
];

const brushSizes = [2, 4, 6, 8, 12, 16];

const STORAGE_KEY = 'doodle_canvas_data';

export default function DoodleCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FF6B6B');
  const [currentSize, setCurrentSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasHeight, setCanvasHeight] = useState(250);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const updateCanvasHeight = () => {
      const windowHeight = window.innerHeight;
      const toolbarHeight = 180;
      const headerHeight = 60;
      const padding = 40;
      const newHeight = Math.max(200, windowHeight - toolbarHeight - headerHeight - padding);
      setCanvasHeight(newHeight);
    };

    updateCanvasHeight();
    window.addEventListener('resize', updateCanvasHeight);
    return () => window.removeEventListener('resize', updateCanvasHeight);
  }, []);

  const saveToLocalStorage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();
    localStorage.setItem(STORAGE_KEY, data);
    setSaveStatus('✅ 已自动保存');
    setTimeout(() => setSaveStatus(''), 2000);
  }, []);

  const loadFromLocalStorage = useCallback(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHistory([savedData]);
        setHistoryIndex(0);
      };
      img.src = savedData;
    }
  }, []);

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(data);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    saveToLocalStorage();
  }, [history, historyIndex, saveToLocalStorage]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      saveToLocalStorage();
    };
    img.src = history[newIndex];
  }, [history, historyIndex, saveToLocalStorage]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      saveToLocalStorage();
    };
    img.src = history[newIndex];
  }, [history, historyIndex, saveToLocalStorage]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    saveHistory();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem(STORAGE_KEY);
  }, [saveHistory]);

  const exportImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `心情涂鸦_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setSaveStatus('📥 已导出图片');
    setTimeout(() => setSaveStatus(''), 2000);
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
    ctx.lineWidth = currentSize;
  }, [currentColor, currentSize, isEraser]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      saveHistory();
      setIsDrawing(false);
    }
  }, [isDrawing, saveHistory]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      loadFromLocalStorage();
    };
    
    resizeCanvas();
  }, [canvasHeight, loadFromLocalStorage]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToLocalStorage();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveToLocalStorage]);

  return (
    <View ref={containerRef} className={styles.doodleCard}>
      <View className={styles.header}>
        <Text className={styles.title}>🎨 心情涂鸦</Text>
        <Text className={styles.subtitle}>释放压力，随心创作</Text>
        {saveStatus && <Text className={styles.saveStatus}>{saveStatus}</Text>}
      </View>
      
      <View className={styles.canvasContainer} style={{ height: `${canvasHeight}px` }}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </View>
      
      <View className={styles.toolbar}>
        <View className={styles.section}>
          <Text className={styles.label}>颜色</Text>
          <View className={styles.colors}>
            {colors.map((color) => (
              <Button
                key={color}
                className={`${styles.colorBtn} ${currentColor === color && !isEraser ? styles.active : ''}`}
                style={{ backgroundColor: color, borderColor: color }}
                onClick={() => {
                  setCurrentColor(color);
                  setIsEraser(false);
                }}
              />
            ))}
          </View>
        </View>
        
        <View className={styles.section}>
          <Text className={styles.label}>笔刷</Text>
          <View className={styles.brushSizes}>
            {brushSizes.map((size) => (
              <Button
                key={size}
                className={`${styles.sizeBtn} ${currentSize === size ? styles.active : ''}`}
                onClick={() => setCurrentSize(size)}
              >
                <Text className={styles.sizePreview} style={{ width: size * 2, height: size * 2 }} />
              </Button>
            ))}
          </View>
        </View>
        
        <View className={styles.section}>
          <Text className={styles.label}>工具</Text>
          <View className={styles.tools}>
            <Button
              className={`${styles.toolBtn} ${isEraser ? styles.active : ''}`}
              onClick={() => setIsEraser(!isEraser)}
              title="橡皮擦"
            >
              🧹
            </Button>
            <Button
              className={styles.toolBtn}
              onClick={undo}
              disabled={historyIndex <= 0}
              title="撤销"
            >
              ↩️
            </Button>
            <Button
              className={styles.toolBtn}
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="重做"
            >
              ↪️
            </Button>
            <Button
              className={styles.toolBtn}
              onClick={clearCanvas}
              title="清空"
            >
              🗑️
            </Button>
            <Button
              className={`${styles.toolBtn} ${styles.saveBtn}`}
              onClick={saveToLocalStorage}
              title="保存到本地"
            >
              💾
            </Button>
            <Button
              className={`${styles.toolBtn} ${styles.exportBtn}`}
              onClick={exportImage}
              title="导出图片"
            >
              📥
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
