// Select elements only if they exist
const address = document.getElementById("address");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const website = document.getElementById("website");
const data = document.getElementById("box");

// Check if "Contact" related elements exist
if (address && phone && email && website && data) {
  address.addEventListener("click", () => {
    data.innerHTML =
      "<b>MIMIT Girls Hostel <br> Malout Institute of Management and Information Technology<br> Malout, Punjab-152107</b>";
  });

  phone.addEventListener("click", () => {
    data.innerHTML = "<b>Phone Number: +91 36272829292</b>";
  });

  email.addEventListener("click", () => {
    data.innerHTML = "<b>Gmail: whateverittakes.fan@gmail.com</b>";
  });

  website.addEventListener("click", () => {
    data.innerHTML =
      "<b>Website Link: <a href='index.html' style='text-decoration:none;'> Visit Color Models </a> </b>";
  });
}

// Check if "Web Safe Color Generator" elements exist
const webbutton = document.getElementById("web-safe-color-generator-button");
if (webbutton) {
  webbutton.addEventListener("click", () => {
    const increments = [0, 51, 102, 153, 204, 255];
    const colors = [];

    // Generate all web-safe colors
    for (let r of increments) {
      for (let g of increments) {
        for (let b of increments) {
          colors.push(`rgb(${r}, ${g}, ${b})`);
        }
      }
    }

    let display = document.querySelector(".trigger-button");
    if (display) {
      display.style.flexDirection = "row-reverse";

      let colorGrid = document.createElement("div");
      colorGrid.setAttribute("id", "display_web_safe_color");
      colorGrid.style.display = "flex";
      colorGrid.style.flexWrap = "wrap";
      colorGrid.style.margin="3%";

      // Create color boxes
      colors.forEach((color) => {
        const rgbMatch = color.match(/\d+/g);
        if (rgbMatch) {
          const [r, g, b] = rgbMatch.map(Number);
          const div = document.createElement("div");
          div.className = "box_display_web_safe_color";
          div.style.backgroundColor = color;
          div.style.width = "20%";
          div.textContent = rgbToHex(r, g, b);
          div.style.color = "rgb(216, 197, 197)";
          colorGrid.appendChild(div);
        }
      });

      display.appendChild(colorGrid);
    }
  });
}

// Function to convert RGB to HEX
function rgbToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
  );
}

let select_cyan = document.getElementById("select_cyan_box2");
let select_magenta = document.getElementById(
    "select_magenta_box2"
);
let select_yellow = document.getElementById("select_yellow_box2");



/**
 * Display the selected CMY color in float and hex formats
 */
function displayCMYColor() {
    let cyan_value = 255 - select_cyan.value;
    let magenta_value = 255 - select_magenta.value;
    let yellow_value = 255 - select_yellow.value;
    let hex_code = rgbToHex(cyan_value, magenta_value, yellow_value);

    // Update float values
    document.getElementById("cell1_cmy_display_color_box2").textContent = 
        `(${(cyan_value / 255).toFixed(2)}, ${(magenta_value / 255).toFixed(2)}, ${(yellow_value / 255).toFixed(2)})`;

    // Update hex code
    document.getElementById("cell2_cmy_display_color_box2").textContent = hex_code;

    // Update color display box
    document.getElementById("cell3_cmy_display_color_box2").style.backgroundColor=hex_code;
}

// Event listeners for CMY color selection
if (select_cyan && select_magenta && select_yellow) {
    select_cyan.addEventListener("change", displayCMYColor);
    select_magenta.addEventListener("change", displayCMYColor);
    select_yellow.addEventListener("change", displayCMYColor);
}
function setValues() {
    for (let i = 0; i <= 255; i++) {

        let cyan_element = document.createElement("option");
        cyan_element.textContent = i;

        let magenta_element = document.createElement("option");
        magenta_element.textContent = i;

        let yellow_element = document.createElement("option");
        yellow_element.textContent = i;


        if (select_cyan && select_magenta && select_yellow) {
            select_cyan.appendChild(cyan_element);
            select_magenta.appendChild(magenta_element);
            select_yellow.appendChild(yellow_element);
        }
    }
}
setValues();

