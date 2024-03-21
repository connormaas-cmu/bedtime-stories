document.addEventListener('DOMContentLoaded', async function() {
    const userInput = sessionStorage.getItem('userInput');
    const imageElement = document.getElementById('image');
    const storyElement1 = document.getElementById('story1');
    const audioElement1 = document.getElementById('audio1');
    const storyElement2 = document.getElementById('story2');
    const audioElement2 = document.getElementById('audio2');
    const storyElement3 = document.getElementById('story3');
    const audioElement3 = document.getElementById('audio3');
    const storyElement4 = document.getElementById('story4');
    const audioElement4 = document.getElementById('audio4');
    const storyElement5 = document.getElementById('story5');
    const audioElement5 = document.getElementById('audio5');
    const storyElement6 = document.getElementById('story6');
    const audioElement6 = document.getElementById('audio6');

    function loadAudio() {
        const sourceElement = audioElement1.querySelector('source');
        if (sourceElement.src == "") {
            audioElement1.load()
        }
    }
    
    setInterval(loadAudio, 10000);

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
        storyElement1.textContent = data.result

        setTimeout(() => {
            fetch('/.netlify/functions/generate-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: data.result }),
            })
            .then(response => response.text())
            .then(textResponse => {
                const audioData = JSON.parse(textResponse)
                // audioElement1.src = audioData.url
                // audioElement1.load()
                const sourceElement = audioElement1.querySelector('source');
                sourceElement.src = audioData.url;
                audioElement1.load();
            })
        }, 2000)

        function finishGeneration(text) {
            fetch('/.netlify/functions/finish-generation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userInput, text: text }),
            })
            .then(response => response.text())
            .then(textResponse => {
                const newData = JSON.parse(textResponse);
                storyElement6.textContent = newData.result
                
                // fetch('/.netlify/functions/texttospeech', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ text: newData.result }),
                // })
                // .then(response => response.text())
                // .then(textResponse => {
                //     const newAudioData = JSON.parse(textResponse);
                //     audioElement6.src = newAudioData.url
                //     audioElement6.load()
                // })
            })
        }

        function continueGeneration(count, text) {
            if (count >= 4) { // repeat 4 times
                finishGeneration(text)
                return; 
            }
            else if (count == 0) {
                fetch('/.netlify/functions/continue-generation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: userInput, text: text }),
                })
                .then(response => response.text())
                .then(textResponse => {
                    const newData = JSON.parse(textResponse);
                    storyElement2.textContent = newData.result
                    
                    // fetch('/.netlify/functions/texttospeech', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ text: newData.result }),
                    // })
                    // .then(response => response.text())
                    // .then(textResponse => {
                    //     const newAudioData = JSON.parse(textResponse);
                    //     audioElement2.src = newAudioData.url
                    //     audioElement2.load()
                    // })

                    continueGeneration(count + 1, text + " " + newData.result)
                })
    
            }
            else if (count == 1) {
                fetch('/.netlify/functions/continue-generation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: userInput, text: text }),
                })
                .then(response => response.text())
                .then(textResponse => {
                    const newData = JSON.parse(textResponse);
                    storyElement3.textContent = newData.result
                    
                    // fetch('/.netlify/functions/texttospeech', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ text: newData.result }),
                    // })
                    // .then(response => response.text())
                    // .then(textResponse => {
                    //     const newAudioData = JSON.parse(textResponse);
                    //     audioElement3.src = newAudioData.url
                    //     audioElement3.load()
                    // })

                    continueGeneration(count + 1, text + " " + newData.result)
                })
            }
            else if (count == 2) {
                fetch('/.netlify/functions/continue-generation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: userInput, text: text }),
                })
                .then(response => response.text())
                .then(textResponse => {
                    const newData = JSON.parse(textResponse);
                    storyElement4.textContent = newData.result

                    // fetch('/.netlify/functions/texttospeech', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ text: newData.result }),
                    // })
                    // .then(response => response.text())
                    // .then(textResponse => {
                    //     const newAudioData = JSON.parse(textResponse);
                    //     audioElement4.src = newAudioData.url
                    //     audioElement4.load()
                    // })

                    continueGeneration(count + 1, text + " " + newData.result)
                })

            }
            else {
                fetch('/.netlify/functions/continue-generation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: userInput, text: text }),
                })
                .then(response => response.text())
                .then(textResponse => {
                    const newData = JSON.parse(textResponse);
                    storyElement5.textContent = newData.result

                    // fetch('/.netlify/functions/texttospeech', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ text: newData.result }),
                    // })
                    // .then(response => response.text())
                    // .then(textResponse => {
                    //     const newAudioData = JSON.parse(textResponse);
                    //     audioElement5.src = newAudioData.url
                    //     audioElement5.load()
                    // })

                    continueGeneration(count + 1, text + " " + newData.result)
                })
            }
        }
        continueGeneration(0, data.result)
    })
    .catch(error => {
        alert(error)
        console.log(error);
    }); 

});

document.addEventListener("DOMContentLoaded", function() {

    const containers = document.querySelectorAll('.container');

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                const source = mutation.target;
                const audio = source.parentElement;
                if (source.getAttribute('src')) {
                    audio.parentElement.style.display = '';
                } else {
                    audio.parentElement.style.display = 'none';
                }
            }
        });
    });

    containers.forEach(container => {
        const source = container.querySelector('source');
        if (source) {
            // Initially hide audio elements with empty src
            if (!source.getAttribute('src')) {
                container.style.display = 'none';
            }
            // Observe changes to the src attribute
            observer.observe(source, { attributes: true });
        }
    });
});
