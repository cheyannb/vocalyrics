import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Check, Loader2, Sparkles, Star, Zap, Settings } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  configureRevenueCat,
  checkIsProUser,
  getOfferings,
  purchasePackage,
  manageSubscription,
  getCustomerInfo,
} from "../lib/revenueCat";
import { toast } from "sonner";

const PRODUCT_META = {
  lifetime: {
    label: "Lifetime",
    badge: "Best Value",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    highlight: true,
    description: "One-time payment, forever access",
  },
  yearly: {
    label: "Yearly",
    badge: "Most Popular",
    badgeColor: "bg-accent/20 text-accent border-accent/30",
    highlight: false,
    description: "Billed once a year",
  },
  monthly: {
    label: "Monthly",
    badge: null,
    badgeColor: "",
    highlight: false,
    description: "Billed monthly, cancel anytime",
  },
};

const PRO_FEATURES = [
  "Unlimited song access & full lyrics breakdowns",
  "Advanced vocabulary study & spaced repetition",
  "Unlimited quiz sessions",
  "Song request priority",
  "Ad-free experience",
  "Early access to new songs & features",
];

function PriceCard({ pkg, onPurchase, purchasing }) {
  const identifier = pkg.identifier;
  const meta = PRODUCT_META[identifier] || { label: identifier, description: "" };
  const product = pkg.webBillingProduct || pkg.product;
  const price = product?.currentPrice
    ? `$${(product.currentPrice.amountMicros / 1_000_000).toFixed(2)}`
    : "—";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-2xl border p-6 flex flex-col gap-4 cursor-pointer transition-all ${
        meta.highlight
          ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
          : "border-border bg-card hover:border-primary/30"
      }`}
      onClick={() => !purchasing && onPurchase(pkg)}
    >
      {meta.badge && (
        <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full border ${meta.badgeColor}`}>
          {meta.badge}
        </span>
      )}
      <div>
        <p className="text-sm text-muted-foreground">{meta.label}</p>
        <p className="text-4xl font-extrabold text-foreground mt-1">{price}</p>
        <p className="text-xs text-muted-foreground mt-1">{meta.description}</p>
      </div>
      <button
        disabled={purchasing}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
          meta.highlight
            ? "bg-primary text-primary-foreground hover:opacity-90 glow-primary"
            : "bg-secondary text-foreground hover:bg-secondary/80"
        } disabled:opacity-50`}
      >
        {purchasing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
        Get {meta.label}
      </button>
    </motion.div>
  );
}

export default function Pro() {
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [packages, setPackages] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    async function init() {
      const me = await base44.auth.me();
      setUser(me);
      configureRevenueCat(me?.id || me?.email);

      const [proStatus, offerings, info] = await Promise.all([
        checkIsProUser(),
        getOfferings(),
        getCustomerInfo(),
      ]);

      setIsPro(proStatus);
      setCustomerInfo(info);

      const pkgs = offerings?.current?.availablePackages || [];
      // Sort: lifetime → yearly → monthly
      const order = ["lifetime", "yearly", "monthly"];
      pkgs.sort((a, b) => order.indexOf(a.identifier) - order.indexOf(b.identifier));
      setPackages(pkgs);
      setLoading(false);
    }
    init().catch(() => setLoading(false));
  }, []);

  const handlePurchase = async (pkg) => {
    setPurchasing(true);
    try {
      await purchasePackage(pkg, user?.email);
      const info = await getCustomerInfo();
      setCustomerInfo(info);
      setIsPro(true);
      toast("🎉 Welcome to Vocalyrics Pro!");
    } catch (err) {
      if (err?.userCancelled) {
        // user closed checkout, no toast needed
      } else {
        toast.error("Purchase failed. Please try again.");
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleManage = async () => {
    try {
      await manageSubscription();
    } catch {
      toast.error("Could not open subscription management.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // ── ACTIVE PRO VIEW ──
  if (isPro) {
    const entitlement = customerInfo?.entitlements?.active?.["Vocalyrics Pro"];
    const expiryDate = entitlement?.expirationDate
      ? new Date(entitlement.expirationDate).toLocaleDateString()
      : null;

    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 glow-primary">
            <Crown className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">You're Pro! 🎉</h1>
          <p className="text-muted-foreground mb-8">
            You have full access to all Vocalyrics Pro features.
            {expiryDate && <span className="block text-xs mt-1">Renews / Expires: {expiryDate}</span>}
          </p>

          <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-left space-y-3">
            {PRO_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-foreground">
                <Check className="w-4 h-4 text-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <button
            onClick={handleManage}
            className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground text-sm font-medium transition-colors border border-border"
          >
            <Settings className="w-4 h-4" />
            Manage Subscription
          </button>
        </motion.div>
      </div>
    );
  }

  // ── PAYWALL ──
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4" />
            Vocalyrics Pro
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Unlock Your Full Japanese Journey
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Get unlimited access to all songs, vocabulary tools, and quizzes to master Japanese through Vocaloid music.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {PRO_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border text-sm text-foreground">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-primary" />
              </div>
              {f}
            </div>
          ))}
        </div>

        {/* Pricing cards */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {packages.map((pkg) => (
              <PriceCard
                key={pkg.identifier}
                pkg={pkg}
                onPurchase={handlePurchase}
                purchasing={purchasing}
              />
            ))}
          </div>
        ) : (
          // Fallback static pricing if offerings not loaded from RC dashboard yet
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { id: "lifetime", label: "Lifetime", price: "$24.99", desc: "One-time payment, forever access", highlight: true, badge: "Best Value" },
              { id: "yearly", label: "Yearly", price: "$55.99", desc: "Billed once a year", highlight: false, badge: "Most Popular" },
              { id: "monthly", label: "Monthly", price: "$6.99", desc: "Cancel anytime", highlight: false, badge: null },
            ].map((p) => (
              <div
                key={p.id}
                className={`relative rounded-2xl border p-6 flex flex-col gap-4 ${p.highlight ? "border-primary/50 bg-primary/5" : "border-border bg-card"}`}
              >
                {p.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full border ${p.highlight ? "bg-primary/20 text-primary border-primary/30" : "bg-accent/20 text-accent border-accent/30"}`}>
                    {p.badge}
                  </span>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">{p.label}</p>
                  <p className="text-4xl font-extrabold text-foreground mt-1">{p.price}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                </div>
                <div className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-2 opacity-50 ${p.highlight ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                  <Crown className="w-4 h-4" /> Configure in RC Dashboard
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Payments are processed securely. Cancel or manage your subscription at any time.
          {" "}<button onClick={handleManage} className="underline hover:text-foreground transition-colors">Manage subscription</button>
        </p>
      </motion.div>
    </div>
  );
}