// Firebase imports and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const appSetting = {
    databaseURL: "https://nidhi-hr-7daed-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSetting);
const database = getDatabase(app);

export { database, ref, push, onValue, update  }; 
