import { accountDefaults } from './accountDefaults';
import { lovelistDefaults } from './lovelistDefaults';
import { braSizeDefaults } from './braSizeDefaults';
import { loyaltyDefaults } from './loyaltyDefaults';
import { authVipDefaults } from './authVipDefaults';
import { engagementDefaults } from './engagementDefaults';

export const customerExperienceDefaults = {
  ...accountDefaults,
  ...lovelistDefaults,
  ...braSizeDefaults,
  ...loyaltyDefaults,
  ...authVipDefaults,
  ...engagementDefaults,
};

export {
  accountDefaults,
  lovelistDefaults,
  braSizeDefaults,
  loyaltyDefaults,
  authVipDefaults,
  engagementDefaults,
};
