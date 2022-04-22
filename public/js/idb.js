//create variable to hold db connection 
let db;

//establish a connnection to indexDB database called "budget_tracker" and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_track', { autoIncrement: true });
};

/// upon a successful 
request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        uploadDb();
    }
};

request.onerror = function (event) {
    // log error here
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new bugetDBand there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_track'], 'readwrite');

    // access the object store for 
    const budgetObjectStore = transaction.objectStore('new_track');

    // add record to store
    budgetObjectStore.add(record);
}

function uploadDb() {
    const transaction = db.transaction(["new_track"], "readwrite");
    const budgetObjectStore = transaction.objectStore("new_track");
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function () {
        console.log(getAll.result)
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(() => {

                    const transaction = db.transaction(["new_track"], "readwrite");
                    const budgetObjectStore = transaction.objectStore("new_track");
                    budgetObjectStore.clear();
                });
        }
    };
}
// listen for app coming back online
window.addEventListener("online", checkDatabase);