// Fallback glosses for words that were never individually annotated in the song
// data. Keyed by the trimmed segment text, so a word repeated across lines only
// has to be written once here.
const RAW_GLOSSES = {
  // particles, connectors and short phrases
  "も": { type: "grammar", reading: "も", meaning: "also / too — the additive particle, stacking one more thing onto the line" },
  "に": { type: "grammar", reading: "に", meaning: "in / at / to — the particle marking time, place or target" },
  "は": { type: "grammar", reading: "は (wa)", meaning: "topic marker — sets up what the line is about" },
  "を": { type: "grammar", reading: "を (wo)", meaning: "object marker — the thing the verb acts on" },
  "と": { type: "grammar", reading: "と", meaning: "and / with — or the particle closing a quotation" },
  "って": { type: "grammar", reading: "って", meaning: "casual quoting particle — the spoken form of と" },
  "って 思いました": { type: "grammar", reading: "って おもいました", meaning: "'that's what I thought' — って (quote) + 思いました (thought), suddenly formal" },
  "何番目でも": { type: "grammar", reading: "なんばんめでも", meaning: "no matter which number in line — 何番目 (which in order) + でも (no matter)" },
  "あなたが": { type: "grammar", reading: "あなたが", meaning: "that you — あなた (you) + the subject marker が" },
  "あなたに": { type: "grammar", reading: "あなたに", meaning: "to you — あなた (you) + the direction particle に" },
  "人が欲しい と": { type: "grammar", reading: "ひとがほしいと", meaning: "'that I want people' — 人 (people) + が + 欲しい (wanted) + と (quote)" },
  "を 夢を": { type: "grammar", reading: "を ゆめを", meaning: "the dream — を (object) + 夢 (dream), said twice as it slips away" },
  "時に": { type: "vocab", reading: "ときに", meaning: "at times / sometimes — 時 (time) + に" },

  // words and repeated words
  "ゴロゴロと": { type: "vocab", reading: "ごろごろと", meaning: "lolling about / rumbling — ゴロゴロ (lazing, or the sound of rolling) + と" },
  "グルグルと": { type: "vocab", reading: "ぐるぐると", meaning: "spinning round and round — グルグル + と (adverb marker)" },
  "ルルル": { type: "vocab", reading: "るるる", meaning: "lu-lu-lu — humming with no dictionary meaning, the tune itself" },
  "あ": { type: "vocab", reading: "あ", meaning: "ah — a single breath of sound, half a word" },
  "ああ": { type: "vocab", reading: "ああ", meaning: "ah / ahh — a sigh, a groan, or a wordless answer" },
  "エマージェンシー": { type: "vocab", reading: "えまーじぇんしー", meaning: "emergency — the katakana loanword, dropped in as a siren" },
  "0時": { type: "vocab", reading: "れいじ", meaning: "zero o'clock / midnight — 0 + 時 (hour)" },
  "エゴ": { type: "vocab", reading: "えご", meaning: "ego — the katakana loanword, one's own self-interest" },
  "聴き殺してランデブー": { type: "vocab", reading: "ききころしてランデブー", meaning: "listening to death into a rendezvous — 聴き殺す (to listen until it dies) + ランデブー (rendezvous)" },
  "ちょっと": { type: "vocab", reading: "ちょっと", meaning: "a little / hang on — the all-purpose softener" },
  "きっと": { type: "vocab", reading: "きっと", meaning: "surely / definitely — a quiet conviction" },
  "遠い": { type: "vocab", reading: "とおい", meaning: "far / distant" },
  "苦しい": { type: "vocab", reading: "くるしい", meaning: "painful / hard to bear" },
  "絞める": { type: "vocab", reading: "しめる", meaning: "to strangle / to tighten — the verb behind the line's violence" },
  "身体": { type: "vocab", reading: "からだ", meaning: "the body" },
  "どの子": { type: "vocab", reading: "どのこ", meaning: "which one / which girl — どの (which) + 子 (child)" },
  "解いて ねえ": { type: "vocab", reading: "といて ねえ", meaning: "untie it, hey — 解く (to untie) in te-form, followed by a plea" },
  "人が 人が": { type: "vocab", reading: "ひとが ひとが", meaning: "people, people — 人 (person) repeated, the need piling up" },
  "人が欲しい": { type: "vocab", reading: "ひとがほしい", meaning: "I want someone — 人 (person) + が + 欲しい (wanted)" },
  "あなたが 足りない": { type: "vocab", reading: "あなたが たりない", meaning: "you are what's missing — 足りない (not enough)" },
  "ねえ": { type: "vocab", reading: "ねえ", meaning: "hey — a nudge to get someone's attention" },
  "ねえ ねえ": { type: "vocab", reading: "ねえ ねえ", meaning: "hey, hey — repeated, because no one answers" },
  "愛して": { type: "vocab", reading: "あいして", meaning: "love me — 愛する in te-form, left hanging as a demand" },
  "愛して 愛して": { type: "vocab", reading: "あいして あいして", meaning: "love me, love me — the verb repeated until it sounds desperate" },
  "寒い 寒い 寒い 寒い": { type: "vocab", reading: "さむい", meaning: "cold, cold, cold, cold — 寒い repeated, the chill piling up" },
  "遠い 遠い 遠い 遠い": { type: "vocab", reading: "とおい", meaning: "far, far, far, far — 遠い repeated, distance with no end" },
  "早い 早い 早い 早い": { type: "vocab", reading: "はやい", meaning: "fast, fast, fast, fast — 早い repeated, time running out" },
  "憎い 憎い 憎い 憎い": { type: "vocab", reading: "にくい", meaning: "hateful, hateful, hateful, hateful — 憎い repeated" },
  "怖い 怖い 怖い 怖い": { type: "vocab", reading: "こわい", meaning: "scary, scary, scary, scary — 怖い repeated, fear on a loop" },
  "ああ 君の 君の 君の": { type: "vocab", reading: "ああ きみの", meaning: "ah — yours, yours, yours. 君 (you) + の (possessive), repeated possessively" },
  "みんな": { type: "vocab", reading: "みんな", meaning: "everyone / all of them" },
  "わんっ　つー　さん　しっ": { type: "vocab", reading: "わん つー さん し", meaning: "one, two, three, four — counted out loud with childish mangling" },
  "! えっ?": { type: "vocab", reading: "えっ", meaning: "huh? — えっ, the sound of being caught off guard" },
  "メルト": { type: "vocab", reading: "めるト", meaning: "melt — the title word; also the verb メルトする, to melt down" },
  "、掻き回して。": { type: "vocab", reading: "かきまわして", meaning: "stirring it all up — 掻き回す (to stir, to mess up) in te-form" },
  "、もう失敗。": { type: "vocab", reading: "もう しっぱい", meaning: "failure again — もう (already) + 失敗 (failure)" },
  "、もう一回。": { type: "vocab", reading: "もう いっかい", meaning: "one more time — もう (again) + 一回 (one time)" },
  "、混ぜあわせて。": { type: "vocab", reading: "まぜあわせて", meaning: "mixing them together — 混ぜ合わせる in te-form" },
  "少女は言う": { type: "vocab", reading: "しょうじょはいう", meaning: "the girl says — 少女 (girl) + は + 言う (to say)" },
  "此処は宴　鋼の檻　その断頭台を": { type: "vocab", reading: "ここはうたげ はがねのおり そのだんとうだいを", meaning: "here is the feast, a cage of steel, that guillotine — 此処 (here) + 宴 (feast) + 鋼の檻 (steel cage) + 断頭台 (guillotine)" },
  "此処は宴　鋼の檻　さあ光線銃を": { type: "vocab", reading: "ここはうたげ はがねのおり さあこうせんじゅうを", meaning: "here is the feast, a cage of steel, now the ray gun — 光線銃 (ray gun) takes over the guillotine" },
  "千本桜　夜ニ紛レ　君が歌い": { type: "vocab", reading: "せんぼんざくら よるにまぎれ きみがうたい", meaning: "a thousand cherry trees, lost in the night, and you sing — 千本桜 (thousand cherry trees) + 夜に紛れ (vanishing into night) + 君が歌い (you sing)" },

  // Bug
  "迷子": { type: "vocab", reading: "まいご", meaning: "a lost child" },
  "ギコ": { type: "vocab", reading: "ぎこ", meaning: "Giko — the name of the classic 2channel ASCII face, a mask the line wears" },
  "退路": { type: "vocab", reading: "たいろ", meaning: "a way out / a retreat route" },
  "バグバグ": { type: "vocab", reading: "ばぐばぐ", meaning: "bug-bug — バグ (bug) doubled, glitching on a loop" },
  "タグ": { type: "vocab", reading: "たぐ", meaning: "tag — a label, the thing that files a person away" },
  "剥グ": { type: "vocab", reading: "はぐ", meaning: "to peel off — 剥ぐ written with the verb ending in katakana" },
  "嫌嫌嫌": { type: "vocab", reading: "いやいやいや", meaning: "no, no, no — 嫌 (いや, no / dislike) repeated three times" },
  "嫌嫌嫌嫌嫌嫌嫌": { type: "vocab", reading: "いやいやいやいやいやいやいや", meaning: "no no no no no no no — 嫌 repeated seven times, refusal past words" },
  "嫌嫌": { type: "vocab", reading: "いやいや", meaning: "no, no — 嫌 (いや) repeated; also the shape of 'iie', no" },
  "パッパラノーイ": { type: "vocab", reading: "ぱっぱらのーい", meaning: "pappara-noi — scat nonsense; the syllables carry the rhythm, not a meaning" },
  "狂": { type: "vocab", reading: "くる", meaning: "madness — the stem of 狂う (to go mad), cut off mid-verb" },
  "(狂 狂、狂 狂)": { type: "vocab", reading: "くる くる くる くる", meaning: "mad, mad, mad, mad — 狂 repeated inside brackets, the word itself breaking" },
  "抱っこ": { type: "vocab", reading: "だっこ", meaning: "a cuddle / being carried — childish for 抱く (to hold)" },
  "いい子": { type: "vocab", reading: "いいこ", meaning: "'good child' — the phrase adults use to praise obedience" },
  "ぱ": { type: "vocab", reading: "ぱ", meaning: "pa — one syllable with no meaning of its own; the word peeling apart" },
  "今今": { type: "vocab", reading: "いまいま", meaning: "now, now — 今 (now) repeated, the present splitting in two" },

  // Kyoufuu All Back
  "定期": { type: "vocab", reading: "ていき", meaning: "regular / the usual — short for 定期券, the commuter pass" },
  "ハト ハト ハト": { type: "vocab", reading: "はと はと はと", meaning: "pigeon, pigeon, pigeon — ハト repeated, the park greeting" },
};

const WORD_GLOSSES = Object.fromEntries(
  Object.entries(RAW_GLOSSES).map(([key, value]) => [key.trim(), value])
);

export function getWordGloss(text) {
  if (!text) return null;
  return WORD_GLOSSES[text.trim()] || null;
}

export default WORD_GLOSSES;