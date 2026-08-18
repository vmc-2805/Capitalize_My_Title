/**
 * Blog posts. Bodies are trusted HTML authored in this repo — never user input —
 * and are rendered with dangerouslySetInnerHTML by the post page.
 *
 * Copy style: short sentences, simple words, direct "you". Keep every
 * description between 80 and 200 characters (the tests check this).
 */

export const POSTS = [
  {
    slug: 'title-case-vs-sentence-case',
    category: 'writing',
    title: 'Title Case vs Sentence Case: Which One Should You Use?',
    description:
      'Title case looks official. Sentence case reads faster. Here is how to choose between them for headings, buttons, subheads and email subject lines.',
    keywords: ['title case vs sentence case', 'when to use sentence case', 'headline capitalization', 'ui capitalization', 'email subject case'],
    date: '2026-01-14',
    updated: '2026-06-02',
    readingTime: 6,
    excerpt:
      'The two styles send different signals. One says "this is a finished, published work". The other says "this is a person talking to you". Choose on purpose.',
    body: `
<p>There are really only two capitalization choices you make again and again: <strong>Title Case Like This</strong>, or <strong>Sentence case like this</strong>. Everything else — whether "with" gets a capital, what happens after a colon — comes after that first choice.</p>

<h2>What each style says to the reader</h2>
<p>Title case is the style of finished, published work: book covers, journal papers, newspaper headlines, chapter names. When a reader sees title case, they read the line as <em>the name of a thing</em>.</p>
<p>Sentence case is the style of speech. It reads like one person talking to another. It is also faster to scan, because the few capital letters left carry real meaning instead of decoration.</p>

<h2>The simple rule</h2>
<ul>
  <li><strong>Use title case</strong> for anything that will be listed, cited or shelved: article titles, book titles, paper titles, course names, official document names.</li>
  <li><strong>Use sentence case</strong> for anything a reader moves through quickly: subheadings, image captions, table headings, tooltips, buttons, form labels and email subject lines.</li>
</ul>
<p>Almost every modern design system says the same thing. Google's Material, Apple's guidelines and GOV.UK all use sentence case for interface text, for two reasons. It is easier to read at small sizes, and it saves writers from making a style guide decision on every single button.</p>

<h2>Email subject lines are special</h2>
<p>A subject line in title case reads like an advertisement. A subject line in sentence case reads like a message from a person, which is the whole point of email. Large tests over the last ten years have found sentence case performing as well as or better than title case, and none have found a real advantage the other way.</p>
<p>There is a second, harder reason. Title case plus an exclamation mark plus a capitalized "FREE" is a pattern spam filters recognise. Sentence case keeps you away from that pattern automatically.</p>

<h2>The one thing worse than either</h2>
<p>Mixing them. A page where three subheadings are in title case and two are in sentence case looks careless, and readers notice even when they cannot say why. If you inherit a messy document, pick one style, apply it everywhere, and write the decision down somewhere you will find it again.</p>

<h2>How to change a whole document quickly</h2>
<p>Paste the text into the <a href="/">title capitalization tool</a> and press <strong>Sentence case</strong>. Names and short forms are kept, so "NASA" and "Monday" survive. To go the other way, choose your style guide tab first. APA, Chicago, AP and MLA disagree about small words, and picking the wrong tab gives you an answer that is confidently wrong.</p>

<h2>Quick reference</h2>
<ul>
  <li>Article and paper titles → title case, in the guide your college or publisher uses.</li>
  <li>Subheadings inside a page → sentence case, unless your organisation says otherwise.</li>
  <li>Buttons, labels, menu items → sentence case, always.</li>
  <li>Email subject lines → sentence case.</li>
  <li>Book and film names inside a sentence → title case, because they are names.</li>
</ul>
`,
  },
  {
    slug: 'apa-vs-chicago-vs-ap-title-case',
    category: 'writing',
    title: 'APA vs Chicago vs AP: The Title Case Differences That Matter',
    description:
      'The three most used style guides disagree about small words, prepositions and the word "to". Here is one title run through each, and how to choose.',
    keywords: ['apa vs chicago title case', 'ap style title case', 'style guide comparison', 'title capitalization rules', 'which style guide'],
    date: '2026-02-03',
    updated: '2026-05-20',
    readingTime: 7,
    excerpt:
      'Run one title through all three guides and the difference shows up immediately. Here is what causes it, and how to pick the right guide for your work.',
    body: `
<p>Take the title <em>a guide to writing between the lines</em> and run it through three style guides:</p>
<ul>
  <li><strong>APA:</strong> A Guide to Writing Between the Lines</li>
  <li><strong>Chicago:</strong> A Guide to Writing between the Lines</li>
  <li><strong>AP:</strong> A Guide to Writing Between the Lines</li>
</ul>
<p>Only one word changes — "between" — and it is not an accident. It comes from one basic disagreement.</p>

<h2>Counting letters, or looking at the word type</h2>
<p>APA and AP <strong>count letters</strong>. Any word of four letters or more gets a capital, whatever type of word it is. That is why "Between", "Through" and "With" all get capitals.</p>
<p>Chicago and MLA <strong>look at the type of word</strong>. Every preposition stays small, however long it is. So "between", "through" and "underneath" all stay small in the middle of a title. Only the first and last words are exceptions.</p>
<p>Bluebook and Wikipedia sit in the middle, with a four letter limit. That is why "with" is small there but "Against" is not.</p>

<h2>The word "to" before a verb</h2>
<p>Chicago, MLA, Bluebook and Wikipedia keep "to" small when it comes before a verb: <em>How to Write Well</em>. APA and AP also keep it small, but only because it is three letters. If their length rule ever changed, they would give a different answer.</p>

<h2>After a colon</h2>
<p>Every guide capitalizes the first word after a colon. This catches more people out than any other rule, because that word is usually short: <em>Editing: A Field Guide</em>, not <em>Editing: a Field Guide</em>.</p>

<h2>Joined words with a hyphen</h2>
<p>APA and AMA capitalize both halves of an important joined word: <em>Self-Report</em>, <em>Follow-Up</em>, <em>Cross-Sectional</em>. Chicago is more relaxed and keeps the second half small when it is a small word, or when the first half cannot stand alone.</p>

<h2>Which one should you use?</h2>
<ul>
  <li><strong>APA</strong> — psychology, education, nursing, social sciences.</li>
  <li><strong>Chicago</strong> — books, history, arts subjects, publishing.</li>
  <li><strong>AP</strong> — news, press releases, PR and most marketing writing.</li>
  <li><strong>MLA</strong> — literature, languages, culture studies, school and college essays.</li>
  <li><strong>AMA</strong> — medicine and medical journals.</li>
  <li><strong>Bluebook</strong> — law journals, court papers and legal references.</li>
</ul>
<p>If nobody has told you which to use, and the work is not academic, use AP. It is the most relaxed, the most familiar to ordinary readers, and the least likely to look wrong.</p>

<h2>Do not do this by hand</h2>
<p>These rules are mechanical, which is exactly the kind of job you should hand to a tool. The <a href="/">title capitalization tool</a> has a tab for each guide, and it shows the rules next to the result, so you can check the reasoning instead of just trusting the answer.</p>
`,
  },
  {
    slug: 'how-to-write-headlines-that-earn-the-click',
    category: 'writing',
    title: 'How to Write Headlines People Actually Click',
    description:
      'Six title patterns that keep working, the character limits that really cut your title short, and a simple test to run before you publish anything.',
    keywords: ['how to write headlines', 'headline formulas', 'clickable titles', 'headline length', 'headline writing tips'],
    date: '2026-03-11',
    readingTime: 8,
    excerpt:
      'Most headline advice is either "be clever" or a list of tricks. There is a middle path, and it is mostly about being specific.',
    body: `
<p>A headline has one job. It should help the right reader decide, in about two seconds, whether this piece is for them. Every so-called "headline formula" is really just a fast way of showing that you are specific.</p>

<h2>Six patterns that keep working</h2>
<ol>
  <li><strong>Number + thing + benefit.</strong> "7 Editing Checks That Catch What Spellcheck Misses." The number tells the reader how much they are getting.</li>
  <li><strong>How to X without Y.</strong> This names the goal and the problem in one line. "How to Cut 20% of Your Draft Without Losing the Argument."</li>
  <li><strong>The question your reader is typing.</strong> "Should You Capitalize After a Colon?" This is also the single best pattern for search traffic.</li>
  <li><strong>A specific claim with a number in it.</strong> "We Rewrote 400 Subject Lines. Sentence Case Won."</li>
  <li><strong>Correcting a common belief.</strong> "Your Meta Description Is Not a Ranking Factor." Only use this when it is actually true.</li>
  <li><strong>A plain description.</strong> Sometimes "APA Title Case Rules, Explained" is the best possible title. Reference pages do not need a hook.</li>
</ol>

<h2>The length limits that really matter</h2>
<ul>
  <li><strong>Google search results:</strong> about 600 pixels, which is roughly 55 to 60 characters. After that you get three dots.</li>
  <li><strong>Email subject lines:</strong> about 40 to 50 characters before phones cut them.</li>
  <li><strong>YouTube:</strong> about 60 characters on a computer, fewer on a phone.</li>
  <li><strong>Social media link cards:</strong> about 70 characters before the wrapping looks bad.</li>
</ul>
<p>So put the important half first. If the essential part of your title is at the end, assume nobody reads it.</p>

<h2>The specific test</h2>
<p>Take your headline and ask one question: could this same title sit on a competitor's article without any change? If yes, it is too general. "How to Improve Your Writing" fails. "The Five-Minute Check Every Draft Needs" passes, because it names something that only exists inside your piece.</p>

<h2>What to avoid</h2>
<ul>
  <li>Creating curiosity with no payoff. Readers remember being tricked.</li>
  <li>Words in ALL CAPS. They read as shouting, and they trigger spam filters in email.</li>
  <li>Two ideas joined by "and". Pick the stronger one.</li>
  <li>Vague amounts — "some", "a few", "several". Use the real number.</li>
</ul>

<h2>Test before you publish</h2>
<p>Write ten titles. Not three — ten. The first three are always the obvious ones. Then run them through the <a href="/tools/ai-title-rewriter">title rewriter</a> to see each one as a question, as a list and as a benefit. Check them in the <a href="/">headline score</a> for length and word mix. Pick the one that passes both.</p>
`,
  },
  {
    slug: 'self-editing-checklist',
    category: 'editing',
    title: 'The Self-Editing Checklist That Catches Most Problems',
    description:
      'Five separate editing passes, each looking for only one thing. Doing them one at a time catches far more than reading through and fixing as you go.',
    keywords: ['self editing checklist', 'how to edit your writing', 'editing passes', 'proofreading checklist', 'copy editing tips'],
    date: '2026-02-18',
    readingTime: 7,
    excerpt:
      'Editing everything at once means editing nothing properly. Split it into five passes and each one becomes easy.',
    body: `
<p>Self-editing feels hard because most people try to fix the structure, the sentences, the word choice and the typos all in one read. Your attention cannot do four jobs at the same time. So split them up.</p>

<h2>Pass 1 — Structure (read only the headings)</h2>
<p>Look at your headings alone, without the text under them. Do they tell the story on their own? If someone read only your subheadings, would they get the argument? Move, join and delete sections here. Do not touch a single sentence yet.</p>

<h2>Pass 2 — Paragraphs (read only first sentences)</h2>
<p>Read the first sentence of every paragraph, one after another. Each one should move the argument forward. If a paragraph starts with something empty, like "It is important to note that…", delete that opening. The real first sentence is usually the second one.</p>

<h2>Pass 3 — Sentences (read it aloud)</h2>
<p>Reading aloud is the only reliable way to find sentences that are too long, rhythms that repeat, and clauses that trip you up. Anywhere you stumble, your reader will stumble too. Do not fix the meaning here. Only fix the shape.</p>

<h2>Pass 4 — Words (search for your own habits)</h2>
<p>Everyone has favourite filler words. Search for yours directly:</p>
<ul>
  <li><em>very, really, just, actually, basically, quite, simply</em> — delete nearly all of them.</li>
  <li><em>there is / there are</em> — usually hiding a stronger verb.</li>
  <li><em>in order to</em> → <em>to</em>.</li>
  <li>Words ending in <em>-ly</em> — keep the ones doing real work, cut the rest.</li>
</ul>

<h2>Pass 5 — Consistency (mechanical, do it last)</h2>
<p>This is the pass most people skip, and the one readers notice most:</p>
<ul>
  <li>Are all your subheadings in the same case? Run them through the <a href="/">capitalization tool</a> together — it handles many lines at once.</li>
  <li>Straight quotes or curly quotes. Pick one and use it everywhere.</li>
  <li>The comma before "and" in a list: yes or no, consistently.</li>
  <li>Numbers: spelled out below ten, or figures everywhere?</li>
  <li>Dates, times and units all in one format.</li>
</ul>

<h2>Then leave it alone</h2>
<p>A draft that has had five clean passes is finished for today. A sixth pass on the same day almost always makes it worse. You start rewriting good sentences because you are bored of them, not because they are wrong.</p>
`,
  },
  {
    slug: 'fix-all-caps-text',
    category: 'editing',
    title: 'How to Fix ALL CAPS Text Without Typing It Again',
    description:
      'Pasted a heading in capitals? Got a document from a caps lock lover? Here is how to fix it properly, including the names most tools get wrong.',
    keywords: ['fix all caps text', 'convert caps to lowercase', 'all caps to sentence case', 'change case in word', 'uppercase to lowercase'],
    date: '2026-04-07',
    readingTime: 5,
    excerpt:
      'Making ALL CAPS small is easy. Getting the names, short forms and brand names back correctly is the part that needs care.',
    body: `
<p>ALL CAPS text has thrown information away. "NASA STUDY SHOWS ICE LOSS IN GREENLAND" gives you no clue about which words originally had capitals. Any tool that converts it has to guess. The only question is how well it guesses.</p>

<h2>The three choices</h2>
<ul>
  <li><strong>lowercase</strong> — for when you are going to fix the capitals by hand anyway.</li>
  <li><strong>Sentence case</strong> — the right choice for body text and subheadings.</li>
  <li><strong>Title Case</strong> — the right choice for a heading, but only with a style guide selected.</li>
</ul>

<h2>Why simple tools get it wrong</h2>
<p>Most converters make everything small, then put a capital on the first letter of each sentence. So "NASA STUDY SHOWS ICE LOSS IN GREENLAND" becomes "Nasa study shows ice loss in greenland". Two mistakes there: NASA lost its capitals, and Greenland lost its capital letter.</p>
<p>A conversion that actually works needs three things: a list of names, a list of short forms, and a rule that protects brand names with capitals inside them, like iPhone and eBay. The <a href="/tools/uppercase-to-lowercase">uppercase to lowercase converter</a> uses all three.</p>

<h2>The check you still have to do</h2>
<p>No automatic list knows the names in your particular document. After converting, look through for:</p>
<ul>
  <li>People and company names from your own work.</li>
  <li>Product names and internal project names.</li>
  <li>Place names outside the common ones.</li>
  <li>Words that are both ordinary words and names — apple and Apple, polish and Polish, march and March.</li>
</ul>
<p>Check that last group carefully. It is the only place where an automatic tool will confidently give you the wrong answer.</p>

<h2>How to avoid it next time</h2>
<p>If the capitals were a design choice and not a typing accident, do not type them in capitals. Type normally and use the CSS rule <code>text-transform: uppercase</code>. It looks exactly the same on screen, but the real text stays readable for screen readers, searchable in your system, and easy to convert later.</p>
`,
  },
  {
    slug: 'consistency-pass-style-sheet',
    category: 'editing',
    title: 'Make a One-Page Style Sheet Before You Need It',
    description:
      'A style sheet is just the twelve decisions you keep making again and again. Writing them down once removes a whole category of editing work.',
    keywords: ['style sheet', 'editorial style guide', 'house style', 'writing consistency', 'content style guide template'],
    date: '2026-05-09',
    readingTime: 5,
    excerpt:
      'Not a ninety-page company style guide. One page, twelve decisions, written down so you stop arguing about them every week.',
    body: `
<p>Most inconsistency in writing is not carelessness. It is the same decision being made differently on different days. A style sheet fixes that by making each decision once.</p>

<h2>The twelve decisions</h2>
<ol>
  <li><strong>Title case for headings?</strong> And which guide — APA, Chicago, AP or MLA?</li>
  <li><strong>Case for subheadings.</strong> Almost always sentence case.</li>
  <li><strong>Comma before "and" in a list.</strong> Yes or no.</li>
  <li><strong>Quote marks.</strong> Straight or curly, and single or double inside a quote.</li>
  <li><strong>Dashes.</strong> A long dash with no spaces, or a shorter one with spaces?</li>
  <li><strong>Numbers.</strong> Words below ten? Below a hundred? Or figures everywhere?</li>
  <li><strong>Dates.</strong> 9 June 2026, June 9 2026, or 2026-06-09.</li>
  <li><strong>Spelling.</strong> British or American — and keep it the same in code comments too.</li>
  <li><strong>Short forms.</strong> Spell them out the first time? Full stops in U.S. or not?</li>
  <li><strong>Product names.</strong> The exact capitals for your products and your competitors.</li>
  <li><strong>Voice.</strong> "We", or the company name, or neither. Second person or third?</li>
  <li><strong>Link text.</strong> Describe the destination, never "click here".</li>
</ol>

<h2>Where to keep it</h2>
<p>In the same folder as the writing itself, not in a wiki nobody opens. One file, twelve lines, plus a growing list at the bottom of words your team spells differently — "email or e-mail", "setup or set up", "login or log in".</p>

<h2>Two habits that keep it working</h2>
<p>First, run every batch of headings through the <a href="/">capitalization tool</a> together instead of one at a time. Inconsistency is obvious the moment the lines sit next to each other. Second, keep a saved find-and-replace list for the words on your inconsistency list, and run it as the last step before publishing.</p>
`,
  },
  {
    slug: 'seo-title-tag-guide',
    category: 'publishing',
    title: 'SEO Title Tags: Length, Structure and What Google Rewrites',
    description:
      'Google rewrites a majority of title tags. Here is what makes it leave yours alone, plus the real length limits and the mistakes to avoid.',
    keywords: ['seo title tag', 'title tag length', 'google rewrites titles', 'meta title best practices', 'seo title format'],
    date: '2026-01-28',
    updated: '2026-06-15',
    readingTime: 8,
    excerpt:
      'The title tag is still the most powerful thing on your page. It is also the one Google is most likely to overrule.',
    body: `
<p>Your title tag does two jobs. It tells search engines what the page is about, and it convinces a human to click. Those goals usually agree with each other. When they do not, Google will rewrite your title.</p>

<h2>The length that works</h2>
<p>Google cuts titles by pixel width, not by character count, at about 600 pixels on a computer. In practice that means <strong>50 to 60 characters</strong> for most titles. Capital letters and wide letters like W and M take more space than i and l. So a 58 character title in capitals may get cut where a 62 character one in sentence case does not.</p>

<h2>A structure that survives</h2>
<p>This pattern works in almost every field:</p>
<p><code>Main Keyword — Benefit or Detail | Brand</code></p>
<ul>
  <li><strong>Keyword first.</strong> Putting it early matters for both scanning and for being cut short.</li>
  <li><strong>One extra detail.</strong> "Free", "2026", "Step by Step", "for Beginners". Pick one, not three.</li>
  <li><strong>Brand last, and only if it helps.</strong> On a small site the brand name eats characters and buys nothing. Leave it out.</li>
</ul>

<h2>Why Google rewrites titles</h2>
<p>Google replaces the title tag on a large share of results. The usual reasons:</p>
<ul>
  <li><strong>Keyword stuffing</strong> — "Title Case Converter, Title Case Tool, Convert Title Case Online".</li>
  <li><strong>The same wording everywhere</strong> — a heavy brand prefix on every single page.</li>
  <li><strong>Too long</strong> — it will use your H1 or some other phrase from the page instead.</li>
  <li><strong>Too short or too vague</strong> — a one word title gives it nothing to work with.</li>
  <li><strong>Does not match the page</strong> — if your H1 and title disagree, Google picks one.</li>
</ul>
<p>The fix for all five is the same: write an accurate, specific title that sounds like something a person would say, and make sure it matches your H1 in meaning without copying it word for word.</p>

<h2>Title tag and H1 are not the same thing</h2>
<p>They should agree, but they should not be identical. The title tag is written for a search results page, where the reader has no context at all. The H1 is written for someone who is already on your page. "SEO Title Tags: Length, Structure and What Google Rewrites" works in search. "Getting your title tags right" works on the page.</p>

<h2>Capitalization in title tags</h2>
<p>Title case is standard, and it looks more authoritative on a results page full of it. AP style is the safest choice, because it capitalizes anything of four letters or more. That avoids the odd looking small "between" that Chicago produces. Run your titles through the <a href="/">capitalization tool</a> on the AP tab before pasting them into your website.</p>

<h2>A checklist before publishing</h2>
<ul>
  <li>50 to 60 characters, with the keyword in the first 30.</li>
  <li>Reads like a phrase a real person would say.</li>
  <li>Different from every other title on your site.</li>
  <li>Matches the H1 in meaning, without copying its exact words.</li>
  <li>No ALL CAPS, and no more than one separator character.</li>
</ul>
`,
  },
  {
    slug: 'meta-description-guide',
    category: 'publishing',
    title: 'Meta Descriptions: Not a Ranking Factor, Still Worth Writing',
    description:
      'Meta descriptions do not affect ranking directly. They do affect how many people click, which affects everything else. Length, structure and examples.',
    keywords: ['meta description', 'meta description length', 'meta description examples', 'seo snippet', 'click through rate seo'],
    date: '2026-03-22',
    readingTime: 6,
    excerpt:
      'Google has said clearly that meta descriptions are not a ranking signal. It has never said they do not matter.',
    body: `
<p>The meta description is your advertisement inside the search results. It does not make the page rank. It decides whether that ranking is worth anything to you.</p>

<h2>Length</h2>
<p>Aim for <strong>140 to 158 characters</strong>. Google shows about 155 to 160 on a computer and less on a phone, and it cuts in the middle of a word with three dots. Anything under about 70 characters looks thin, and it invites Google to write its own version instead.</p>

<h2>A structure that gets clicks</h2>
<p>The pattern is simple: <strong>what the page gives you, then why it is believable, then what to do.</strong></p>
<blockquote>Convert titles to APA, Chicago, AP and MLA title case instantly. Each style guide's rules are shown next to the result, so you can check the reasoning.</blockquote>
<p>That is 150 characters. It names the output, names what makes it different, and does not beg for a click.</p>

<h2>Include the keyword, for bold text</h2>
<p>Google puts the words from the search in bold inside the snippet. A description containing the exact words your reader typed gets visual weight on a page full of grey text. That is the whole SEO value of the keyword here. It is not about ranking.</p>

<h2>Common mistakes</h2>
<ul>
  <li><strong>The same description on many pages.</strong> Worse than having none. It signals templated, low effort content.</li>
  <li><strong>Auto-filled from the first paragraph.</strong> Your first paragraph is written for people who already arrived.</li>
  <li><strong>Cut off at 200 characters.</strong> Write to the limit, not past it.</li>
  <li><strong>"Welcome to our website."</strong> Says nothing, ranks nothing, converts nobody.</li>
  <li><strong>A promise the page does not keep.</strong> High clicks followed by an instant bounce is a worse signal than fewer clicks.</li>
</ul>

<h2>When to skip it</h2>
<p>If a page can rank for dozens of different long search phrases, Google's own generated snippet — pulled from whichever part of the page matches the search — often works better than anything you would write. Reference pages and documentation are the usual examples. For anything with one clear purpose, write it yourself.</p>

<h2>Do not forget the social version</h2>
<p>Open Graph and Twitter card descriptions are separate tags, and each gets cut at a different length. Roughly 200 characters for a link preview, but the first 100 do the real work. Writing one description and reusing it across all three is perfectly fine. Writing none, and letting each platform guess, is not.</p>
`,
  },
  {
    slug: 'structured-data-for-articles',
    category: 'publishing',
    title: 'Structured Data for Articles: The Minimum That Actually Helps',
    description:
      'You do not need twelve schema types. Article, BreadcrumbList and FAQPage cover almost every content site. Here is what to add and what to skip.',
    keywords: ['structured data', 'article schema', 'json-ld', 'breadcrumblist schema', 'faqpage schema'],
    date: '2026-04-30',
    readingTime: 7,
    excerpt:
      'Schema markup is one of the few SEO jobs with a clear right answer. It is also one of the most over-complicated.',
    body: `
<p>Structured data tells search engines what the parts of your page mean. Most sites need three types and nothing more.</p>

<h2>1. Article (or BlogPosting)</h2>
<p>The parts that matter are <code>headline</code>, <code>description</code>, <code>datePublished</code>, <code>dateModified</code>, <code>author</code>, <code>publisher</code> and <code>image</code>. Keep the headline under 110 characters, because Google cuts it there.</p>
<p>The most under-used part is <code>dateModified</code>. If you genuinely update a piece, say so. It is the cheapest freshness signal you have.</p>

<h2>2. BreadcrumbList</h2>
<p>This replaces the plain URL in a search result with a readable path — <em>Home › Tools › CSV to JSON</em>. It takes very little effort, it is well supported, and it makes a deep page look like part of a proper site instead of a lost page.</p>

<h2>3. FAQPage</h2>
<p>Use this only when your page really does have a question and answer section that a reader would recognise as one. Adding invented questions just to take more space in the results is exactly the behaviour Google has been reducing.</p>

<h2>What to skip</h2>
<ul>
  <li><strong>HowTo</strong> — the rich results for it were mostly removed.</li>
  <li><strong>Review and rating on your own pages</strong> — reviews of yourself are ignored, and can get you a manual penalty.</li>
  <li><strong>Speakable</strong> — very narrow use, almost no benefit.</li>
  <li><strong>WebPage on every page</strong> — harmless, and does nothing.</li>
</ul>

<h2>How to add it</h2>
<p>Use JSON-LD inside a <code>&lt;script type="application/ld+json"&gt;</code> tag. Google prefers it, it is easier to generate from a template, and it keeps your HTML clean. Use one block per type, or one <code>@graph</code> list holding all of them.</p>
<p>Everything in your structured data must also be visible on the page itself. A published date the reader cannot see, or an FAQ answer that exists only in the code, breaks Google's rules. It is not a clever trick.</p>

<h2>Check it before you publish</h2>
<p>Run the page through Google's Rich Results Test and the Schema.org validator. They catch different problems. The first tells you what Google will actually use. The second tells you whether your code is technically correct. Both are free and take under a minute.</p>
`,
  },
]

export const POSTS_BY_CATEGORY = POSTS.reduce((acc, post) => {
  ;(acc[post.category] ||= []).push(post)
  return acc
}, {})

export const POST_BY_SLUG = new Map(POSTS.map((p) => [p.slug, p]))

export const sortedPosts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))
