const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;
    const { id } = event;

    if (!id) {
      return { code: -1, message: '参数错误', data: null };
    }

    await db.collection('favorites')
      .where({ _id: id, _openid: openid })
      .remove();

    return { code: 0, message: 'success', data: { success: true } };
  } catch (err) {
    console.error('[removeFavorite] error:', err);
    return { code: -1, message: err.message || '服务异常', data: null };
  }
};