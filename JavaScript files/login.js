document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const submitButton = document.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from submitting immediately

        const username = form.username.value.trim(); // Trim to remove extra spaces
        const password = form.password.value;

        // Basic validation
        if (!username || !password) {
            return;
        }

        try {
            // Make a POST request to the backend to check credentials
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }) // Use `username` and `password` keys as per backend
            });

            if (response.redirected) {
                // If the backend redirects, follow the redirection
                window.location.href = response.url;
            } else if (!response.ok) {
                // If the response is not OK, handle the error
                vibrateButton(submitButton);

                const errorData = await response.json();
            }
        } catch (error) {
            vibrateButton(submitButton);
        }
    });

    function vibrateButton(button) {
        button.classList.add('vibrate'); // Add the vibration class
        button.style.backgroundColor = 'red';
        setTimeout(() => {
            button.style.backgroundColor = 'red';
            button.classList.remove('vibrate'); // Remove vibration class after animation ends
        }, 500); // Match this duration with the CSS animation duration
    }
});
