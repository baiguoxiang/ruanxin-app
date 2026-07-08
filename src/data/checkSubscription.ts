export default function () {
  const freeTrialEndTime = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  return {
    isMember: true,
    type: 'free_trial' as const,
    expireTime: freeTrialEndTime.toISOString(),
    isFreeTrial: true
  };
}