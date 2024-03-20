async function setupFetch() {
  const module = await import('node-fetch');
  return module.default;
}

async function openaiSetup() {
    const module = await import('openai')
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  const fetch = await setupFetch();
  const openai = openaiSetup()

  try {
      const { prompt } = JSON.parse(event.body);
      const API_KEY = process.env.TEXT_API_KEY;
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
  
      const story = response.data.choices[0].message.content;

      return {
          statusCode: 200,
          body: JSON.stringify({ story }),
      };
  } catch (error) {
      return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler }
