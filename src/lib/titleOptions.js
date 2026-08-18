/**
 * Option sets for the title generators: tone, genre, poem form, essay type and
 * essay grade. Each one swaps in a different template list or word bank, so
 * changing a dropdown genuinely changes the titles you get back.
 */

/* ------------------------------------------------------------------ */
/* Tone                                                                */
/* ------------------------------------------------------------------ */

export const TONES = [
  { value: 'standard', label: 'Standard' },
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'funny', label: 'Funny' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'clickbait', label: 'Clickbait' },
  { value: 'academic', label: 'Academic' },
  { value: 'poetic', label: 'Poetic' },
]

/**
 * Tone templates need a {topic}, so they are only used when the user has
 * typed one. Otherwise the generator falls back to the base templates.
 */
export const TONE_TEMPLATES = {
  casual: [
    'So You Want to {topicVerb} {topic}',
    '{topic}, Explained Like You Are Busy',
    'Honestly, {topic} Is Not That Hard',
    'The Lazy Way to {topicVerb} {topic}',
    'What I Wish Someone Had Told Me About {topic}',
    '{number} {topic} Things Nobody Warns You About',
    'Let Us Talk About {topic}',
    'A Very Normal Guide to {topic}',
  ],
  professional: [
    'A Practical Framework for {topic}',
    '{topic}: What the Evidence Actually Shows',
    'Improving {topic} Without Increasing Cost',
    'The Complete {topic} {format}',
    '{number} Proven Approaches to {topic}',
    'Building a Repeatable {topic} Process',
    '{topic} Best Practices for {audience}',
    'Measuring the Real Impact of {topic}',
  ],
  funny: [
    'I Tried {topic} So You Do Not Have To',
    '{topic}: A Disaster in {number} Parts',
    'Everything I Know About {topic} Is Wrong',
    'How to {topicVerb} {topic} and Only Slightly Regret It',
    'My {topic} Journey, Sponsored by Panic',
    '{number} Ways to Fail at {topic} Spectacularly',
    '{topic} for People Who Give Up Easily',
    'Nobody Asked, but Here Is My {topic} Opinion',
  ],
  dramatic: [
    'The Day {topic} Changed Everything',
    'Nobody Survives {topic} Unchanged',
    '{topic}: The Story We Were Never Told',
    'What {topic} Costs, and Who Pays',
    'The Quiet Collapse of {topic}',
    'Before It Was Too Late: A {topic} Story',
    'The Truth About {topic} Finally Comes Out',
    '{topic} and the Price of Getting It Wrong',
  ],
  clickbait: [
    'You Will Not Believe What {topic} Does to You',
    '{number} {topic} Secrets Experts Do Not Share',
    'This One {topic} Trick Changes Everything',
    'Stop Doing {topic} Wrong — Do This Instead',
    'The {topic} Mistake Almost Everyone Makes',
    'Why Everything You Know About {topic} Is Wrong',
    '{number} Shocking Facts About {topic}',
    'Doctors Hate This Simple {topic} Method',
  ],
  academic: [
    'A Critical Analysis of {topic}',
    '{topic}: Theory, Evidence and Practice',
    'Rethinking {topic} in Contemporary Scholarship',
    'The Case for Re-examining {topic}',
    'Toward a New Understanding of {topic}',
    '{topic} and Its Implications for {abstract}',
    'Competing Accounts of {topic}: A Review',
    'Reframing {topic} Through the Lens of {abstract}',
  ],
  poetic: [
    'What the {noun} Knows About {topic}',
    '{topic} in Late {season}',
    'Small {topic}, Long Winter',
    'Notes Towards a {adjective} {topic}',
    'Everything {topic} Left Behind',
    'A Letter to {topic}',
    '{topic}, and the Long Way Home',
    'The {adjective} Weight of {topic}',
  ],
}

/* ------------------------------------------------------------------ */
/* Use — which template family to draw from                            */
/* ------------------------------------------------------------------ */

export const USES = [
  { value: 'blog', label: 'Blog post' },
  { value: 'essay', label: 'Essay' },
  { value: 'book', label: 'Book' },
  { value: 'poem', label: 'Poem' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'song', label: 'Song' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'product', label: 'Product' },
]

/* ------------------------------------------------------------------ */
/* Book genres — each one swaps the imagery, not just the label        */
/* ------------------------------------------------------------------ */

export const BOOK_GENRES = [
  { value: 'any', label: 'Any' },
  { value: 'literary', label: 'Literary fiction' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'scifi', label: 'Science fiction' },
  { value: 'horror', label: 'Horror' },
  { value: 'historical', label: 'Historical' },
  { value: 'memoir', label: 'Memoir' },
  { value: 'selfHelp', label: 'Self-help' },
  { value: 'business', label: 'Business' },
]

export const GENRE_BANKS = {
  literary: {
    adjective: ['quiet', 'unfinished', 'ordinary', 'borrowed', 'small', 'late', 'honest', 'distant'],
    noun: ['kitchen', 'letter', 'harbour', 'orchard', 'balcony', 'season', 'window', 'stairwell'],
    plural: ['letters', 'seasons', 'strangers', 'promises', 'kitchens', 'afternoons'],
  },
  thriller: {
    adjective: ['silent', 'final', 'cold', 'buried', 'missing', 'last', 'hunted', 'broken'],
    noun: ['witness', 'contract', 'hour', 'exchange', 'debt', 'signal', 'informant', 'protocol'],
    plural: ['witnesses', 'hours', 'debts', 'signals', 'names', 'lies'],
  },
  mystery: {
    adjective: ['locked', 'missing', 'quiet', 'crooked', 'hidden', 'unsolved', 'forgotten'],
    noun: ['room', 'clue', 'inheritance', 'guest', 'letter', 'garden', 'lighthouse', 'notebook'],
    plural: ['clues', 'guests', 'letters', 'alibis', 'notebooks'],
  },
  romance: {
    adjective: ['second', 'unexpected', 'stubborn', 'reluctant', 'sweet', 'accidental', 'slow'],
    noun: ['summer', 'promise', 'bakery', 'wedding', 'letter', 'balcony', 'reunion', 'chance'],
    plural: ['summers', 'promises', 'weddings', 'chances', 'letters'],
  },
  fantasy: {
    adjective: ['golden', 'shattered', 'hollow', 'ancient', 'crownless', 'burning', 'wandering'],
    noun: ['throne', 'kingdom', 'blade', 'oath', 'gate', 'crown', 'tower', 'prophecy'],
    plural: ['thrones', 'kingdoms', 'oaths', 'gates', 'crowns', 'gods'],
  },
  scifi: {
    adjective: ['orbital', 'quiet', 'terminal', 'artificial', 'distant', 'frozen', 'unmapped'],
    noun: ['station', 'signal', 'colony', 'archive', 'engine', 'horizon', 'protocol', 'orbit'],
    plural: ['stations', 'signals', 'colonies', 'archives', 'orbits', 'machines'],
  },
  horror: {
    adjective: ['hollow', 'wrong', 'quiet', 'rotting', 'watching', 'buried', 'starving'],
    noun: ['house', 'basement', 'well', 'church', 'hunger', 'visitor', 'mirror', 'sound'],
    plural: ['houses', 'visitors', 'mirrors', 'teeth', 'sounds'],
  },
  historical: {
    adjective: ['last', 'divided', 'occupied', 'exiled', 'forgotten', 'burning', 'silent'],
    noun: ['empire', 'border', 'monsoon', 'railway', 'treaty', 'harbour', 'partition', 'letter'],
    plural: ['empires', 'borders', 'railways', 'treaties', 'exiles'],
  },
  memoir: {
    adjective: ['ordinary', 'crooked', 'borrowed', 'stubborn', 'unfinished', 'quiet'],
    noun: ['kitchen', 'father', 'town', 'illness', 'leaving', 'inheritance', 'homecoming'],
    plural: ['leavings', 'homecomings', 'kitchens', 'summers'],
  },
  selfHelp: {
    adjective: ['simple', 'quiet', 'daily', 'small', 'honest', 'practical'],
    noun: ['habit', 'method', 'discipline', 'permission', 'boundary', 'reset', 'practice'],
    plural: ['habits', 'methods', 'boundaries', 'excuses', 'systems'],
  },
  business: {
    adjective: ['unfair', 'compounding', 'quiet', 'durable', 'scarce', 'practical'],
    noun: ['advantage', 'moat', 'margin', 'system', 'bet', 'playbook', 'engine'],
    plural: ['advantages', 'margins', 'systems', 'bets', 'playbooks'],
  },
}

/* ------------------------------------------------------------------ */
/* Poem forms                                                          */
/* ------------------------------------------------------------------ */

export const POEM_TYPES = [
  { value: 'any', label: 'Any' },
  { value: 'freeVerse', label: 'Free verse' },
  { value: 'sonnet', label: 'Sonnet' },
  { value: 'haiku', label: 'Haiku' },
  { value: 'ode', label: 'Ode' },
  { value: 'elegy', label: 'Elegy' },
  { value: 'ballad', label: 'Ballad' },
  { value: 'limerick', label: 'Limerick' },
  { value: 'love', label: 'Love poem' },
]

export const POEM_TYPE_TEMPLATES = {
  freeVerse: [
    'Self-Portrait as a {noun}',
    'Notes on a {adjective} {noun}',
    'What the {noun} Left',
    '{abstract} in Late {season}',
    'Aubade with {plural}',
    'On {verbGerund}',
    'Small {abstract}',
    'The {noun} Speaks',
  ],
  sonnet: [
    'Sonnet for the {adjective} {noun}',
    'Sonnet in Late {season}',
    'Sonnet Against {abstract}',
    'Sonnet for What We Did Not Say',
    'A Sonnet of {plural}',
    'Sonnet with {plural} and Rain',
  ],
  haiku: [
    '{season} Morning',
    '{adjective} {noun}',
    'After the {noun}',
    '{noun} at First Light',
    'Rain on the {noun}',
    'Late {season}',
  ],
  ode: [
    'Ode to a {adjective} {noun}',
    'Ode to the {noun} Keeper',
    'Ode to {abstract}',
    'Ode to the Last {noun}',
    'Ode to {plural} in {season}',
    'Ode to Nobody in Particular',
  ],
  elegy: [
    'Elegy for the {noun}',
    'Elegy for a {adjective} {season}',
    'Elegy with {plural}',
    'Elegy for What the {noun} Took',
    'Elegy in the Key of {abstract}',
    'Elegy for the Last {noun}',
  ],
  ballad: [
    'The Ballad of the {adjective} {noun}',
    'The Ballad of {place}',
    'The Ballad of the {noun} Keeper',
    'A Ballad for {plural}',
    'The Ballad of the Long {season}',
  ],
  limerick: [
    'There Was a {noun} in {place}',
    'A {adjective} Fellow From {place}',
    'The {noun} That Would Not Behave',
    'A Very Poor Decision Involving a {noun}',
    'The Unfortunate Business of the {noun}',
  ],
  love: [
    'Letter to My {adjective} {noun}',
    'What I Mean When I Say {abstract}',
    'Still, After the {season}',
    'A {adjective} Kind of {abstract}',
    'Everything I Did Not Say',
    'Love Poem with {plural}',
  ],
}

/* ------------------------------------------------------------------ */
/* Essay types and grades                                              */
/* ------------------------------------------------------------------ */

export const ESSAY_TYPES = [
  { value: 'any', label: 'Any' },
  { value: 'argumentative', label: 'Argumentative' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'compare', label: 'Compare and contrast' },
  { value: 'descriptive', label: 'Descriptive' },
  { value: 'narrative', label: 'Narrative' },
  { value: 'expository', label: 'Expository' },
  { value: 'persuasive', label: 'Persuasive' },
]

export const ESSAY_TYPE_TEMPLATES = {
  argumentative: [
    'Why {topic} Deserves a Second Look',
    'The Case for {topic}',
    'The Case Against {topic}',
    '{topic} Does More Harm Than Good',
    'Why We Are Still Getting {topic} Wrong',
    '{topic}: The Argument Nobody Wants to Have',
  ],
  analytical: [
    'A Critical Analysis of {topic}',
    'Breaking Down {topic}: Causes and Effects',
    'What {topic} Reveals About {abstract}',
    'Reading {topic} Through the Lens of {abstract}',
    'The Structure of {topic}, Examined',
  ],
  compare: [
    '{topic} Then and Now: A Comparison',
    'Two Views of {topic}',
    '{topic} in Theory and in Practice',
    'Comparing Approaches to {topic}',
    'What {topic} Shares With {abstract}',
  ],
  descriptive: [
    'A Day Inside {topic}',
    'The Many Faces of {topic}',
    '{topic}: A Closer Look',
    'What {topic} Actually Looks Like',
    'The Shape and Sound of {topic}',
  ],
  narrative: [
    'The Day I Understood {topic}',
    'How {topic} Changed My Mind',
    'My First Encounter With {topic}',
    'What {topic} Taught Me About {abstract}',
    'A Story About {topic}',
  ],
  expository: [
    'Understanding {topic}: A Clear Explanation',
    'How {topic} Actually Works',
    '{topic} Explained Step by Step',
    'The Basics of {topic}',
    'What Everyone Should Know About {topic}',
  ],
  persuasive: [
    'It Is Time to Rethink {topic}',
    'Why {topic} Should Matter to You',
    '{topic} Cannot Wait Any Longer',
    'We Need to Talk About {topic}',
    'The Change {topic} Needs Now',
  ],
}

export const ESSAY_GRADES = [
  { value: 'elementary', label: 'Elementary School' },
  { value: 'middle', label: 'Middle School' },
  { value: 'high', label: 'High School' },
  { value: 'college', label: 'College' },
  { value: 'graduate', label: 'Graduate' },
]

/**
 * Grade changes the register, so it overrides the type templates for the two
 * ends of the range where the difference matters most.
 */
export const ESSAY_GRADE_TEMPLATES = {
  elementary: [
    'All About {topic}',
    'Why I Like {topic}',
    'My Report on {topic}',
    '{number} Facts About {topic}',
    'What Is {topic}?',
    '{topic} and Why It Matters',
    'The Best Things About {topic}',
    'How {topic} Works',
  ],
  middle: [
    'Why {topic} Is Important',
    '{number} Things to Know About {topic}',
    'The Problem With {topic}',
    'How {topic} Affects Us',
    'What I Learned About {topic}',
    'Should We Change {topic}?',
    'The History of {topic}',
  ],
  graduate: [
    'Toward a Critical Reassessment of {topic}',
    '{topic}: Methodological Challenges and Directions',
    'Interrogating the Assumptions Behind {topic}',
    'A Systematic Review of {topic} Literature',
    '{topic} and the Limits of Current Frameworks',
    'Situating {topic} Within Contemporary Debate',
  ],
}
