/* Word banks used by the title, name, poem, song and prompt generators. */

export const BANK = {
  adjective: [
    'quiet', 'restless', 'golden', 'hollow', 'bright', 'bitter', 'endless',
    'fragile', 'gentle', 'hidden', 'lonely', 'ancient', 'reckless', 'silent',
    'stubborn', 'tender', 'wild', 'crooked', 'luminous', 'weathered', 'brave',
    'crimson', 'distant', 'faithful', 'forgotten', 'frozen', 'honest',
    'invisible', 'patient', 'ruthless', 'sacred', 'shattered', 'sudden',
    'unfinished', 'velvet', 'wandering', 'brittle', 'humming', 'sleepless',
  ],
  noun: [
    'echo', 'harbour', 'lantern', 'threshold', 'compass', 'orchard', 'tide',
    'archive', 'balcony', 'canyon', 'chapel', 'corridor', 'garden', 'glass',
    'horizon', 'island', 'kitchen', 'ladder', 'library', 'meadow', 'mirror',
    'orbit', 'railway', 'river', 'rooftop', 'season', 'shoreline', 'stairwell',
    'station', 'summer', 'thunder', 'valley', 'window', 'winter', 'letter',
    'machine', 'signal', 'shadow', 'silence',
  ],
  plural: [
    'echoes', 'harbours', 'lanterns', 'thresholds', 'orchards', 'tides',
    'archives', 'canyons', 'corridors', 'gardens', 'horizons', 'islands',
    'ladders', 'libraries', 'meadows', 'mirrors', 'rivers', 'rooftops',
    'seasons', 'stairwells', 'stations', 'valleys', 'windows', 'letters',
    'machines', 'signals', 'shadows', 'silences', 'promises', 'strangers',
  ],
  abstract: [
    'memory', 'grief', 'courage', 'longing', 'wonder', 'doubt', 'faith',
    'hunger', 'mercy', 'patience', 'ruin', 'solitude', 'wanderlust', 'gravity',
    'inheritance', 'nostalgia', 'reckoning', 'surrender', 'tenderness',
  ],
  place: [
    'Blackwater', 'Ashford', 'Marrowvale', 'Northgate', 'Silverbrook',
    'Thornfield', 'Greyhollow', 'Larkspur', 'Windmere', 'Copperfield',
    'Foxglove', 'Ravenswood', 'Stonebridge', 'Wren Harbour', 'Halloway',
  ],
  verbGerund: [
    'chasing', 'leaving', 'burning', 'holding', 'losing', 'building',
    'breaking', 'learning', 'waiting', 'crossing', 'counting', 'keeping',
    'naming', 'reading', 'running', 'saving', 'singing', 'stealing',
  ],
  season: ['spring', 'summer', 'autumn', 'winter', 'midwinter', 'harvest'],
  number: ['3', '5', '7', '9', '10', '12', '15', '21', '25', '30', '50', '101'],
  timeframe: [
    'in 2026', 'this year', 'in 30 days', 'before Friday', 'in one weekend',
    'in under an hour', 'from day one', 'this quarter',
  ],
  audience: [
    'beginners', 'busy founders', 'freelancers', 'students', 'marketers',
    'writers', 'developers', 'small teams', 'first-time managers',
    'remote workers', 'parents', 'creators',
  ],
  benefit: [
    'save hours every week', 'stop second-guessing yourself',
    'get more replies', 'write faster', 'rank higher on Google',
    'cut your costs', 'finally finish it', 'sound more confident',
    'double your output', 'never miss a deadline',
  ],
  topicVerb: [
    'master', 'fix', 'simplify', 'automate', 'rethink', 'improve', 'audit',
    'launch', 'plan', 'scale', 'streamline', 'document',
  ],
  powerWord: [
    'proven', 'essential', 'complete', 'practical', 'honest', 'simple',
    'definitive', 'no-nonsense', 'field-tested', 'surprisingly effective',
  ],
  emotion: [
    'without the stress', 'without burning out', 'and actually enjoy it',
    'even if you hate it', 'without starting over', 'the calm way',
  ],
  format: [
    'guide', 'checklist', 'playbook', 'framework', 'walkthrough', 'breakdown',
    'case study', 'field guide', 'blueprint', 'cheat sheet',
  ],
  question: ['How', 'Why', 'What', 'When', 'Where', 'Who'],
}

export const NAME_BANKS = {
  fantasyFirst: [
    'Aer', 'Bran', 'Cael', 'Dain', 'Eir', 'Fen', 'Gath', 'Hal', 'Ith', 'Jor',
    'Kaen', 'Lyr', 'Mor', 'Nym', 'Orin', 'Pyr', 'Quen', 'Rhys', 'Sael', 'Thal',
    'Ul', 'Vas', 'Wyn', 'Xan', 'Yr', 'Zeph',
  ],
  fantasySuffix: [
    'ion', 'iel', 'wyn', 'dor', 'ara', 'eth', 'ryn', 'las', 'mir', 'thas',
    'ven', 'ora', 'ax', 'ise', 'anor', 'ella', 'ric', 'undel',
  ],
  humanFirstF: [
    'Ada', 'Alice', 'Amara', 'Beatrix', 'Clara', 'Delphine', 'Edith', 'Elena',
    'Freya', 'Greta', 'Hazel', 'Imogen', 'Juno', 'Kira', 'Lena', 'Maeve',
    'Nadia', 'Odette', 'Priya', 'Rosa', 'Sabine', 'Tamsin', 'Ursula', 'Vera',
    'Willa', 'Zara',
  ],
  humanFirstM: [
    'Abel', 'Bertram', 'Caleb', 'Desmond', 'Elias', 'Felix', 'Gideon', 'Hugo',
    'Isaac', 'Jonas', 'Kester', 'Linus', 'Milo', 'Nathaniel', 'Oscar', 'Percy',
    'Quentin', 'Rufus', 'Silas', 'Theo', 'Ulric', 'Victor', 'Wendell', 'Xavier',
    'Yusuf', 'Zachary',
  ],
  humanFirstN: [
    'Ari', 'Blake', 'Cass', 'Devon', 'Ellis', 'Frankie', 'Gray', 'Harper',
    'Indigo', 'Jules', 'Kai', 'Lark', 'Marlow', 'Noor', 'Oakley', 'Phoenix',
    'Quinn', 'Reese', 'Sage', 'Tatum', 'Vale', 'Wren', 'Yael', 'Zion',
  ],
  surname: [
    'Ashcombe', 'Barlow', 'Cavendish', 'Draper', 'Ellery', 'Fairweather',
    'Gallagher', 'Hawkins', 'Ingram', 'Jarvis', 'Keating', 'Lockwood',
    'Merrick', 'Nightingale', 'Osgood', 'Pemberton', 'Quill', 'Radcliffe',
    'Sinclair', 'Thackeray', 'Underwood', 'Vance', 'Whitlock', 'Yarrow',
    'Ziegler', 'Bramble', 'Crowe', 'Dunmore', 'Fenwick', 'Grimsby',
  ],
  epithet: [
    'the Unyielding', 'the Quiet', 'of the Northwatch', 'the Twice-Born',
    'Stormcaller', 'the Ashen', 'Ironhand', 'the Fox', 'Nightwarden',
    'the Undrowned', 'Emberheart', 'the Last', 'of Thornfield',
  ],
  scifiFirst: [
    'Ax', 'Cyr', 'Dex', 'Eko', 'Ferr', 'Hexa', 'Iri', 'Jax', 'Kel', 'Lux',
    'Myr', 'Nex', 'Orb', 'Prax', 'Quor', 'Ryx', 'Syn', 'Tev', 'Vex', 'Zyn',
  ],
  scifiSuffix: ['-9', '-Prime', 'ari', 'ex', 'ova', 'ir', 'on', 'us', 'yn', 'aax'],
  pokemonStart: [
    'Bulba', 'Char', 'Squirt', 'Pika', 'Jiggly', 'Meow', 'Psy', 'Gee', 'Onix',
    'Snor', 'Eve', 'Vapor', 'Jolt', 'Flare', 'Drago', 'Mew', 'Zap', 'Arti',
    'Molt', 'Gasti', 'Hita', 'Krab', 'Volt', 'Magne', 'Rhy', 'Chan', 'Tangel',
    'Lap', 'Ditt', 'Porygo', 'Omany', 'Kabu', 'Aero', 'Snea', 'Tyra', 'Lugi',
  ],
  pokemonEnd: [
    'saur', 'mander', 'tle', 'chu', 'puff', 'th', 'duck', 'dude', 'lax', 'ee',
    'eon', 'nite', 'two', 'dos', 'cuno', 'res', 'ly', 'mie', 'by', 'orb',
    'ette', 'ick', 'ini', 'ora', 'zor', 'tar', 'ia', 'go', 'don', 'king',
  ],
  petName: [
    'Biscuit', 'Bandit', 'Clover', 'Dumpling', 'Ember', 'Fig', 'Ginger',
    'Hopper', 'Juniper', 'Kiwi', 'Marbles', 'Noodle', 'Olive', 'Pepper',
    'Pickles', 'Rusty', 'Sable', 'Tofu', 'Waffles', 'Ziggy',
  ],
  bandAdjective: [
    'Velvet', 'Electric', 'Midnight', 'Neon', 'Paper', 'Plastic', 'Royal',
    'Silver', 'Static', 'Wooden', 'Glass', 'Iron', 'Lonely', 'Modern',
  ],
  bandNoun: [
    'Coyotes', 'Ghosts', 'Lanterns', 'Machines', 'Monarchs', 'Orchards',
    'Pilots', 'Revival', 'Saints', 'Sirens', 'Skyline', 'Tigers', 'Union',
    'Wolves', 'Youth',
  ],
  businessPrefix: [
    'North', 'Bright', 'Clear', 'True', 'Swift', 'Blue', 'Ever', 'Prime',
    'Core', 'Loft', 'Kind', 'Open', 'Solid', 'Well',
  ],
  businessSuffix: [
    'peak', 'lane', 'works', 'labs', 'forge', 'craft', 'bridge', 'grove',
    'harbor', 'nest', 'point', 'stone', 'wave', 'yard',
  ],
}

export const POEM_BANKS = {
  opening: [
    'The {noun} keeps what the {season} took',
    'I did not know the {noun} could hold so much {abstract}',
    'Morning arrives like a {adjective} {noun}',
    'There is a {noun} at the end of every {noun}',
    'Nobody warned me about the {adjective} part',
  ],
  middle: [
    'and still the {plural} go on {verbGerund},',
    'as if {abstract} were a room you could leave,',
    'the way water forgives the {noun} it breaks on,',
    'counting the {plural} we never named,',
    'and I keep the {noun} in my pocket like proof,',
  ],
  closing: [
    'so let the {noun} be enough for tonight.',
    'and that is how {abstract} learns your name.',
    'I am still {verbGerund}. I am still here.',
    'the {season} will ask for nothing back.',
    'we call it {abstract} because we have to call it something.',
  ],
}

export const SONG_BANKS = {
  verse: [
    "I was {verbGerund} down a {adjective} {noun}",
    "You said the {noun} would look different in the {season}",
    "There's a light on in the {noun} where we used to talk",
    "Every {noun} in this town knows your name but mine",
  ],
  chorus: [
    "So hold on, hold on to the {adjective} {noun}",
    "And I'd cross every {noun} just to hear you say it",
    "We were {adjective}, we were golden, we were never gonna land",
    "Take me back to the {season}, back before the {noun} broke",
  ],
  bridge: [
    "Maybe {abstract} is just another word for staying",
    "I stopped {verbGerund} the day you stopped calling",
    "The {plural} don't remember, but I do",
  ],
}

export const FORTUNES = [
  'The work you keep postponing is smaller than you think.',
  'A conversation you are avoiding will turn out kinder than expected.',
  'Do not confuse being busy with being close to done.',
  'Someone will remember your patience long after they forget your advice.',
  'The next good idea will arrive while you are doing something else.',
  'Say the true thing, then stop talking.',
  'Your second draft will be braver than your first.',
  'A small habit begun this week outlasts a grand plan made today.',
  'The door you thought was locked was only heavy.',
  'You are further along than your notes suggest.',
  'Rest is part of the method, not a reward for finishing.',
  'Choose the version you can maintain, not the version that impresses.',
  'What feels like a detour is collecting something you will need.',
  'The person you should ask is easier to reach than you assume.',
  'Finish one thing badly rather than three things halfway.',
  'Luck is mostly a matter of having sent the message.',
  'You will soon be grateful you wrote it down.',
  'Trust the quiet opinion you keep returning to.',
  'A generous edit is worth more than a clever line.',
  'Tomorrow will not be less busy. Begin anyway.',
]

export const LUCKY_MESSAGES = [
  'Learn Chinese: 朋友 (péng yǒu) — friend',
  'Learn Chinese: 幸运 (xìng yùn) — lucky',
  'Learn Chinese: 耐心 (nài xīn) — patience',
  'Learn Chinese: 开始 (kāi shǐ) — to begin',
  'Learn Chinese: 谢谢 (xiè xiè) — thank you',
]

export const BACKSTORY_BANKS = {
  origin: [
    'raised by a grandmother who never explained anything twice',
    'the youngest of six in a river town that flooded every spring',
    'left at a monastery gate with a name stitched into the blanket',
    'born on the road between two cities that both claimed them',
    'the only child of a clockmaker who talked to the clocks',
    'grew up above a bakery and still cannot sleep without the smell of yeast',
  ],
  turningPoint: [
    'a fire that took the workshop but not the notebooks',
    'a letter that arrived eleven years late',
    'the winter the harbour froze and the ships stopped coming',
    'a debt inherited from a father they had never met',
    'the night they chose the wrong side of an argument and were right anyway',
    'a stranger who paid their passage and asked for nothing',
  ],
  skill: [
    'can read a room faster than a page',
    'knows every back alley in three cities',
    'mends anything with a hinge',
    'remembers voices but never faces',
    'can talk a crowd down from anything',
    'reads six languages and speaks two badly',
  ],
  flaw: [
    'cannot leave a question unanswered, even a dangerous one',
    'lies fluently about small things and badly about large ones',
    'keeps every promise except the ones made to themselves',
    'trusts competence far more than kindness',
    'flinches at gratitude',
    'measures everyone against someone long gone',
  ],
  want: [
    'to buy back the family workshop',
    'to hear one person say they were right',
    'to find the sibling who stopped writing',
    'to finish the map nobody asked for',
    'to be forgiven without having to explain',
    'to leave, finally, and mean it',
  ],
  secret: [
    'they were the one who let the door stand open',
    'the name on their papers belongs to someone else',
    'they still write letters to an address that no longer exists',
    'they cannot actually do the thing everyone hired them for',
    'they took the money and gave it away out of guilt',
  ],
}

/**
 * Parts for the Pokemon name generator.
 *
 * `roots` carry the type. Each has two flavours: invented syllables for a made
 * up name, and plain English words for when the fake-name switch is off.
 *
 * `ends` are grouped by the sound of the ending, not by anything about the
 * creature — a Pokemon has no gender in the way a person does. Hard endings sit
 * under `male`, soft ones under `female`, and short flat ones under
 * `nonbinary`, which is what makes the four choices audibly different.
 */
export const POKEMON_BANKS = {
  roots: {
    Fire: { fake: ['Char', 'Pyra', 'Ignis', 'Vulca', 'Ashen'], real: ['Ember', 'Blaze', 'Cinder', 'Scorch', 'Flare'] },
    Water: { fake: ['Vapor', 'Aqua', 'Marin', 'Nauti', 'Tsuna'], real: ['Tide', 'Ripple', 'Current', 'Splash', 'Coral'] },
    Grass: { fake: ['Bulba', 'Chloro', 'Verda', 'Sylva', 'Petali'], real: ['Bramble', 'Thorn', 'Fern', 'Moss', 'Bloom'] },
    Electric: { fake: ['Volta', 'Zappa', 'Ampe', 'Jolti', 'Ioni'], real: ['Spark', 'Storm', 'Static', 'Surge', 'Bolt'] },
    Psychic: { fake: ['Psy', 'Mesma', 'Onira', 'Telka', 'Auri'], real: ['Dream', 'Echo', 'Mind', 'Vision', 'Whisper'] },
    Rock: { fake: ['Onix', 'Petra', 'Grani', 'Basalt', 'Geoda'], real: ['Boulder', 'Granite', 'Slate', 'Quarry', 'Flint'] },
    Ghost: { fake: ['Gasti', 'Umbra', 'Wraithe', 'Spectr', 'Hollo'], real: ['Shadow', 'Hollow', 'Veil', 'Dusk', 'Mourn'] },
    Ice: { fake: ['Glacia', 'Cryo', 'Nivea', 'Frosti', 'Hailo'], real: ['Frost', 'Glacier', 'Icicle', 'Winter', 'Snow'] },
    Dragon: { fake: ['Drago', 'Wyver', 'Serpen', 'Ryuji', 'Salaman'], real: ['Scale', 'Talon', 'Wyrm', 'Roar', 'Ridge'] },
    Steel: { fake: ['Ferra', 'Magne', 'Chroma', 'Alloya', 'Rivet'], real: ['Iron', 'Anvil', 'Rivet', 'Forge', 'Chrome'] },
    Flying: { fake: ['Aero', 'Zephy', 'Avia', 'Pluma', 'Cirro'], real: ['Gale', 'Feather', 'Sky', 'Drift', 'Cloud'] },
    Dark: { fake: ['Noctu', 'Sabla', 'Umbre', 'Corvi', 'Tenebra'], real: ['Midnight', 'Raven', 'Cinder', 'Silence', 'Onyx'] },
  },
  ends: {
    any: ['saur', 'mander', 'tle', 'chu', 'puff', 'eon', 'nite', 'orb', 'ini', 'go'],
    male: ['don', 'zor', 'tar', 'rex', 'gon', 'kron', 'thor', 'max'],
    female: ['ette', 'ia', 'ora', 'lyn', 'ina', 'elle', 'ara', 'issa'],
    nonbinary: ['ix', 'ex', 'yn', 'is', 'ol', 'un', 'ar', 'em'],
  },
  realEnds: {
    any: ['paw', 'wing', 'tail', 'mane', 'hide', 'coat'],
    male: ['fang', 'claw', 'horn', 'tusk', 'jaw', 'maw'],
    female: ['bloom', 'song', 'plume', 'silk', 'lace', 'dew'],
    nonbinary: ['step', 'shade', 'drift', 'gaze', 'wisp', 'trail'],
  },
}

export const SPEECH_BANKS = {
  hook: [
    'I want to start with something I got wrong.',
    'Ten years ago I would have disagreed with everything I am about to say.',
    'There is a question I get asked more than any other.',
    'Let me tell you about the day the plan fell apart.',
    'I am going to make one argument, and I am going to make it plainly.',
  ],
  transition: [
    'Here is what that taught me.', 'But that is only half the story.',
    'And this is where it gets interesting.', 'So what do we do about it?',
    'Which brings me to the part that matters.',
  ],
  closer: [
    'So here is what I am asking of you.',
    'If you remember one thing from tonight, let it be this.',
    'The work is not finished, and that is exactly the point.',
    'Thank you — and I mean that in the specific way, not the polite way.',
    'Let us be the reason someone else gets an easier start.',
  ],
}

export const US_STATES = [
  { name: 'Alabama', abbr: 'AL', capital: 'Montgomery', region: 'South' },
  { name: 'Alaska', abbr: 'AK', capital: 'Juneau', region: 'West' },
  { name: 'Arizona', abbr: 'AZ', capital: 'Phoenix', region: 'West' },
  { name: 'Arkansas', abbr: 'AR', capital: 'Little Rock', region: 'South' },
  { name: 'California', abbr: 'CA', capital: 'Sacramento', region: 'West' },
  { name: 'Colorado', abbr: 'CO', capital: 'Denver', region: 'West' },
  { name: 'Connecticut', abbr: 'CT', capital: 'Hartford', region: 'Northeast' },
  { name: 'Delaware', abbr: 'DE', capital: 'Dover', region: 'South' },
  { name: 'Florida', abbr: 'FL', capital: 'Tallahassee', region: 'South' },
  { name: 'Georgia', abbr: 'GA', capital: 'Atlanta', region: 'South' },
  { name: 'Hawaii', abbr: 'HI', capital: 'Honolulu', region: 'West' },
  { name: 'Idaho', abbr: 'ID', capital: 'Boise', region: 'West' },
  { name: 'Illinois', abbr: 'IL', capital: 'Springfield', region: 'Midwest' },
  { name: 'Indiana', abbr: 'IN', capital: 'Indianapolis', region: 'Midwest' },
  { name: 'Iowa', abbr: 'IA', capital: 'Des Moines', region: 'Midwest' },
  { name: 'Kansas', abbr: 'KS', capital: 'Topeka', region: 'Midwest' },
  { name: 'Kentucky', abbr: 'KY', capital: 'Frankfort', region: 'South' },
  { name: 'Louisiana', abbr: 'LA', capital: 'Baton Rouge', region: 'South' },
  { name: 'Maine', abbr: 'ME', capital: 'Augusta', region: 'Northeast' },
  { name: 'Maryland', abbr: 'MD', capital: 'Annapolis', region: 'South' },
  { name: 'Massachusetts', abbr: 'MA', capital: 'Boston', region: 'Northeast' },
  { name: 'Michigan', abbr: 'MI', capital: 'Lansing', region: 'Midwest' },
  { name: 'Minnesota', abbr: 'MN', capital: 'Saint Paul', region: 'Midwest' },
  { name: 'Mississippi', abbr: 'MS', capital: 'Jackson', region: 'South' },
  { name: 'Missouri', abbr: 'MO', capital: 'Jefferson City', region: 'Midwest' },
  { name: 'Montana', abbr: 'MT', capital: 'Helena', region: 'West' },
  { name: 'Nebraska', abbr: 'NE', capital: 'Lincoln', region: 'Midwest' },
  { name: 'Nevada', abbr: 'NV', capital: 'Carson City', region: 'West' },
  { name: 'New Hampshire', abbr: 'NH', capital: 'Concord', region: 'Northeast' },
  { name: 'New Jersey', abbr: 'NJ', capital: 'Trenton', region: 'Northeast' },
  { name: 'New Mexico', abbr: 'NM', capital: 'Santa Fe', region: 'West' },
  { name: 'New York', abbr: 'NY', capital: 'Albany', region: 'Northeast' },
  { name: 'North Carolina', abbr: 'NC', capital: 'Raleigh', region: 'South' },
  { name: 'North Dakota', abbr: 'ND', capital: 'Bismarck', region: 'Midwest' },
  { name: 'Ohio', abbr: 'OH', capital: 'Columbus', region: 'Midwest' },
  { name: 'Oklahoma', abbr: 'OK', capital: 'Oklahoma City', region: 'South' },
  { name: 'Oregon', abbr: 'OR', capital: 'Salem', region: 'West' },
  { name: 'Pennsylvania', abbr: 'PA', capital: 'Harrisburg', region: 'Northeast' },
  { name: 'Rhode Island', abbr: 'RI', capital: 'Providence', region: 'Northeast' },
  { name: 'South Carolina', abbr: 'SC', capital: 'Columbia', region: 'South' },
  { name: 'South Dakota', abbr: 'SD', capital: 'Pierre', region: 'Midwest' },
  { name: 'Tennessee', abbr: 'TN', capital: 'Nashville', region: 'South' },
  { name: 'Texas', abbr: 'TX', capital: 'Austin', region: 'South' },
  { name: 'Utah', abbr: 'UT', capital: 'Salt Lake City', region: 'West' },
  { name: 'Vermont', abbr: 'VT', capital: 'Montpelier', region: 'Northeast' },
  { name: 'Virginia', abbr: 'VA', capital: 'Richmond', region: 'South' },
  { name: 'Washington', abbr: 'WA', capital: 'Olympia', region: 'West' },
  { name: 'West Virginia', abbr: 'WV', capital: 'Charleston', region: 'South' },
  { name: 'Wisconsin', abbr: 'WI', capital: 'Madison', region: 'Midwest' },
  { name: 'Wyoming', abbr: 'WY', capital: 'Cheyenne', region: 'West' },
]

export const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
  'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore',
  'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis',
  'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex',
  'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur',
  'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt',
  'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
  'laborum', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus', 'error',
  'accusantium', 'doloremque', 'laudantium', 'totam', 'rem', 'aperiam',
  'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis', 'quasi',
  'architecto', 'beatae', 'vitae', 'dicta', 'explicabo', 'nemo', 'voluptas',
  'aspernatur', 'odit', 'fugit', 'consequuntur', 'magni', 'dolores', 'eos',
  'ratione', 'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem',
]
