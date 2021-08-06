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
      checkInput();
  }
};

request.onerror = ({ target }) => {
    console.log(`Uhhh-Ohhh ${target}`)
}

const saveInput = (input) => {
    const transaction = db.transaction(["waiting"], "readwrite"); 
    const store = transaction.objectStore("pending");

    store.addEventListener(input); 
}

const checkInput = () => {
    const transaction = db.transaction(["waiting"], "readwrite"); 
    const store = transaction.objectStore("waiting"); 
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
};

window.addEventListener("online", checkInput); 
