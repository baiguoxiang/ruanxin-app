const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;

    const result = await db.collection('subscriptions')
      .where({ _openid: openid })
      .orderBy('expireTime', 'desc')
      .limit(1)
      .get();

    if (result.data.length === 0) {
      return { code: 0, message: 'success', data: { isMember: false, type: null, expireTime: null, isFreeTrial: false } };
    }

    const subscription = result.data[0];
    const now = new Date().getTime();
    const expireTime = new Date(subscription.expireTime).getTime();

    if (expireTime > now) {
      return {
        code: 0,
        message: 'success',
        data: {
          isMember: true,
          type: subscription.type,
          expireTime: subscription.expireTime,
          isFreeTrial: subscription.type === 'free_trial'
        }
      };
    }

    return { code: 0, message: 'success', data: { isMember: false, type: null, expireTime: null, isFreeTrial: false } };
  } catch (err) {
    console.error('[checkSubscription] error:', err);
    return { code: -1, message: err.message || '服务异常', data: null };
  }
};