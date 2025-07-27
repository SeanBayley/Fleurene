import { kv } from "@vercel/kv"

export const saveQuizResult = async (userId: string, result: any) => {
  const key = `quiz_results:${userId}`
  const existingResults = (await kv.get(key)) || []
  const newResults = [...existingResults, { ...result, id: Date.now(), date: new Date().toISOString() }]
  await kv.set(key, newResults)
}

export const getQuizResults = async (userId: string) => {
  const key = `quiz_results:${userId}`
  return (await kv.get(key)) || []
}
