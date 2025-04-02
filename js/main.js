//  dd/mm/yyyy  Date 
function parseDate(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day); // Month is 0-indexed
}


//branch name---------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve branch information from localStorage
    const branchName = localStorage.getItem('userName');
  
    if (branchName) {
      // Display the branch name
      document.getElementById('branchName').textContent = branchName;
      document.getElementById('hiddenBranchName').value = branchName;
    } else {
      // Redirect back to login if no branch name found
      window.location.href = './';
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll(".item-checkbox");
    const selectedList = document.getElementById("selectedList");
    const saveButton = document.querySelector(".save");
    const clearButton = document.querySelector(".clear");

    // Function to update the selected items list
    function updateSelectedList() {
        selectedList.innerHTML = ""; // Clear the list

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                let listItem = document.createElement("li");
                listItem.textContent = checkbox.nextSibling.textContent.trim();
                selectedList.appendChild(listItem);
            }
        });
    }

    // Function to clear checkboxes and selected items list
    function clearSelection() {
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
        selectedList.innerHTML = ""; // Clear the list
    }

    // Add event listener to checkboxes
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", updateSelectedList);
    });
   

    // Clear selected items list when clicking "Clear"
    clearButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission (if needed)
        clearSelection();
    });
});

  
document.addEventListener("DOMContentLoaded", function () {
  const orderBtn = document.getElementById("orderBtn");
  const popup = document.querySelector(".Stationary_poup");
  const closeButton = document.querySelector(".clear"); // Close button inside the form

  // Show the popup when clicking the New Order button
  orderBtn.addEventListener("click", function () {
      popup.style.display = "block";
  });

  // Hide the popup when clicking the Cancel button
  closeButton.addEventListener("click", function () {
      popup.style.display = "none";
  });

  // Optional: Close popup if clicking outside of it
  window.addEventListener("click", function (event) {
      if (event.target === popup) {
          popup.style.display = "none";
      }
  });
});
 


