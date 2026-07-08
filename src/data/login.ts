export default function () {
  const freeTrialEndTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return {
    openid: 'mock_openid_' + Date.now(),
    isNewUser: true,
    freeTrialEndTime: freeTrialEndTime.toISOString()
  };
}