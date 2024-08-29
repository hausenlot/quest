// app/javascript/controllers/trunc_test_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  
  truncate() {
    const dbName = 'myDatabase';
    const objectStoreName = 'myObjectStore';

    const request = indexedDB.open(dbName);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(objectStoreName, 'readwrite');
      const objectStore = transaction.objectStore(objectStoreName);

      const clearRequest = objectStore.clear();
      
      clearRequest.onsuccess = () => {
        console.log('Object store cleared successfully');
        alert('Database truncated successfully');
        location.reload();
      };

      clearRequest.onerror = (event) => {
        console.error('Error clearing object store:', event.target.error);
        alert('Error truncating database');
        location.reload();
      };
    };

    request.onerror = (event) => {
      console.error('Error opening database:', event.target.error);
      alert('Error opening database');
    };
  }
}
