import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Loader2, RefreshCw, Crown, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  initRevenueCat,
  getOfferings,
  getCustomerInfo,
  purchasePackage,
  restorePurchases,
  checkProAccess,
  PRO_ENTITLEMENT,
} from "@/lib/revenuecat";

// Fallback display data for when RevenueCat offerings aren't configured yet
const FALLBACK_PRODUCTS = [
  {
    identifier: "monthly",
    packageType: "MONTHLY",
    label: "Monthly",
    price: "$6.99",
    period: "/ month",
    badge: null,
  },
  {
    identifier: "yearly",
    packageType: "ANNUAL",
    label: "Yearly",
    price: "$55.99",
    period: "/ year",
    badge: "Save 33%",
  },
  {
    identifier: "lifetime",
    packageType: "LIFETIME",
    label: "Lifetime",
    price: "$24.99",
    period: "one-time",
    badge: "Best Value",
  },
];

const PRO_FEATURES = [
  "Unlimited song library access",
  "Full synced lyrics with grammar breakdowns",
  "Advanced vocabulary flashcards",
  "Detailed mastery tracking",
  "Priority song requests",
  "Ad-free experience",
];

function PriceCard({ pkg, fallback, selected, onSelect }) {
  const label = pkg
    ? pkg.packageType === "ANNUAL"
      ? "Yearly"
      : pkg.packageType === "MONTHLY"
      ? "Monthly"
      : "Lifetime"
    : fallback.label;

  const price = pkg
    ? pkg.webBillingProduct?.currentPrice?.formattedPrice ||
      pkg.product?.priceString ||
      fallback.price
    : fallback.price;

  const period = fallback.period;
  const badge = fallback.badge;
  const isPopular = fallback.identifier === "lifetime";

  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 right-4 text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground">
          {badge}
        </span>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{period}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-foreground">{price}</p>
        </div>
      </div>
      {selected && (
        <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-primary-foreground" />
        </div>
      )}
    </button>
  );
}

export default function Pro() {
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(2); // default: Lifetime
  const [customerInfo, setCustomerInfo] = useState(null);
  const [hasPro, setHasPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    try {
      const isAuthed = await base44.auth.isAuthenticated();
      if (!isAuthed) {
        setLoading(false);
        return;
      }
      const me = await base44.auth.me();
      setUser(me);

      // Initialize RevenueCat with the user's email as their app user ID
      initRevenueCat(me.email);

      const [pkgs, info] = await Promise.all([getOfferings(), getCustomerInfo()]);
      setPackages(pkgs);
      setCustomerInfo(info);
      if (info) {
        setHasPro(PRO_ENTITLEMENT in (info.entitlements?.active || {}));
      }
    } catch (e) {
      console.error("Pro page init error", e);
    }
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }

    const pkg = packages[selectedIndex];
    if (!pkg) {
      setMessage({ type: "error", text: "Product not available. Please try again later." });
      return;
    }

    setPurchasing(true);
    setMessage(null);

    const result = await purchasePackage(pkg, user.email);

    if (result.success) {
      setCustomerInfo(result.customerInfo);
      setHasPro(PRO_ENTITLEMENT in (result.customerInfo?.entitlements?.active || {}));
      setMessage({ type: "success", text: "🎉 Welcome to VocaLyrics Pro!" });
    } else if (!result.cancelled) {
      setMessage({ type: "error", text: result.error || "Purchase failed. Please try again." });
    }

    setPurchasing(false);
  };

  const handleRestore = async () => {
    setRestoring(true);
    setMessage(null);
    const result = await restorePurchases();
    if (result.success) {
      const isPro = PRO_ENTITLEMENT in (result.customerInfo?.entitlements?.active || {});
      setHasPro(isPro);
      setCustomerInfo(result.customerInfo);
      setMessage({
        type: isPro ? "success" : "error",
        text: isPro ? "✅ Pro access restored!" : "No active Pro subscription found.",
      });
    } else {
      setMessage({ type: "error", text: result.error || "Restore failed." });
    }
    setRestoring(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Already Pro
  if (hasPro) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 glow-primary">
            <Crown className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You're Pro! 🎉</h1>
          <p className="text-muted-foreground text-sm mb-6">
            You have full access to all VocaLyrics Pro features.
          </p>
          {customerInfo && (
            <div className="bg-card border border-border rounded-2xl p-5 text-left text-sm space-y-2 mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Subscription Info</p>
              {Object.values(customerInfo.entitlements.active).map((ent) => (
                <div key={ent.identifier} className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="text-foreground font-medium capitalize">{ent.productIdentifier}</span>
                </div>
              ))}
              {customerInfo.entitlements.active[PRO_ENTITLEMENT]?.expirationDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renews</span>
                  <span className="text-foreground font-medium">
                    {new Date(customerInfo.entitlements.active[PRO_ENTITLEMENT].expirationDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleRestore}
            disabled={restoring}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 mx-auto"
          >
            <RefreshCw className={`w-3 h-3 ${restoring ? "animate-spin" : ""}`} />
            Restore purchases
          </button>
        </motion.div>
      </div>
    );
  }

  const displayPackages = packages.length > 0 ? packages : FALLBACK_PRODUCTS;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            VocaLyrics Pro
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Learn Japanese,{" "}
            <span className="text-primary text-glow">Unleashed</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Unlock the full song library, detailed lyric breakdowns, mastery tracking, and more.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-10">
          {PRO_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              {f}
            </div>
          ))}
        </div>

        {/* Pricing cards */}
        <div className="space-y-3 mb-6">
          {displayPackages.map((pkg, i) => {
            const fallback = FALLBACK_PRODUCTS.find(
              (f) =>
                f.identifier ===
                (pkg.packageType === "ANNUAL"
                  ? "yearly"
                  : pkg.packageType === "MONTHLY"
                  ? "monthly"
                  : "lifetime")
            ) || FALLBACK_PRODUCTS[i] || FALLBACK_PRODUCTS[0];

            return (
              <PriceCard
                key={pkg.identifier || i}
                pkg={packages.length > 0 ? pkg : null}
                fallback={fallback}
                selected={selectedIndex === i}
                onSelect={() => setSelectedIndex(i)}
              />
            );
          })}
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center gap-3 p-3 rounded-xl text-sm mb-4 ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              <span className="flex-1">{message.text}</span>
              <button onClick={() => setMessage(null)}>
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        {!user ? (
          <button
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:opacity-90 transition-opacity glow-primary"
          >
            Log in to Subscribe
          </button>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:opacity-90 transition-opacity glow-primary disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {purchasing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processing…
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Get VocaLyrics Pro
              </>
            )}
          </button>
        )}

        <p className="text-center text-xs text-muted-foreground mt-3">
          Secure payment · Cancel anytime
        </p>

        {/* Restore */}
        <div className="text-center mt-6">
          <button
            onClick={handleRestore}
            disabled={restoring}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${restoring ? "animate-spin" : ""}`} />
            {restoring ? "Restoring…" : "Restore previous purchase"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}