// Div containing the navigation links
const navLinks = document.querySelector(".nav-links");

// Div that appers when toggle button is clicked for smaller devices
const container = document.querySelector(".nav-2");

//Function to hide the div that appears when toggle button is clicked when the device width becomes larger
function handleResize() {
    if (window.innerWidth > 1030) {
        container.style.display = 'none';
    }
}

handleResize();

// Function that helps to use the toggle button to hide and display the navigation links on smaller devices
const toggleMenu = () => {
  navLinks.display = "none";
  if (window.innerWidth <= 1030) {
    container.style.display = (container.style.display === 'flex') ? 'none' : 'flex';
}
};

// Listening for window resizing
window.addEventListener('resize', handleResize);
