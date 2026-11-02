import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Music, Sparkles, Users, Wrench } from "lucide-react";

const highlights = [
  {
    icon: Music,
    title: "Time-synced lyrics",
    text: "Every line follows the video, so the Japanese on screen is the Japanese being sung right then.",
  },
  {
    icon: Sparkles,
    title: "Tap for meaning",
    text: "Every vocabulary word and grammar point opens a note with its reading and how it works in the line.",
  },
  {
    icon: Users,
    title: "Built for learners",
    text: "Save words as you listen, then review them with flashcards and quizzes at your own pace.",
  },
];

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
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
            <Music className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">About VocaLyrics</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Learning Japanese through Vocaloid music</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            VocaLyrics is a Japanese learning app built around the Vocaloid songs people already
            love to listen to. Each song in the catalog comes with its lyrics broken down line by
            line, timed to the video so the text on screen changes as the track plays. Tap any
            highlighted word and you get its reading, its English meaning, and a short note on how
            it is being used in that exact line; tap a grammar point and you get an explanation of
            the particle, conjugation, or slang at work. Everything you look up can be saved in one
            click, and saved words feed a flashcard study mode and quizzes that track how well you
            really know them. A separate line-by-line lesson view walks through a whole song for
            listeners who want to sit down and study it properly.
          </p>
          <p>
            The app is made for anyone learning Japanese who finds textbook dialogues hard to care
            about: absolute beginners picking up their first words, intermediate learners looking
            for casual spoken Japanese and internet slang, and advanced students who want to
            appreciate the wordplay in a lyricist's choice of kanji. It is also simply a place for
            Vocaloid fans who want to know what their favorite songs are actually saying, including
            the lines that never make it into the translation videos.
          </p>
          <p>
            VocaLyrics is an independent project, built and maintained by a small solo developer who
            has been listening to Vocaloid since the Nico Nico Douga days and learning Japanese
            alongside it. Every annotation is written by hand rather than machine-translated, songs
            are added one at a time, and requests from the community help decide what comes next.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 my-10">
          {highlights.map((item) => (
            <div key={item.title} className="bg-card border border-border rounded-2xl p-5">
              <item.icon className="w-5 h-5 text-primary mb-3" />
              <h2 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
          <Wrench className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-1.5">Something to tell us?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Requests for new songs go on the{" "}
              <Link to="/request" className="text-primary hover:underline">
                Request page
              </Link>
              , and anything else reaches us through the{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}