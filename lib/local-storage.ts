// Simple local storage solution - no database needed
export const saveQuizResult = (result: any) => {
  const existingResults = getQuizResults()
  const newResults = [...existingResults, { ...result, id: Date.now(), date: new Date().toISOString() }]
  localStorage.setItem("fleurene_quiz_results", JSON.stringify(newResults))
}

export const getQuizResults = () => {
  if (typeof window === "undefined") return []
  const results = localStorage.getItem("fleurene_quiz_results")
  return results ? JSON.parse(results) : []
}

export const clearQuizResults = () => {
  localStorage.removeItem("fleurene_quiz_results")
}
