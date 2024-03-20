async function setupFetch() {
  const module = await import('node-fetch');
  return module.default;
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => { 
  const fetch = await setupFetch();
  try {
    const body = JSON.parse(event.body);  
    const text = body.prompt;
    const API_KEY = '3ec93807f6msh31ed4d7d260d5d3p175ee1jsn3ce1ecb6e9a2';
    const API_HOST = 'omniinfer.p.rapidapi.com';

    const response = await fetch('https://omniinfer.p.rapidapi.com/v2/txt2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const task_id = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ task_id })
    };

  } catch (error) {
    return { statusCode: 500, body: error.toString() }; 
  }
};

module.exports = { handler };
