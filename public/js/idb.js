//create variable to hold db connection 
let db;

//establish a connnection to indexDB database called "budget_app" and set it to version 1
const request = indexedDB.open('budgert_app')