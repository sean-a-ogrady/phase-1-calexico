// Select all of the elements we want to edit and assign names to each
const menuItems = document.querySelector("#menu-items");
const dishImage = document.querySelector("#dish-image");
const dishName = document.querySelector("#dish-name");
const dishDescription = document.querySelector("#dish-description");
const dishPrice = document.querySelector("#dish-price");
const cartForm = document.querySelector("#cart-form");
const numberInCart = document.querySelector("#number-in-cart");
const cartAmount = document.querySelector("#cart-amount");
const totalCostContainer = document.createElement("h3");
const totalCost = document.createElement("span");

// Fetch the menu data
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
        newSpan.id = `item${menuItem.id}`;
        // Create custom number-in-cart property on newSpan
        newSpan["data-count"] = 0;

        // CHALLENGE 3
        // Add click event listener for each span
        newSpan.addEventListener('click', () => {
            // Assign the image source to the item clicked on
            dishImage.src = menuItem.image;
            // Display the name of the menu item clicked
            dishName.textContent = menuItem.name;
            // Display the description of the menu item clicked
            dishDescription.textContent = menuItem.description;
            // Display the price of the menu item clicked
            dishPrice.textContent = `$${menuItem.price}`;
            // Set the class value of the name to equal the id of the new span
            // This is done in order to keep track of which item is currently selected
            dishName.class = newSpan.id;
            // Change the value of the number in cart to the amount of the currently selected item
            numberInCart.textContent = newSpan["data-count"];
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
    dishName.class = `item${menu[0].id}`;
}

// CHALLENGE 4
// Create an event listener to prevent non-integer values from being input into the text input
cartAmount.addEventListener('input', (event) => {
    // Remove any non-integer characters
    /* NOTES ON THE SYNTAX:
        - The /s are the delimiters for the regular expression literal
        - This is much like how "s are the delimeters for the string literal
        - The ^ means start of the string
        - [^0-9-] means match anything that is not a digit [range 0 to 9] or a hyphen
        - g is a flag that indicates global, meaning find all instances of the above
        - essentially, this is querying for elements in a string, then replacing those with ''

        - (0)+ matches one or more zeroes

    */
    cartAmount.value = cartAmount.value.replace(/[^0-9-]/g, '');
    // Remove multiple leading zeroes
    cartAmount.value = cartAmount.value.replace(/^(0)+/, '0');
    // Remove multiple leading negative signs
    cartAmount.value = cartAmount.value.replace(/^(-)+/, '-');
    // Remove negative signs that are not at the beginning
    if (cartAmount.value.charAt(0) === '-') {
        cartAmount.value = '-' + cartAmount.value.slice(1).replace(/-/g, '');
    } else {
        cartAmount.value = cartAmount.value.replace(/-/g, '');
    }

});
// Create an event listener for when the form is submitted
cartForm.addEventListener('submit', (event) => {
    // Prevent default form submission event behavior
    event.preventDefault();
    // Parse the integer value of the value the user defined in the input text field
    const numToAdd = parseInt(cartAmount.value);
    // This part is a little complicated
    /* EXPLANATION:
        - This line of code below assigns the span element from the DOM with the id of the currently
        displayed food item to the variable `selectedItem`
        - Earlier, I assigned the class name of the currently selected dish to the id of the span,
        which allows the span element to be selected by interpolating the class name with the
        syntax for selecting an element by id, `#`
        - Since this is now selected, we can access the attached custom property given to the span,
        "data-count", where the value of such should be how many of each of those items is in the
        cart
    */
    const selectedItem = document.querySelector(`#${dishName.class}`);
    const totalBefore = parseInt(selectedItem["data-count"]);
    // Add the number that the user input to the total in the cart
    const newTotal = numToAdd + totalBefore;
    // Assign the new total to the custom "data-count" property on the span. If less than 0, set 0.
    selectedItem["data-count"] = newTotal >= 0 ? newTotal : 0;
    // Display the new amount of the item in the cart
    numberInCart.textContent = selectedItem["data-count"];
    
    if (numToAdd >= 0) {
        totalCost.textContent = parseInt(totalCost.textContent) + parseInt(dishPrice.textContent.slice(1)) * numToAdd;
    } else {
        totalCost.textContent = parseInt(totalCost.textContent) + parseInt(dishPrice.textContent.slice(1)) * (parseInt(selectedItem["data-count"]) - totalBefore);
    }
})

// BONUS CHALLENGE 1: The value of the cart should persist when clicking through different menu items
// Already completed!

// BONUS CHALLENGE 2: Calculate the total cost of what is currently in the cart and display it on page
totalCostContainer.textContent = `Total Cost: $`;
totalCost.textContent = 0;
totalCost.id = "total-cost";
totalCostContainer.appendChild(totalCost);
document.querySelector("#dish").append(totalCostContainer);

// BONUS CHALLENGE 3: Use PATCH requests to maintain the value of the cart in-between refreshes