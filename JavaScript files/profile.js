document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const saveButton = document.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const username = form.username.value; // Match backend's `username` field
        const email = form.email.value;
        const password = form.password.value;

        try {
            // Make a POST request to the backend to update profile data
            const response = await fetch('/api/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password }) // Use fields as expected by the backend
            });

            if (response.ok) {
                // If the password is updated, turn button yellow and change text to SAVED!
                turnButtonYellowAndSetText(saveButton, 'SAVED!');
            } else {
                // If the password cannot be updated, vibrate and turn the button red
                turnButtonRedAndVibrate(saveButton);
                const errorData = await response.json();
                alert(errorData.message || 'Failed to update password.');
            }
        } catch (error) {
            console.error('Error while updating password:', error);
            turnButtonRedAndVibrate(saveButton);
            alert('An unexpected error occurred. Please try again later.');
        }
    });

    function turnButtonRedAndVibrate(button) {
        // Add vibration and red color to the button
        button.classList.add('vibrate'); // Add vibration effect
        button.style.backgroundColor = 'red'; // Turn the button red

        setTimeout(() => {
            button.classList.remove('vibrate'); // Remove vibration effect
            button.style.backgroundColor = ''; // Reset button color to default
        }, 500); // Match vibration animation duration
    }

    function turnButtonYellowAndSetText(button, text) {
        // Turn the button yellow and change its text
        button.style.backgroundColor = 'yellow'; // Turn the button yellow
        button.textContent = text; // Change button text
    }
});
