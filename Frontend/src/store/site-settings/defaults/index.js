import { generalDefaults } from './generalDefaults';
import { homeDefaults } from './homeDefaults';
import { catalogDefaults } from './catalogDefaults';
import { megaMenuDefaults } from './megaMenuDefaults';
import { checkoutCartDefaults } from './checkoutCartDefaults';
import { customerExperienceDefaults } from './customerExperienceDefaults';
import { cmsDefaults } from './cmsDefaults';

/**
 * Combined default site settings values
 */
export const DEFAULTS = {
  ...generalDefaults,
  ...homeDefaults,
  ...catalogDefaults,
  ...megaMenuDefaults,
  ...checkoutCartDefaults,
  ...customerExperienceDefaults,
  ...cmsDefaults,
};

export {
  generalDefaults,
  homeDefaults,
  catalogDefaults,
  megaMenuDefaults,
  checkoutCartDefaults,
  customerExperienceDefaults,
  cmsDefaults,
};
