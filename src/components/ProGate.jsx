/**
 * ProGate - wrap any component to require Pro access.
 * Shows an upgrade prompt if the user doesn't have Pro.
 */
import { useEffect, useState } from "react";
import { checkProAccess } from "@/lib/revenuecat";
import { Link } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";

export default function ProGate({ children, feature = "this feature" }) {
  const [hasPro, setHasPro] = useState(null);

  useEffect(() => {
    checkProAccess().then(setHasPro);
  }, []);

  if (hasPro === null) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!hasPro) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Pro Required</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Unlock {feature} and everything else in VocaLyrics Pro.
        </p>
        <Link
          to="/pro"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  return children;
}