document.addEventListener('DOMContentLoaded', async function() {
    const userInput = sessionStorage.getItem('userInput');
    const storyElement = document.getElementById('story');
    const imageElement = document.getElementById('image');
    const audioElement = document.getElementById('audio');

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

    // generate story
    fetch('/.netlify/functions/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput }),
    })
    .then(response => response.text())
    .then(textResponse => {
        const data = JSON.parse(textResponse);
        storyElement.textContent = data.result

        function generateAudio(text) {
            fetch('/.netlify/functions/generate-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text }),
            })
            .then(response => response.text())
            .then(textResponse => {
                const newData = JSON.parse(textResponse);
                audioElement.src = newData.url
                audioElement.load();
            })      
        }

        function finishGeneration(text) {
            fetch('/.netlify/functions/finish-generation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userInput, text: text }),
            })
            .then(response => response.text())
            .then(textResponse => {
                const newData = JSON.parse(textResponse);
                storyElement.textContent = text + " " + newData.result
                generateAudio(text + " " + newData.result)
            })
        }

        function continueGeneration(count, text) {
            if (count >= 2) { // repeat 2 times
                finishGeneration(text)
                return; 
            }

            fetch('/.netlify/functions/continue-generation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userInput, text: text }),
            })
            .then(response => response.text())
            .then(textResponse => {
                const newData = JSON.parse(textResponse);
                storyElement.textContent = text + " " + newData.result
                continueGeneration(count + 1, text + " " + newData.result)
            })
        }
        continueGeneration(0, data.result)
    })
    .catch(error => {
        storyElement.textContent = "Failed to generate story." + error;
    }); 
    
});
