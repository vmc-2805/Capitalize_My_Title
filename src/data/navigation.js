/**
 * Single source of truth for the menu tree, the router, internal linking and
 * the generated sitemap. Plain JS on purpose so the build script can import it.
 *
 * Each item:
 *   path        route + canonical URL
 *   label       menu text
 *   key         maps to a component in src/routes.jsx
 *   title       <title> tag (aim for 50–60 characters)
 *   description meta description (must be 80–200 characters — tests check this)
 *   keywords    target keywords, first one is primary
 *   h1          on-page heading
 *   intro       lead paragraph shown under the H1
 *
 * Copy style: short sentences, simple words, direct "you". Keep it readable
 * for someone who uses English every day but does not speak it at home.
 */

export const TOOL_GROUPS = [
  {
    id: 'converters',
    label: 'Converters',
    blurb: 'Change lists, spreadsheets and JSON from one shape to another.',
    items: [
      {
        path: '/tools/comma-separator',
        key: 'CommaSeparator',
        label: 'Comma Separator – Column to CSV',
        title: 'Comma Separator — Turn a Column into a CSV List',
        description:
          'Paste a column of names, emails or IDs and get a clean comma separated list. Add quotes, remove duplicates, sort it and pick any separator you want.',
        keywords: ['comma separator', 'column to comma separated list', 'convert column to csv', 'add commas to list', 'list to csv converter'],
        h1: 'Comma Separator: Column to Comma Separated List',
        intro:
          'Paste one item per line. You get back a single line, joined the way you want. Useful for SQL queries, CSV cells, tag fields, and anywhere a spreadsheet column has to become a list.',
      },
      {
        path: '/tools/csv-to-json',
        key: 'CsvToJson',
        label: 'CSV to JSON Converter',
        title: 'CSV to JSON Converter — Free, Private, In Your Browser',
        description:
          'Turn CSV or TSV data into clean JSON in one second. Handles quoted fields, any separator, headers and number detection. Your file is never uploaded.',
        keywords: ['csv to json', 'csv to json converter', 'convert csv to json online', 'csv parser', 'tsv to json'],
        h1: 'CSV to JSON Converter',
        intro:
          'Paste your CSV, pick the separator, and get valid JSON you can use straight away in an API call or a test file. Everything happens in your browser, so your data never leaves this page.',
      },
      {
        path: '/tools/json-to-csv',
        key: 'JsonToCsv',
        label: 'JSON to CSV Converter',
        title: 'JSON to CSV Converter — Open Your JSON in Excel',
        description:
          'Turn a JSON array into a CSV file you can open in Excel or Google Sheets. Nested values become simple columns like address.city, so nothing is lost.',
        keywords: ['json to csv', 'json to csv converter', 'convert json to excel', 'flatten json to csv', 'json array to spreadsheet'],
        h1: 'JSON to CSV Converter',
        intro:
          'Paste a JSON array and download a CSV that opens cleanly in Excel or Google Sheets. Nested values become columns like <code>address.city</code>, so you do not lose anything.',
      },
      {
        path: '/tools/uppercase-to-lowercase',
        key: 'UppercaseToLowercase',
        label: 'Uppercase to Lowercase Converter',
        title: 'Uppercase to Lowercase Converter — Fix ALL CAPS Text',
        description:
          'Paste text that is in ALL CAPS and change it to lowercase, sentence case, title case or proper case in one click. Names and short forms stay correct.',
        keywords: ['uppercase to lowercase', 'all caps to lowercase', 'convert caps to sentence case', 'change case online', 'text case converter'],
        h1: 'Uppercase to Lowercase Converter',
        intro:
          'Caps lock mistakes, headings copied from a PDF, shouting email subjects — all of them become readable again here. Change to lowercase, or go straight to sentence case or title case.',
      },
      {
        path: '/tools/square-image',
        key: 'SquareImage',
        label: 'Square Your Image Tool',
        title: 'Square Your Image — Free 1:1 Photo Resizer',
        description:
          'Make any photo a perfect square without cutting off the subject. Choose a background colour, add space around it, and download as PNG or JPEG.',
        keywords: ['square image tool', 'make image square', '1:1 image resizer', 'instagram square photo', 'add padding to image'],
        h1: 'Square Your Image',
        intro:
          'Instagram, online marketplaces and podcast apps all want a square image. This tool adds space around your photo instead of cutting it, so nothing important is lost.',
      },
    ],
  },
  {
    id: 'title-generators',
    label: 'Title Generators',
    blurb: 'Never sit and stare at an empty title box again.',
    items: [
      {
        path: '/tools/ai-title-generator',
        key: 'AiTitleGenerator',
        label: 'AI Title Generator',
        title: 'AI Title Generator — Free Headline Ideas in One Click',
        description:
          'Type your topic and get dozens of ready titles for blog posts, articles and landing pages. Each one is scored for length, strong words and SEO fit.',
        keywords: ['ai title generator', 'blog title generator', 'headline generator', 'free title generator', 'article title ideas'],
        h1: 'AI Title Generator',
        intro:
          'Type a topic and get a working list of headlines. They are built from patterns that really do earn clicks: numbered lists, how-to titles, clear promises and honest curiosity.',
      },
      {
        path: '/tools/poem-title-generator',
        key: 'PoemTitleGenerator',
        label: 'Poem Title Generator',
        title: 'Poem Title Generator — Titles for Poems and Collections',
        description:
          'Get poem title ideas in one click, from simple image titles to odes, elegies and self-portraits. Add a theme to guide the mood of the results.',
        keywords: ['poem title generator', 'poetry title ideas', 'titles for poems', 'poem name generator', 'poetry collection titles'],
        h1: 'Poem Title Generator',
        intro:
          'Poems are usually titled last, and it is the hardest part. These patterns copy the way modern poetry actually titles itself: odes, elegies, letters and plain images.',
      },
      {
        path: '/tools/book-title-generator',
        key: 'BookTitleGenerator',
        label: 'Book Title Generator',
        title: 'Book Title Generator — Novel and Non-Fiction Ideas',
        description:
          'Get book title ideas for any genre, from literary fiction to thrillers and memoirs. Check the length and see how each one looks in correct title case.',
        keywords: ['book title generator', 'novel title generator', 'book name ideas', 'fiction title generator', 'title ideas for my book'],
        h1: 'Book Title Generator',
        intro:
          'A good book title is short, clear and a little unexpected. Generate options, then check how each one looks in title case and how it would sit on a cover.',
      },
      {
        path: '/tools/youtube-title-generator',
        key: 'YouTubeTitleGenerator',
        label: 'YouTube Title Generator',
        title: 'YouTube Title Generator — Titles People Click',
        description:
          'Get YouTube titles that fit the 60 character limit, put your keyword first, and use the hooks that really do increase click-through rate.',
        keywords: ['youtube title generator', 'video title ideas', 'youtube seo titles', 'clickable video titles', 'youtube headline generator'],
        h1: 'YouTube Title Generator',
        intro:
          'YouTube cuts titles at about 60 characters on mobile, so every title here is counted as you type. Keyword first, hook second, and no shouting in capitals.',
      },
      {
        path: '/tools/essay-title-generator',
        key: 'EssayTitleGenerator',
        label: 'Essay Title Generator',
        title: 'Essay Title Generator — Titles Your Teacher Will Accept',
        description:
          'Get essay and research paper titles in a proper academic style, then format them in APA, MLA or Chicago title case with a single click.',
        keywords: ['essay title generator', 'research paper title generator', 'academic title ideas', 'thesis title generator', 'essay heading ideas'],
        h1: 'Essay Title Generator',
        intro:
          'An academic title has to name your subject and your angle without sounding like a news headline. These patterns follow the colon-and-subtitle style that teachers expect.',
      },
    ],
  },
  {
    id: 'title-rewriter',
    label: 'Title Rewriter',
    blurb: 'Already have a title? See nine better versions of it.',
    items: [
      {
        path: '/tools/ai-title-rewriter',
        key: 'AiTitleRewriter',
        label: 'AI Title Rewriter',
        title: 'AI Title Rewriter — Rewrite Any Headline Nine Ways',
        description:
          'Paste a title and get clearer, shorter, SEO, question, how-to, list and benefit versions side by side. Each one shows its character count.',
        keywords: ['title rewriter', 'headline rewriter', 'rewrite my title', 'ai headline rewriter', 'seo title rewriter'],
        h1: 'AI Title Rewriter',
        intro:
          'One title in, nine versions out. Every version shows its character count, so you can see which ones will get cut short on Google, YouTube or in an inbox.',
      },
    ],
  },
  {
    id: 'text-generators',
    label: 'Text Generators',
    blurb: 'Dummy text, and fancy fonts you can copy and paste.',
    items: [
      {
        path: '/tools/lorem-ipsum-generator',
        key: 'LoremIpsum',
        label: 'Lorem Ipsum Generator',
        title: 'Lorem Ipsum Generator — Paragraphs, Words and HTML',
        description:
          'Make dummy text by paragraph, sentence, word or list, with HTML tags if you need them. Copy or download filler text for your design or website.',
        keywords: ['lorem ipsum generator', 'placeholder text generator', 'dummy text', 'lorem ipsum html', 'filler text generator'],
        h1: 'Lorem Ipsum Generator',
        intro:
          'Choose paragraphs, sentences, words or list items. Decide if you want HTML tags. Then copy the result straight into your design or template.',
      },
      {
        path: '/tools/wingdings-translator',
        key: 'WingdingsTranslator',
        label: 'Wingdings Translator',
        title: 'Wingdings Translator — Text to Wingdings and 40+ Fonts',
        description:
          'Change your text into Wingdings, Webdings and 40+ copy-paste font styles: gothic, bubble, cursive, vaporwave and more. Also converts symbols back.',
        keywords: ['wingdings translator', 'wingdings converter', 'text to wingdings', 'webdings translator', 'wingdings to english', 'fancy text generator', 'font generator copy and paste'],
        h1: 'Wingdings Translator',
        intro:
          'Type once and get your text in Wingdings, Webdings and more than forty other copy-paste styles. Each result uses real characters, not a font, so it works wherever you paste it.',
      },
      {
        path: '/tools/bold-text-generator',
        key: 'BoldTextGenerator',
        label: 'Bold Text Generator',
        title: 'Bold Text Generator — Bold Letters for Any App',
        description:
          'Make bold, italic, monospace and cursive text that works in Instagram bio, LinkedIn posts, WhatsApp and Discord. No formatting button needed.',
        keywords: ['bold text generator', 'bold text copy paste', 'instagram bold text', 'linkedin bold text', 'unicode bold generator'],
        h1: 'Bold Text Generator',
        intro:
          'Most apps remove formatting, but they cannot remove these. They are real bold letters, not styling, so they keep their look wherever you paste them.',
      },
      {
        path: '/tools/bubble-text-generator',
        key: 'BubbleTextGenerator',
        label: 'Bubble Text Generator',
        title: 'Bubble Text Generator — ⓑⓤⓑⓑⓛⓔ Letters to Copy',
        description:
          'Turn your text into bubble letters, black bubble letters, square letters and more. Tap to copy, then paste into your bio, username or caption.',
        keywords: ['bubble text generator', 'bubble letters copy paste', 'circle text generator', 'bubble font copy and paste', 'aesthetic text generator'],
        h1: 'Bubble Text Generator',
        intro:
          'Circled and square letters, ready to copy. Each style shows a live preview, so you can check that it looks right before you post it anywhere.',
      },
    ],
  },
  {
    id: 'other-generators',
    label: 'Other Generators',
    blurb: 'Everything else we built because someone asked for it.',
    items: [
      {
        path: '/tools/fortune-cookie-generator',
        key: 'FortuneCookie',
        label: 'Fortune Cookie Generator',
        title: 'Fortune Cookie Generator — Fortunes and Lucky Numbers',
        description:
          'Open a virtual fortune cookie for a message, six lucky numbers and a word to learn. Make a whole sheet of fortunes to print for a party or class.',
        keywords: ['fortune cookie generator', 'random fortune generator', 'fortune cookie messages', 'lucky numbers generator', 'printable fortunes'],
        h1: 'Fortune Cookie Generator',
        intro:
          'One click opens a cookie: a message worth keeping, six lucky numbers and a word to learn. Make a batch if you want to print and fold them.',
      },
      {
        path: '/tools/invisible-character',
        key: 'InvisibleCharacter',
        label: 'Empty and Invisible Character Generator',
        title: 'Invisible Character Generator — Blank Space to Copy',
        description:
          'Copy invisible and empty characters that pass "this field is required" checks. Twelve options, with notes on where each one actually works.',
        keywords: ['invisible character', 'empty character copy paste', 'blank space copy', 'invisible text generator', 'zero width space'],
        h1: 'Empty and Invisible Character Generator',
        intro:
          'Twelve truly blank characters, with a note on where each one works. Some get removed by apps automatically, so the most reliable ones are listed first.',
      },
      {
        path: '/tools/random-state-generator',
        key: 'RandomState',
        label: 'Random State Generator',
        title: 'Random US State Generator — Pick a State at Random',
        description:
          'Pick one or more US states at random, with capitals, short forms and region filters. Useful for teachers, quizzes, trip planning and giveaways.',
        keywords: ['random state generator', 'random us state picker', 'pick a random state', 'us states quiz generator', 'random state and capital'],
        h1: 'Random State Generator',
        intro:
          'Pick one random US state, or draw several without any repeating. Filter by region, and show the capital and short form next to each result.',
      },
      {
        path: '/tools/prompt-generator',
        key: 'PromptGenerator',
        label: 'Prompts Generator',
        title: 'AI Prompt Generator — Text and Image Prompts',
        description:
          'Get ready-to-paste prompts written about your own subject, for ChatGPT, Claude and Gemini. Includes an image mode with style and lighting words for image tools.',
        keywords: ['ai prompt generator', 'chatgpt prompt generator', 'image prompt generator', 'midjourney prompt generator', 'prompt ideas'],
        h1: 'AI Prompts Generator',
        intro:
          'Type what you are working on and get ready-to-paste prompts about it, in the language you typed. Use text mode for chat tools, or image mode for style and lighting words.',
      },
      {
        path: '/tools/text-repeater',
        key: 'TextRepeater',
        label: 'Text Repeater',
        title: 'Text Repeater — Repeat Any Word or Text X Times',
        description:
          'Repeat a word, a line or a full paragraph as many times as you need. Choose the separator, number the lines, then copy or download the result.',
        keywords: ['text repeater', 'repeat text generator', 'repeat a word x times', 'duplicate lines tool', 'copy paste repeat text'],
        h1: 'Text Repeater',
        intro:
          'Repeat anything from one word to a full paragraph. Choose what goes between the copies, number the lines if you want, and copy it all in one click.',
      },
      {
        path: '/tools/speech-generator',
        key: 'SpeechGenerator',
        label: 'Speech Generator',
        title: 'Speech Generator — Plan a Talk in Seconds',
        description:
          'Get a speech outline with an opening line, clear points, linking lines and a closing line, sized to the number of minutes you have on stage.',
        keywords: ['speech generator', 'speech outline generator', 'wedding speech generator', 'presentation outline generator', 'speech writing tool'],
        h1: 'Speech Generator',
        intro:
          'Enter your topic, the occasion and how long you have to speak. You get an opening, linking lines, numbered points and a closing line to fill with your own stories.',
      },
      {
        path: '/tools/song-generator',
        key: 'SongGenerator',
        label: 'Song Generator',
        title: 'Song Lyrics Generator — Verses, Chorus and Bridge',
        description:
          'Get a full song structure with verses, a repeating chorus, a bridge and an ending. Set a theme and style, then rewrite the lines you like.',
        keywords: ['song generator', 'song lyrics generator', 'random lyrics generator', 'songwriting prompts', 'chorus generator'],
        h1: 'Song Generator',
        intro:
          'A complete song skeleton: two verses, a repeating chorus, a bridge and an ending. Treat every line as an idea and rewrite the ones that feel right.',
      },
      {
        path: '/tools/poem-generator',
        key: 'PoemGenerator',
        label: 'Poem Generator',
        title: 'Poem Generator — Free Verse, Short Form and Stanzas',
        description:
          'Write a poem from any theme in free verse or short form. Choose how many stanzas you want and keep the lines that give you a good idea.',
        keywords: ['poem generator', 'random poem generator', 'free verse generator', 'haiku generator', 'poetry writing prompts'],
        h1: 'Poem Generator',
        intro:
          'Enter a theme and pick a form. What you get is not a finished poem. It is a first draft with a few surprising lines in it, and that is usually the hard part.',
      },
      {
        path: '/tools/character-backstory-generator',
        key: 'BackstoryGenerator',
        label: 'Character Backstory Generator',
        title: 'Character Backstory Generator — Past, Flaws and Secrets',
        description:
          'Build a character backstory with a beginning, a turning point, a skill, a real flaw, a goal and a secret. Made for D&D, stories and games.',
        keywords: ['character backstory generator', 'dnd backstory generator', 'random character background', 'character history generator', 'rpg character backstory'],
        h1: 'Character Backstory Generator',
        intro:
          'Every result covers the six things that make a character playable: where they come from, what changed them, what they are good at, their flaw, their goal and their secret.',
      },
    ],
  },
  {
    id: 'name-generators',
    label: 'Name Generators',
    blurb: 'Names for characters, pets, bands, businesses and monsters.',
    items: [
      {
        path: '/tools/character-name-generator',
        key: 'CharacterNameGenerator',
        label: 'Character Name Generator',
        title: 'Character Name Generator — Fantasy, Sci-Fi, Real',
        description:
          'Make character names by style, gender and first letter, with surnames and titles if you want them. Built for novels, films and tabletop games.',
        keywords: ['character name generator', 'fantasy name generator', 'random character names', 'dnd name generator', 'novel character names'],
        h1: 'Character Name Generator',
        intro:
          'Choose real, fantasy or sci-fi. Then narrow it down by gender and first letter. Add a surname and a title when your character needs to sound like a legend.',
      },
      {
        path: '/tools/name-generator',
        key: 'NameGenerator',
        label: 'Name Generators',
        title: 'Name Generator — Pets, Bands, Businesses and More',
        description:
          'One tool, seven kinds of names: real, fantasy, sci-fi, Pokemon style, pet, band and business. Filter by first letter and copy with one tap.',
        keywords: ['name generator', 'random name generator', 'business name generator', 'band name generator', 'pet name generator'],
        h1: 'Name Generator',
        intro:
          'Seven kinds of names in one place. Pick a category, set a first letter if you already have one in mind, and make as many as you need.',
      },
      {
        path: '/tools/pokemon-name-generator',
        key: 'PokemonNameGenerator',
        label: 'Pokemon Name Generator',
        title: 'Pokemon Name Generator — Names That Sound Real',
        description:
          'Make Pokemon style names using the real naming pattern: a describing word joined to a creature word. Each name comes with a type and a description.',
        keywords: ['pokemon name generator', 'fake pokemon names', 'pokemon nickname generator', 'fakemon name generator', 'random pokemon name'],
        h1: 'Pokemon Name Generator',
        intro:
          'Pokemon names join a describing word to a creature word. This generator uses the same recipe, so the results sound like they belong in a real Pokédex.',
      },
    ],
  },
]

export const BLOG_CATEGORIES = [
  {
    path: '/blog/writing',
    key: 'BlogCategory',
    slug: 'writing',
    label: 'Writing Articles',
    title: 'Writing Articles — Headlines, Titles and Style Guides',
    description:
      'Simple, practical guides on titles, headlines, capitalization rules and the style guides behind them. Written for people who have real work to finish.',
    keywords: ['writing articles', 'headline writing tips', 'title writing guide', 'capitalization rules', 'writing style guides'],
    h1: 'Writing',
    intro: 'Guides on titles, headlines and the capitalization rules behind them.',
  },
  {
    path: '/blog/editing',
    key: 'BlogCategory',
    slug: 'editing',
    label: 'Editing',
    title: 'Editing Articles — Check Your Own Writing Properly',
    description:
      'How to edit your own writing: cut extra words, fix capitals and punctuation, check that everything matches, and know when a draft is really done.',
    keywords: ['editing articles', 'self editing tips', 'proofreading guide', 'copy editing checklist', 'how to edit your writing'],
    h1: 'Editing',
    intro: 'How to check your own writing, in separate passes that each look for one thing.',
  },
  {
    path: '/blog/publishing',
    key: 'BlogCategory',
    slug: 'publishing',
    label: 'Publishing Articles',
    title: 'Publishing Articles — SEO, Meta Tags and Sharing',
    description:
      'Everything that happens after the draft: SEO titles, meta descriptions, structured data, social previews, and getting your work in front of readers.',
    keywords: ['publishing articles', 'seo title tips', 'meta description guide', 'content distribution', 'blog publishing checklist'],
    h1: 'Publishing',
    intro: 'SEO titles, meta tags, social previews and getting your work actually seen.',
  },
]

export const STATIC_PAGES = [
  {
    path: '/tools',
    key: 'AllTools',
    label: 'All Tools',
    title: 'All Tools — Every Free Writing and Word Tool We Make',
    description:
      'See every free tool here: title capitalization, converters, word finders, title generators, text generators and name generators. No signup, no limits.',
    keywords: ['free writing tools', 'all tools', 'text tools online', 'word tools', 'free seo title tools'],
    h1: 'All Tools',
    intro: 'Every tool on this site, grouped the same way as the menu. All free, all in your browser.',
  },
  {
    path: '/blog',
    key: 'BlogIndex',
    label: 'Blog',
    title: 'Blog — Writing, Editing and Publishing Guides',
    description:
      'Guides on writing better titles, checking your own drafts, and publishing work that people actually find. Practical, clear and to the point.',
    keywords: ['writing blog', 'editing tips', 'publishing guides', 'headline writing', 'seo writing blog'],
    h1: 'Blog',
    intro: 'Long guides on writing, editing and publishing — the thinking behind every tool on this site.',
  },
  {
    path: '/about',
    key: 'About',
    label: 'About',
    title: 'About Capitalize My Title — Who Makes These Tools',
    description:
      'Capitalize My Title makes free writing tools that run in your browser. Read how the style guide rules are built and why nothing is ever uploaded.',
    keywords: ['about capitalize my title', 'title case tool about', 'free writing tools team'],
    h1: 'About Capitalize My Title',
    intro: 'Free writing tools that run fully inside your browser.',
  },
  {
    path: '/contact',
    key: 'Contact',
    label: 'Contact',
    title: 'Contact — Report a Problem or Ask for a Tool',
    description:
      'Found a title our tool gets wrong, a bug, or a tool we should build? Send it to us. We read every message, and style guide corrections come first.',
    keywords: ['contact capitalize my title', 'report a bug', 'request a tool', 'style guide correction'],
    h1: 'Contact',
    intro: 'Bug reports, style guide corrections and tool requests all come to the same inbox.',
  },
  {
    path: '/privacy-policy',
    key: 'Privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy — What We Do and Do Not Collect',
    description:
      'Our tools work inside your browser and never upload your text. Read exactly what is saved on your device, what we measure, and how to stop it.',
    keywords: ['privacy policy', 'text tool privacy', 'no upload text tools'],
    h1: 'Privacy Policy',
    intro: 'Short version: whatever you type stays inside your browser.',
  },
  {
    path: '/terms',
    key: 'Terms',
    label: 'Terms of Use',
    title: 'Terms of Use — Capitalize My Title',
    description:
      'The simple rules for using these free tools: what you can do with the results, what we do not promise, and the limits of our responsibility.',
    keywords: ['terms of use', 'terms and conditions', 'tool usage terms'],
    h1: 'Terms of Use',
    intro: 'Plain language terms for using the tools on this site.',
  },
]

export const HOME_PAGE = {
  path: '/',
  key: 'Home',
  label: 'Title Capitalization Tool',
  title: 'Capitalize My Title — Free Title Case Converter (APA, AP, MLA)',
  description:
    'Capitalize any title correctly in APA, Chicago, AP, MLA, Bluebook, AMA, NYT and Wikipedia style. Free title case converter with headline scoring and case tools.',
  keywords: [
    'capitalize my title',
    'title case converter',
    'title capitalization tool',
    'apa title case',
    'chicago title case',
    'ap style capitalization',
    'mla title case converter',
    'headline capitalization',
  ],
  h1: 'Capitalize My Title',
  intro:
    'Paste your title, pick a style guide, and get the correct capitals at once — APA, Chicago, AP, MLA, Bluebook, AMA, New York Times, Wikipedia and email subject style.',
}

/* ------------------------------------------------------------------ */
/* Derived structures                                                  */
/* ------------------------------------------------------------------ */

export const ALL_TOOLS = TOOL_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.label, groupId: group.id })),
)

export const ALL_PAGES = [
  { ...HOME_PAGE, group: 'Home', groupId: 'home' },
  ...ALL_TOOLS,
  ...BLOG_CATEGORIES.map((c) => ({ ...c, group: 'Blog', groupId: 'blog' })),
  ...STATIC_PAGES.map((p) => ({ ...p, group: 'Site', groupId: 'site' })),
]

export const PAGE_BY_PATH = new Map(ALL_PAGES.map((page) => [page.path, page]))

/** Tools in the same menu group first, then everything else. */
export function relatedTools(path, limit = 6) {
  const current = ALL_TOOLS.find((t) => t.path === path)
  const siblings = current ? ALL_TOOLS.filter((t) => t.groupId === current.groupId && t.path !== path) : []
  const others = ALL_TOOLS.filter((t) => t.path !== path && !siblings.some((s) => s.path === t.path))
  return [...siblings, ...others].slice(0, limit)
}
