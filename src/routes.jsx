import { lazy } from 'react'

/**
 * Route key → component. Pages are grouped into a handful of modules so the
 * bundler produces sensible chunks instead of fifty tiny ones.
 */
const named = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })))

const converters = () => import('./pages/Converters.jsx')
const titles = () => import('./pages/Titles.jsx')
const textGenerators = () => import('./pages/TextGenerators.jsx')
const otherGenerators = () => import('./pages/OtherGenerators.jsx')
const nameGenerators = () => import('./pages/NameGenerators.jsx')
const blog = () => import('./pages/Blog.jsx')
const staticPages = () => import('./pages/StaticPages.jsx')

export const COMPONENTS = {
  Home: lazy(() => import('./pages/Home.jsx')),

  CommaSeparator: named(converters, 'CommaSeparator'),
  CsvToJson: named(converters, 'CsvToJson'),
  JsonToCsv: named(converters, 'JsonToCsv'),
  UppercaseToLowercase: named(converters, 'UppercaseToLowercase'),
  SquareImage: named(converters, 'SquareImage'),

  AiTitleGenerator: named(titles, 'AiTitleGenerator'),
  PoemTitleGenerator: named(titles, 'PoemTitleGenerator'),
  BookTitleGenerator: named(titles, 'BookTitleGenerator'),
  YouTubeTitleGenerator: named(titles, 'YouTubeTitleGenerator'),
  EssayTitleGenerator: named(titles, 'EssayTitleGenerator'),
  AiTitleRewriter: named(titles, 'AiTitleRewriter'),

  LoremIpsum: named(textGenerators, 'LoremIpsum'),
  WingdingsTranslator: named(textGenerators, 'WingdingsTranslator'),
  BoldTextGenerator: named(textGenerators, 'BoldTextGenerator'),
  BubbleTextGenerator: named(textGenerators, 'BubbleTextGenerator'),

  FortuneCookie: named(otherGenerators, 'FortuneCookie'),
  InvisibleCharacter: named(otherGenerators, 'InvisibleCharacter'),
  RandomState: named(otherGenerators, 'RandomState'),
  PromptGenerator: named(otherGenerators, 'PromptGenerator'),
  TextRepeater: named(otherGenerators, 'TextRepeater'),
  SpeechGenerator: named(otherGenerators, 'SpeechGenerator'),
  SongGenerator: named(otherGenerators, 'SongGenerator'),
  PoemGenerator: named(otherGenerators, 'PoemGenerator'),
  BackstoryGenerator: named(otherGenerators, 'BackstoryGenerator'),

  CharacterNameGenerator: named(nameGenerators, 'CharacterNameGenerator'),
  NameGenerator: named(nameGenerators, 'NameGenerator'),
  PokemonNameGenerator: named(nameGenerators, 'PokemonNameGenerator'),

  BlogIndex: named(blog, 'BlogIndex'),
  BlogCategory: named(blog, 'BlogCategory'),
  BlogPost: named(blog, 'BlogPost'),

  AllTools: named(staticPages, 'AllTools'),
  About: named(staticPages, 'About'),
  Contact: named(staticPages, 'Contact'),
  Privacy: named(staticPages, 'Privacy'),
  Terms: named(staticPages, 'Terms'),
  NotFound: named(staticPages, 'NotFound'),
}
