import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Send, Music, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusConfig = {
  Pending: { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  "In Progress": { label: "In Progress", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: Loader2 },
  Added: { label: "Added", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle },
  Declined: { label: "Declined", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: XCircle },
};

export default function Request() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ song_title: "", artist: "", youtube_url: "", notes: "" });

  useEffect(() => {
    base44.entities.SongRequest.list("-created_date").then((data) => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.song_title.trim() || !form.artist.trim()) return;
    setSubmitting(true);
    const created = await base44.entities.SongRequest.create({ ...form, status: "Pending" });
    setRequests((prev) => [created, ...prev]);
    setForm({ song_title: "", artist: "", youtube_url: "", notes: "" });
    toast("Song request submitted!");
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Request a Song</h1>
          <p className="text-sm text-muted-foreground">
            Suggest a Vocaloid song you'd like to see added to the library.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Song Title *</label>
              <input
                type="text"
                value={form.song_title}
                onChange={(e) => setForm((f) => ({ ...f, song_title: e.target.value }))}
                placeholder="e.g. Ghost Rule"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Artist / Producer *</label>
              <input
                type="text"
                value={form.artist}
                onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
                placeholder="e.g. DECO*27"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">YouTube Link (optional)</label>
            <input
              type="url"
              value={form.youtube_url}
              onChange={(e) => setForm((f) => ({ ...f, youtube_url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Why would you like this song added?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Request
          </button>
        </form>

        {/* Requests List */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">All Requests</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-7 h-7 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No requests yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => {
                const status = statusConfig[req.status] || statusConfig.Pending;
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-4 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground text-sm">{req.song_title}</p>
                          <p className="text-xs text-muted-foreground">{req.artist}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${status.bg} ${status.color} shrink-0`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      {req.notes && <p className="text-xs text-muted-foreground mt-1.5 italic">"{req.notes}"</p>}
                      {req.youtube_url && (
                        <a href={req.youtube_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">
                          YouTube →
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}