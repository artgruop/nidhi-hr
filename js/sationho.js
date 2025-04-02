//db
import { database, ref, update , onValue,   } from "./firebaseConfig.js";

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

const branchListDropdown = document.getElementById("branchList");

// Function to fetch data based on the selected branch
function fetchStationaryData(selectedBranch) {
    let collectionRef;

    if (selectedBranch === "Full") {
        collectionRef = ref(database, "stationary"); // Fetch all branches
    } else {
        collectionRef = ref(database, `stationary/${selectedBranch}`); // Fetch specific branch
    }

    onValue(collectionRef, function (snapshot) {
        reportContainer.innerHTML = ""; // Clear previous data
    
        if (snapshot.exists()) {
            let dataEntries = [];
    
            if (selectedBranch === "Full") {
                const branchesData = snapshot.val();
                
                Object.keys(branchesData).forEach(branch => {
                    const branchRecords = branchesData[branch];
    
                    if (branchRecords) {
                        Object.entries(branchRecords).forEach(([id, data]) => {
                            dataEntries.push({ id, data, branch });
                        });
                    }
                });
            } else {
                dataEntries = Object.entries(snapshot.val()).map(([id, data]) => ({ id, data, branch: selectedBranch }));
            }
    
            // Sort by timestamp (latest first)
            dataEntries.sort((a, b) => new Date(b.data.timestamp) - new Date(a.data.timestamp));
    
            dataEntries.forEach(({ id, data, branch }) => {
                const formattedTimestamp = formatTimestamp(data.timestamp);
                let checkboxList = Object.keys(checkboxFields)
                    .map(field => data[field] ? `<span class="badge">${checkboxFields[field]}</span>` : "")
                    .join("");
    
                const pledgeNumberDisplay = data.pledgeNumber ? `<p>Pledge number: <b>${data.pledgeNumber}</b></p>` : "";
    
                reportContainer.innerHTML += `
                    <div class="record-box">
                        <div class="record-header">
                            <h3>${branch || "Branch Name"}</h3>
                            <p>${formattedTimestamp}</p>
                        </div>
                        <div class="record-content">
                            ${checkboxList}
                            ${pledgeNumberDisplay}
                        </div>
                        <div class="record-footer">
                            <p><b>Status:</b> <strong>${data.status || "Unknown"}</strong></p>
                            <p class="msge"><b>Details:</b> <strong>${data.Details || ""}</strong></p>
                            <p class="msge"><b>Remarks:</b> <strong>${data.mssge || ""}</strong></p>                            
                            <button class="btn-edit-status" data-id="${id}" data-branch="${branch}" data-status="${data.status || 'Pending'}">Update Status</button>
                        </div>
                    </div>`;
            });
        } else {
            reportContainer.innerHTML = "<p class='no-records'><b>No Record Found</b></p>";
        }
    });
    
}

// Run the function when the dropdown value changes
branchListDropdown.addEventListener("change", function () {
    fetchStationaryData(branchListDropdown.value);
});

// Fetch initial data for the default selected branch
fetchStationaryData(branchListDropdown.value);


// Handle clicking "Edit Status" button
let currentEditId = null;
const modal = document.getElementById("modal");
const modalStatusDropdown = document.getElementById("modalStatusDropdown");
const statusMessageInput = document.getElementById("Details"); // Input for remarks
const saveEditBtn = document.getElementById("saveEditBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

document.addEventListener("click", function (e) {
    let editButton = e.target.closest(".btn-edit-status");
    if (editButton) {
        currentEditId = editButton.dataset.id;
        const currentStatus = editButton.dataset.status;
        const currentBranch = editButton.dataset.branch; // Get branch from dataset

        modalStatusDropdown.value = currentStatus;
        modal.style.display = "block";

        saveEditBtn.setAttribute("data-branch", currentBranch); // Store branch in button
    }
});

// Save the new status and message
if (saveEditBtn) {
    saveEditBtn.addEventListener("click", function () {
        if (currentEditId) {
            const newStatus = modalStatusDropdown.value;
            const newMessage = statusMessageInput.value.trim();
            const branch = saveEditBtn.getAttribute("data-branch"); // Retrieve branch

            if (!branch) {
                console.error("Branch name is missing!");
                alert("Error: Could not determine the branch.");
                return;
            }

            const updateRef = ref(database, `stationary/${branch}/${currentEditId}`);

            update(updateRef, {
                status: newStatus,
                Details: newMessage
            })
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



//branch droplist
document.addEventListener("DOMContentLoaded", function () {
    const branchSelect = document.getElementById("branchList");   
    fetch("resources/droplist.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load appraiser.json");
            }
            return response.json();
        })
        .then(data => {
            branchSelect.innerHTML = `<option value="" disabled selected>Select Branch</option>`;
            data.branches.forEach(branch => {
                const option = document.createElement("option");
                option.value = branch;
                option.textContent = branch;
                branchSelect.appendChild(option);            
            });
        })
        .catch(error => console.error("Error loading data:", error));
});