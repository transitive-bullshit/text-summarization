interface SummarizationSentence {
  original: string
  listItem: number
  actual: string
  normalized: string
  tokenized: string[]
}

interface SummarizationItem {
  index: number
  sentence: SummarizationSentence[]
  liScore: number
  nodeScore: number
  readabilityScore: number
  attributionScore: number
  tfidfScore: number
  score: number
}

interface SummarizationOptions {
  html?: string
  text?: string
  title?: string
  minNumSentences?: number
  maxNumSentences?: number
  minImageWidth?: number
  minImageHeight?: number
  media?: boolean
}

interface SummarizationResult {
  title: string

  extractive: string[]
  abstractive?: string[]

  topItems?: SummarizationItem[]
  items?: SummarizationItem[]
}
