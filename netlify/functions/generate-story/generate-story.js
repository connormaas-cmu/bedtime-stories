async function setupFetch() {
  const module = await import('node-fetch');
  return module.default;
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  const fetch = await setupFetch();
  try {
      const { prompt } = JSON.parse(event.body);
      const API_KEY = process.env.TEXT_API_KEY;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{"role": "user", "content": prompt}]
          }),
      });

      const data = await response.json();

      const story = data.choices[0].message.content;

      return {
          statusCode: 200,
          body: JSON.stringify({ story }),
      };
  } catch (error) {
      return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler }
