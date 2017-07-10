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
    score += count * tagValues[tagName.toLowerCase()]
  }

  return score
}

export default function scorer (htmlString) {
  return 0
}
