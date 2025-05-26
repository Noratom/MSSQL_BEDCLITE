document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 DOM fully loaded!");

    const form = document.getElementById('substation-form'); // ✅ Ensure correct ID
    console.log("📌 Form found:", form);

    if (!form) {
        console.error("🚨 ERROR: Form with ID 'Pointload-form' NOT FOUND! 🚨");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent page reload

        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:4000/forms/submitSubstation', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.status === 'ok') {
                alert('Form submitted successfully!');
                window.top.location.href = 'success.html';

            } else {
                alert(result.msg);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Try again!');
        }
    });
});
