/**
 * Blog posts. Bodies are trusted HTML authored in this repo — never user input —
 * and are rendered with dangerouslySetInnerHTML by the post page.
 *
 * Copy style: short sentences, simple words, direct "you". Keep every
 * description between 80 and 200 characters (the tests check this).
 */

export const POSTS = [
  {
    slug: 'how-to-write-perfect-paragraphs',
    category: 'writing',
    image: '/blog-img-paragraphs.jpg',
    title: 'How to Write Perfect Paragraphs Every Time',
    description:
      'Most paragraphs fail for the same three reasons. Fix the opening line, keep one idea per paragraph, and end with momentum. Here is how to do all three.',
    keywords: ['how to write paragraphs', 'paragraph writing tips', 'topic sentence', 'paragraph structure', 'writing better paragraphs'],
    date: '2026-07-10',
    readingTime: 7,
    excerpt:
      'A paragraph is a contract with the reader. It starts with a promise, delivers on it, and hands the reader to the next one. Most fall apart at step one.',
    body: `
<p>A well-written paragraph does three things: it opens with a clear idea, it develops that idea with one or two specifics, and it ends in a way that makes the next paragraph feel necessary. When any of those three fails, the reader stops. They do not always know why. They just stop.</p>

<h2>Start with the point, not the warm-up</h2>
<p>The most common problem in paragraphs is a warm-up sentence at the start. Something like "It is important to consider that writing is a complex skill." That sentence says nothing. The real paragraph starts on the second line.</p>
<p>Read only your opening sentences, one after another. Each one should give the reader something. If it doesn't, delete it and move the real first sentence up.</p>

<h2>One idea per paragraph</h2>
<p>If your paragraph could be split into two different paragraphs and both would make sense, split it. A paragraph that holds two ideas loses both. The reader cannot hold them together, and search engines cannot decide what the paragraph is about either.</p>
<p>The test: write a one-sentence summary of your paragraph. If you need the word "and" to connect two separate things, you have two paragraphs.</p>

<h2>Use concrete details, not abstract claims</h2>
<p>Abstract: "Good writing is clear and concise." Every writer has read this a hundred times and learned nothing from it.</p>
<p>Concrete: "Cut the first sentence of every paragraph. Then read the paragraph again. In most cases, it is better." That sentence you just read is 21 words. This note about it is 22. Concrete is almost always shorter than abstract, not longer.</p>

<h2>End with momentum, not a summary</h2>
<p>A paragraph that ends by repeating what it just said trains the reader to skip the endings. Instead, end with something that makes the next paragraph feel earned. A question, a consequence, or a half-stated thing that the next paragraph will complete.</p>

<h2>The length question</h2>
<p>There is no right length. A single sentence can be a paragraph if it needs to land hard. Eight sentences can be a paragraph if the idea needs that much room. The wrong answer is a fixed rule. The right answer is: as long as the idea needs, and no longer.</p>
<p>For web reading, shorter is almost always safer. Readers scan. Give them somewhere to stop every three or four sentences, and they will read more of what you wrote, not less.</p>

<h2>Fix your existing paragraphs quickly</h2>
<p>Paste your draft into a document and read only the first sentence of each paragraph, one after another. Every weak one will show itself immediately. Then read only the last sentences. Wherever the ending just repeats the opening, rewrite it to open a door to the next thought instead.</p>
<p>Run your headings through the <a href="/">capitalization tool</a> when you are done, to make sure the structure looks as clean as the writing does.</p>
`,
  },
  {
    slug: 'power-words-that-make-writing-stronger',
    category: 'editing',
    image: '/blog-img-powerwords.jpg',
    title: 'Power Words That Make Your Writing Stronger',
    description:
      'Some words carry weight and some words dissolve. Here are the categories of strong words, where to use them, and the weak ones to replace them with.',
    keywords: ['power words for writing', 'strong words in writing', 'replace weak words', 'word choice writing', 'persuasive words list'],
    date: '2026-07-28',
    readingTime: 8,
    excerpt:
      'Changing twenty words in a five-hundred-word piece can change how the whole thing reads. The words that do the most damage are usually the invisible ones.',
    body: `
<p>Power words are not fancy words. They are specific, concrete words that do the work your sentence needs. The opposite is not simple words — it is vague words. "Improve" is vague. "Cut in half" is powerful. "Interesting" is vague. "Stopped me mid-sentence" is powerful.</p>

<h2>The four categories of strong words</h2>

<h3>Verbs that do the work themselves</h3>
<p>Weak verbs need an adverb to do anything. Strong verbs do not. "He walked quickly" needs two words to say what "he strode" says in two. "She said loudly" is weaker than "she announced". Every time you write a verb with an adverb, ask whether a stronger verb already exists.</p>
<ul>
  <li>walked quickly → strode, marched, hurried</li>
  <li>said loudly → announced, declared, insisted</li>
  <li>looked carefully → studied, examined, scrutinised</li>
  <li>worked hard → drove, pushed, ground through</li>
</ul>

<h3>Numbers and specifics</h3>
<p>"Many readers" is a claim. "More than four thousand readers" is a fact. Specifics are trusted more, remembered more, and shared more. Whenever you write "many", "some", "a lot", "significant", or "various", replace it with the real number if you have it. If you don't, find it.</p>

<h3>Sensory words</h3>
<p>Anything a reader can see, hear, feel, taste or smell lands harder than an abstract description. "The office was uncomfortable" tells nothing. "The chairs had no cushions and the air smelled of old coffee" is something the reader can be inside.</p>

<h3>Consequence words</h3>
<p>Words that move the reader from cause to effect: therefore, which means, so, as a result, that is why. These are the hinges of an argument. Without them, readers have to do the logical work themselves, and some will not bother.</p>

<h2>The weak words list</h2>
<p>These words appear in almost every draft. Most of them can go:</p>
<ul>
  <li><em>very, really, quite, rather, fairly, somewhat</em> — cut almost all of them.</li>
  <li><em>thing, stuff, aspect, area, element</em> — replace with what you actually mean.</li>
  <li><em>utilize</em> → use. <em>Implement</em> → do. <em>Leverage</em> → use.</li>
  <li><em>basically, essentially, literally</em> — delete and reread. The sentence is almost always better.</li>
  <li><em>that</em> — remove it and check if the sentence still works. In about a third of cases it does.</li>
</ul>

<h2>When simple beats strong</h2>
<p>Power words are not always the long or dramatic ones. "Now" is more powerful than "at this point in time". "Use" is more powerful than "utilise". The strongest word is always the most exact one, and exact words are usually shorter than the alternatives.</p>

<h2>How to edit for word choice</h2>
<p>Run a separate editing pass where you look only at verbs and adjectives. Highlight every verb in the document and ask whether a stronger one exists. Then highlight every adjective and ask whether a concrete detail would say it better. This pass alone changes how the whole piece reads.</p>
<p>When your headings are finalised, run them through the <a href="/">title capitalization tool</a> to make sure the style is consistent across the piece. Inconsistent capitalisation undermines the impression of care that good word choice builds.</p>
`,
  },
  {
    slug: 'how-to-publish-your-first-article-online',
    category: 'publishing',
    image: '/blog-img-publish.jpg',
    title: 'How to Publish Your First Article Online: A Practical Guide',
    description:
      'Choosing where to publish, formatting for the web, setting the metadata and clicking publish. The complete first-article checklist for writers new to online publishing.',
    keywords: ['how to publish article online', 'publishing first blog post', 'online publishing guide', 'where to publish writing', 'article publishing checklist'],
    date: '2026-08-12',
    readingTime: 9,
    excerpt:
      'The writing is the hard part and you have already done it. Publishing is a sequence of decisions. Here is what each one is and how to make it quickly.',
    body: `
<p>Publishing online is not just uploading a file. It is a sequence of small decisions that together decide whether anyone finds what you wrote. Most first-time publishers get the writing right and then rush the rest. This guide covers every step after the final draft.</p>

<h2>Step 1 — Choose where to publish</h2>
<p>There are three sensible choices for a first article:</p>
<ul>
  <li><strong>Your own site</strong> — maximum control, all the SEO benefit, but more setup time.</li>
  <li><strong>Medium or Substack</strong> — built-in audience discovery, simple editor, zero setup. The SEO benefit goes to the platform, not to you.</li>
  <li><strong>A publication that accepts pitches</strong> — their audience, their credibility, your byline. Competitive, but the fastest way to reach a large readership without building one from scratch.</li>
</ul>
<p>If your goal is to build your own readership over time, start with your own site. If your goal is to be read by as many people as possible right now, pitch a publication first and cross-post to Medium after.</p>

<h2>Step 2 — Format for reading on screen</h2>
<p>Web readers scan before they read. Help them with:</p>
<ul>
  <li>Subheadings every three to five paragraphs.</li>
  <li>Short paragraphs — three to four sentences maximum for the web.</li>
  <li>A bold first word or phrase in a list makes it scannable.</li>
  <li>One idea per paragraph. Two ideas means two paragraphs.</li>
</ul>
<p>Do not use a centred layout for body text. Left-aligned text on a light background with good line height is still the fastest thing to read, and speed of reading is what keeps someone on the page.</p>

<h2>Step 3 — Write the metadata before you publish</h2>
<p>Most writers publish and then go back to the metadata. This is the wrong order. Write these three things before you click publish, while the article is still fresh in your head:</p>
<ol>
  <li><strong>Title tag</strong> — 50 to 60 characters, keyword first. Run it through the <a href="/">title capitalization tool</a> on AP style.</li>
  <li><strong>Meta description</strong> — 140 to 158 characters. State what the piece gives the reader and why it is believable. No "Welcome to our blog."</li>
  <li><strong>URL slug</strong> — short, hyphenated, keyword-first. No dates, no underscores. "how-to-write-better" not "how_to_write_better_2026_08_12".</li>
</ol>

<h2>Step 4 — Choose and set your image</h2>
<p>Every article needs an Open Graph image — the image that appears when someone shares the link on social media or in a message. If you do not set one, the platform picks one for you, and it is usually wrong.</p>
<p>A simple, readable image with a clear focus works better than a complex one. The image is shown at roughly 1200 × 630 pixels, but will often be seen at 300 × 157. Anything in the middle of a busy image will disappear at that size.</p>

<h2>Step 5 — Internal links</h2>
<p>Before publishing, add at least two links to other things you have written or to tools that are relevant. Internal links keep readers on your site and tell search engines that the pages are connected. They are the easiest thing to add and the most often skipped.</p>

<h2>Step 6 — The pre-publish checklist</h2>
<ul>
  <li>Title tag written and correct length.</li>
  <li>Meta description written and correct length.</li>
  <li>URL slug is clean and readable.</li>
  <li>Open Graph image is set.</li>
  <li>At least two internal links added.</li>
  <li>Headings are in consistent case — run them through the <a href="/">capitalization tool</a> together.</li>
  <li>Read the whole piece one more time on the screen you will publish to. It looks different than in a document editor.</li>
</ul>

<h2>After publishing</h2>
<p>Submit the URL to Google Search Console so it gets crawled faster. Share it once, clearly, without overselling it. Then start the next one. The biggest mistake after a first article is waiting to see how it does before writing the second. The second one is always better, and writing it is the only way to find out.</p>
`,
  },
]

export const POSTS_BY_CATEGORY = POSTS.reduce((acc, post) => {
  ;(acc[post.category] ||= []).push(post)
  return acc
}, {})

export const POST_BY_SLUG = new Map(POSTS.map((p) => [p.slug, p]))

export const sortedPosts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))
