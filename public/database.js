let db; 

const request = indexedDB.open("budgetDb", 1);

// Create schema
request.onupgradeneeded = ({ target }) => {
  const db = target.result; 

  // Creates an object store with a listID keypath that can be used to query on.
  db.createObjectStore("waiting", { keyPath: "listID", autoIncrement: true });
}; 

// Opens a transaction, accesses the toDoList objectStore and statusIndex.
request.onsuccess = ({ target }) => {
  db = target.result; 

  if (navigator.onLine) {
      checkRecord();
  }
};

request.onerror = ({ target }) => {
    console.log(`Uhhh-Ohhh ${target.errorCode}`)
}

const saveRecord = (input) => {
    console.log("saving record", input)
    const transaction = db.transaction(["waiting"], "readwrite"); 
    const store = transaction.objectStore("waiting");

    store.add(input); 
}

const checkRecord = () => {
    const transaction = db.transaction(["waiting"], "readwrite"); 
    const store = transaction.objectStore("waiting"); 
    const getAll = store.getAll(); 
    console.log("getAll", getAll)

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            console.log('getAll.result:', getAll.result)
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["waiting"], "readwrite"); 
                const store = transaction.objectStore("waiting"); 
                store.clear();
            })
            .catch((err) => console.log(err));
        }
    };
};

window.addEventListener("online", checkRecord); 
