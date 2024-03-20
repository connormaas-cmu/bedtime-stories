document.addEventListener('DOMContentLoaded', async function() {
    const userInput = sessionStorage.getItem('userInput'); // Retrieve user input
    const storyElement = document.getElementById('story');
    const imageElement = document.getElementById('image');

    storyElement.textContent = "Generating image..."; // Notify user that image is being generated

    fetch('/.netlify/functions/generate-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
    })
    .then(async response => {
        response.text().then(text => alert(text));
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response);
        }
        const { image_url } = await response.json();
        // Update storyElement with the image URL
        storyElement.textContent = "Image generated!"; 
        // Update imageElement to display the generated image
        imageElement.src = image_url;
    })
    .catch(error => {
        console.error('Error generating image:', error);
        alert(error)
        storyElement.textContent = "Failed to generate image. Limit exceeded for today"; // Notify user of failure
    });
});


