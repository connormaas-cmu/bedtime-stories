function redirectToDisplay() {
    const userInput = document.getElementById('storyInput').value;
    sessionStorage.setItem('userInput', userInput);
    window.location.href = 'display.html';
}
