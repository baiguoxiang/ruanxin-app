const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;

    const result = await db.collection('favorites')
      .where({ _openid: openid })
      .orderBy('createTime', 'desc')
      .get();

    return { code: 0, message: 'success', data: { favorites: result.data } };
  } catch (err) {
    console.error('[getUserFavorites] error:', err);
    return { code: -1, message: err.message || '服务异常', data: null };
  }
};