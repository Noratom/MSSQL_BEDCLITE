



document.getElementById('principalPersonsForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from refreshing

    const formData = new FormData(e.target);

    try {
        const response = await fetch('http://localhost:4000/forms/submitForm', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.status === 'ok') {
            localStorage.setItem('contract', JSON.stringify(container));
            alert('Form submitted successfully!');
            window.location.href = 'network-construction.html'; 
        } else {
            alert(result.msg);
        }
    } catch (error) {
        console.error(error);
        alert('Something went wrong. Try again!');
    }
});
