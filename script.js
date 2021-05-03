// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const c = document.getElementById('user-image');
const ctx = c.getContext('2d');

const clear = document.querySelector("[type='reset']");
const read = document.querySelector("[type='button']");
const submit = document.querySelector("[type='submit']");
const voices = document.getElementById("voice-selection");
const submitBtn = document.getElementById('generate-meme');

const topText = document.getElementById('text-top');
const bottomText = document.getElementById('text-bottom');

const slider = document.querySelector("[type='range']");
const group = document.getElementById("volume-group");
const pic = document.querySelector('#volume-group img');

var imgInput = document.getElementById('image-input');
imgInput.addEventListener('input', () => {
  img.src = URL.createObjectURL(imgInput.files[0]);
  let fileIndex = objectURL.lastIndexOf("/") + 1;
  let fileName = objectURL.substr(fileIndex);
  img.alt = fileName;
});
// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, c.width, c.height);
  // - Clear the form when a new image is selected
  document.getElementById('generate-meme').reset();
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
  var d = getDimmensions(c.width, c.height, img.width, img.height);
  ctx.drawImage(img, d.startX, d.startY, d.width, d.height);
});

submitBtn.addEventListener('submit', (event) => {
  event.preventDefault();

  ctx.font = "30px Arial";
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center'; 

  ctx.fillText(topText.value, c.width/2, 30);
  ctx.fillText(bottomText.value, c.width/2, c.height - 5);

  submit.disabled = true;
  clear.disabled = false;
  read.disabled = false;
  voices.disabled = false;

  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }
});

clear.addEventListener('click', event => {
  event.preventDefault();

  ctx.clearRect(0, 0, c.width, c.height);

  submit.disabled = false;
  clear.disabled = true;
  read.disabled = true;
  voices.disabled = true;
  
});

read.addEventListener('click', event => {
  event.preventDefault();

  let synth = window.speechSynthesis;

  let topUtterance = new SpeechSynthesisUtterance(topText.value);
  let bottomUtterance = new SpeechSynthesisUtterance(bottomText.value);
  let availableVoices = synth.getVoices();

  let selectedOption = voices.selectedOptions[0].getAttribute('data-name');

  for(let i = 0; i < availableVoices.length ; i++) {
    if(availableVoices[i].name === selectedOption) {
      topUtterance.voice = availableVoices[i];
      bottomUtterance.voice = availableVoices[i];
    }
  }

  topUtterance.volume = (slider.value/100);
  bottomUtterance.volume = (slider.value/100);

  window.speechSynthesis.cancel();
  
  synth.speak(topUtterance);
  synth.speak(bottomUtterance);
});

function populateVoices(){
  
  let synth = window.speechSynthesis;
  let availableVoices = synth.getVoices();

  //fill available voices
  for(let i = 0; i < availableVoices.length ; i++) {
    let option = document.createElement('option'); 
    option.textContent = availableVoices[i].name + ' (' + availableVoices[i].lang + ')';

    if(availableVoices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', availableVoices[i].lang);
    option.setAttribute('data-name', availableVoices[i].name);
    voices.appendChild(option);
  }
}

group.addEventListener('input', event => {
  event.preventDefault();
  
  if((slider.value/100) >= .67){
    pic.src = 'icons/volume-level-3.svg';
    pic.alt = 'Volume Level 3';
  }
  else if((slider.value/100) >= .34){
    pic.src = 'icons/volume-level-2.svg';
    pic.alt = 'Volume Level 2';
  }
  else if((slider.value/100) >= .01){
    pic.src = 'icons/volume-level-1.svg'; 
    pic.alt = 'Volume Level 1';
  }
  else{
    pic.src = 'icons/volume-level-0.svg';
    pic.alt = 'Volume Level 0';
  }
  
  });

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
