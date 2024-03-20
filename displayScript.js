document.addEventListener('DOMContentLoaded', async function() {
    const userInput = sessionStorage.getItem('userInput');
    const storyElement = document.getElementById('story');
    const imageElement = document.getElementById('image');

    storyElement.textContent = "Generating image...";

    fetch('/.netlify/functions/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput }),
    })
    .then(response => response.text())
    .then(textResponse => {
        alert(textResponse);  // Now textResponse contains the actual text
        const data = JSON.parse(textResponse);  // Parse text response to JSON
        alert(data)
        alert(JSON.stringify(data));  // Show the data object
        const { task_id } = data;
        alert(task_id);  // Show the task_id
        const checkStatus = () => {
            fetch(`/.netlify/functions/check-image-status?task_id=${task_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.image_url) {
                    storyElement.textContent = "Image generated!";
                    imageElement.src = data.image_url;
                } else {
                    setTimeout(checkStatus, 2000);
                }
            });
        };
        checkStatus();
    })
    .catch(error => {
        storyElement.textContent = "Failed to generate image." + error;
    });
});
