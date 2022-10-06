// Access toggle switch HTML element
var themeSwitcher = document.querySelector("#theme-switcher");
var container = document.querySelector(".container");

// Set default mode to dark
var mode = "dark";

// Listen for a click event on toggle switch
themeSwitcher.addEventListener("click", function() {
  // If mode is dark, apply light background
  if (mode === "dark") {
    mode = "light";
    /* 
      If you set the class attribute directly it will replace all classes on an 
      element.  This is probably a bad idea as other classes may still be needed.
      It is recommended to add and remove the necessary classes using classList like lines 19 & 20.
      container.setAttribute("class", "light");
    */
    console.log(container.classList)
    container.classList.add('light')
    container.classList.remove('dark')
  }
  // If mode is light, apply dark background 
  else {
    mode = "dark";/* 
      If you set the class attribute directly it will replace all classes on an 
      element.  This is probably a bad idea as other classes may still be needed.
      It is recommended to add and remove the necessary classes using classList like lines 31 & 32.
      container.setAttribute("class", "dark");
    */
    container.classList.add('dark')
    container.classList.remove('light')
  }
});
