async function setupFetch() {
  const module = await import('node-fetch');
  return module.default;
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  const fetch = await setupFetch();
  try {
      const body = JSON.parse(event.body);  
      const prom = body.prompt;
      const text = body.text
      const prompt = "We are creating an educational story in the form of a children's tale about the following:\n\n'" + prom + "'\n\nHere is the story so far:\n\n" + text + "\n\nPlease respond with about 75 words that cleverly end the story (continue from where it left off). Make it as educational ass possible."

      const API_KEY = process.env.API_KEY;
      const API_HOST = 'open-ai21.p.rapidapi.com';

      const input = {
          "messages": [
              {
                  "role": "user",
                  "content": prompt
              }
          ],
          "web_access": false,
          "system_prompt": '',
          "temperature": 0.9,
          "top_k": 5,
          "top_p": 0.9,
          "max_tokens": 250
      }

      const response = await fetch('https://open-ai21.p.rapidapi.com/conversationgpt35', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': API_HOST
          },
          body: JSON.stringify(input)
      });

      if (!response.ok) {
          throw new Error(`Failed to generate text: ${response.statusText}`);
      }

      const res = await response.text();
      const jsonRes = JSON.parse(res)
      const result = jsonRes.result

      return {
          statusCode: 200,
          body: JSON.stringify({ result })
      };

  } catch (error) {
      return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler }
