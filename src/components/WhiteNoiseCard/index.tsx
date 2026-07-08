import React, { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Card from '@/components/Card';
import styles from './index.module.scss';

interface Noise {
  id: string;
  title: string;
  icon: string;
  category: string;
}

const noiseCategories = ['自然', '环境', '舒缓'];

const noises: Noise[] = [
  { id: 'rain', title: '雨声', icon: '🌧️', category: '自然' },
  { id: 'thunder', title: '雷雨', icon: '⛈️', category: '自然' },
  { id: 'birds', title: '鸟鸣', icon: '🐦', category: '自然' },
  { id: 'ocean', title: '海浪', icon: '🌊', category: '自然' },
  { id: 'forest', title: '森林', icon: '🌲', category: '自然' },
  { id: 'fire', title: '篝火', icon: '🔥', category: '自然' },
  { id: 'wind', title: '风声', icon: '🌬️', category: '自然' },
  { id: 'stream', title: '溪流', icon: '💧', category: '自然' },
  { id: 'cafe', title: '咖啡馆', icon: '☕', category: '环境' },
  { id: 'library', title: '图书馆', icon: '📚', category: '环境' },
  { id: 'white', title: '白噪音', icon: '🔊', category: '舒缓' },
  { id: 'pink', title: '粉噪音', icon: '🌸', category: '舒缓' },
];

export default function WhiteNoiseCard() {
  const [activeCategory, setActiveCategory] = useState('自然');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [nodes, setNodes] = useState<AudioNode[]>([]);

  const filteredNoises = noises.filter(n => n.category === activeCategory);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const createWhiteNoise = (ctx: AudioContext): AudioBufferSourceNode => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  const createPinkNoise = (ctx: AudioContext): AudioBufferSourceNode => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.90000 * b3 + white * 0.3104856;
      b4 = 0.65000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  const playRainSound = (ctx: AudioContext) => {
    const noise = createWhiteNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.25;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    
    setNodes(prev => [...prev, noise, filter, gain]);
  };

  const playThunderSound = (ctx: AudioContext) => {
    const playRumble = () => {
      const noise = createPinkNoise(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 3);
      
      setNodes(prev => [...prev, noise, filter, gain]);
    };
    
    playRumble();
    setInterval(() => {
      if (playingId === 'thunder') {
        playRumble();
      }
    }, 8000 + Math.random() * 10000);
    
    const rainNoise = createWhiteNoise(ctx);
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'highpass';
    rainFilter.frequency.value = 1000;
    
    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.15;
    
    rainNoise.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(ctx.destination);
    rainNoise.start();
    
    setNodes(prev => [...prev, rainNoise, rainFilter, rainGain]);
  };

  const playBirdsSound = (ctx: AudioContext) => {
    const playChirp = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const baseFreq = 2000 + Math.random() * 1500;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(baseFreq + 500, ctx.currentTime + 0.05);
      osc.frequency.linearRampToValueAtTime(baseFreq - 300, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      
      setNodes(prev => [...prev, osc, gain]);
    };
    
    const scheduleChirps = () => {
      playChirp();
      if (Math.random() > 0.5) {
        setTimeout(playChirp, 100 + Math.random() * 200);
      }
      if (playingId === 'birds') {
        setTimeout(scheduleChirps, 500 + Math.random() * 2000);
      }
    };
    
    scheduleChirps();
    
    const ambient = createPinkNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.05;
    
    ambient.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    ambient.start();
    
    setNodes(prev => [...prev, ambient, filter, gain]);
  };

  const playOceanSound = (ctx: AudioContext) => {
    const noise = createPinkNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
    lfo.start();
    
    setNodes(prev => [...prev, noise, filter, lfo, lfoGain, gain]);
  };

  const playForestSound = (ctx: AudioContext) => {
    const windNoise = createPinkNoise(ctx);
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 400;
    
    const windLfo = ctx.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.value = 0.05;
    
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 200;
    
    const windGain = ctx.createGain();
    windGain.gain.value = 0.15;
    
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);
    windNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(ctx.destination);
    
    windNoise.start();
    windLfo.start();
    
    setNodes(prev => [...prev, windNoise, windFilter, windLfo, windLfoGain, windGain]);
    
    const playBird = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const baseFreq = 1500 + Math.random() * 1000;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(baseFreq + 200, ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      
      setNodes(prev => [...prev, osc, gain]);
    };
    
    const scheduleBirds = () => {
      if (Math.random() > 0.7) playBird();
      if (playingId === 'forest') {
        setTimeout(scheduleBirds, 1000 + Math.random() * 3000);
      }
    };
    scheduleBirds();
  };

  const playFireSound = (ctx: AudioContext) => {
    const noise = createPinkNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.25;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    
    setNodes(prev => [...prev, noise, filter, gain]);
    
    const playCrackle = () => {
      const crackleNoise = createWhiteNoise(ctx);
      const crackleFilter = ctx.createBiquadFilter();
      crackleFilter.type = 'bandpass';
      crackleFilter.frequency.value = 2000;
      crackleFilter.Q.value = 1;
      
      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0, ctx.currentTime);
      crackleGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
      crackleGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      crackleNoise.connect(crackleFilter);
      crackleFilter.connect(crackleGain);
      crackleGain.connect(ctx.destination);
      crackleNoise.start();
      crackleNoise.stop(ctx.currentTime + 0.1);
      
      setNodes(prev => [...prev, crackleNoise, crackleFilter, crackleGain]);
    };
    
    const scheduleCrackles = () => {
      if (Math.random() > 0.5) playCrackle();
      if (playingId === 'fire') {
        setTimeout(scheduleCrackles, 50 + Math.random() * 200);
      }
    };
    scheduleCrackles();
  };

  const playWindSound = (ctx: AudioContext) => {
    const noise = createPinkNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 200;
    filter.Q.value = 1;
    
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.03;
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 150;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.2;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
    lfo.start();
    
    setNodes(prev => [...prev, noise, filter, lfo, lfoGain, gain]);
  };

  const playStreamSound = (ctx: AudioContext) => {
    const noise = createWhiteNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 500;
    
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 2;
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.25;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
    lfo.start();
    
    setNodes(prev => [...prev, noise, filter, lfo, lfoGain, gain]);
  };

  const playCafeSound = (ctx: AudioContext) => {
    const noise = createPinkNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 0.5;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.15;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    
    setNodes(prev => [...prev, noise, filter, gain]);
    
    const playCup = () => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1);
      
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      
      setNodes(prev => [...prev, osc, oscGain]);
    };
    
    const scheduleCups = () => {
      if (Math.random() > 0.85) playCup();
      if (playingId === 'cafe') {
        setTimeout(scheduleCups, 200 + Math.random() * 1000);
      }
    };
    scheduleCups();
  };

  const playLibrarySound = (ctx: AudioContext) => {
    const noise = createPinkNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.08;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    
    setNodes(prev => [...prev, noise, filter, gain]);
    
    const playPage = () => {
      const pageNoise = createWhiteNoise(ctx);
      const pageFilter = ctx.createBiquadFilter();
      pageFilter.type = 'bandpass';
      pageFilter.frequency.value = 1000;
      pageFilter.Q.value = 0.5;
      
      const pageGain = ctx.createGain();
      pageGain.gain.setValueAtTime(0, ctx.currentTime);
      pageGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
      pageGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      pageNoise.connect(pageFilter);
      pageFilter.connect(pageGain);
      pageGain.connect(ctx.destination);
      pageNoise.start();
      pageNoise.stop(ctx.currentTime + 0.2);
      
      setNodes(prev => [...prev, pageNoise, pageFilter, pageGain]);
    };
    
    const schedulePages = () => {
      if (Math.random() > 0.95) playPage();
      if (playingId === 'library') {
        setTimeout(schedulePages, 500 + Math.random() * 3000);
      }
    };
    schedulePages();
  };

  const playNoise = (noise: Noise) => {
    if (playingId === noise.id) {
      stopAudio();
      return;
    }

    stopAudio();

    const ctx = new AudioContext();
    setAudioContext(ctx);

    switch (noise.id) {
      case 'rain':
        playRainSound(ctx);
        break;
      case 'thunder':
        playThunderSound(ctx);
        break;
      case 'birds':
        playBirdsSound(ctx);
        break;
      case 'ocean':
        playOceanSound(ctx);
        break;
      case 'forest':
        playForestSound(ctx);
        break;
      case 'fire':
        playFireSound(ctx);
        break;
      case 'wind':
        playWindSound(ctx);
        break;
      case 'stream':
        playStreamSound(ctx);
        break;
      case 'cafe':
        playCafeSound(ctx);
        break;
      case 'library':
        playLibrarySound(ctx);
        break;
      case 'white': {
        const source = createWhiteNoise(ctx);
        const gain = ctx.createGain();
        gain.gain.value = 0.3;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
        setNodes(prev => [...prev, source, gain]);
        break;
      }
      case 'pink': {
        const source = createPinkNoise(ctx);
        const gain = ctx.createGain();
        gain.gain.value = 0.3;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
        setNodes(prev => [...prev, source, gain]);
        break;
      }
    }

    setPlayingId(noise.id);
  };

  const stopAudio = () => {
    nodes.forEach(node => {
      try {
        if ('stop' in node) {
          (node as AudioBufferSourceNode | OscillatorNode).stop();
        }
        node.disconnect();
      } catch (e) {}
    });
    setNodes([]);
    
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    setPlayingId(null);
  };

  const currentNoise = noises.find(n => n.id === playingId);

  return (
    <Card className={styles.noiseCard} padding="lg">
      <View className={styles.cardHeader}>
        <Text className={styles.cardIcon}>🎵</Text>
        <Text className={styles.cardTitle}>白噪音</Text>
      </View>

      <View className={styles.categoryTabs}>
        {noiseCategories.map(category => (
          <Button
            key={category}
            className={`${styles.categoryTab} ${activeCategory === category ? styles.active : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </View>

      <View className={styles.noiseGrid}>
        {filteredNoises.map(noise => (
          <Button
            key={noise.id}
            className={`${styles.noiseItem} ${playingId === noise.id ? styles.playing : ''}`}
            onClick={() => playNoise(noise)}
          >
            <Text className={styles.noiseIcon}>{noise.icon}</Text>
            <Text className={styles.noiseTitle}>{noise.title}</Text>
            <Text className={styles.noiseCategory}>{noise.category}</Text>
            {playingId === noise.id && (
              <View className={styles.playingIndicator}>
                <Text></Text>
                <Text></Text>
                <Text></Text>
              </View>
            )}
          </Button>
        ))}
      </View>

      {currentNoise && (
        <View className={styles.playingBar}>
          <Text className={styles.playingText}>正在播放：{currentNoise.icon} {currentNoise.title}</Text>
          <Button className={styles.stopButton} onClick={stopAudio}>
            ⏹️
          </Button>
        </View>
      )}
    </Card>
  );
}
