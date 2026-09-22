/**
 * Core constants and enums for the Spatial Intelligence Layer
 */

export const SpatialStatus = {
  NORMAL: 'NORMAL',
  UNUSUAL: 'UNUSUAL', // Route deviation
  ATTENTION_REQUIRED: 'ATTENTION_REQUIRED', // Outside configured safe area
  UNAVAILABLE: 'UNAVAILABLE' // Phone-left-behind or signal lost
};

export const LocationSource = {
  GPS: 'GPS',
  WEARABLE: 'WEARABLE',
  CAMERA: 'CAMERA',
  BLE: 'BLE',
  WIFI: 'WIFI',
  MANUAL: 'MANUAL'
};

export const PlaceCategory = {
  HOME: 'HOME',
  PARK: 'PARK',
  WORSHIP: 'WORSHIP',
  SHOP: 'SHOP',
  CLINIC: 'CLINIC',
  RELATIVE: 'RELATIVE',
  OTHER: 'OTHER'
};
