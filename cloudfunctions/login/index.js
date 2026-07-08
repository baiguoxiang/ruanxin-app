const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

const FREE_TRIAL_DAYS = 7;

const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function calculateBazi(birthDate) {
  if (!birthDate) return '';
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const yearGanIndex = (year - 4) % 10;
  const yearZhiIndex = (year - 4) % 12;
  const monthGanIndex = (yearGanIndex * 2 + month) % 10;
  const monthZhiIndex = (month + 1) % 12;
  
  const yearBazi = gan[yearGanIndex] + zhi[yearZhiIndex];
  const monthBazi = gan[monthGanIndex] + zhi[monthZhiIndex];
  
  return yearBazi + '年 ' + monthBazi + '月';
}

function getZodiac(birthDate) {
  if (!birthDate) return '';
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const index = (year - 4) % 12;
  return zodiacs[index];
}

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;

    const clientIP = event.clientIP || context.CLIENTIP || 'unknown';
    const birthDate = event.birthDate;

    const existingUser = await db.collection('users').where({ _openid: openid }).get();

    if (existingUser.data.length === 0) {
      const ipUsed = await db.collection('users')
        .where({ ip: clientIP })
        .get();

      if (ipUsed.data.length > 0) {
        return { 
          code: -1, 
          message: '该IP地址已注册过账号，请使用已注册的账号登录', 
          data: null 
        };
      }

      if (!birthDate) {
        return { 
          code: -2, 
          message: '请输入出生日期', 
          data: null 
        };
      }

      const freeTrialEndTime = new Date(Date.now() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000);
      const bazi = calculateBazi(birthDate);
      const zodiac = getZodiac(birthDate);

      await db.collection('users').add({
        data: {
          _openid: openid,
          ip: clientIP,
          birthDate,
          bazi,
          zodiac,
          createTime: db.serverDate(),
          freeTrialEndTime: freeTrialEndTime,
          hasUsedFreeTrial: true
        }
      });

      await db.collection('subscriptions').add({
        data: {
          _openid: openid,
          type: 'free_trial',
          expireTime: freeTrialEndTime,
          createTime: db.serverDate()
        }
      });

      return { 
        code: 0, 
        message: 'success', 
        data: { 
          openid,
          isNewUser: true,
          freeTrialEndTime: freeTrialEndTime.toISOString(),
          bazi,
          zodiac
        } 
      };
    }

    const user = existingUser.data[0];
    return { 
      code: 0, 
      message: 'success', 
      data: { 
        openid,
        isNewUser: false,
        freeTrialEndTime: user.freeTrialEndTime ? user.freeTrialEndTime.toISOString() : null,
        bazi: user.bazi || '',
        zodiac: user.zodiac || '',
        birthDate: user.birthDate || null
      } 
    };
  } catch (err) {
    console.error('[login] error:', err);
    return { code: -1, message: err.message || '服务异常', data: null };
  }
};