var shoppingFormEl = $("#shopping-form");
var shoppingListEl = $("#shopping-list");

// TODO: Create a function to handle the form submission event that captures the form's `<input>` value and prints it to the `shoppingListEl` as a `<li>`
function handleFormSubmit(event) {
  event.preventDefault();
  //   shoppingFormEl: input();
  console.log(shoppingFormEl.getText());
}

// TODO: Add an event listener to the `shoppingFormEl` to handle submission
shoppingFormEl.on("click", handleFormSubmit());
