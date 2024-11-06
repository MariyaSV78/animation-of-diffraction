let wavelengthSlider, slitWidthSlider, distanceSlider;
let waveOffset = 0; // Offset for wavefront animation
let waveSpeed = 1; // Speed at which the wavefronts move
let waveOffsetShift = 140; // Shift of wave front
let numWaves = 18; // Number of wavefronts to display

function setup() {
  console.log(width, height, PI)
  createCanvas(500, 600);
  background(225);
  wavelengthSlider = createSlider(400, 700, 500); // Wavelength in nm
  wavelengthSlider.position(20, 570);
  wavelengthSlider.style("accent-color", "#000"); // Set thumb color to black

  slitWidthSlider = createSlider(0.3, 5.0, 0.5, 0.1); // Slit width in microns
  slitWidthSlider.position(190, 570);
  slitWidthSlider.style("accent-color", "#000"); // Set thumb color to black
  
  distanceSlider = createSlider(0, 20.0, 0.5, 0.5); // Distance between the slits in microns
  distanceSlider.position(350, 570);
  distanceSlider.style("accent-color", "#000"); // Set thumb color to black
 
}

function draw() {
  background(255);

  // Draw border around the canvas
  stroke(0); // Set border color to black
  strokeWeight(4); // Set border thickness
  noFill(); // No fill for the rectangle
  rect(0, 0, width, height); // Draw the border around the canvas

  let wavelength = wavelengthSlider.value() * 1e-9; // Convert nm to meters
  let slitWidth = slitWidthSlider.value() * 1e-6; // Convert microns to meters
  let distance = distanceSlider.value() * 1e-6; // Convert microns to meters
  
  let slitPixelWidth = map(slitWidthSlider.value(), 0.5, 5.0, 10, 100); // Map slit width to pixel width
  let distancePixelWidth = map(distanceSlider.value(), 0, 10.0, 0, 200); // Map slit width to pixel width
  let color = wavelengthToColor(wavelengthSlider.value()); // Get color based on wavelength

  let D = 1.0; // Distance to screen in meters

  let scaleFactor = 500; // Scale factor for visualization

  push(); // Save the current drawing state

  // Draw the 2D diffraction pattern
  translate(width / 2, height / 2 + 190); // Move origin to the center of the canvas for diffraction pattern

  for (let i = -width / 2; i < width / 2; i++) {
    let x = i / scaleFactor; // Convert pixel position to meters
    let beta = (PI * slitWidth * x) / (wavelength * D);
    let intensity_dif = beta !== 0 ? pow(sin(beta) / beta, 2) : 1;
    let alpha = (PI * (distance + slitWidth) * x) / (wavelength * D);
    let intensity_interf = pow(cos(alpha), 2);
    
    let intensity = intensity_interf * intensity_dif
        
    stroke(color);
    line(i, 0, i, -intensity * 150); // Draw vertical lines for diffraction pattern

    // Fill intensity map for 2D pattern
    for (let j = -20; j < 20; j++) {
      let brightness = map(pow(intensity, 0.4), 0, 1, 0, 255);
      stroke(color.levels[0], color.levels[1], color.levels[2], brightness);
      point(i, j + 30); // Draw the 2D pattern above the plot
    }
  }

//     wavelengthSlider.style("accent-color", color); // Set thumb color to black
//     distanceSlider.style("accent-color", color); // Set thumb color to black
//     slitWidthSlider.style("accent-color", color); // Set thumb color to black

  
  pop(); // Restore the previous drawing state

  // Draw the incident plane wave
  drawPlaneWave();

  // Draw the animated diffraction pattern
  drawDiffractionPattern(slitPixelWidth, distancePixelWidth);

  // Draw the screen (écran)
  fill(180); // Gray color for the screen
  noStroke();
  rect(width / 2 - 248, 150, width - 2, 10); // Taller screen representation

  // Draw the slit
  fill(255); // Black color for the slit
  noStroke();
  rect(width / 2 - slitPixelWidth - distancePixelWidth/2, 150, slitPixelWidth, 10); // Slit representation in the center of the screen
  rect(width / 2 + distancePixelWidth/2, 150, slitPixelWidth, 10);

  // Labels for sliders
  fill(0);
  stroke(color);
  strokeWeight(1); // Set border thickness
  text("Wavelength (nm): " + wavelengthSlider.value(), 20, 560);
  noStroke();
  text("Slit Width (μm): " + slitWidthSlider.value(), 190, 560);
  noStroke();
  text("Distance (μm): " + distanceSlider.value(), 350, 560);

  // Update waveOffset for animation

  if (waveOffset < height / 20) {
    waveOffset += 2; // Adjust speed of the wavefront animation
    waveOffsetShift -= 1;
  } else {
    waveOffset = 0;
    waveOffsetShift = 140;
  }

  endShape();
}

// Function to draw the incident plane wave
function drawPlaneWave() {
  let numLines = 12; // Number of wavefront lines
  let lineSpacing = 12; // Spacing between wavefront lines
  let wavelength = wavelengthSlider.value(); // Get the current wavelength from the slider
  let yOffset;
  // Convert the wavelength to a color
  let color = wavelengthToColor(wavelength);

  stroke(color); // Gray color for wavefronts
  strokeWeight(3);

  // Draw wavefront lines moving towards the slit
  for (let i = 0; i < numLines; i++) {
    yOffset = waveOffset - i * lineSpacing + waveOffsetShift;

    // Draw the wavefront line moving towards the slit
    line(width / 2 - 240, yOffset, width / 2 + 240, yOffset); // Corrected end X position
  }
}

// Function to draw the diffracted waves after the slit
function drawDiffractionPattern(slitPixelWidth, distancePixelWidth) {
  let wavelength = wavelengthSlider.value(); // Get the current wavelength from the slider
  let color = wavelengthToColor(wavelength);
  let numWaves = 6; // Number of diffracted wavefronts
  let waveSpacing = 40; // Spacing between diffracted wavefronts

  stroke(color);
  strokeWeight(3);
  noFill();

  for (let i = 0; i < numWaves; i++) {
    let radius = waveOffset + i * waveSpacing;
    // arc(width / 2, 150, radius * 2, radius * 2, 0, PI); // Draw the diffracted wavefront as an arc
    
    arc(width / 2 - distancePixelWidth/2, 155, radius * 2, radius * 2, 0, PI); // Draw the diffracted wavefront as an arc
    arc(width / 2 + distancePixelWidth/2, 155, radius * 2, radius * 2, 0, PI); // Draw the diffracted wavefront as an arc
    
    arc(width / 2 - slitPixelWidth/2 - distancePixelWidth/2, 155, radius * 2, radius * 2, 0, PI); // Draw the diffracted wavefront as an arc
    arc(width / 2 + slitPixelWidth/2 + distancePixelWidth/2, 155, radius * 2, radius * 2, 0, PI); // Draw the diffracted wavefront as an arc
    
    arc(width / 2 - slitPixelWidth - distancePixelWidth/2, 155, radius * 2, radius * 2, 0, PI); // Draw the diffracted wavefront as an arc
    arc(width / 2 + slitPixelWidth + distancePixelWidth/2, 155, radius * 2, radius * 2, 0, PI); // Draw the diffracted wavefront as an arc

  }
}

function wavelengthToColor(wavelength) {
  let r, g, b;
  if (wavelength >= 400 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 400);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 700) {
    r = 1;
    g = 0;
    b = 0;
  } else {
    r = 0;
    g = 0;
    b = 0;
  }

  let factor;
  if (wavelength >= 399 && wavelength < 420) {
    factor = 0.3 + (0.7 * (wavelength - 400)) / (420 - 400);
  } else if (wavelength >= 420 && wavelength < 645) {
    factor = 1;
  } else if (wavelength >= 645 && wavelength <= 700) {
    factor = 0.3 + (0.7 * (700 - wavelength)) / (700 - 645);
  } else {
    factor = 0;
  }

  let rgb = [
    Math.round(r * factor * 255),
    Math.round(g * factor * 255),
    Math.round(b * factor * 255),
  ];
  return color(rgb[0], rgb[1], rgb[2]);
}

