document.addEventListener('DOMContentLoaded', async function() {
    const userInput = sessionStorage.getItem('userInput'); // Retrieve user input
    const storyElement = document.getElementById('story');
    const imageElement = document.getElementById('image');

    // Replace 'your_netlify_function_endpoint' with your actual Netlify function URL
    const response = await fetch('your_netlify_function_endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
    });

    const data = await response.json();
    storyElement.textContent = data.story; // Display generated story
    imageElement.src = data.image; // Display generated image
});
