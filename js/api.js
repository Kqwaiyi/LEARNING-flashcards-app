let requestLock = false;

export async function getQuestions(amt) {
  if (requestLock) return { error: "rate-limited" };
  requestLock = true;

  try {
    const resp = await fetch(
      `https://opentdb.com/api.php?amount=${amt}&type=multiple&encode=url3986`,
    );
    if (resp.status === 429) {
      console.warn("Too many requests");
      return { error: "rate-limited" };
    }
    if (!resp.ok) return { error: "failed" };
    const data = await resp.json();

    if (data.response_code === 5) return { error: "rate-limited" };
    if (data.response_code !== 0) return { error: "failed" };

    const results = data.results;
    return { questions: results };
  } catch (err) {
    console.error(err);
    return { error: "failed" };
  } finally {
    requestLock = false;
  }
}
