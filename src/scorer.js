import htmlparser from 'htmlparser2'

const tagValues = {
  div: 3,
  p: 1,
  h1: 3,
  h2: 2,
  html: 5,
  body: 5,
  header: 10,
  footer: 10,
  font: -1,
  center: -2,
  big: -2,
  strike: -1,
  tt: -2,
  frameset: -5,
  frame: -5
}

export function tagCountsToScore (tagCounts) {
  let score = 0

  for (const tagName in tagCounts) {
    const count = tagCounts[tagName]
    const tagValue = tagValues[tagName.toLowerCase()] || 0
    score += count * tagValue
  }

  return score
}

/*
  At first I tried cheerio (https://github.com/cheeriojs/cheerio),
  since I've used it before. I discovered that it parses HTML fragments
  by wrapping it around proper HTML when missing.
  (ex: <div></div> -> <html><head></head><body><div></div></body>)

  htmlparser2 doesn't do that, and supports a much better traversal API
  for this simple purpose.
*/

function parseTagCounts (htmlString) {
  let tagCounts = {}

  const parser = new htmlparser.Parser({
    onopentagname: tagName => {
      tagCounts[tagName] = (tagCounts[tagName] || 0) + 1
    }
  })
  parser.write(htmlString)
  parser.end()

  return tagCounts
}

export default function scorer (htmlString) {
  const tagCounts = parseTagCounts(htmlString)
  const score = tagCountsToScore(tagCounts)
  return score
}
