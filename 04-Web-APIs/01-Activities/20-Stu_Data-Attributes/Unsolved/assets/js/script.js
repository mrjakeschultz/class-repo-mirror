var container = document.querySelector(".container");

container.addEventListener("click", function(event) {
  var element = event.target;
  // console.log(element);
  if (element.matches(".box")) {
    var state = element.getAttribute("data-state");
    console.log(state);
    if (state === "hidden") {
      element.dataset.state = "visible";
      element.textContent = element.dataset.number;
    } else {
      element.textContent = "";
      element.setAttribute("data-state", "hidden")
    }
  }

  // TODO: Complete function
});
