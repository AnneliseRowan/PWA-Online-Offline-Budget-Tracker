let db; 

const request = indexedDB.open("budgetDb", 1);

// Create schema
request.onupgradeneeded = ({ target }) => {
  const db = target.result; 

  // Creates an object store with a listID keypath that can be used to query on.
  db.createdObjectStore("waiting", { keyPath: "listID", autoIncrement: true });
}; 

// Opens a transaction, accesses the toDoList objectStore and statusIndex.
request.onsuccess = ({ target }) => {
  const db = target.result; 

  if (navigator.onLine) {
      checkDatabase();
  }
};

request.onerror = ({ target }) => {
    console.log(`Uhhh-Ohhh ${target}`)
}

const saveInput = (input) => {

}

const checkInput = (input) => {

}

getAll.onsuccess = () => {
    const transaction = db.transaction(["waiting"], "readwrite"); 
    const store = transaction.objectStore("pending"); 
    const getAll = store.getAll(); 

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "appication/json",
                },
            })
            .then(response => response.json())
            .then(() => {
                transaction; 
                store; 
                store.clear(); 
            });
        }
    };
}

window.addEventListener("online", checkDatabase); 
