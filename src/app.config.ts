export default defineAppConfig({
  version: '2.0.0',
  pages: [
    'pages/home/index',
    'pages/happy/index',
    'pages/emotion/index',
    'pages/local/index',
    'pages/mine/index',
    'pages/member/index',
    'pages/subscribe/index',
    'pages/emotional/index',
    'pages/finance/index',
    'pages/idea/index',
    'pages/doodle/index',
    'pages/pet/index',
    'pages/psytest/index',
    'pages/admin/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#7B68EE',
    navigationBarTitleText: '暖心陪伴',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FA',
    backgroundColorTop: '#E8F0FE',
    backgroundColorBottom: '#F5F7FA'
  },
  tabBar: {
    color: '#B2BEC3',
    selectedColor: '#7B68EE',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/happy/index',
        text: '开心乐园'
      },
      {
        pagePath: 'pages/emotion/index',
        text: '情感心事'
      },
      {
        pagePath: 'pages/local/index',
        text: '我的城市'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})