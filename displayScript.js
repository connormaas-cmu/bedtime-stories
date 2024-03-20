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
        const checkStatus = (startTime) => {
            if (new Date() - startTime > 30000) { // Stop after 30 seconds
                alert("Timeout: Image generation took too long.");
                return;
            }
        
            fetch(`/.netlify/functions/check-image-status?task_id=${taskId}`)
                .then(response => response.text())
                .then(textContent => {
                    if (textContent.includes("Image is still being processed.")) {
                        alert("checking")
                        setTimeout(() => checkStatus(startTime), 5000);
                    } else {
                        alert("Image URL: " + textContent); 
                    }
                })
                .catch(error => {
                    alert("Error checking status: " + error);
                });
        };
        
        checkStatus(new Date());

    })
    .catch(error => {
        storyElement.textContent = "Failed to generate image." + error;
    });
});
