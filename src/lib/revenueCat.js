import { Purchases } from "@revenuecat/purchases-js";

const API_KEY = "test_BUFkCaXRgczWzbTcbAImIKXWVwj";
const ENTITLEMENT_ID = "Vocalyrics Pro";

let _instance = null;

/**
 * Configure RevenueCat once. Pass the app user's unique ID (e.g. their email or Base44 user id).
 * Falls back to an anonymous ID if no userId is provided.
 */
export function configureRevenueCat(userId) {
  if (_instance) return _instance;
  const appUserId = userId || Purchases.generateRevenueCatAnonymousAppUserId();
  _instance = Purchases.configure({ apiKey: API_KEY, appUserId });
  return _instance;
}

export function getRevenueCat() {
  if (!_instance) throw new Error("RevenueCat not configured. Call configureRevenueCat() first.");
  return _instance;
}

/** Returns the current customer info object */
export async function getCustomerInfo() {
  return getRevenueCat().getCustomerInfo();
}

/** Returns true if the customer has an active "Vocalyrics Pro" entitlement */
export async function checkIsProUser() {
  const info = await getCustomerInfo();
  return !!info.entitlements.active[ENTITLEMENT_ID];
}

/** Fetches current offerings from RevenueCat */
export async function getOfferings() {
  return getRevenueCat().getOfferings();
}

/**
 * Purchase a package.
 * @param {object} rcPackage - A package object from offerings.current.availablePackages
 * @param {string} email - Customer's email (used as purchase option)
 */
export async function purchasePackage(rcPackage, email) {
  const purchaseOption = rcPackage.webBillingProduct?.defaultPurchaseOption;
  return getRevenueCat().purchase({
    rcPackage,
    purchaseOption,
    ...(email ? { customerEmail: email } : {}),
  });
}

/**
 * Opens the RevenueCat Web Billing management portal for the current customer.
 */
export async function manageSubscription() {
  return getRevenueCat().showManageSubscriptions();
}

export { ENTITLEMENT_ID };