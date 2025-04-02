//db
import { database, ref, push, onValue, update } from "./firebaseConfig.js";

const branchName = localStorage.getItem('userName') || "Unknown Branch";  // Retrieve branch name
const collectionListDB = ref(database, `stationary/${branchName}`);

const popup = document.querySelector(".Stationary_poup");
const pledgeNumberBox = document.querySelector("#pledgeNumberBox"); 
const pledgeNumberInput = document.querySelector("#pledgeNumber");

// Function to format date as dd/mm/yyyy HH:MM
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Checkbox fields with display names
const checkboxFields = {
    "goldCover": "Gold Cover",
    "KYCBooks": "KYC Book",
    "Vocher": "Voucher",
    "sticker": "Sticker",
    "Inlandletter": "Inland Letter",
    "whitecover": "White Envelope(Small)",
    "whitecover1": "White Envelope(Big)",
    "ctyrp": "Chitty Receipt Book",
    "ctyvr": "Chitty Voucher",
   // "glrecept": "Gold Loan Receipt",
    //"glapplication": "Gold Loan Application",
    "chiyform": "Chity Form",
    "rdbook": "RD Book",
    "carbon": "Carbon Paper"
};


// Handle new order submission
document.getElementById("collectionForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const collect = {};


    Object.keys(checkboxFields).forEach(id => {
        collect[id] = document.getElementById(id).checked;
    });

    
    // Handle pledge number only if "sticker" is checked
    if (collect["sticker"]) {
        const pledgeNumber = pledgeNumberInput.value.trim();
        if (!pledgeNumber) {
            alert("Please enter the last pledge number.");
            return; // Prevent form submission if pledge number is missing
        }
        collect.pledgeNumber = pledgeNumber;
    }

    collect.timestamp = new Date().toISOString();
    collect.status = "order Success";
    collect.mssge = "";
    collect.Details = "";
    collect.hiddenBranchName = localStorage.getItem('userName') || "Unknown Branch";

    push(collectionListDB, collect)
        .then(() => {
            alert("Order placed successfully!");
            document.getElementById("collectionForm").reset();            
            pledgeNumberBox.style.display = "none"; 
            popup.style.display = "none";          
        })
        .catch(error => alert("Error placing order: " + error));
});

// Toggle pledge number box visibility based on "sticker" checkbox
document.querySelector("#sticker").addEventListener("change", function () {
    pledgeNumberBox.style.display = this.checked ? "block" : "none";
});

// Fetch and display data
const reportContainer = document.getElementById("reportContainer");
onValue(collectionListDB, function (snapshot) {
    if (snapshot.exists()) {
        let userArray = Object.entries(snapshot.val()).sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));
        reportContainer.innerHTML = "";

        userArray.forEach(([id, data]) => {
            const formattedTimestamp = formatTimestamp(data.timestamp);
            
            // Convert checkbox field IDs to their corresponding display names
            let checkboxList = Object.keys(checkboxFields)
                .map(field => data[field] ? `<span class="badge">${checkboxFields[field]}</span>` : '')
                .join('');

            // Add pledge number if available
            const pledgeNumberDisplay = data.pledgeNumber ? `<p>Pledge Number: <b>${data.pledgeNumber}</b></p>` : '';            

            reportContainer.innerHTML += `
                <div class="record-box">
                    <div class="record-header">
                        <h3>${data.hiddenBranchName || "Branch Name"}</h3>
                        <p>${formattedTimestamp}</p>
                    </div>
                    <div class="record-content">
                        ${checkboxList}
                        ${pledgeNumberDisplay}
                    </div>
                    <div class="record-footer">
                        <p><b>Status:</b> <strong>${data.status || "Unknown"}</strong></p>
                        <p class="msge"><b>Remarks:</b> <strong>${data.mssge || ""}</strong></p>
                        <button class="btn-edit-status" data-id="${id}" data-status="${data.status || 'Pending'}">Update Status</button>
                    </div>
                </div>`;
        });
    } else {
        reportContainer.innerHTML = "<p class='no-records'><b>No Record Found</b></p>";
    }     
});

// Handle clicking "Edit Status" button
let currentEditId = null;
const modal = document.getElementById("modal");
const modalStatusDropdown = document.getElementById("modalStatusDropdown");

const closeModalBtn = document.getElementById("closeModalBtn");

document.addEventListener("click", function (e) {
    let editButton = e.target.closest(".btn-edit-status");
    if (editButton) {
        currentEditId = editButton.dataset.id;
        const currentStatus = editButton.dataset.status;

        modalStatusDropdown.value = currentStatus;
        modal.style.display = "block"; 
    }
});

// Save the new status
if (saveEditBtn) {
    saveEditBtn.addEventListener("click", function () {
        if (currentEditId) {
            const newStatus = modalStatusDropdown.value; 
            const newmssg = statusMssg.value;            
            const updateRef = ref(database, `stationary/${branchName}/${currentEditId}`);            
            update(updateRef, { status: newStatus })
            update(updateRef, { mssge: newmssg })
                .then(() => {
                    console.log("Status updated successfully!");
                    modal.style.display = "none"; 
                })
                .catch((error) => {
                    console.error("Error updating status:", error);
                });
        }
    });
}

// Close modal
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });
}