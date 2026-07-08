const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;
    const { type } = event;

    if (!type || (type !== 'monthly' && type !== 'yearly')) {
      return { code: -1, message: '无效的套餐类型', data: null };
    }

    const now = new Date();
    const duration = type === 'monthly' ? 30 : 365;
    const expireTime = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

    const existingSubscription = await db.collection('subscriptions')
      .where({ _openid: openid })
      .orderBy('expireTime', 'desc')
      .limit(1)
      .get();

    let finalExpireTime = expireTime;
    if (existingSubscription.data.length > 0) {
      const existingExpire = new Date(existingSubscription.data[0].expireTime).getTime();
      if (existingExpire > now.getTime()) {
        finalExpireTime = new Date(existingExpire + duration * 24 * 60 * 60 * 1000);
      }
    }

    await db.collection('subscriptions').add({
      data: {
        _openid: openid,
        type,
        expireTime: finalExpireTime,
        createTime: db.serverDate()
      }
    });

    const orderId = `ORDER_${Date.now()}_${openid.slice(-8)}`;

    return { code: 0, message: 'success', data: { orderId, type } };
  } catch (err) {
    console.error('[createOrder] error:', err);
    return { code: -1, message: err.message || '服务异常', data: null };
  }
};