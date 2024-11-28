document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const createAccountButton = document.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Use querySelector to ensure correct selection
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        try {
            // Make a POST request to the backend to create an account
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password }) // Use `name` instead of `username`
            });

            if (response.ok) {
                createAccountButton.textContent = 'DONE!';
                createAccountButton.disabled=true;
            } else {
                // If the response is not OK, vibrate the button and turn it red
                vibrateButton(createAccountButton);
                createAccountButton.textContent = 'User Exists';

                // Optionally, display an error message
                const errorData = await response.json();
            }
        } catch (error) {
            vibrateButton(createAccountButton);
        }
    });

    function vibrateButton(button) {
        button.classList.add('vibrate'); // Add the vibration class
        button.style.backgroundColor = 'red';
        setTimeout(() => {
            button.style.backgroundColor = '#39b83f';
            button.classList.remove('vibrate'); // Remove vibration class after animation ends
        }, 500); // Match this duration with the CSS animation duration
    }
});