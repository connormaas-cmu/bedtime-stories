async function setupFetch() {
  const module = await import('node-fetch');
  return module.default;
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  const fetch = await setupFetch();
  try {
    const task_id = event.queryStringParameters.task_id;
    const API_KEY = '3ec93807f6msh31ed4d7d260d5d3p175ee1jsn3ce1ecb6e9a2';
    const API_HOST = 'omniinfer.p.rapidapi.com';

    const imageResponse = await fetch(`https://omniinfer.p.rapidapi.com/v2/progress?task_id=${task_id}`, {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    });

    if (!imageResponse.ok) {
      throw new Error(`Failed to check status: ${imageResponse.statusText}`);
    }

    const response = await imageResponse.text()
    const data = JSON.parse(response);
    const images = data.imgs

    throw new Error(images)

    if (images.length() > 0) {
      const image = images[0]
      return {
        statusCode: 200,
        body: JSON.stringify({ image })
      };
    } else {
      return {
        statusCode: 202,
        body: 'Image is still being processed.'
      };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler }
