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
        const data = JSON.parse(textResponse);
        const innerData = JSON.parse(data.task_id);
        const taskId = innerData.data.task_id; 
        const checkStatus = () => {
            fetch(`/.netlify/functions/check-image-status?task_id=${taskId}`)
            .then(response => {
                if (response.headers.get('Content-Type').includes('application/json')) {
                    return response.json();
                }
                throw new Error('Response not in JSON format');
            })
            .then(data => {
                alert("here")
                if (data.image_url) {
                    storyElement.textContent = "Image generated!";
                    imageElement.src = data.image_url;
                } else {
                    setTimeout(checkStatus, 2000);
                }
            })
            .catch(error => {
                alert("error man: " + error);
            });
        };
        checkStatus();
    })
    .catch(error => {
        storyElement.textContent = "Failed to generate image." + error;
    });
});
