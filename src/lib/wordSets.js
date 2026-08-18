// Word classes used by every title-case style guide.

export const ARTICLES = ['a', 'an', 'the']

export const COORDINATING_CONJUNCTIONS = ['and', 'but', 'or', 'nor', 'for', 'so', 'yet']

export const SUBORDINATING_CONJUNCTIONS = [
  'after', 'although', 'as', 'because', 'before', 'if', 'once', 'since', 'than',
  'that', 'though', 'till', 'unless', 'until', 'when', 'whenever', 'where',
  'whereas', 'wherever', 'whether', 'while',
]

export const PREPOSITIONS = [
  'aboard', 'about', 'above', 'across', 'after', 'against', 'along', 'alongside',
  'amid', 'amidst', 'among', 'amongst', 'anti', 'around', 'as', 'astride', 'at',
  'atop', 'barring', 'before', 'behind', 'below', 'beneath', 'beside', 'besides',
  'between', 'beyond', 'but', 'by', 'circa', 'concerning', 'considering',
  'despite', 'down', 'during', 'except', 'excepting', 'excluding', 'following',
  'for', 'from', 'given', 'in', 'inside', 'into', 'like', 'minus', 'near',
  'notwithstanding', 'of', 'off', 'on', 'onto', 'opposite', 'out', 'outside',
  'over', 'past', 'per', 'plus', 'regarding', 'round', 'save', 'since', 'than',
  'through', 'throughout', 'till', 'to', 'toward', 'towards', 'under',
  'underneath', 'unlike', 'until', 'unto', 'up', 'upon', 'versus', 'via', 'with',
  'within', 'without',
]

// The New York Times stylebook publishes an explicit list of words it lowercases.
export const NYT_SMALL_WORDS = [
  'a', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'of', 'on', 'or',
  'the', 'to', 'v', 'v.', 'via', 'vs', 'vs.',
]

// Words that keep their shape no matter which case function runs.
export const ACRONYMS = [
  'AI', 'API', 'ASAP', 'CEO', 'CFO', 'CIA', 'CMS', 'CPU', 'CSS', 'CSV', 'CTA',
  'CTO', 'DIY', 'DNA', 'DVD', 'EU', 'FAQ', 'FBI', 'GDP', 'GIF', 'GPS', 'GPT',
  'HR', 'HTML', 'HTTP', 'HTTPS', 'ID', 'IQ', 'IT', 'JSON', 'JPEG', 'KPI', 'LED',
  'MBA', 'NASA', 'NATO', 'NBA', 'NFL', 'NGO', 'OK', 'PDF', 'PhD', 'PNG', 'PR',
  'RAM', 'ROI', 'RSS', 'SEO', 'SMS', 'SQL', 'SUV', 'TV', 'UI', 'UK', 'URL',
  'USA', 'USB', 'UX', 'VIP', 'XML', 'YouTube',
]

// Brand names with deliberate internal capitals.
export const BRAND_CASING = [
  'iPhone', 'iPad', 'iPod', 'iMac', 'iOS', 'macOS', 'watchOS', 'tvOS', 'eBay',
  'eBook', 'eCommerce', 'iTunes', 'JavaScript', 'TypeScript', 'PostgreSQL',
  'MySQL', 'GitHub', 'GitLab', 'LinkedIn', 'YouTube', 'WhatsApp', 'TikTok',
  'PayPal', 'WordPress', 'DuckDuckGo', 'McDonald', 'MacBook', 'AirPods',
  'ChatGPT', 'OpenAI', 'DeepMind',
]

// Used by Sentence case / Email case so real names survive lowercasing.
export const PROPER_NOUNS = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'june', 'july', 'august',
  'september', 'october', 'november', 'december',
  'america', 'american', 'africa', 'african', 'asia', 'asian', 'europe',
  'european', 'australia', 'australian', 'canada', 'canadian', 'china',
  'chinese', 'england', 'english', 'france', 'french', 'germany', 'german',
  'india', 'indian', 'ireland', 'irish', 'italy', 'italian', 'japan',
  'japanese', 'mexico', 'mexican', 'russia', 'russian', 'spain', 'spanish',
  'britain', 'british', 'scotland', 'scottish', 'wales', 'welsh', 'brazil',
  'brazilian', 'egypt', 'egyptian', 'greece', 'greek', 'korea', 'korean',
  'london', 'paris', 'tokyo', 'delhi', 'mumbai', 'sydney', 'toronto',
  'chicago', 'boston', 'seattle', 'atlanta', 'houston', 'dallas', 'denver',
  'christmas', 'easter', 'thanksgiving', 'halloween', 'ramadan', 'diwali',
  'hanukkah', 'christian', 'muslim', 'hindu', 'buddhist', 'jewish',
  'god', 'jesus', 'bible', 'quran', 'torah',
  'google', 'apple', 'microsoft', 'amazon', 'facebook', 'instagram', 'twitter',
  'netflix', 'spotify', 'adobe', 'nike', 'tesla', 'samsung', 'sony', 'intel',
  'nvidia', 'reddit', 'pinterest', 'shopify', 'grammarly', 'harvard', 'oxford',
  'cambridge', 'yale', 'stanford', 'nasa', 'unicef', 'monday.com',
  'i', "i'm", "i'll", "i've", "i'd",
]

export const toSet = (list) => new Set(list.map((w) => w.toLowerCase()))

export const ARTICLE_SET = toSet(ARTICLES)
export const COORD_SET = toSet(COORDINATING_CONJUNCTIONS)
export const SUBORD_SET = toSet(SUBORDINATING_CONJUNCTIONS)
export const PREPOSITION_SET = toSet(PREPOSITIONS)
export const NYT_SET = toSet(NYT_SMALL_WORDS)
export const PROPER_NOUN_SET = toSet(PROPER_NOUNS)

export const ACRONYM_MAP = new Map(ACRONYMS.map((w) => [w.toLowerCase(), w]))

/**
 * Acronyms that are also ordinary English words.
 *
 * These are only honoured when the writer typed them in capitals. Applying
 * them to lowercase input turns "how to fix it" into "How to Fix IT", which is
 * wrong far more often than it is right.
 */
export const AMBIGUOUS_ACRONYMS = new Set(['id', 'it', 'ok'])
export const BRAND_MAP = new Map(BRAND_CASING.map((w) => [w.toLowerCase(), w]))
