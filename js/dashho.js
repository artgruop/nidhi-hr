//db
import { database, ref, push, onValue } from "./firebaseConfig.js";


const collectionListDB = ref(database, "stationary"); // Fetch data from "stationary" collection

const orderTableBody = document.getElementById("orderTableBody");

// Function to format date as DD/MM/YYYY
function formatDate(dateInput) {
    if (!dateInput) return "Unknown Date";

    let date = !isNaN(dateInput) && typeof dateInput === "number"
        ? new Date(dateInput)
        : (typeof dateInput === "string" && !isNaN(Date.parse(dateInput))
            ? new Date(dateInput)
            : null);

    if (!date || isNaN(date.getTime())) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// Function to fetch last 5 orders
function fetchOrders() {
    onValue(collectionListDB, function (snapshot) {
        if (snapshot.exists()) {
            let ordersArray = [];

            snapshot.forEach(branchSnapshot => {
                const branchOrders = Object.entries(branchSnapshot.val()).map(([id, data]) => ({
                    id,
                    branch: data.hiddenBranchName || "Unknown Branch",
                    timestamp: data.timestamp ? new Date(data.timestamp).getTime() : 0,
                    formattedDate: data.timestamp ? formatDate(data.timestamp) : "Unknown Date",
                    status: data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase() : "Pending"
                }));

                ordersArray = ordersArray.concat(branchOrders);
            });

            // Sort orders by timestamp (latest first) & get last 5
            ordersArray = ordersArray.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

            // Clear table before inserting new data
            orderTableBody.innerHTML = ordersArray.length === 0
                ? "<tr><td colspan='3'>No recent orders</td></tr>"
                : ordersArray.map(order => `
                    <tr>
                        <td>${order.branch}</td>
                        <td>${order.formattedDate}</td>
                        <td><a class="btn1">${order.status}</a></td>
                    </tr>
                `).join("");

        } else {
            orderTableBody.innerHTML = "<tr><td colspan='3'>No recent orders</td></tr>";
        }
    });
}

// Fetch data when page loads
fetchOrders();
