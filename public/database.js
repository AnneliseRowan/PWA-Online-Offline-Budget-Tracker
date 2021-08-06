let db; 

const request = indexedDB.open("budgetDb", 1);

// Create schema
request.onupgradeneeded = ({ target }) => {
  const db = target.result; 

  // Creates an object store with a listID keypath that can be used to query on.
  const budgetStore = db.createdObjectStore("budgetDb", {keyPath: "listID"});
  // Creates a statusIndex that we can query on.
  budgetStore.createIndex("statusIndex", "status")
}; 

// Opens a transaction, accesses the toDoList objectStore and statusIndex.
request.onsuccess = event => {
  const db = event.target.result; 
  const transaction = db.transaction(["budgetDb"], "readwrite");
  const budgetStore = transaction.objectStore("budgetDb"); 
  const statusIndex = budgetStore.index("statusIndex"); 

  // Adds data to our objectStore??????

  // Return an item by keyPath
  const getRequest = budgetStore.get("1");
  getRequest.onsuccess = () => {
    console.log(getRequest.result); 
  }

  // Return an item by index
  const getRequestIndex = statusIndex.getAll("complete");
  getRequestIndex.onsuccess= () => {
    console.log(getRequestIndex.result);
  };

  // Opens a Cursor request and iterates over the documents -- Don't know if I need this
  // const getCursorRequest = toDoListStore.openCursor();
  //   getCursorRequest.onsuccess = e => {
  //     const cursor = e.target.result;
  //     if (cursor) {
  //       console.log(cursor.value);
  //       cursor.continue();
  //     } else {
  //       console.log("No documents left!");
  //     }
  //   };
}; 
