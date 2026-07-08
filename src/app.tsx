import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { AppProvider } from '@/store';
import './app.scss';

function App(props) {
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({ env: '', traceUser: true });
    }
  }, []);

  useDidShow(() => {});
  useDidHide(() => {});

  return (
    <AppProvider>
      {props.children}
    </AppProvider>
  );
}

export default App;