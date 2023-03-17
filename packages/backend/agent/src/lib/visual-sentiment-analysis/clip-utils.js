import numeric from 'numeric'

export function softmax(arr) {
  const exps = arr.map(Math.exp)
  const sumExps = exps.reduce((acc, exp) => acc + exp)
  return exps.map((exp) => exp / sumExps)
}

export function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error('Vectors must be of equal length for cosine similarity.')
  }

  const dotProduct = numeric.dot(a, b)
  const normA = numeric.norm2(a)
  const normB = numeric.norm2(b)

  return 100 * (dotProduct / (normA * normB))
}
