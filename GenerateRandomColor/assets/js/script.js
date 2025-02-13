// Select elements only if they exist
const address = document.getElementById("address");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const website = document.getElementById("website");
const data = document.getElementById("box");

// Check if "Contact" related elements exist and add event listeners
if (address && phone && email && website && data) {
  // Display address on click
  address.addEventListener("click", () => {
    data.innerHTML =
      "<b>MIMIT Girls Hostel <br> Malout Institute of Management and Information Technology<br> Malout, Punjab-152107</b>";
  });

  // Display phone number on click
  phone.addEventListener("click", () => {
    data.innerHTML = "<b>Phone Number: +91 36272829292</b>";
  });

  // Display email on click
  email.addEventListener("click", () => {
    data.innerHTML = "<b>Gmail: whateverittakes.fan@gmail.com</b>";
  });

  // Display website link on click
  website.addEventListener("click", () => {
    data.innerHTML =
      "<b>Website Link: <a href='index.html' style='text-decoration:none;'> Visit Color Models </a> </b>";
  });
}

// Check if "Web Safe Color Generator" elements exist
const webbutton = document.getElementById("web-safe-color-generator-button");

if (webbutton) {
  webbutton.addEventListener("click", () => {
    const increments = [0, 51, 102, 153, 204, 255]; // Web-safe color increments
    const colors = [];

    // Generate all web-safe colors by combining different RGB values
    for (let r of increments) {
      for (let g of increments) {
        for (let b of increments) {
          colors.push(`rgb(${r}, ${g}, ${b})`);
        }
      }
    }

    // Select the button container
    let buttonContainer = document.querySelector(".trigger-button");
    
    let existingColorGrid = document.getElementById("display_web_safe_color");

    // If a color grid already exists, remove it
    if (existingColorGrid) {
      existingColorGrid.remove();
    }

    // Create a new container to display the color grid
    let colorGrid = document.createElement("div");
    colorGrid.setAttribute("id", "display_web_safe_color");
    colorGrid.style.display = "flex";
    colorGrid.style.flexWrap = "wrap";
    colorGrid.style.justifyContent = "center";
    colorGrid.style.margin = "20px auto";
    colorGrid.style.width = "90%"; // Takes 90% width
    colorGrid.style.boxSizing = "border-box";

    // Create color boxes for each web-safe color
    colors.forEach((color) => {
      const rgbMatch = color.match(/\d+/g);
      if (rgbMatch) {
        const [r, g, b] = rgbMatch.map(Number);
        const div = document.createElement("div");
        div.className = "box_display_web_safe_color";
        div.style.backgroundColor = color;
        div.style.width = "80px"; // Set a fixed width
        div.style.height = "80px"; // Set a fixed height
        div.style.margin = "5px"; // Spacing between boxes
        div.textContent = rgbToHex(r, g, b);
        div.style.color = "white";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "center";
        colorGrid.appendChild(div);
      }
    });

    // Append the new color grid below the button
    buttonContainer.insertAdjacentElement("afterend", colorGrid);
  });
}


// Function to convert RGB to HEX format
function rgbToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
  );
}

// Select CMY input elements
let select_cyan = document.getElementById("select_cyan_box2");
let select_magenta = document.getElementById("select_magenta_box2");
let select_yellow = document.getElementById("select_yellow_box2");

// Function to display selected CMY color in float and hex formats
function displayCMYColor() {
  let cyan_value = 255 - select_cyan.value;
  let magenta_value = 255 - select_magenta.value;
  let yellow_value = 255 - select_yellow.value;
  let hex_code = rgbToHex(cyan_value, magenta_value, yellow_value);

  // Update float values
  document.getElementById("cell1_cmy_display_color_box2").textContent = `(${(
    cyan_value / 255
  ).toFixed(2)}, ${(magenta_value / 255).toFixed(2)}, ${(
    yellow_value / 255
  ).toFixed(2)})`;

  // Update hex code
  document.getElementById("cell2_cmy_display_color_box2").textContent =
    hex_code;

  // Update color display box
  document.getElementById(
    "cell3_cmy_display_color_box2"
  ).style.backgroundColor = hex_code;
}

// Add event listeners for CMY selection changes
if (select_cyan && select_magenta && select_yellow) {
  select_cyan.addEventListener("change", displayCMYColor);
  select_magenta.addEventListener("change", displayCMYColor);
  select_yellow.addEventListener("change", displayCMYColor);
}

// Function to set values in dropdowns for RGB and CMY
function setValues() {
  for (let i = 0; i <= 255; i++) {
    let red_element = document.createElement("option");
    red_element.textContent = i;

    let green_element = document.createElement("option");
    green_element.textContent = i;

    let blue_element = document.createElement("option");
    blue_element.textContent = i;
    let cyan_element = document.createElement("option");
    cyan_element.textContent = i;

    let magenta_element = document.createElement("option");
    magenta_element.textContent = i;

    let yellow_element = document.createElement("option");
    yellow_element.textContent = i;

    if (select_red && select_green && select_blue) {
      select_red.appendChild(red_element);
      select_green.appendChild(green_element);
      select_blue.appendChild(blue_element);
    }

    if (select_cyan && select_magenta && select_yellow) {
      select_cyan.appendChild(cyan_element);
      select_magenta.appendChild(magenta_element);
      select_yellow.appendChild(yellow_element);
    }
  }
}

// Select RGB dropdowns and color generator button
let select_red = document.getElementById("select_red_box2");
let select_green = document.getElementById("select_green_box2");
let select_blue = document.getElementById("select_blue_box2");

let generate_random_color = document.getElementById("color-generator-button");

// Add event listeners for RGB selection changes
if (select_red && select_green && select_blue) {
  select_red.addEventListener("change", displayRGBColor);
  select_green.addEventListener("change", displayRGBColor);
  select_blue.addEventListener("change", displayRGBColor);
  generate_random_color.addEventListener("click", generateRandomColor);
}

// Function to display selected RGB color
function displayRGBColor() {
  let red_value = select_red.value;
  let green_value = select_green.value;
  let blue_value = select_blue.value;
  let hex_code = rgbToHex(red_value, green_value, blue_value);

  // Update float values
  document.getElementById("cell1_rgb_display").textContent = `(${(
    red_value / 255
  ).toFixed(2)}, ${(green_value / 255).toFixed(2)}, ${(
    blue_value / 255
  ).toFixed(2)})`;

  // Update hex code
  document.getElementById("cell2_rgb_display").textContent = hex_code;

  // Update color display box
  document.getElementById("cell3_rgb_display").style.backgroundColor = hex_code;
}

//Function to generate 10 random RGB colors
function generateRandomColor() {
  let main = document.querySelector("main");

  // Check if the color display already exists and remove it
  let existingContainer = document.getElementById("outer_display_color");
  if (existingContainer) {
    existingContainer.remove();
  }

  // Create a new container for displaying generated colors
  let main_new_element = document.createElement("div");
  main_new_element.setAttribute("id", "outer_display_color");

  let outer_main_new_element = document.createElement("div");
  outer_main_new_element.setAttribute("id", "display_color");

  // Add column headings for RGB float values, hex values, and color display
  let inner_main_new_element = document.createElement("div");
  inner_main_new_element.style.display = "flex";
  inner_main_new_element.style.marginLeft = "10%";
  inner_main_new_element.style.marginRight = "10%";
  inner_main_new_element.style.marginTop = "3%";
  inner_main_new_element.style.marginBottom = "2%";
  inner_main_new_element.style.justifyContent = "space-between";

  ["RGB Float Values", "RGB Hexadecimal Values", "Display"].forEach(
    (heading) => {
      let cell = document.createElement("div");
      cell.textContent = heading;
      cell.style.fontSize = "larger";
      cell.style.fontWeight = "bold";
      cell.setAttribute("id", "data_inner_display_color");
      inner_main_new_element.appendChild(cell);
    }
  );
  inner_main_new_element.setAttribute("id", "inner_display_color");
  outer_main_new_element.appendChild(inner_main_new_element);

  // Generate and display 10 random colors
  for (let i = 0; i < 10; i++) {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    let hex_code = rgbToHex(red, green, blue);

    let inner_new_element = document.createElement("div");
    inner_new_element.style.display = "flex";
    inner_new_element.style.marginLeft = "8%";
    inner_new_element.style.marginRight = "8%";
    inner_new_element.style.justifyContent = "space-between";

    // Display RGB float values
    let cell1 = document.createElement("div");
    cell1.textContent = `(${(red / 255).toFixed(2)}, ${(green / 255).toFixed(
      2
    )}, ${(blue / 255).toFixed(2)})`;
    cell1.setAttribute("id", "data_inner_display_color");
    inner_new_element.appendChild(cell1);

    // Display HEX code
    let cell2 = document.createElement("div");
    cell2.textContent = hex_code;
    cell2.setAttribute("id", "data_inner_display_color");
    inner_new_element.appendChild(cell2);

    // Create and set color display box
    let cell3 = document.createElement("div");
    cell3.style.width = "12%";
    cell3.style.height = "30px";
    cell3.style.backgroundColor = hex_code;
    cell3.setAttribute("id", "data_inner_display_color");
    inner_new_element.appendChild(cell3);

    inner_new_element.setAttribute("id", "inner_display_color");
    outer_main_new_element.appendChild(inner_new_element);
  }

  // Append the generated color display to the main container
  main_new_element.appendChild(outer_main_new_element);
  main.appendChild(main_new_element);
}

// Set initial values for dropdowns
setValues();

// Function to apply colors to elements based on their class names
function rgb() {
  let red_color = document.querySelectorAll(".red_color");
  red_color.forEach((element) => {
    element.style.color = "red";
  });

  let green_color = document.querySelectorAll(".green_color");
  green_color.forEach((element) => {
    element.style.color = "green";
  });

  let blue_color = document.querySelectorAll(".blue_color");
  blue_color.forEach((element) => {
    element.style.color = "blue";
  });
}

// Apply RGB colors to elements with respective class names
rgb();

// Function to apply CMY colors to elements based on their class names
function cmy() {
  let cyan_color = document.querySelectorAll(".cyan_color");
  cyan_color.forEach((element) => {
    element.style.color = "cyan";
  });

  let magenta_color = document.querySelectorAll(".magenta_color");
  magenta_color.forEach((element) => {
    element.style.color = "magenta";
  });

  let yellow_color = document.querySelectorAll(".yellow_color");
  yellow_color.forEach((element) => {
    element.style.color = "yellow";
  });
}

// Apply CMY colors to elements with respective class names
cmy();
