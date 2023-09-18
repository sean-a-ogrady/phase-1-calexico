// Select all of the elements we want to edit and assign names to each
const menuItems = document.querySelector("#menu-items");
const dishImage = document.querySelector("#dish-image");
const dishName = document.querySelector("#dish-name");
const dishDescription = document.querySelector("#dish-description");
const dishPrice = document.querySelector("#dish-price");

// Write your code here...
fetch("http://localhost:3000/menu")
.then(response => response.json())
.then(menu => addSpans(menu));

// CHALLENGE 1
function addSpans(menu){
    // For each object (here named `menuItem`) in `menu`:
    menu.forEach(menuItem => {
        // Create a new span element and assign it to the name `newSpan`
        const newSpan = document.createElement("span");
        // Change the text of `newSpan` to be the name property of the current `menuItem` object
        newSpan.textContent = menuItem.name;
        // Assign the id of the span to match the JSON ids
        newSpan.id = menuItem.id;
        newSpan.addEventListener('click', () => {
            dishImage.src = menuItem.image;
            dishName.textContent = menuItem.name;
            dishDescription.textContent = menuItem.description;
            dishPrice.textContent = `$${menuItem.price}`;
        });
        // Add the new span to the DOM as a child of `menuItems`
        menuItems.appendChild(newSpan);
    });
    // Call the next function `setDefaultMenuItem` and pass the menu data to it
    setDefaultMenuItem(menu);
}

// CHALLENGE 2

function setDefaultMenuItem(menu){
    // Assign the data from the first menu item as the default to display
    dishImage.src = menu[0].image;
    dishName.textContent = menu[0].name;
    dishDescription.textContent = menu[0].description;
    dishPrice.textContent = `$${menu[0].price}`;
    addUpdateOnClick(menu);
}

// CHALLENGE 3
function addUpdateOnClick(menu){

}