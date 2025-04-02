



document.addEventListener("DOMContentLoaded", function () {
    const applyButton = document.querySelector(".btn-leave button.save");
    const leaveForm = document.querySelector(".wrapper");
    const cancelButton = document.querySelector(".btn-leave_apply .clear");
    const leaveApplyForm = document.querySelector("#leaveapplyForm");

    // Show the form when Apply button is clicked
    applyButton.addEventListener("click", function (event) {
        event.preventDefault();
        leaveForm.style.display = "block";
    });

    // Hide the form when Cancel button is clicked
    cancelButton.addEventListener("click", function () {
        leaveForm.style.display = "none";   

        leaveApplyForm.reset(); // Reset the form fields
        leaveForm.style.display = "none"; // Hide the form after submission
    });
});
