import { getAdminConfig, getTrialExpireDate } from '@/utils/adminConfig';

export default function () {
  const config = getAdminConfig();
  const expireTime = getTrialExpireDate();
  
  return {
    isMember: true,
    type: 'free_trial' as const,
    expireTime: expireTime,
    isFreeTrial: true,
    trialDays: config.freeTrialDays
  };
}
