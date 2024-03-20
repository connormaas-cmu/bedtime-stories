document.addEventListener('DOMContentLoaded', async function() {
    const userInput = sessionStorage.getItem('userInput');
    const storyElement = document.getElementById('story');
    const imageElement = document.getElementById('image');

    // generate story
    fetch('/.netlify/functions/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput }),
    })
    .then(response => response.text())
    .then(textResponse => {
        alert(textResponse)
        const story = JSON.parse(textResponse);
        alert(story)
        storyElement.textContent = story
    })
    .catch(error => {
        storyElement.textContent = "Failed to generate story.";
    });

    // generate image
    // fetch('/.netlify/functions/generate-image', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ prompt: userInput }),
    // })
    // .then(response => response.text())
    // .then(textResponse => {
    //     const data = JSON.parse(textResponse);
    //     const innerData = JSON.parse(data.task_id);
    //     const taskId = innerData.data.task_id; 
    //     const checkStatus = (startTime) => {
    //         if (new Date() - startTime > 20000) {
    //             alert("Timeout: Image generation took too long.");
    //             return;
    //         }
        
    //         fetch(`/.netlify/functions/check-image-status?task_id=${taskId}`)
    //             .then(response => response.text())
    //             .then(textContent => {
    //                 if (textContent.includes("Image is still being processed.")) {
    //                     setTimeout(() => checkStatus(startTime), 2000);
    //                 } else {
    //                     const data = JSON.parse(textContent);
    //                     imageElement.src = data.image;
    //                 }
    //             })
    //             .catch(error => {
    //                 console.log(error)
    //             });
    //     };

    //     checkStatus(new Date());

    // })
    // .catch(error => {
    //     storyElement.textContent = "Failed to generate image." + error;
    // });
});
