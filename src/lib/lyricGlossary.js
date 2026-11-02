// The complete word/phrase dictionary for the lyrics.
//
// Every Japanese word or phrase that appears in a song either carries its own
// annotation in the song data, or is looked up here — so every word in the
// lyrics is annotated as vocab or grammar, however often it repeats.
// Keys are the trimmed text of a segment (or of a word inside a raw lyric line).
const RAW_GLOSSES = {
  // ── Particles, connectors and grammatical chunks ──
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
  "俺の私だけの": { type: "grammar", reading: "おれの わたしだけの", meaning: "'my own, mine alone' — 俺の (my) + 私だけの (only mine)" },
  "朽ちるまでの愛憎を": { type: "grammar", reading: "くちるまでのあいぞうを", meaning: "'the love and hate until it rots away' — 朽ちる (to rot) + まで (until) + 愛憎 (love and hate) + を" },
  "天気は良いのに": { type: "grammar", reading: "てんきはいいのに", meaning: "'even though the weather is fine' — 天気 (weather) + は + 良い (good) + のに (even though)" },
  "終わったわ": { type: "grammar", reading: "おわったわ", meaning: "'it's over' — 終わる (to end) in the past tense + わ, a sentence-ending particle" },
  "俺の私の音が": { type: "grammar", reading: "おれのわたしのおとが", meaning: "'my own sound' — 俺の (my) + 私の (my own) + 音 (sound) + が (subject)" },
  "俺の私の音を": { type: "grammar", reading: "おれのわたしのおとを", meaning: "'my own sound', as the object — the を marks what the next verb acts on" },
  "君が包むだけ": { type: "grammar", reading: "きみがつつむだけ", meaning: "'you only wrap it up' — 君が (you) + 包む (to wrap) + だけ (only)" },
  "僕が僕であるために": { type: "grammar", reading: "ぼくがぼくであるために", meaning: "'so that I can stay myself' — 僕が僕である (I am me) + ために (for the sake of)" },
  "本当の芝居で騙される": { type: "grammar", reading: "ほんとうのしばいでだまされる", meaning: "'fooled by a genuine performance' — 芝居 (playacting) + 騙される (to be deceived)" },
  "「私は今日も転がります。」と": { type: "grammar", reading: "わたしはきょうもころがりますと", meaning: "'I'll roll along again today,' [she says] — 転がる (to roll) + the quoting particle と" },
  "わがままなんて言ってないんだから": { type: "grammar", reading: "わがままなんて いってないんだから", meaning: "'I'm not being selfish, you know' — わがまま (selfish) + なんて (such a thing) + 言ってない (not saying) + んだから (because, I tell you)" },
  "あなたじゃ分からないかもね": { type: "grammar", reading: "あなたじゃわからないかもね", meaning: "'maybe you just wouldn't get it' — あなたじゃ (from you) + 分からない (not understand) + かもね (maybe)" },

  // ── Words and repeated words ──
  "時に": { type: "vocab", reading: "ときに", meaning: "at times / sometimes — 時 (time) + に" },
  "ゴロゴロと": { type: "vocab", reading: "ごろごろと", meaning: "lolling about / rumbling — ゴロゴロ (lazing, or the sound of rolling) + と" },
  "グルグルと": { type: "vocab", reading: "ぐるぐると", meaning: "spinning round and round — グルグル + と (adverb marker)" },
  "ルルル": { type: "vocab", reading: "るるる", meaning: "lu-lu-lu — humming with no dictionary meaning, the tune itself" },
  "あ": { type: "vocab", reading: "あ", meaning: "ah — a single breath of sound, half a word" },
  "ああ": { type: "vocab", reading: "ああ", meaning: "ah / ahh — a sigh, a groan, or a wordless answer" },
  "エマージェンシー": { type: "vocab", reading: "えまーじぇんしー", meaning: "emergency — the katakana loanword, dropped in like a siren" },
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
  "寒い": { type: "vocab", reading: "さむい", meaning: "cold — 寒い, the chill stated flatly" },
  "寒い 寒い 寒い 寒い": { type: "vocab", reading: "さむい", meaning: "cold, cold, cold, cold — 寒い repeated, the chill piling up" },
  "遠い 遠い 遠い 遠い": { type: "vocab", reading: "とおい", meaning: "far, far, far, far — 遠い repeated, distance with no end" },
  "早い": { type: "vocab", reading: "はやい", meaning: "early / fast — 早い" },
  "早い 早い 早い 早い": { type: "vocab", reading: "はやい", meaning: "fast, fast, fast, fast — 早い repeated, time running out" },
  "憎い": { type: "vocab", reading: "にくい", meaning: "hateful / detestable — 憎い" },
  "憎い 憎い 憎い 憎い": { type: "vocab", reading: "にくい", meaning: "hateful, hateful, hateful, hateful — 憎い repeated" },
  "怖い": { type: "vocab", reading: "こわい", meaning: "scary / frightening — 怖い" },
  "怖い 怖い 怖い 怖い": { type: "vocab", reading: "こわい", meaning: "scary, scary, scary, scary — 怖い repeated, fear on a loop" },
  "ああ 君の 君の 君の": { type: "vocab", reading: "ああ きみの", meaning: "ah — yours, yours, yours. 君 (you) + の (possessive), repeated possessively" },
  "みんな": { type: "vocab", reading: "みんな", meaning: "everyone / all of them" },
  "わんっ　つー　さん　しっ": { type: "vocab", reading: "わん つー さん し", meaning: "one, two, three, four — counted out loud with childish mangling" },
  "! えっ?": { type: "vocab", reading: "えっ", meaning: "huh? — えっ, the sound of being caught off guard" },
  "メルト": { type: "vocab", reading: "メルト", meaning: "melt — the title word; also the verb メルトする, to melt down" },
  "、掻き回して。": { type: "vocab", reading: "かきまわして", meaning: "stirring it all up — 掻き回す (to stir, to mess up) in te-form" },
  "、もう失敗。": { type: "vocab", reading: "もう しっぱい", meaning: "failure again — もう (already) + 失敗 (failure)" },
  "、もう一回。": { type: "vocab", reading: "もう いっかい", meaning: "one more time — もう (again) + 一回 (one time)" },
  "、混ぜあわせて。": { type: "vocab", reading: "まぜあわせて", meaning: "mixing them together — 混ぜ合わせる in te-form" },
  "少女は言う": { type: "vocab", reading: "しょうじょはいう", meaning: "the girl says — 少女 (girl) + は + 言う (to say)" },
  "此処は宴　鋼の檻　その断頭台を": { type: "vocab", reading: "ここはうたげ はがねのおり そのだんとうだいを", meaning: "here is the feast, a cage of steel, that guillotine — 此処 (here) + 宴 (feast) + 鋼の檻 (steel cage) + 断頭台 (guillotine)" },
  "此処は宴　鋼の檻　さあ光線銃を": { type: "vocab", reading: "ここはうたげ はがねのおり さあこうせんじゅうを", meaning: "here is the feast, a cage of steel, now the ray gun — 光線銃 (ray gun) takes the guillotine's place" },
  "千本桜　夜ニ紛レ　君が歌い": { type: "vocab", reading: "せんぼんざくら よるにまぎれ きみがうたい", meaning: "a thousand cherry trees, lost in the night, and you sing — 千本桜 (thousand cherry trees) + 夜に紛れ (vanishing into the night) + 君が歌い (you sing)" },

  "千本桜": { type: "vocab", reading: "せんぼんざくら", meaning: "a thousand cherry trees — 千 (thousand) + 本 (the counter) + 桜 (cherry blossom)" },
  "夜ニ紛レ": { type: "vocab", reading: "よるにまぎれ", meaning: "'lost in the night' — 夜 (night) + に + 紛れ (to be lost among)" },
  "君ノ声モ届カナイヨ": { type: "vocab", reading: "きみのこえもとどかないよ", meaning: "'even your voice doesn't reach me' — 君の声 (your voice) + も (even) + 届かない (doesn't reach), spelled out in katakana" },
  "嘆ク唄": { type: "vocab", reading: "なげくうた", meaning: "'a song of grief' — 嘆く (to grieve) + 唄 (song)" },
  "もう一回、もう一回。": { type: "vocab", reading: "もういっかい もういっかい", meaning: "'one more time, one more time' — the line looping back on itself" },
  "息を止めるの、今。": { type: "vocab", reading: "いきをとめるの いま", meaning: "'holding my breath, now' — 息を止める (to hold one's breath) + の + 今 (now)" },
  "ワーニング": { type: "vocab", reading: "わーにんぐ", meaning: "warning — the English word in katakana" },

  // ── Bug ──
  "迷子": { type: "vocab", reading: "まいご", meaning: "a lost child" },
  "ギコ": { type: "vocab", reading: "ぎこ", meaning: "Giko — the name of the classic 2channel ASCII face, a mask the line wears" },
  "退路": { type: "vocab", reading: "たいろ", meaning: "a way out / a retreat route" },
  "バグバグ": { type: "vocab", reading: "ばぐばぐ", meaning: "bug-bug — バグ (bug) doubled, glitching on a loop" },
  "タグ": { type: "vocab", reading: "たぐ", meaning: "tag — a label, the thing that files a person away" },
  "剥グ": { type: "vocab", reading: "はぐ", meaning: "to peel off — 剥ぐ with its verb ending written in katakana" },
  "嫌嫌嫌": { type: "vocab", reading: "いやいやいや", meaning: "no, no, no — 嫌 (いや, no / dislike) repeated three times" },
  "嫌嫌嫌嫌嫌嫌嫌": { type: "vocab", reading: "いやいやいやいやいやいやいや", meaning: "no no no no no no no — 嫌 repeated seven times, refusal past words" },
  "嫌嫌": { type: "vocab", reading: "いやいや", meaning: "no, no — 嫌 (いや) repeated; also the shape of いいえ, 'no'" },
  "パッパラノーイ": { type: "vocab", reading: "ぱっぱらのーい", meaning: "pappara-noi — scat nonsense; the syllables carry rhythm, not meaning" },
  "狂": { type: "vocab", reading: "くる", meaning: "madness — the stem of 狂う (to go mad), cut off mid-verb" },
  "(狂 狂、狂 狂)": { type: "vocab", reading: "くる くる くる くる", meaning: "mad, mad, mad, mad — 狂 repeated inside brackets, the word itself breaking" },
  "抱っこ": { type: "vocab", reading: "だっこ", meaning: "a cuddle / being carried — childish for 抱く (to hold)" },
  "いい子": { type: "vocab", reading: "いいこ", meaning: "'good child' — the phrase adults use to praise obedience" },
  "ぱ": { type: "vocab", reading: "ぱ", meaning: "pa — one syllable with no meaning of its own; the word peeling apart" },
  "今今": { type: "vocab", reading: "いまいま", meaning: "now, now — 今 (now) repeated, the present splitting in two" },

  // ── Kyoufuu All Back ──
  "定期": { type: "vocab", reading: "ていき", meaning: "regular / the usual — short for 定期券, the commuter pass" },
  "ハト ハト ハト": { type: "vocab", reading: "はと はと はと", meaning: "pigeon, pigeon, pigeon — ハト repeated, the park greeting" },
  "引き籠り": { type: "vocab", reading: "ひきこもり", meaning: "shut-in / hikikomori — 引き籠る (to withdraw indoors)" },
  "絶対": { type: "vocab", reading: "ぜったい", meaning: "absolutely / definitely — 絶対" },
  "ジャスティス": { type: "vocab", reading: "じゃすてぃす", meaning: "justice — the English word in katakana" },
  "折の中で": { type: "vocab", reading: "おりのなかで", meaning: "'inside the cage' — 折 (a fold, a cage) + の中で (inside)" },
  "レフトサイド": { type: "vocab", reading: "れふとさいど", meaning: "left side — in katakana" },
  "ライトサイド": { type: "vocab", reading: "らいとさいど", meaning: "right side — in katakana" },
  "進めない": { type: "vocab", reading: "すすめない", meaning: "I can't move forward — the negative of 進む (to advance)" },
  "風": { type: "vocab", reading: "かぜ", meaning: "wind" },
  "強すぎて": { type: "vocab", reading: "つよすぎて", meaning: "'too strong to bear' — 強い (strong) + すぎる (too much), in te-form" },
  "お亡くなり": { type: "vocab", reading: "おなくなり", meaning: "passing away — the polite word for dying, used here as a joke" },
  "的にオールバック": { type: "vocab", reading: "てきに おーるばっく", meaning: "'slicked-back, as a matter of routine' — 的 (as in 定期的, regularly) + オールバック (slicked-back hair)" },
  "外出た瞬間": { type: "vocab", reading: "そとでたしゅんかん", meaning: "'the moment I stepped outside' — 外 (outside) + 出た (went out) + 瞬間 (instant)" },
  "君に染まるまで": { type: "vocab", reading: "きみにそまるまで", meaning: "'until I'm dyed in your colour' — 君に (by you) + 染まる (to be dyed) + まで (until)" },
  "時がきた今": { type: "vocab", reading: "ときがきた いま", meaning: "'now that the time has come' — 時 (time) + がきた (has come) + 今 (now)" },
  "言葉を書く": { type: "vocab", reading: "ことばをかく", meaning: "to write words — 言葉 (words) + を + 書く (to write)" },
  "曖昧に": { type: "vocab", reading: "あいまいに", meaning: "vaguely / ambiguously — 曖昧 (ambiguity) + に" },
  "契り集め": { type: "vocab", reading: "ちぎりあつめ", meaning: "'gathering vows' — 契り (a vow, a pledge) + 集め (collecting)" },
  "持ってきた": { type: "vocab", reading: "もってきた", meaning: "'brought along' — 持つ (to hold) + て + 来た (came)" },
  "飲み込む君": { type: "vocab", reading: "のみこむきみ", meaning: "'you, swallowing it down' — 飲み込む (to swallow) + 君 (you)" },
  "簡単に": { type: "vocab", reading: "かんたんに", meaning: "easily / simply — 簡単 (easy) + に" },
  "微笑む君": { type: "vocab", reading: "ほほえむきみ", meaning: "'you, smiling' — 微笑む (to smile) + 君 (you)" },
  "どうして": { type: "vocab", reading: "どうして", meaning: "why / how come" },
  "さらば!": { type: "vocab", reading: "さらば", meaning: "farewell — a theatrical goodbye" },
  "「あなた段々眠くなる」浅はかな催眠術": { type: "vocab", reading: "あなただんだんねむくなる あさはかなさいみんじゅつ", meaning: "'you're getting sleepy' — shallow hypnosis: 段々 (gradually) + 眠くなる (grow sleepy) + 浅はか (shallow) + 催眠術 (hypnosis)" },
  "頭、身体、煙に巻く": { type: "vocab", reading: "あたま からだ けむにまく", meaning: "'head, body, all wrapped in smoke' — 煙に巻く (to baffle with smoke, an idiom)" },
  "まさか、数多誑かす!?": { type: "vocab", reading: "まさか あまたたらかす", meaning: "'surely not, deceiving so many' — まさか (no way) + 数多 (many) + 誑かす (to deceive)" },
  "目の前で揺らぐ硬貨": { type: "vocab", reading: "めのまえでゆらぐこうか", meaning: "'the coin swaying before my eyes' — 目の前 (in front of me) + 揺らぐ (to sway) + 硬貨 (a coin)" },
  "動かなくなる彼方...": { type: "vocab", reading: "うごかなくなるかなた", meaning: "'the beyond that stops moving' — 動かなくなる (to become still) + 彼方 (the far beyond)" },
  "こんな時代に誂えた": { type: "vocab", reading: "こんなじだいにあつらえた", meaning: "'made to order for an age like this' — 時代 (era) + 誂える (to custom-make)" },
  "見て呉れの脆弱性": { type: "vocab", reading: "みてぐれのぜいじゃくせい", meaning: "'the fragility of appearances' — 見て呉れ (looks, outward show) + 脆弱性 (fragility)" },
  "矢鱈と煩い心臓の鼓動": { type: "vocab", reading: "やたらとうるさいしんぞうのこどう", meaning: "'a heartbeat reckless and loud' — 矢鱈と (recklessly) + 煩い (noisy) + 心臓の鼓動 (heartbeat)" },
  "此処は宴": { type: "vocab", reading: "ここはうたげ", meaning: "'here is the feast' — 此処 (here) + は + 宴 (banquet)" },
  "鋼の檻": { type: "vocab", reading: "はがねのおり", meaning: "'cage of steel' — 鋼 (steel) + の + 檻 (cage)" },
  "その断頭台で見下ろして": { type: "vocab", reading: "そのだんとうだいでみおろして", meaning: "'looking down from that guillotine' — 断頭台 (guillotine) + 見下ろす (to look down on)" },
  "三千世界": { type: "vocab", reading: "さんぜんせかい", meaning: "the three thousand worlds — the Buddhist phrase for all of existence" },
  "常世之闇（とこよのやみ）": { type: "vocab", reading: "とこよのやみ", meaning: "the eternal darkness — 常世 (the unchanging otherworld) + 闇 (darkness)" },
  "嘆ク唄モ聞コエナイヨ": { type: "vocab", reading: "なげくうたもきこえないよ", meaning: "'I can't even hear the grieving song' — 嘆く (to grieve) + 唄 (song) + も + 聞こえない (cannot hear)" },
  "環状線を走り抜けて": { type: "vocab", reading: "かんじょうせんをはしりぬけて", meaning: "'racing all the way round the loop line' — 環状線 (loop line) + 走り抜ける (to run through)" },
  "東奔西走なんのその": { type: "vocab", reading: "とうほんせいそうなんのその", meaning: "'rushing east and west, no big deal' — 東奔西走 (rushing about) + なんのその (no problem at all)" },
  "少年少女戦国無双": { type: "vocab", reading: "しょうねんしょうじょせんごくむそう", meaning: "'boys and girls, unmatched in the warring states' — 少年少女 (boys and girls) + 戦国無双 (unrivalled in battle)" },
  "浮世の随（まにま）に": { type: "vocab", reading: "うきよのまにまに", meaning: "'as the floating world wills it' — 浮世 (the fleeting world) + 随に (as one is carried along)" },
  "世界でいちばんおひめさま": { type: "vocab", reading: "せかいでいちばんおひめさま", meaning: "'the number one princess in the world' — 世界で (in the world) + いちばん (number one) + おひめさま (princess)" },
  "べつに": { type: "vocab", reading: "べつに", meaning: "not really / nothing special — 別に, usually with a shrug" },
  "イェエー": { type: "vocab", reading: "いぇえー", meaning: "yeahh — a cheer" },
  "イェエーエー": { type: "vocab", reading: "いぇえーえー", meaning: "yeah yeah — an extended cheer" },
  "ヘイベイビー": { type: "vocab", reading: "へいべいびー", meaning: "hey baby — the English call-out in katakana" },
  "「もう良いかい？」": { type: "vocab", reading: "もういいかい", meaning: "'ready or not?' — the call from the children's game; literally 'is it okay now?'" },
  "ホップ・ステップで踊ろうか": { type: "vocab", reading: "ほっぷすてっぷでおどろうか", meaning: "'shall we dance, hop and step' — ホップ・ステップ (hop, step) + 踊ろうか (shall we dance)" },
  "世界の隅っこでワン・ツー": { type: "vocab", reading: "せかいのすみっこでわんつー", meaning: "'a one-two in a corner of the world' — 隅っこ (little corner) + ワン・ツー (one, two)" },
  "ちょっとクラッとしそうになる終末感を楽しんで": { type: "vocab", reading: "ちょっとくらっとしそうになるしゅうまつかんをたのしんで", meaning: "'enjoying that end-of-the-world feeling that almost makes you dizzy' — クラッと (to stagger) + 終末感 (sense of the end) + 楽しんで (enjoy it)" },
  "パッとフラッと消えちゃいそな": { type: "vocab", reading: "ぱっとふらっときえちゃいそな", meaning: "'like it might vanish in a flash' — パッと (suddenly) + フラッと (lightly) + 消えちゃいそう (seems it will vanish)" },
  "次の瞬間を残そうか": { type: "vocab", reading: "つぎのしゅんかんをのこそうか", meaning: "'shall we leave the next instant behind' — 次の瞬間 (the next moment) + 残そうか (shall we leave it)" },
  "無いのあなたにお願い一つ": { type: "vocab", reading: "ないの あなたに おねがいひとつ", meaning: "'there's nothing left, so one favour of you' — 無い (none) + あなたに (to you) + お願い (a request)" },
  "張り詰めた思い込め": { type: "vocab", reading: "はりつめたおもいいれ", meaning: "'putting in taut, pent-up feeling' — 張り詰めた (taut) + 思い (feelings) + 込め (put into)" },
  "歯を突き出して": { type: "vocab", reading: "はをつきだして", meaning: "'baring my teeth' — 歯 (teeth) + 突き出す (to thrust out)" },
  "パッパッパッ": { type: "vocab", reading: "ぱっぱっぱ", meaning: "pa-pa-pa — a burst of syllables, rhythm rather than sense" },
  "はぁ？うっせぇうっせぇうっせぇわ": { type: "vocab", reading: "はぁ うっせぇうっせぇうっせぇわ", meaning: "'haa? shut up, shut up, shut up' — the sigh and the chorus fused into one line" },
  "うっせぇうっせぇうっせぇわ": { type: "vocab", reading: "うっせぇうっせぇうっせぇわ", meaning: "'shut up, shut up, shut up' — うるさい (annoying) mangled into うっせぇ and repeated" },
  "あなたが思うより健康です": { type: "vocab", reading: "あなたがおもうよりけんこうです", meaning: "'I'm healthier than you think' — 思うより (than you think) + 健康です (I'm healthy)" },
  "一切合切凡庸な": { type: "vocab", reading: "いっさいがっさいぼんような", meaning: "'every last bit of it, mediocre' — 一切合切 (absolutely everything) + 凡庸 (mediocre)" },
  "(さあ)": { type: "vocab", reading: "さあ", meaning: "'now then' — an encouraging nudge" },
};

const WORD_GLOSSES = Object.fromEntries(
  Object.entries(RAW_GLOSSES).map(([key, value]) => [key.trim(), value])
);

export function getWordGloss(text) {
  if (!text) return null;
  return WORD_GLOSSES[text.trim()] || null;
}

// Splits a raw lyric line into word-sized segments, so lines that were never
// broken down by hand still get a vocab or grammar annotation on every word.
export function buildSegments(japanese) {
  return (japanese || "")
    .split(/(\s+)/)
    .filter((token) => token !== "")
    .map((token) => {
      const gloss = getWordGloss(token);
      if (!gloss || !token.trim()) return { text: token };
      return {
        text: token,
        type: gloss.type,
        reading: gloss.reading,
        meaning: gloss.meaning,
      };
    });
}

export default WORD_GLOSSES;