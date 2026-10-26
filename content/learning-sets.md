# Learning set definitions

Revised 2026-10-20. Content specification for a seven-year-old Indonesian learner using the school word bank.

This definition replaces the earlier 14-set draft with 22 focused content sets. The identifiers S01-S22 below are new identifiers; do not interpret an old set number as a new one automatically.

## Purpose and scope

Teach the link between an English word, its meaning, the sounds heard in a consistent English recording, and its standard written spelling. An attempt such as peren, raber, kuin or renbow can preserve a sensible interpretation of the sound while requiring several English spelling decisions.

The sets are reusable content groups, not 22 compulsory lessons or a ranking of word difficulty. A word can belong to several sets. Its primary set identifies its main teaching focus; additional sets identify targeted practice and review. The mapping is a proposed curriculum, not a claim about how often a particular population makes each mistake.

The child-facing experience remains minimal: one word or clue, one task, replay, an answer, and brief feedback. Set names and pattern identifiers are authoring metadata.

Current word bank: [school-words.csv](school-words.csv). It contains 88 unique words, context sentences, separate indonesian_distractors and english_distractors, indonesian_translation, arrange_chunks, and separate Indonesian/general English extra-tile banks for Arrange Chunks and Arrange Letters. The chunk field stores ordered spelling blocks; required single-letter tiles are derived from word. See [the app concept](../app-concept.md) for these separate challenges, optional extra-tile rules, and translation-clue rules. Each word also has image_path, image_alt and image_requires_context fields referencing the SVG illustration set. The image context flag is independent of each tricky-part row's context_required flag; honour both. The companion [tricky-parts.csv](tricky-parts.csv) contains the focused replacement challenges. The word CSV remains the source for whole-word content.

## How a tricky-part challenge works

- One underscore represents one replacement slot, not one missing letter. The correct chunk and alternatives may have different lengths.
- Replacing the underscore with the answer must reconstruct the exact word, including the capital D in December.
- Teach one spelling decision at a time in early practice. Later, S22 can combine previously introduced decisions into a larger spelling chunk.
- For a presence/absence choice, an empty string means no letters; label it clearly in the interface. The examples below use an empty string only as a distractor, not as missing metadata.
- The displayed choices are the answer plus the appropriate distractors, deduplicated and shuffled. Wrong parts need their own curation; do not automatically slice them out of full-word distractors.
- Keep Indonesian sound-based and general English distractors separate. A plausible error can belong to both groups. English here means a general English spelling error, not an error exclusive to native speakers.
- If a wrong option forms another real word, the spoken context sentence or meaning must make the target unambiguous. Exclude accepted alternative spellings of the target from wrong choices.
- Example alternatives illustrate the content format and the intended contrast. They are not all established frequent errors; bh in the requested rubber example is a structural option, not a research claim.

| Word | Template | Answer | Choices | Intended decision |
| --- | --- | --- | --- | --- |
| rubber | `r_bber` | `u` | `["u","a","o"]` | Choose the vowel letter. |
| rubber | `ru_er` | `bb` | `["b","bb","bh"]` | Remember the doubled consonant. |
| parent | `p_rent` | `a` | `["a","e","ai"]` | Keep a even when e seems to fit the sound. |
| parent | `pare_` | `nt` | `["nt","n","t"]` | Keep the complete ending. |

## Research basis and limits

A first-grade Indonesian thesis describes classroom examples including ticer for teacher, dokter for doctor, and spun for spoon. These show why whole sound-based attempts matter alongside letter-order errors. [Winri Indah Sari, first-grade spelling thesis, especially printed page 18 / PDF page 15](https://repository.uir.ac.id/1337/1/Winri%20Indah%20Sari.pdf).

A study of 38 Indonesian secondary-school students links spelling errors with first-language spelling transfer and inconsistent English sound-spelling relationships. It supports attention to sound-based spelling as well as omission, substitution and other orthographic errors. [Muhassin et al., 2020](https://ejournal.radenintan.ac.id/index.php/ENGEDU/article/view/7699).

A study of 40 Indonesian university learners documents difficulties with English fricatives and substitutions including v with f and th with more familiar consonants. It also records a pronunciation approximating fanila for vanilla. Using such a form as a spelling distractor is a design inference from pronunciation evidence, rather than a measured spelling frequency. [Adnyani, 2021](https://aksara.kemendikdasmen.go.id/index.php/aksara/article/download/645/298).

Further pronunciation research discusses vowel substitution, diphthong changes, cluster reduction and vowel insertion. These motivate focused cluster and vowel exercises, without implying that all Indonesian speakers make the same changes. [A Study of Phonological Errors in Students’ English Speech Production, 2026](https://journal.ukwms.ac.id/index.php/Magister_Scientiae/article/download/7821/5682).

The sources involve different ages, regions, tasks and English experience. Their patterns inform the sets; the exact assignments and unreported distractors below are proposed practice content. Parent to peren is the parent-provided example. Use the child’s actual answers to decide which subpatterns need more practice.

## Set overview

| Set | Focus | Primary words / review memberships |
| --- | --- | --- |
| S01 | Short-vowel spelling choices | 4 primary; 13 total memberships |
| S02 | The vowel sound in queen: ee, ea, ie and particular word spellings | 6 primary; 14 total memberships |
| S03 | The vowel sound in rain: ai and a spellings | 5 primary; 10 total memberships |
| S04 | The vowel sound in roast: oa, ow, o and o-e | 6 primary; 11 total memberships |
| S05 | The vowel sound in might: igh and i-e | 4 primary; 6 total memberships |
| S06 | The vowel sound in mouse: ou and ow | 3 primary; 4 total memberships |
| S07 | The vowel sound in soup: oo, ou, ue and u | 2 primary; 5 total memberships |
| S08 | Ea with the vowel in bed | 1 primary; 3 total memberships |
| S09 | Y used as a vowel | 1 primary; 7 total memberships |
| S10 | Vowels beside r: air, ar, or and ear | 0 primary; 8 total memberships |
| S11 | Qu for the opening sounds in queen | 3 primary; 4 total memberships |
| S12 | Other consonant spelling choices: c, g, j, s, z and x | 5 primary; 30 total memberships |
| S13 | Sh, ch and tch | 9 primary; 12 total memberships |
| S14 | Th versus t or d | 2 primary; 6 total memberships |
| S15 | F, ph and v | 3 primary; 10 total memberships |
| S16 | Double consonants | 4 primary; 13 total memberships |
| S17 | Weak or hard-to-hear syllables | 3 primary; 44 total memberships |
| S18 | Consonants and groups that get shortened or expanded | 2 primary; 36 total memberships |
| S19 | Final e, retained base e and le endings | 4 primary; 23 total memberships |
| S20 | Stable written endings | 6 primary; 16 total memberships |
| S21 | Compound word building | 6 primary; 11 total memberships |
| S22 | Word-specific chunks and combined decisions | 9 primary; 14 total memberships |

A set may have no primary word and still be important: S10, for example, isolates an additional spelling decision in parent, chair and other words. Counts describe this word bank, not a lesson size.

## Set definitions

### S01 - Short-vowel spelling choices

**Teaching focus.** Practise the written vowel in a particular word, especially u in rubber/fluffy/jungle/junkyard and a in camel/cash/badger. Teach each contrast with the selected English audio.

**Sound-based risk.** An English vowel may be approximated with a familiar Indonesian vowel, giving raber or flafi; a child may also choose e for the vowel written a. These are spelling decisions, not a rule that English u always sounds like Indonesian a.

**School words.** gymnast, rubber, chimpanzee, cash, fluffy, junkyard, kayak, management, jungle, grandfather, camel, badger, lantern.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| rubber | `r_bber` | `u` | `["u","a","o"]` |
| camel | `c_mel` | `a` | `["a","e","u"]` |

### S02 - The vowel sound in queen: ee, ea, ie and particular word spellings

**Teaching focus.** Teach separate tracks for ee in queen/street/seesaw, ea in teacher/speakers/sneakers/eagle/peaceful, and ie in niece. Later compare the spellings for the same spoken vowel. Revisit the initial e of evening, e in centipede and the word-specific final vowel spelling of magazine.

**Sound-based risk.** Writing a single Indonesian i can produce kuin, strit or spikers. Choosing ee for ea is also a general English spelling error. Teach these tracks individually before mixing them; magazine is a later word-specific case.

**School words.** peaceful, street, chimpanzee, speakers, teacher, seesaw, evening, magazine, eagle, queen, sneakers, sleeveless, niece, centipede.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| queen | `qu_n` | `ee` | `["ee","i","ea"]` |
| speakers | `sp_kers` | `ea` | `["ea","ee","i"]` |
| niece | `n_ce` | `ie` | `["ie","i","ee"]` |

### S03 - The vowel sound in rain: ai and a spellings

**Teaching focus.** Learn ai in mailbox/rainbow and the a spelling in escape, bakery, eraser, graceful, vacation, staircase and toothpaste. Where applicable, connect a with its following consonant and e after the child knows the complete word.

**Sound-based risk.** The heard vowel may be written e or ei, producing renbow, eskeip or beikeri. Do not turn ai into an Indonesian pronunciation guide: use the English recording.

**School words.** mailbox, escape, vacation, toothpaste, graceful, staircase, eraser, earthquake, rainbow, bakery.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| rainbow | `r_nbow` | `ai` | `["ai","e","ay"]` |
| escape | `esc_pe` | `a` | `["a","ei","e"]` |
| bakery | `b_kery` | `a` | `["a","ei","e"]` |

### S04 - The vowel sound in roast: oa, ow, o and o-e

**Teaching focus.** Teach oa in roast/toaster, ow in elbow/rainbow/throwing, and o or o-e in joke, sofa, ocean, notice, telephone and postcard. Keep this sound separate from ow in shower/flowers, which belongs to S06.

**Sound-based risk.** An Indonesian-style o can replace oa or ow, producing rost, elbo or renbo. English learners can also confuse oa, ow and final-e spellings.

**School words.** roast, elbow, joke, sofa, ocean, telephone, throwing, notice, toaster, rainbow, postcard.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| roast | `r_st` | `oa` | `["oa","o","ow"]` |
| elbow | `elb_` | `ow` | `["ow","o","ou"]` |
| notice | `n_tice` | `o` | `["o","ow","oa"]` |

### S05 - The vowel sound in might: igh and i-e

**Teaching focus.** Teach igh in might/flight and the i-e pattern in rice/divide/crocodile. Kayak can be revisited here only after its specific spelling has been introduced in S22; its ay is not the usual English ay pattern.

**Sound-based risk.** Indonesian ai can produce mait, flait or divaid. Silent letters or final e can disappear from sound-based attempts.

**School words.** kayak, might, crocodile, flight, rice, divide.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| might | `m_t` | `igh` | `["igh","ai","i"]` |
| divide | `div_de` | `i` | `["i","ai","y"]` |

### S06 - The vowel sound in mouse: ou and ow

**Teaching focus.** Teach ou in mouse/couch and ow in shower/flowers. Compare with S04 only after both sounds are familiar: ow in flowers differs from ow in elbow.

**Sound-based risk.** Indonesian au or aw can produce maus, kauc, syawer or flauers. A correct spoken approximation can still need a different English spelling.

**School words.** mouse, flowers, shower, couch.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| mouse | `m_se` | `ou` | `["ou","au","ow"]` |
| shower | `sh_er` | `ow` | `["ow","au","ou"]` |
| flowers | `fl_ers` | `ow` | `["ow","au","ou"]` |

### S07 - The vowel sound in soup: oo, ou, ue and u

**Teaching focus.** Learn oo in balloon/toothpaste, ou in soup, ue in the blue part of blueberry, and u in ruler. Blue has adjacent ue; it is not a split u-e example.

**Sound-based risk.** A single Indonesian u can replace the English vowel spelling, producing balun, sup, tutpeis or bluberi. Teach the exact correspondence in each word.

**School words.** blueberry, toothpaste, balloon, ruler, soup.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| balloon | `ball_n` | `oo` | `["oo","u","ou"]` |
| soup | `s_p` | `ou` | `["ou","u","oo"]` |
| blueberry | `bl_berry` | `ue` | `["ue","u","oo"]` |

### S08 - Ea with the vowel in bed

**Teaching focus.** Teach ea in feather, weather and breakfast as a small family. Later contrast with the ea track in S02.

**Sound-based risk.** A child may write e because that matches the heard sound, as in fether or brekfes. The missing a is a spelling-memory target, not a sound the child should invent.

**School words.** feather, weather, breakfast.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| feather | `f_ther` | `ea` | `["ea","e","ee"]` |
| weather | `w_ther` | `ea` | `["ea","e","ee"]` |
| breakfast | `br_kfast` | `ea` | `["ea","e","ee"]` |

### S09 - Y used as a vowel

**Teaching focus.** Teach medial y in gymnast and syrup, then final y in skinny, fluffy, cherry, blueberry and bakery as a separate track. The medial and final vowel sounds need not be identical.

**Sound-based risk.** Indonesian i may replace y, producing gimnast, skini or bluberi. Syrup has regional pronunciation variants; describe the chosen recording rather than claiming y always has one sound.

**School words.** blueberry, skinny, syrup, gymnast, cherry, fluffy, bakery.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| gymnast | `g_mnast` | `y` | `["y","i","e"]` |
| skinny | `skinn_` | `y` | `["y","i","ie"]` |
| syrup | `s_rup` | `y` | `["y","e","u"]` |

### S10 - Vowels beside r: air, ar, or and ear

**Teaching focus.** Use separate word tracks for air in chair/staircase, ar in parent/carpet/postcard, or in workshop/gorgeous, and ear in earthquake. These spellings represent different vowels; never present them as one sound family.

**Sound-based risk.** The vowels heard in parent or staircase may suggest e or er, producing peren/perent or sterkeis. The written r may also be hard to hear in a non-rhotic English accent.

**School words.** parent, carpet, staircase, workshop, chair, earthquake, postcard, gorgeous.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| parent | `p_rent` | `a` | `["a","e","ai"]` |
| chair | `ch_` | `air` | `["air","er","eir"]` |
| earthquake | `_thquake` | `ear` | `["ear","er","ir"]` |

### S11 - Qu for the opening sounds in queen

**Teaching focus.** Teach qu as a spelling unit in queen, quiz, quilt and the quake part of earthquake.

**Sound-based risk.** Indonesian ku or a sound-based kw can produce kuin, kuis or kwilt. In qu, u does not stand for a separate Indonesian u vowel.

**School words.** quilt, queen, quiz, earthquake.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| queen | `_een` | `qu` | `["qu","ku","kw"]` |
| quiz | `_iz` | `qu` | `["qu","ku","kw"]` |
| quilt | `_ilt` | `qu` | `["qu","ku","kw"]` |

### S12 - Other consonant spelling choices: c, g, j, s, z and x

**Teaching focus.** Keep separate tracks: c/ck versus k for the sound in carpet/pickle; c versus s in December/rice/notice; g or dg versus j in gymnast/badger/cottage/management/gorgeous; s versus z in eraser and endings; x versus ks in mailbox. Hard g in eagle/jungle is a different track from soft g.

**Sound-based risk.** Indonesian c normally suggests the sound written ch in English, and j can suggest replacing English g/dg. Thus karpet, Desember, jimnast, bajer, erazer and meilboks need different local spelling decisions. These letter roles are word-specific here, not universal rules for all c or g.

**School words.** carpet, doctor, mailbox, peaceful, gymnast, escape, chimpanzee, cash, graceful, pickle, December, management, jungle, helicopter, magazine, staircase, crocodile, eagle, eraser, quiz, badger, notice, niece, office, postcard, cottage, rice, centipede, couch, gorgeous.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| carpet | `_arpet` | `c` | `["c","k","ck"]` |
| December | `De_ember` | `c` | `["c","s","z"]` |
| gymnast | `_ymnast` | `g` | `["g","j"]` |
| badger | `ba_er` | `dg` | `["dg","j","g"]` |
| mailbox | `mailbo_` | `x` | `["x","ks","k"]` |

### S13 - Sh, ch and tch

**Teaching focus.** Separate sh for the sound in cash/shower/shellfish/workshop from ch or tch for the sound in chair/cherry/teacher/chimpanzee/spinach/couch/switch. Ocean is an explicit later exception: its c represents the sound normally introduced with sh.

**Sound-based risk.** Indonesian sy or s may replace sh, while Indonesian c can replace English ch or tch: syelfis, ceri, ticer, spinic or kauc. Sh and ch are different sounds. Tch is a spelling group for the affricate, not three separately spoken consonants.

**School words.** chimpanzee, shellfish, cherry, ocean, cash, switch, teacher, workshop, shower, chair, spinach, couch.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| cash | `ca_` | `sh` | `["sh","s","sy"]` |
| chair | `_air` | `ch` | `["ch","c","tch"]` |
| switch | `swi_` | `tch` | `["tch","ch","c"]` |

### S14 - Th versus t or d

**Teaching focus.** Teach voiced th in feather/weather/grandfather separately from voiceless th in toothpaste/throwing/earthquake. Let the audio model the sound without making pronunciation accuracy a condition for answering the spelling.

**Sound-based risk.** Familiar t or d may replace th, producing feder, weder, tutpeis, trowing or grenfader.

**School words.** feather, toothpaste, weather, throwing, grandfather, earthquake.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| feather | `fea_er` | `th` | `["th","d","t"]` |
| throwing | `_rowing` | `th` | `["th","t","s"]` |
| toothpaste | `too_paste` | `th` | `["th","t","d"]` |

### S15 - F, ph and v

**Teaching focus.** Separate two tracks: ph represents the f sound in telephone; v is the required letter in vanilla, vacation, divide, adventure, evening and sleeveless. Where relevant, practise retaining f in words such as sofa/fluffy/office.

**Sound-based risk.** Sound-based f or Indonesian phone forms can produce telefon/telepon, and v may be approximated with f, giving fanila, difaid or ifning. Do not teach f and v as the same English sound.

**School words.** sofa, vacation, fluffy, telephone, evening, sleeveless, adventure, vanilla, office, divide.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| telephone | `tele_one` | `ph` | `["ph","f","p"]` |
| vanilla | `_anilla` | `v` | `["v","f","p"]` |
| evening | `e_ening` | `v` | `["v","f","p"]` |
| sofa | `so_a` | `f` | `["f","v","p"]` |

### S16 - Double consonants

**Teaching focus.** Practise bb, ff, nn, rr, tt, ll and ss in the words that actually contain them. Blueberry has rr in berry; its separated b letters are not a bb group. Ck in pickle is not a doubled consonant letter.

**Sound-based risk.** A doubled letter is often not recoverable as an extra consonant sound, so raber, skini, ceri, balun or ofis may omit it. General English errors also include doubling the wrong letter.

**School words.** blueberry, skinny, rubber, shellfish, bottle, cherry, glasses, fluffy, balloon, sleeveless, vanilla, office, cottage.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| rubber | `ru_er` | `bb` | `["b","bb","bh"]` |
| skinny | `ski_y` | `nn` | `["nn","n","nh"]` |
| balloon | `ba_oon` | `ll` | `["ll","l","lh"]` |
| blueberry | `bluebe_y` | `rr` | `["rr","r","re"]` |

### S17 - Weak or hard-to-hear syllables

**Teaching focus.** Practise the standard letters in unstressed syllables and endings: parent/carpet/doctor/camel/lantern; er in teacher/ruler/eraser/December; weak vowels in sofa, balloon, management, telephone, helicopter, restaurant and other longer words. E in evening may be weak or absent in natural speech, depending on the speaker.

**Sound-based risk.** The heard weak vowel may not identify its English letter. Attempts such as dokter, botol, sirep, megezin or venila can preserve much of the spoken word while choosing different written vowels. Indonesian itself has a schwa; do not explain this as an absence of schwa from Indonesian.

**School words.** parent, carpet, feather, doctor, syrup, rubber, escape, sofa, vacation, ocean, speakers, weather, December, teacher, dentist, management, telephone, balloon, flowers, grandfather, evening, helicopter, magazine, restaurant, crocodile, shower, eraser, sneakers, ruler, camel, breakfast, badger, notice, adventure, toaster, spinach, vanilla, office, lantern, bakery, cottage, divide, centipede, gorgeous.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| parent | `par_nt` | `e` | `["e","a","i"]` |
| doctor | `doct_r` | `o` | `["o","e","a"]` |
| camel | `cam_l` | `e` | `["e","a","u"]` |
| ruler | `rul_` | `er` | `["er","ar","ur"]` |
| syrup | `syr_p` | `u` | `["u","e","a"]` |

### S18 - Consonants and groups that get shortened or expanded

**Teaching focus.** Use separate tracks for initial groups such as str, fl, sn and sw; final groups such as nt/st/lt; and final written consonants. Practise standard spelling while avoiding added vowels or omitted letters.

**Sound-based risk.** A learner may insert a vowel, as in setrit/felait, or simplify a group, as in peren/dentis/kuil. This does not mean Indonesian cannot end words in consonants. Some letters may be unreleased or not clearly audible in the chosen English voice; never demand an invented extra syllable to justify them.

**School words.** parent, carpet, roast, mailbox, street, skinny, gymnast, toothpaste, glasses, fluffy, speakers, switch, quilt, junkyard, dentist, jungle, throwing, swings, flowers, grandfather, helicopter, staircase, workshop, restaurant, crocodile, sneakers, sleeveless, earthquake, breakfast, adventure, toaster, spinach, lantern, postcard, flight, centipede.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| street | `_reet` | `st` | `["st","set","s"]` |
| flight | `_ight` | `fl` | `["fl","fel","f"]` |
| parent | `pare_` | `nt` | `["nt","n","t"]` |
| dentist | `denti_` | `st` | `["st","s","t"]` |
| quilt | `qui_` | `lt` | `["lt","l","t"]` |

### S19 - Final e, retained base e and le endings

**Teaching focus.** Keep distinct tracks: final e in joke/escape/rice/divide/crocodile/centipede/telephone; le in bottle/pickle/jungle/eagle; e after c or g in notice/office/cottage; and retained base e in peaceful/graceful/management. Magazine is an explicit exception to a simple long-i final-e explanation.

**Sound-based risk.** Sound-based attempts may omit an unwritten-in-the-audio e or use el/ol for le. Teach le as a written ending, which may be pronounced with a weak vowel or a syllabic l. Do not claim every final e changes the preceding vowel, or that management must have a long a because manage contains a final e.

**School words.** peaceful, joke, escape, mouse, toothpaste, bottle, graceful, pickle, management, telephone, jungle, magazine, staircase, crocodile, eagle, earthquake, notice, niece, office, cottage, rice, divide, centipede.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| joke | `jok_` | `e` | `["e","","a"]` |
| bottle | `bott_` | `le` | `["le","el","ol"]` |
| office | `offic_` | `e` | `["e",""]` |
| management | `manag_ment` | `e` | `["e",""]` |

### S20 - Stable written endings

**Teaching focus.** Teach separate tracks for s/es, ing, er, ful, less, ment, tion and ture. Some are meaningful suffixes; others are useful spelling endings. Do not claim every recurring ending is a transparent meaning unit.

**Sound-based risk.** Hear-and-write attempts may use z for plural s, iz/is for es, in/eng for ing, full/fel for ful, men for ment or syen/shun for tion. An ending keeps its standard spelling even when its spoken form changes.

**School words.** peaceful, vacation, glasses, speakers, graceful, teacher, management, throwing, swings, flowers, evening, eraser, sneakers, sleeveless, adventure, toaster.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| flowers | `flower_` | `s` | `["s","z",""]` |
| glasses | `glass_` | `es` | `["es","is","iz","s"]` |
| throwing | `throw_` | `ing` | `["ing","in","eng"]` |
| peaceful | `peace_` | `ful` | `["ful","full","fel"]` |
| sleeveless | `sleeve_` | `less` | `["less","les","lis"]` |
| vacation | `vaca_` | `tion` | `["tion","syen","shun"]` |
| adventure | `adven_` | `ture` | `["ture","cer","cher"]` |
| management | `manage_` | `ment` | `["ment","men","mant"]` |

### S21 - Compound word building

**Teaching focus.** Build mailbox, rainbow, blueberry, shellfish, toothpaste, junkyard, grandfather, staircase, workshop, postcard and earthquake from useful word parts. Practise each part with English audio before recalling the complete spelling.

**Sound-based risk.** Remembering the meaning of an Indonesian compound or loan word does not supply the English spelling. Restore known English components instead of spelling the whole sound string from scratch. Do not assume that Indonesian-style pronunciation of each written component will produce the English word.

**School words.** mailbox, blueberry, shellfish, toothpaste, junkyard, grandfather, staircase, workshop, earthquake, rainbow, postcard.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| mailbox | `mail_` | `box` | `["box","boks","bok"]` |
| toothpaste | `_paste` | `tooth` | `["tooth","tut","toot"]` |
| postcard | `post_` | `card` | `["card","kard","kad"]` |

### S22 - Word-specific chunks and combined decisions

**Teaching focus.** Teach the distinctive spelling chunks in ocean, kayak, restaurant, gorgeous, management, helicopter, crocodile, centipede, adventure, vacation and magazine. Include the aw part of seesaw as its own vowel track. These are targeted word lessons and later integrations of earlier sets, not a rule that long words are automatically hardest.

**Sound-based risk.** A complete phonetic attempt can combine several changes, such as osyen, restoran, gorjes or helikopter. Start with the component decisions elsewhere in the map; combine them only after those parts have been introduced. For kayak, teach the actual chosen pronunciation and spelling without extending the usual ay rule from other English words.

**School words.** chimpanzee, vacation, ocean, kayak, management, telephone, seesaw, helicopter, magazine, restaurant, crocodile, adventure, centipede, gorgeous.

| Word | Template | Answer | Example choices |
| --- | --- | --- | --- |
| ocean | `o_` | `cean` | `["cean","syen","shen"]` |
| restaurant | `rest_rant` | `au` | `["au","o","a"]` |
| gorgeous | `gorge_` | `ous` | `["ous","us","uos"]` |
| kayak | `kay_k` | `a` | `["a","e","u"]` |
| helicopter | `heli_` | `copter` | `["copter","kopter","coptor"]` |
| seesaw | `sees_` | `aw` | `["aw","o","ow"]` |

## Suggested starting route

Use the four words already raised in the discussion first. Introduce their meaning and correct whole-word spelling before presenting alternatives. Practise only the failed component, then return to independent whole-word spelling later.

| Word / attempt | First decision | Next decision | Further practice if needed |
| --- | --- | --- | --- |
| rubber / raber | S01: `r_bber` -> u | S16: `ru_er` -> bb | S17: `rubb_` -> er |
| queen / kuin | S11: `_een` -> qu | S02: `qu_n` -> ee | Combine qu + ee + n, then spell independently. |
| parent / peren | S10: `p_rent` -> a | S18: `pare_` -> nt | S17: `par_nt` -> e only if that vowel also causes difficulty. |
| rainbow / renbow | S03: `r_nbow` -> ai | S04: `rainb_` -> ow | S21: rain + bow, then spell independently. |

After these anchors, add short subtracks based on his answers: S13 sh/ch, S14 th, S15 v/ph, S17 quiet syllables and S18 consonant groups. Expand vowel families in S02-S10, then practise the ending and word-building tracks in S19-S21. Use S22 for specific chunks and integration once the relevant component decisions have been introduced.

One set can span several sessions, and a session can mix several sets. Do not make mastery of an entire set a gate before a child can revisit a familiar word. A correct answer with visible letters is supported practice; later whole-word answers without spelling support are the stronger check of recall.

## Full school-word mapping

Every current school word appears once in this mapping. Primary is an administrative teaching focus, not an instruction to teach that set before its listed component sets. Additional sets select useful review targets; the list need not represent every possible exercise for a word.

| Word | Primary set | Additional practice sets |
| --- | --- | --- |
| parent | S17 | S10, S18 |
| carpet | S12 | S10, S17, S18 |
| feather | S14 | S08, S17 |
| doctor | S12 | S17 |
| roast | S04 | S18 |
| mailbox | S03 | S12, S18, S21 |
| peaceful | S20 | S02, S12, S19 |
| elbow | S04 | None required initially |
| street | S02 | S18 |
| blueberry | S16 | S07, S09, S21 |
| skinny | S16 | S09, S18 |
| syrup | S09 | S17 |
| gymnast | S12 | S01, S09, S18 |
| joke | S19 | S04 |
| rubber | S01 | S16, S17 |
| escape | S03 | S12, S17, S19 |
| chimpanzee | S13 | S01, S02, S12, S22 |
| sofa | S04 | S15, S17 |
| mouse | S06 | S19 |
| shellfish | S13 | S16, S21 |
| vacation | S20 | S03, S15, S17, S22 |
| toothpaste | S21 | S03, S07, S14, S18, S19 |
| bottle | S19 | S16 |
| cherry | S13 | S09, S16 |
| ocean | S22 | S04, S13, S17 |
| cash | S13 | S01, S12 |
| glasses | S20 | S16, S18 |
| fluffy | S01 | S09, S15, S16, S18 |
| speakers | S02 | S17, S18, S20 |
| switch | S13 | S18 |
| quilt | S11 | S18 |
| junkyard | S01 | S18, S21 |
| graceful | S20 | S03, S12, S19 |
| pickle | S19 | S12 |
| kayak | S22 | S01, S05 |
| weather | S14 | S08, S17 |
| might | S05 | None required initially |
| December | S12 | S17 |
| teacher | S13 | S02, S17, S20 |
| dentist | S18 | S17 |
| management | S22 | S01, S12, S17, S19, S20 |
| telephone | S15 | S04, S17, S19, S22 |
| jungle | S19 | S01, S12, S18 |
| seesaw | S02 | S22 |
| throwing | S04 | S14, S18, S20 |
| swings | S18 | S20 |
| balloon | S07 | S16, S17 |
| flowers | S06 | S17, S18, S20 |
| grandfather | S21 | S01, S14, S17, S18 |
| evening | S15 | S02, S17, S20 |
| helicopter | S22 | S12, S17, S18 |
| magazine | S22 | S02, S12, S17, S19 |
| staircase | S21 | S03, S10, S12, S18, S19 |
| workshop | S21 | S10, S13, S18 |
| restaurant | S22 | S17, S18 |
| crocodile | S22 | S05, S12, S17, S18, S19 |
| eagle | S02 | S12, S19 |
| shower | S13 | S06, S17 |
| eraser | S03 | S12, S17, S20 |
| queen | S11 | S02 |
| sneakers | S02 | S17, S18, S20 |
| ruler | S17 | S07 |
| quiz | S11 | S12 |
| chair | S13 | S10 |
| sleeveless | S20 | S02, S15, S16, S18 |
| earthquake | S21 | S03, S10, S11, S14, S18, S19 |
| camel | S01 | S17 |
| soup | S07 | None required initially |
| breakfast | S08 | S17, S18 |
| badger | S12 | S01, S17 |
| notice | S04 | S12, S17, S19 |
| adventure | S20 | S15, S17, S18, S22 |
| toaster | S04 | S17, S18, S20 |
| spinach | S13 | S17, S18 |
| vanilla | S15 | S16, S17 |
| niece | S02 | S12, S19 |
| office | S16 | S12, S15, S17, S19 |
| lantern | S17 | S01, S18 |
| rainbow | S03 | S04, S21 |
| bakery | S03 | S09, S17 |
| postcard | S21 | S04, S10, S12, S18 |
| flight | S05 | S18 |
| cottage | S16 | S12, S17, S19 |
| rice | S05 | S12, S19 |
| divide | S05 | S15, S17, S19 |
| centipede | S22 | S02, S12, S17, S18, S19 |
| couch | S06 | S12, S13 |
| gorgeous | S22 | S10, S12, S17 |

## Content authoring rules for the next step

1. Use one tricky-part row per local decision, with the ten columns defined below. Multiple rows can share a word and set. Keep trick_id stable when revising distractors or feedback.
2. Give each subtrack a specific pattern identifier. For example, vowel_u and double_b are distinct patterns for rubber; parent_vowel_a and parent_final_nt are distinct patterns for parent. The broad set name alone is not enough to identify the mistake.
3. Preserve natural English audio and the standard target spelling. Choose a consistent pronunciation source before finalising sound explanations. Accept normal accent differences; do not add imaginary spoken letters to justify a spelling.
4. Do not write Indonesian phonetic attempts as pronunciation instructions or as answers to memorise. Use them as controlled contrasts against the standard English spelling.
5. Teach the correct form first. Reveal and explain the specific contrast after a wrong answer, then hide the spelling before a later recall attempt. Keep feedback factual and short, such as: In rubber, this vowel is written u; or: Remember bb in rubber.
6. Keep different sounds and different spelling functions separate within a set. In particular, sh versus ch, the two th sounds, f versus v, the two ow sounds, ea in feather versus teacher, and final e versus le need distinct subtracks.
7. Treat meaningful compounds, suffixes and spelling chunks accurately. Seesaw is handled as spelling chunks here without claiming see + saw is a transparent meaning-based compound. Break + fast must not become an instruction to pronounce breakfast like its standalone components.
8. Use the supplied context for homophones and real-word distractors. A valid modern alternative spelling of the same target word must not be labelled wrong. The current English/Indonesian group labels are authoring categories, not empirical frequency rankings.
9. The existing word CSV remains the whole-word source. Curate local distractors separately in the companion CSV. Do not derive them by blindly slicing whole-word errors.

## Tricky-part CSV structure

The current file contains 238 initial challenges across all 88 school words and all 22 sets. It covers selected spelling decisions rather than every possible error. Rows are grouped in school-word order; file order does not define lesson order.

| Column | Meaning |
| --- | --- |
| trick_id | Unique, stable challenge ID, such as rubber_double_b. Use this for challenge progress. |
| word | Exact key in school-words.csv, including the capital D in December. |
| set_id | Owning content set, S01-S22. It must be one of the word's mapped sets. |
| pattern_id | Specific spelling decision, such as short_u, double_b or qu_kw. Shared IDs support practice across words. |
| template | Target spelling with exactly one underscore replacing a variable-length chunk. |
| answer | Correct replacement chunk. Inserting it must reconstruct word exactly. |
| indonesian_distractors | JSON array of wrong chunks motivated by plausible Indonesian sound-based transfer. |
| english_distractors | JSON array of wrong chunks motivated by general English spelling confusion or letter errors. |
| context_required | Lowercase true or false. True requires a meaning or sentence cue because a distractor can form a different real word or otherwise create ambiguity. |
| explanation | Brief feedback shown after answering. It may reveal the correct spelling. |

The two distractor fields contain JSON arrays inside quoted CSV fields. Parse the CSV first, then JSON-parse each array. An empty array means that category has no candidates. An empty string inside an array is an intentional choice meaning no letters. Do not confuse either with missing data. Parse context_required explicitly as a boolean; the text false must not become a truthy value.

The category labels describe authoring rationale, not proven frequencies or exclusive groups of learners. A candidate can occur in both arrays. The exact proposed chunks have not been validated against this child's answers. The requested bh option for rubber is retained as a structural contrast; it is not claimed to be a common error. Do not add weak options merely to reach a fixed choice count.

Examples of the stored decisions:

| trick_id | Template | Answer | Indonesian wrong chunks | English wrong chunks |
| --- | --- | --- | --- | --- |
| rubber_short_u | r_bber | u | ["a"] | ["a","o"] |
| rubber_double_b | ru_er | bb | ["b"] | ["b","bh"] |
| parent_final_nt | pare_ | nt | ["n"] | ["n","t"] |
| queen_qu_kw | _een | qu | ["ku","kw"] | ["kw","q","qw"] |

### Presenting the challenge

1. Join word to school-words.csv to obtain its context sentence. Supply a target-identifying cue, normally natural English audio. A false context_required flag does not mean the template alone is sufficient.
2. If context_required is true, also give the meaning through a suitable picture, Indonesian clue or context sentence. For example, r_bber also permits robber, so identify the intended word. For weather, wether is a different real word that sounds the same.
3. If showing the context sentence as text before answering, mask every occurrence of the target. The existing sentences contain the correct spelling and would reveal the answer. Alternatively, read the sentence aloud. Keep image, Indonesian meaning and audio references at word level when those assets are authored later.
4. Select a small number of wrong chunks from the appropriate banks. Normally use one Indonesian candidate and one general English candidate when distinct useful options exist. Deduplicate the combined choices and include answer exactly once. Use two choices when there is only one useful wrong chunk. Shuffle the visible options.
5. Render one constant-looking blank regardless of answer length. Label an empty-string choice as no letters. Compare the selected chunk with answer, then show the reconstructed correct word and explanation.
6. Save progress separately from content, keyed by trick_id. Use pattern_id to find related practice. Later whole-word recall is still needed because the visible template supplies spelling support.

### Content checks

Each row must have a unique ID, a valid word/set link, one replacement slot, a nonempty answer, and at least one distinct wrong chunk. Each bank must contain unique strings and must exclude answer. Combining the banks may create duplicates; remove those at presentation time. Validate every reconstructed option and exclude accepted modern alternative spellings of the same target. In particular, sirup is not a wrong spelling of syrup, and kaiak/kyak must not be wrong choices for kayak. Dictionary matches require contextual review because broad word lists also include obsolete forms, abbreviations and unrelated words.

## Coverage check

- 22 sets with stable identifiers S01-S22.
- 88 unique school words mapped, matching the current CSV.
- 81 example challenges checked: exactly one underscore, the answer reconstructs the word, and the correct answer occurs once in its choices.
- All example words are assigned to the set where the example appears.
- 238 CSV challenges cover all 88 school words and all 22 sets. Replacement chunks, IDs, word/set links and JSON arrays are validated during export.
- Word data, context sentences and current whole-word distractor columns are preserved.
