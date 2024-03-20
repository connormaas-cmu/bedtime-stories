let fetch;
import('node-fetch').then(module => {
  fetch = module.default;
});

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    const { text } = JSON.parse(event.body); 
    const API_KEY = '3ec93807f6msh31ed4d7d260d5d3p175ee1jsn3ce1ecb6e9a2';
    const API_HOST = 'omniinfer.p.rapidapi.com';

    const response = await fetch('https://omniinfer.p.rapidapi.com/v1/text-to-image', {
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

    const { task_id } = await response.json();

    let imageResponse;
    while (true) {
      imageResponse = await fetch(`https://omniinferapi.p.rapidapi.com/v1/progress?task_id=${task_id}`, {
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST
        }
      });

      if (imageResponse.ok) {
        const { image_url } = await imageResponse.json();
        if (image_url) {
          return {
            statusCode: 200,
            body: JSON.stringify({ image_url })
          };
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    return { statusCode: 500, body: "baaa"}; //error.toString() };
  }
};

module.exports = { handler };
