var canvas,
    bgColor,
    radialArcs = [],
    fft,
    soundFile,
    soundSpectrum,
    amp,
    fps = 60,
    volHistory = [],
    maxvolHistory;
//var capturer = new CCapture({format: 'png', frameRate: fps});
// function preload(){
//   canvas = createCanvas(windowWidth-100,windowHeight-100); // create canvas
//   canvas.drop(gotFile); // listen for file drop onto canvas
//   text('Drop MP3 here, then click canvas to play when uploaded.', width / 2, height / 2);
// }
function setup() {
  colorMode(HSB,360,100,100); // set colour mode of sketch to HSB (360 degress, 100%, 100%)
  frameRate(fps); // set framerate
  canvas = createCanvas(windowWidth,windowHeight); // create canvas
  canvas.drop(gotFile); // listen for file drop onto canvas
  bgColor = color(330,0,5); // set BG colour in HSB 
  background(bgColor); // draw bg
  //initRadialArcs(); // setup radial arc objects
  textAlign(CENTER); // welcome text
  fill(0,0,90);
  maxvolHistory=0;
  text('Drop MP3 here, then click canvas to play when uploaded.', width / 2, height / 2);
  amp = new p5.Amplitude();
}

function gotFile(file) {
  if((!soundFile) && (file.type == "audio")) { // if don't already have sound && is audio
		background(bgColor);
    soundFile = new p5.SoundFile(file.data); // create soundFile from dropped audio file
    initSound(); // init sound & FFT 
	//canvas.mouseClicked(startRecording); // listen for mouse click to start recording frames
	canvas.mouseClicked(togglePlay); // listen for mouse click to play sound
  }
}

function draw() {
  if(soundFile) {
    colorMode(HSB,360,100,100);
    var vol = amp.getLevel();
    volHistory.push(vol);
    
    noFill();
    // dataHue = map(vol,0,1, 0, 360); // value moves across inout hue rangedata
    // dataSaturation = map(vol,0,1,100,80); // higher value = lower saturation (more white, when combined with brightness)
    // dataBrightness = map(vol,0,1,10,100); // higher value = higher brightness (more white, when combined with saturation)
    // stroke( dataHue, dataSaturation, dataBrightness);
    beginShape();
    translate(width/2,height/2);
    for(var i = 0; i < 360; i++)
    {
      var r = map(volHistory[i],0,1,10,height/2);
      var x = r * Math.cos(i);
      var y = r * Math.sin(i);
      vertex(x,y); 
      dataHue = map(vol,0,1, 0, 360); // value moves across inout hue rangedata
      dataSaturation = map(vol,0,1,100,80); // higher value = lower saturation (more white, when combined with brightness)
      dataBrightness = map(vol,0,1,10,100); // higher value = higher brightness (more white, when combined with saturation)
      stroke( dataHue, dataSaturation, dataBrightness);
    }
    endShape();//pop();
    if(volHistory.length > 360)
    {
      volHistory.splice(0,1);
    }
    
  }
}
// ------------------------ color stuff ----------------------------------
// getDataHSBColor(d) {
//   this.dataHue = map(d,0,1,this.minHue,this.maxHue); // value moves across inout hue range
//   this.dataSaturation = map(d,0,1,100,80); // higher value = lower saturation (more white, when combined with brightness)
//   this.dataBrightness = map(d,0,1,10,100); // higher value = higher brightness (more white, when combined with saturation)
//   return color(this.dataHue,this.dataSaturation,this.dataBrightness);
// }
// -------------------------  Sound Stuff -------------------------------
function getNewSoundDataValue(freqType) {
  return map(fft.getEnergy(freqType),0,255,0,1); // get energy from frequency, scaled from 0 to 1
}

function initSound() {
  fft = new p5.FFT(0.4,1024); // (smoothing, bins)
  soundFile.amp(0.7); 
}

function togglePlay() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
  } else {
	soundFile.loop();
  }
}

function analyseSound() {
  soundSpectrum = fft.analyze(); // spectrum is array of amplitudes of each frequency
}


