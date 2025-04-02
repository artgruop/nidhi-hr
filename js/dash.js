//db
import { database, ref, push, onValue } from "./firebaseConfig.js";



const branchName = localStorage.getItem('userName') || "Unknown Branch";  // Retrieve branch name
const collectionListDB = ref(database, `stationary/${branchName}`);

const orderTableBody = document.getElementById("orderTableBody");
const searchInput = document.getElementById("hiddenBranchName");
//  format date 
function formatDate(dateInput) {
    if (!dateInput) return "Unknown Date"; 

    let date;

    // ✅ Firebase timestamp (milliseconds)
    if (!isNaN(dateInput) && typeof dateInput === "number") {
        date = new Date(dateInput);
    } 
    // ✅ ISO date string (2024-02-27T12:00:00Z)
    else if (typeof dateInput === "string" && !isNaN(Date.parse(dateInput))) {
        date = new Date(dateInput);
    } 
    // ❌ Invalid case
    else {
        return "Invalid Date";
    }

    if (isNaN(date.getTime())) return "Invalid Date"; // Final check

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based months
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// ✅ Fetch and display last 5 orders from Firebase
onValue(collectionListDB, function (snapshot) {
    console.log("Firebase Data:", snapshot.val()); // Debugging: Check retrieved data

    if (snapshot.exists()) {
        let ordersArray = Object.entries(snapshot.val());

        // ✅ Sort orders by timestamp (latest first)
        ordersArray.sort((a, b) => {
            const timestampA = a[1].timestamp ? new Date(a[1].timestamp).getTime() : 0;
            const timestampB = b[1].timestamp ? new Date(b[1].timestamp).getTime() : 0;
            return timestampB - timestampA;
        });

        // ✅ Get the last 5 orders
        const lastFiveOrders = ordersArray.slice(0, 10);

        // ✅ Clear table before inserting new data
        orderTableBody.innerHTML = "";

        if (lastFiveOrders.length === 0) {
            orderTableBody.innerHTML = "<tr><td colspan='3'>No recent orders</td></tr>";
            return;
        }

        // ✅ Populate table with the last 5 orders
        lastFiveOrders.forEach(([orderId, orderData]) => {
            const formattedDate = orderData.timestamp 
                ? formatDate(orderData.timestamp) 
                : "Unknown Date";

            const status = orderData.status 
                ? orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1).toLowerCase() 
                : "Pending";

            orderTableBody.innerHTML += `
                <tr>
                    <td>${orderData.hiddenBranchName || "Unknown Branch"}</td>
                    <td>${formattedDate}</td>
                    <td><a class="btn1">${status}</a></td>
                </tr>
            `;
        });

      
    } else {
        orderTableBody.innerHTML = "<tr><td colspan='3'>No recent orders</td></tr>";
    }
});
