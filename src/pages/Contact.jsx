import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquarePlus, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.message.trim()) {
      toast.error("Please add your email and a message.");
      return;
    }
    setSending(true);
    try {
      await base44.entities.ContactMessage.create({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      toast.success("Thanks — your message has been sent.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Contact</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Questions, corrections, or anything else — get in touch
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-foreground mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Your name"
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium text-foreground mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                value={form.message}
                onChange={handleChange("message")}
                placeholder="How can we help?"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all glow-primary disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send message"}
            </button>
            <p className="text-xs text-muted-foreground">
              Add an email address if you would like a reply.
            </p>
          </form>
        </div>

        <div className="mt-6 bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
          <MessageSquarePlus className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-1.5">Looking for a song?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Song suggestions are collected on the{" "}
              <Link to="/request" className="text-primary hover:underline">
                Request page
              </Link>{" "}
              so they can be tracked and added to the catalog.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}