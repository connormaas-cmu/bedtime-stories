document.addEventListener('DOMContentLoaded', async function() {
    const userInput = sessionStorage.getItem('userInput');
    const imageElement = document.getElementById('image');
    const storyElement1 = document.getElementById('story1');
    const audioElement1 = document.getElementById('audio1');
    const storyElement2 = document.getElementById('story2');
    const audioElement2 = document.getElementById('audio2');
    const storyElement3 = document.getElementById('story3');
    const audioElement3 = document.getElementById('audio3');
    // const storyElement4 = document.getElementById('story4');
    // const audioElement4 = document.getElementById('audio4');
    // const storyElement5 = document.getElementById('story5');
    // const audioElement5 = document.getElementById('audio5');
    const storyElement6 = document.getElementById('story6');
    const audioElement6 = document.getElementById('audio6');

    // load our audio
    function loadAudio() {

        if (audioElement1.paused) {
            audioElement1.load()
        } 
        if (audioElement2.paused) {
            audioElement2.load()
        } 
        if (audioElement3.paused) {
            audioElement3.load()
        } 
        // if (audioElement4.paused) {
        //     audioElement4.load()
        // } 
        // if (audioElement5.paused) {
        //     audioElement5.load()
        // } 
        if (audioElement6.paused) {
            audioElement6.load()
        } 
    }
    
    setInterval(loadAudio, 10000);

    // generate image
    async function generateImage(story) {
        const abrStory = story.substring(0, 200)

        fetch('/.netlify/functions/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userInput, story: abrStory }),
        })
        .then(response => response.text())
        .then(textResponse => {
            const data = JSON.parse(textResponse);
            const innerData = JSON.parse(data.task_id);
            const taskId = innerData.data.task_id; 
            
            const checkStatus = (startTime) => {
                if (new Date() - startTime > 30000) {
                    alert("Timeout: Image generation took too long.");
                    return;
                }
            
                fetch(`/.netlify/functions/check-image-status?task_id=${taskId}`)
                    .then(response => response.text())
                    .then(textContent => {
                        if (textContent.includes("Image is still being processed.")) {
                            setTimeout(() => checkStatus(startTime), 5000);
                        } else {
                            const data = JSON.parse(textContent);
                            imageElement.src = data.image;
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    });
            };

            checkStatus(new Date());

        })
        .catch(error => {
            alert(error);
        });
    }

    // generate story
    await fetch('/.netlify/functions/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput }),
    })
    .then(response => response.text())
    .then(textResponse => {
        const data = JSON.parse(textResponse);
        storyElement1.textContent = data.result
        generateImage(data.result)

        setTimeout(() => {
            const rawText = data.result
            const modText = rawText.replace(/[.!?]/g, ",");
            fetch('/.netlify/functions/generate-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: modText }),
            })
            .then(response => response.text())
            .then(textResponse => {
                const audioData = JSON.parse(textResponse)
                const sourceElement = audioElement1.querySelector('source');
                sourceElement.src = audioData.url;
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
                storyElement6.textContent = newData.result + " The end!"
                
                setTimeout(() => {
                    const newRawText = newData.result + ", Thee, end"
                    const newModText = newRawText.replace(/[.!?-]/g, ",");
                    fetch('/.netlify/functions/generate-audio', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: newModText }),
                    })
                    .then(response => response.text())
                    .then(textResponse => {
                        const newAudioData = JSON.parse(textResponse)
                        const sourceElement = audioElement6.querySelector('source');
                        sourceElement.src = newAudioData.url;
                    })
                }, 2000)
            })
        }

        function continueGeneration(count, text) {
            if (count >= 2) { // repeat 2 times
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
                    const sourceElement = audioElement2.querySelector('source');
                    
                    setTimeout(() => {
                        const newRawText = newData.result
                        const newModText = newRawText.replace(/[.!?]/g, ",");
                        fetch('/.netlify/functions/generate-audio', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: newModText }),
                        })
                        .then(response => response.text())
                        .then(textResponse => {
                            const newAudioData = JSON.parse(textResponse)
                            const sourceElement = audioElement2.querySelector('source');
                            sourceElement.src = newAudioData.url;
                        })
                    }, 2000)

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
                    storyElement3.textContent = newData.result
                    
                    setTimeout(() => {
                        const newRawText = newData.result
                        const newModText = newRawText.replace(/[.!?]/g, ",");
                        fetch('/.netlify/functions/generate-audio', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: newModText }),
                        })
                        .then(response => response.text())
                        .then(textResponse => {
                            const newAudioData = JSON.parse(textResponse)
                            const sourceElement = audioElement3.querySelector('source');
                            sourceElement.src = newAudioData.url;
                        })
                    }, 2000)

                    continueGeneration(count + 1, text + " " + newData.result)
                })
            }
            
            // else if (count == 2) {
            //     fetch('/.netlify/functions/continue-generation', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ prompt: userInput, text: text }),
            //     })
            //     .then(response => response.text())
            //     .then(textResponse => {
            //         const newData = JSON.parse(textResponse);
            //         storyElement4.textContent = newData.result
            //          const sourceElement = audioElement4.querySelector('source');
            //
            //         setTimeout(() => {
            //             const newRawText = newData.result
            //             const newModText = newRawText.replace(/[.!?]/g, ",");
            //             fetch('/.netlify/functions/generate-audio', {
            //                 method: 'POST',
            //                 headers: { 'Content-Type': 'application/json' },
            //                 body: JSON.stringify({ text: newModText }),
            //             })
            //             .then(response => response.text())
            //             .then(textResponse => {
            //                 const newAudioData = JSON.parse(textResponse)
            //                 const sourceElement = audioElement4.querySelector('source');
            //                 sourceElement.src = newAudioData.url;
            //             })
            //         }, 2000)

            //         continueGeneration(count + 1, text + " " + newData.result)
            //     })

            // }
            // else {
            //     fetch('/.netlify/functions/continue-generation', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ prompt: userInput, text: text }),
            //     })
            //     .then(response => response.text())
            //     .then(textResponse => {
            //         const newData = JSON.parse(textResponse);
            //         storyElement5.textContent = newData.result
            //         const sourceElement = audioElement5.querySelector('source');
            //
            //         setTimeout(() => {
            //             const newRawText = newData.result
            //             const newModText = newRawText.replace(/[.!?]/g, ",");
            //             fetch('/.netlify/functions/generate-audio', {
            //                 method: 'POST',
            //                 headers: { 'Content-Type': 'application/json' },
            //                 body: JSON.stringify({ text: newModText }),
            //             })
            //             .then(response => response.text())
            //             .then(textResponse => {
            //                 const newAudioData = JSON.parse(textResponse)
            //                 const sourceElement = audioElement5.querySelector('source');
            //                 sourceElement.src = newAudioData.url;
            //             })
            //         }, 2000)

            //         continueGeneration(count + 1, text + " " + newData.result)
            //     })
            // }
        }
        continueGeneration(0, data.result)
    })
    .catch(error => {
        alert(error)
    }); 
});

// display audio
document.addEventListener("DOMContentLoaded", function() {

    const containers = document.querySelectorAll('.container2');

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
            if (!source.getAttribute('src')) {
                container.style.display = 'none';
            }
            observer.observe(source, { attributes: true });
        }
    });
});