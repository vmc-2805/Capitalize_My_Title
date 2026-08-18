import { useMemo, useState } from 'react'
import ToolShell from '../components/ToolShell.jsx'
import {
  CopyButton,
  EmptyState,
  Field,
  Icon,
  NumberInput,
  ResetButton,
  ResultsHeader,
  SegmentedControl,
  Select,
  Toggle,
  resetControls,
  useCopy,
  useGenerator,
} from '../components/ui.jsx'
import { NAME_STYLES, POKEMON_TYPE_NAMES, generateNames, generatePokemon } from '../lib/generators.js'
import { createRng, pick } from '../lib/random.js'

/** The four choices, in the order the reference tool shows them. */
const GENDERS = [
  { value: 'any', label: 'Any' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'nonbinary', label: 'Non-binary' },
]

function NameGrid({ names }) {
  const { copy } = useCopy()
  const [copied, setCopied] = useState(null)

  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {names.map((name) => (
        <li key={name}>
          <button
            type="button"
            onClick={() => {
              copy(name)
              setCopied(name)
              setTimeout(() => setCopied((c) => (c === name ? null : c)), 1500)
            }}
            className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-brand-400 hover:bg-brand-50"
          >
            <span className="text-[15px] font-medium text-ink-900">{name}</span>
            <span className="shrink-0 text-ink-500">
              {copied === name ? <Icon.check className="text-emerald-600" /> : <Icon.copy />}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/** Shared controls and layout for the three name generators. */
function NameGeneratorPage({ path, styles, defaultStyle, showGender = true, showEpithet = true, extras, howTo, faqs, about }) {
  const [style, setStyle] = useState(defaultStyle)
  const [gender, setGender] = useState('any')
  const [count, setCount] = useState(12)
  const [startsWith, setStartsWith] = useState('')
  const [includeSurname, setIncludeSurname] = useState(true)
  const [includeEpithet, setIncludeEpithet] = useState(false)
  const { seed, generated, generate, field } = useGenerator()

  const names = useMemo(
    () =>
      seed ? generateNames(style, { count, seed, gender, includeSurname, includeEpithet, startsWith }) : [],
    [style, count, seed, gender, includeSurname, includeEpithet, startsWith],
  )

  const surnameApplies = ['human', 'fantasy', 'scifi'].includes(style)

  const { dirty, reset } = resetControls([
    [style, setStyle, defaultStyle],
    [gender, setGender, 'any'],
    [count, setCount, 12],
    [startsWith, setStartsWith, ''],
    [includeSurname, setIncludeSurname, true],
    [includeEpithet, setIncludeEpithet, false],
    field,
  ])

  return (
    <ToolShell path={path} howTo={howTo} faqs={faqs} about={about}>
      <div className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {styles.length > 1 && (
          <Field label="Name style" htmlFor="ng-style">
            <Select
              id="ng-style"
              value={style}
              onChange={setStyle}
              options={styles.map((s) => ({ value: s.key, label: s.label }))}
            />
          </Field>
        )}
        {showGender && surnameApplies && (
          // Four choices side by side rather than in a dropdown: every option
          // is readable without opening anything, and switching is one click.
          <div className="sm:col-span-2">
            <Field label="Gender">
              <SegmentedControl
                name="ng-gender"
                value={gender}
                onChange={setGender}
                options={GENDERS}
              />
            </Field>
          </div>
        )}
        <Field label="Starts with" hint="Optional single letter" htmlFor="ng-start">
          <input
            id="ng-start"
            className="field uppercase"
            maxLength={1}
            value={startsWith}
            onChange={(e) => setStartsWith(e.target.value)}
          />
        </Field>
        <Field label="How many" htmlFor="ng-count">
          <NumberInput id="ng-count" value={count} onChange={setCount} min={1} max={60} />
        </Field>
        {surnameApplies && (
          <div className="flex flex-col justify-center gap-2">
            <Toggle checked={includeSurname} onChange={setIncludeSurname} label="Include surname" />
            {showEpithet && <Toggle checked={includeEpithet} onChange={setIncludeEpithet} label="Add an epithet" />}
          </div>
        )}
        {extras}
        <div className="flex flex-wrap items-end gap-2">
          <button type="button" className="btn-primary" onClick={generate}>
            <Icon.refresh />
            {generated ? 'Generate again' : 'Generate names'}
          </button>
          <ResetButton reset={reset} dirty={dirty} />
        </div>
      </div>

      {!generated ? (
        <EmptyState>Press “Generate names” to see your names.</EmptyState>
      ) : (
        <>
          <ResultsHeader count={names.length} noun="name">
            <CopyButton value={names.join('\n')} label="Copy all" className="btn-secondary !py-1.5 !text-xs" />
          </ResultsHeader>
          {names.length ? (
            <NameGrid names={names} />
          ) : (
            <p className="text-sm text-ink-500">No names match that starting letter. Try a different one.</p>
          )}
        </>
      )}
    </ToolShell>
  )
}

/* ================================================================== */

export function CharacterNameGenerator() {
  return (
    <NameGeneratorPage
      path="/tools/character-name-generator"
      styles={NAME_STYLES.filter((s) => ['human', 'fantasy', 'scifi'].includes(s.key))}
      defaultStyle="fantasy"
      howTo={{
        steps: [
          'Choose realistic, fantasy or sci-fi.',
          'Narrow it down by gender and first letter, if you already have an idea.',
          'Add a surname and a title for characters who need to sound like a legend.',
          'Click any name to copy it.',
        ],
      }}
      faqs={[
        {
          q: 'How do I choose a character name that fits?',
          a: 'Say it aloud in a line of dialogue: "Get down, ___!" A name that is hard to shout is hard to read. Also check that no other main character starts with the same letter, that the syllable count is different from your hero, and that it does not match a famous real person.',
        },
        {
          q: 'Can I use these names in a published book?',
          a: 'Yes. Names cannot be copyrighted, and these are built from sound patterns, not copied from any book. Still, search the name once before you commit, in case it matches a famous character.',
        },
        {
          q: 'What makes fantasy names sound convincing?',
          a: 'Being consistent. Names from one culture in your world should share sounds. If one person is Aeryn, another should not be Bob. Choose two or three consonant sounds and one or two vowel patterns, and stay inside them for that culture.',
        },
        {
          q: 'How many characters should have similar names?',
          a: 'None, ideally. Readers recognise characters by the first letter and the shape of the word, not by the full name. Two characters called Marcus and Marlow will be confused for the whole book.',
        },
      ]}
      about={`
        <h2>Naming by genre</h2>
        <ul>
          <li><strong>Modern and literary fiction</strong> — real names that suit the time period. A character born in 1955 is not called Aiden.</li>
          <li><strong>Fantasy</strong> — invented, but easy to say. If a reader cannot pronounce it, they will skip over it every time, and the character will never feel real.</li>
          <li><strong>Science fiction</strong> — familiar roots with a small twist, or names that suggest cultures mixing in the future. Avoid apostrophes, they are overused.</li>
          <li><strong>Historical fiction</strong> — check which names were actually used then. Naming fashions change fast, and readers of this genre notice.</li>
        </ul>
        <h2>The distinctiveness test</h2>
        <p>Write your character list in one column. If two names start with the same letter, have the same number of syllables, or end with the same sound, change one of them. This single check removes most of the "wait, which one is this?" moments in a first draft.</p>
      `}
    />
  )
}

export function NameGenerator() {
  return (
    <NameGeneratorPage
      path="/tools/name-generator"
      styles={NAME_STYLES}
      defaultStyle="human"
      howTo={{
        steps: [
          'Pick a category: realistic, fantasy, sci-fi, Pokemon-style, pet, band or business.',
          'Set a starting letter if you want alliteration or a specific initial.',
          'Generate as many as you need.',
          'Click a name to copy it, or copy the whole list at once.',
        ],
      }}
      faqs={[
        {
          q: 'How do I pick a business name?',
          a: 'Three checks, in this order. Can you get a usable domain name? Can someone spell it after hearing it once? Is it free of trademark problems in your industry and state? A name that fails any one of these will cost you far more later than a slightly less clever name costs you today.',
        },
        {
          q: 'What makes a good band name?',
          a: 'It should be easy to search and easy to say. Two words work better than one, because a single common word is impossible to find online. Avoid deliberate wrong spellings, because everyone who hears the name before seeing it will search for the wrong thing.',
        },
        {
          q: 'How do I name a pet?',
          a: 'Two syllables ending in a vowel sound carries best when you call across a park, and it does not sound like a command. Avoid names that rhyme with "no", "sit" or "stay". Dogs really do get confused by those.',
        },
        {
          q: 'Are these names checked for trademarks?',
          a: 'No. They are made in your browser from word patterns, with no database check. Before using any name for business, search your country trademark register, the domain registries, and the app stores if that applies to you.',
        },
      ]}
      about={`
        <h2>Seven categories, one generator</h2>
        <ul>
          <li><strong>Realistic</strong> — first names and surnames that would not stand out in a modern novel.</li>
          <li><strong>Fantasy</strong> — invented sounds, with surnames and titles if you want them.</li>
          <li><strong>Sci-fi</strong> — short roots with technical endings.</li>
          <li><strong>Pokemon style</strong> — a describing word joined to a creature ending.</li>
          <li><strong>Pet</strong> — short, often food related, and easy to call out.</li>
          <li><strong>Band</strong> — a describing word plus a plural noun, the standard since the 1960s.</li>
          <li><strong>Business</strong> — two parts joined together, using positive words and place-like endings.</li>
        </ul>
        <h2>Before you commit to a business name</h2>
        <ol>
          <li>Search the exact name along with your industry.</li>
          <li>Check the .com and the .in domain.</li>
          <li>Check the username on the two social apps you will actually use.</li>
          <li>Search your country trademark register.</li>
          <li>Say it in a sentence: "Hi, I'm calling from ___." If it needs spelling out, it will need spelling out forever.</li>
        </ol>
      `}
    />
  )
}

/** Two Pokédex lines per type, so a whole page of one type does not repeat. */
const FLAVOUR_BY_TYPE = {
  Fire: [
    'Its tail flame burns brighter the longer it goes without sleep.',
    'It dries wet clothing simply by walking past the washing line.',
  ],
  Water: [
    'It hums a low note underwater that carries for several kilometres.',
    'It can tell how deep it has swum by the taste of the water alone.',
  ],
  Grass: [
    'The leaves along its back curl inward when a storm is coming.',
    'It plants a seed wherever it sleeps, and returns a year later to check.',
  ],
  Electric: [
    'It charges itself by resting against transformers on quiet roads.',
    'Streetlights flicker twice when one passes underneath them.',
  ],
  Psychic: [
    'It answers questions a fraction of a second before they are asked.',
    'It remembers dreams that belong to somebody else.',
  ],
  Rock: [
    'Its shell is layered with sediment recording every year of its life.',
    'It sits so still that moss treats it as part of the hillside.',
  ],
  Ghost: [
    'It is only visible in photographs taken by accident.',
    'It follows people home but never crosses the doorway.',
  ],
  Ice: [
    'It sleeps through summer inside a shell of its own breath.',
    'The air around it stays cold for an hour after it leaves.',
  ],
  Dragon: [
    'Older specimens can recite the coastline of an entire continent.',
    'It counts its own age in storms rather than in years.',
  ],
  Steel: [
    'It polishes itself against stone until it can see its own reflection.',
    'It rings like a struck bell when it is startled.',
  ],
  Flying: [
    'It never lands in the same place twice in one season.',
    'It sleeps on the wing, one half of its brain at a time.',
  ],
  Dark: [
    'It counts what it takes and returns exactly half, always.',
    'It is drawn to the last lit window on a street.',
  ],
}

export function PokemonNameGenerator() {
  const [count, setCount] = useState(12)
  const [gender, setGender] = useState('any')
  const [fake, setFake] = useState('yes')
  const [type, setType] = useState('any')
  const { seed, generated, generate, field } = useGenerator()
  const { copy } = useCopy()

  const results = useMemo(() => {
    if (!seed) return []
    const rng = createRng(`pokedex|${seed}|${type}`)
    return generatePokemon({ count, seed, type, gender, fake: fake === 'yes' }).map((entry) => ({
      ...entry,
      flavour: pick(rng, FLAVOUR_BY_TYPE[entry.type] || ['']),
    }))
  }, [count, seed, type, gender, fake])

  const { dirty, reset } = resetControls([
    [count, setCount, 12],
    [gender, setGender, 'any'],
    [fake, setFake, 'yes'],
    [type, setType, 'any'],
    field,
  ])

  return (
    <ToolShell
      path="/tools/pokemon-name-generator"
      howTo={{
        steps: [
          'Pick a type, and every name will be built from words that suit it.',
          'Turn "Fake name" off to get names made of plain English words instead.',
          'Gender changes how the name ends — harder, softer, or short and flat.',
          'Click a card to copy the name.',
        ],
      }}
      faqs={[
        {
          q: 'How are real Pokemon names constructed?',
          a: 'Almost all of them are two words joined together: a describing word plus a creature word. Bulbasaur is bulb plus dinosaur. Charmander is char plus salamander. Squirtle is squirt plus turtle. This generator uses the same recipe.',
        },
        {
          q: 'Can I use these names for my own game?',
          a: 'The generated names are free to use. But the Pokemon name itself, and all the existing creature designs, are trademarks of Nintendo, Creatures Inc. and Game Freak. So your own original creature with a generated name is fine. Anything using their artwork or branding is not.',
        },
        {
          q: 'What is a Fakemon?',
          a: 'A creature made by a fan, in the same style as the official ones. Fans have been making them since the late 1990s. A convincing name is usually the first thing such a design needs.',
        },
        {
          q: 'What does the Gender setting actually change?',
          a: 'Only the sound of the ending. A creature is not gendered the way a person is, so this is not a claim about the creature. Male gives hard endings like -don and -zor, Female gives soft ones like -ia and -elle, and Non-binary gives short flat ones like -ix and -yn. Any mixes all three.',
        },
        {
          q: 'What is the difference when Fake name is off?',
          a: 'The name is built from plain English words instead of invented syllables. Fake name on gives you Ignismander. Off gives you Emberfang. The first sounds like it came out of a game, the second is easier to say and easier to remember.',
        },
        {
          q: 'How long should the name be?',
          a: 'Official English names have a twelve character limit, and most are between seven and ten. Anything longer will not fit inside a real game screen, and it loses the short, sharp quality that the good names have.',
        },
      ]}
      about={`
        <h2>The naming formula</h2>
        <p>Take a word that describes the creature main feature, then a word for the animal or object it looks like, and join them at a shared sound. That overlap is what makes it feel like one word instead of two stuck together — <em>Char</em> + sala<em>mander</em>, or <em>Pika</em> (Japanese for a spark) + <em>chu</em> (a mouse squeak).</p>
        <h2>Naming a full set</h2>
        <p>Evolution lines usually share a root, or build up a sound: Charmander, Charmeleon, Charizard. If you are designing a three-stage line, decide the shared part first and build all three names together. Adding the third name later almost never works.</p>
      `}
    >
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <Field label="Gender">
          <SegmentedControl name="pk-gender" value={gender} onChange={setGender} options={GENDERS} />
        </Field>
        <Field label="Fake name?" hint="No uses plain English words">
          <SegmentedControl
            name="pk-fake"
            value={fake}
            onChange={setFake}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Field>
        <div className="w-40">
          <Field label="Pokemon type" htmlFor="pk-type">
            <Select
              id="pk-type"
              value={type}
              onChange={setType}
              options={[
                { value: 'any', label: 'Any' },
                ...POKEMON_TYPE_NAMES.map((t) => ({ value: t, label: t })),
              ]}
            />
          </Field>
        </div>
        <div className="w-28">
          <Field label="Results" htmlFor="pk-count">
            <NumberInput id="pk-count" value={count} onChange={setCount} min={1} max={40} />
          </Field>
        </div>
        <button type="button" className="btn-primary" onClick={generate}>
          <Icon.refresh />
          {generated ? 'Generate again' : 'Generate names'}
        </button>
        <ResetButton reset={reset} dirty={dirty} />
      </div>

      {!generated ? (
        <EmptyState>Press “Generate names” to see your names.</EmptyState>
      ) : (
        <>
          <ResultsHeader count={results.length} noun="name">
            <CopyButton
              value={results.map((r) => `${r.name} (${r.type})`).join('\n')}
              label="Copy all"
              className="btn-secondary !py-1.5 !text-xs"
            />
          </ResultsHeader>

          <ul className="grid gap-3 sm:grid-cols-2">
            {results.map((entry) => (
              <li key={entry.name}>
                <button
                  type="button"
                  onClick={() => copy(entry.name)}
                  className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-brand-400 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-ink-900">{entry.name}</span>
                    <span className="chip">{entry.type}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-ink-500">{entry.flavour}</p>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </ToolShell>
  )
}
