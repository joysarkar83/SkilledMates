document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    // Get the submit button
    const postButton = document.querySelector('.button');

    // Collect form data
    const title = document.getElementById('title').value;
    const description = document.getElementById('descbox').value;
    const contact = document.getElementById('contact').value;

    // Basic validation
    if (!title || !description || !contact) {
        alert('Please fill in all fields');
        return;
    }

    // Prepare data to be sent to the server
    const announcementData = { title, description, contact };

    // Send data to the server
    fetch('/api/announcements', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData)
    })
    .then(async response => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to post announcement.');
        }
        return response.json();
    })
    .then(data => {
        // Handle success
        console.log('Success:', data);

        // Update button text and disable it
        postButton.textContent = 'DONE!';
        postButton.disabled = true;
        postButton.style.backgroundColor = '#AAFF01'; // Green success color
        postButton.style.cursor = 'not-allowed';


        // Add a success message (ensure it's added only once)
        const container = document.getElementById('container');
        let successMessage = document.getElementById('successMessage');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.id = 'successMessage'; // Add an ID to avoid duplicates
            successMessage.textContent = 'Your announcement has been posted successfully!';
            successMessage.style.color = 'green';
            successMessage.style.marginTop = '10px';
            container.appendChild(successMessage);
        }

        // Optional: Revert changes after a few seconds
        setTimeout(() => {
            postButton.textContent = 'POST';
            postButton.disabled = false;
            postButton.style.backgroundColor = ''; // Reset to original color
            postButton.style.cursor = 'pointer';
            
            // Remove success message
            if (successMessage) {
                successMessage.remove();
            }
        }, 3000); // Revert after 3 seconds
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
        alert(error.message || 'There was an error posting your announcement. Please try again.');
    });
});
