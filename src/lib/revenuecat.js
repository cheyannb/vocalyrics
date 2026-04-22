import { Purchases } from "@revenuecat/purchases-js";

const RC_API_KEY = "test_JIDymLdezvvdwQxlGuGSsmniFDJ";
const PRO_ENTITLEMENT = "Vocalyrics App Pro";

let instance = null;

/**
 * Initialize RevenueCat with a user ID.
 * Call this once after the user is authenticated.
 */
export function initRevenueCat(appUserId) {
  if (instance) return instance;
  instance = Purchases.configure({
    apiKey: RC_API_KEY,
    appUserId: appUserId,
  });
  return instance;
}

/**
 * Get the shared Purchases instance (must call initRevenueCat first).
 */
export function getPurchases() {
  return Purchases.getSharedInstance();
}

/**
 * Check if the current user has an active Pro entitlement.
 * Returns true/false.
 */
export async function checkProAccess() {
  try {
    const customerInfo = await getPurchases().getCustomerInfo();
    return PRO_ENTITLEMENT in customerInfo.entitlements.active;
  } catch (e) {
    console.error("RevenueCat: Error checking entitlement", e);
    return false;
  }
}

/**
 * Fetch current customer info.
 */
export async function getCustomerInfo() {
  try {
    return await getPurchases().getCustomerInfo();
  } catch (e) {
    console.error("RevenueCat: Error fetching customer info", e);
    return null;
  }
}

/**
 * Fetch current offerings from RevenueCat.
 * Returns the current offering's packages or [].
 */
export async function getOfferings() {
  try {
    const offerings = await getPurchases().getOfferings();
    if (offerings.current && offerings.current.availablePackages.length > 0) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (e) {
    console.error("RevenueCat: Error fetching offerings", e);
    return [];
  }
}

/**
 * Purchase a package.
 * Returns { success: true, customerInfo } or { success: false, error }
 */
export async function purchasePackage(pkg, customerEmail) {
  try {
    const result = await getPurchases().purchase({
      rcPackage: pkg,
      customerEmail: customerEmail,
    });
    return { success: true, customerInfo: result.customerInfo };
  } catch (e) {
    if (e.userCancelled) {
      return { success: false, cancelled: true };
    }
    console.error("RevenueCat: Purchase error", e);
    return { success: false, error: e.message || "Purchase failed" };
  }
}

/**
 * Restore purchases for the current user.
 */
export async function restorePurchases() {
  try {
    const customerInfo = await getPurchases().restorePurchases();
    return { success: true, customerInfo };
  } catch (e) {
    console.error("RevenueCat: Restore error", e);
    return { success: false, error: e.message || "Restore failed" };
  }
}

export { PRO_ENTITLEMENT };