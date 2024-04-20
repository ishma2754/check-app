

import { applyFilter, deleteMedicines, editMedicines, addMedicines } from "./action.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';



//export const medicinesList = JSON.parse(localStorage.getItem('medicinesList')) || [];
const filterButton = document.querySelector('.js-filter-button');
const filterMedicineInputDisplay = document.querySelector('.js-filter-medicines');
const totalMedicineDisplay = document.querySelector('.js-total-medicines');
const earliestExpiryDisplay = document.querySelector('.js-earliest-expiry');
const medicinesInputDisplay = document.querySelector('.js-medicines-grid-display');
const notificationButton = document.querySelector('.js-notification');


const addButton = document.querySelector('.js-add-medicines-button');


const today = dayjs();
const todayDate = today.format('YYYY-MM-DD');
console.log(todayDate);


// Call the function to load data from storage
export const medicinesList = loadFromStorage();

function loadFromStorage() {
  return JSON.parse(localStorage.getItem('medicinesList')) || [];
}

renderMedicinesList();


notificationButton.addEventListener('click', () => {
   Notification.requestPermission().then(perm => {
    console.log("Notification permission:", perm); 
    if(perm === 'granted') {
      new Notification("example notification");
    }
   })
});







  /*
  const today = new Date();
  const todayDate = today.toISOString().split('T')[0];

  const medicinesWithTodayDueDate = medicinesList.filter(medicine => medicine.dueDate === todayDate);

  if (medicinesWithTodayDueDate.length > 0) {
    
    if (Notification.permission === "granted") {
      const notification = new Notification("Warning: One or more medicines have a due date of today!");
      console.log(notification);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          const notification = new Notification("Warning: One or more medicines have a due date of today!");
        }
      });
    }
  }
*/

  




filterButton.addEventListener('click', () => {
  applyFilter();
});



export function renderFilterList(filteredMedicines = medicinesList) {
  const filterListHTML = filteredMedicines.map((medicinesObject, index) => {
    const { name, dueDate, description, imageUrl, quantity } = medicinesObject;
    return `
      <div class="details">
      <div class="brand-name-display">${name}</div> 
      <div class="due-date-name-display">${dueDate}</div>
      <div class="description-display">${description}</div>
      <div class="image-container">${imageUrl ? `<img width="220" src="${imageUrl}" alt="medicine-Image">` : 'No Image'}</div>
      <div class="quantity-display">${quantity} quantity</div>
      </div>`;
  }).join('');

  filterMedicineInputDisplay.innerHTML = filterListHTML;
}



  function renderSummary(medicinesList) {
    
    const totalMedicines = medicinesList.length;
    totalMedicineDisplay.textContent = totalMedicines;
  
    const earliestMedicines = findEarliestDueMedicines(medicinesList);
    if (earliestMedicines) {
      earliestExpiryDisplay.innerHTML = `Earliest Expiry:   <span class="earliest-name">${earliestMedicines.name}</span>, Due on: <span class="earliest-date">${earliestMedicines.dueDate}</span>`;
     
    } else {
      earliestExpiryDisplay.innerHTML = `<span class="earliest-name">No medicines found.</span>`;
    }
  }
  
  function findEarliestDueMedicines(medicinesList) {
    if (medicinesList.length === 0) {
      return null;
    }
  
    return medicinesList.reduce((earliest, currentMedicines) => {
      const earliestDueDate = new Date(earliest.dueDate);
      const currentDueDate = new Date(currentMedicines.dueDate);
      return earliestDueDate < currentDueDate ? earliest : currentMedicines;
    });
  }
  
  renderSummary(medicinesList);

export function renderMedicinesList() {
  const medicinesListHTML = medicinesList.map((medicinesObject, index) => {
    const { name, dueDate, description, imageUrl, quantity  } = medicinesObject;
    return `
    <div class="details">
      <div class="brand-name-display">${name}</div> 
      <div class="due-date-name-display">${dueDate}</div>
      <div class="description-display">${description}</div>
      <div class="image-container">${imageUrl ? `<img src="${imageUrl}" alt="medicine-Image">` : 'No Image'}</div>
      <div class="quantity-display">${quantity} quantity</div>
      <button class="delete-medicines-button js-delete-medicines-button">Delete</button>
      <button class="edit-medicines-button js-edit-medicines-button">Edit</button>
    </div>
      `;
  }).join(''); 

  medicinesInputDisplay.innerHTML = medicinesListHTML;

  renderSummary(medicinesList);


  
  
  document.querySelectorAll('.js-delete-medicines-button').forEach((deleteButton, index) => {
   deleteButton.addEventListener('click', () => {
      deleteMedicines(index);
   });
  });

  document.querySelectorAll('.js-edit-medicines-button').forEach((editButton, index) => {
   editButton.addEventListener('click', () => {
      editMedicines(index);
   });
  });
};

addButton.addEventListener('click', () => {
    addMedicines();
 });


 export function saveToStorage (){
  localStorage.setItem('medicinesList', JSON.stringify(medicinesList));
 }
