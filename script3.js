// Attach an event listener to the "Fetch Details" button
document.getElementById('fetchContractorDetails').addEventListener('click', async () => {
    const BEDCRegNo = document.getElementById('BEDCRegNo').value; // Get BEDCRegNo from input field

    // Check if BEDCRegNo is not empty before making the API call
    if (!BEDCRegNo) {
        alert('Please enter a valid BEDC Registration Number');
        return; // Stop execution if no BEDCRegNo is entered
    }

    try {
        // Make a GET request to fetch contractor details based on BEDCRegNo
        const response = await fetch(`http://localhost:4000/forms/getContractor/${BEDCRegNo}`);
        const result = await response.json(); // Parse the JSON response

        // If the response is successful, autofill the form fields with contractor details
        if (result.status === 'ok') {
            const contractor = result.contractor;

            // Set the form input fields to the corresponding values from the response
            document.getElementById('contractorsName').value = contractor.companyName;
            document.getElementById('ContractorAddress').value = contractor.companyAddress;
            document.getElementById('contractorEmail').value = contractor.email;
            document.getElementById('PhoneNo').value = contractor.phoneNumber;
            document.getElementById('BEDCRegNo').value = contractor.BEDCRegNo; // Autofill BEDCRegNo field as well
        } else {
            // Display error message if contractor is not found
            alert(result.msg);
        }
    } catch (error) {
        console.error('Error fetching contractor details:', error); // Log errors to the console
        alert('Failed to fetch contractor details. Try again later.'); // Show error alert to the user
    }
});
