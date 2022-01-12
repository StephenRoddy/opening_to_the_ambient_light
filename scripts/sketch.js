// original sources:
//1. https://p5js.org/examples/interaction-wavemaker.html
//2. https://editor.p5js.org/ag3439/sketches/UNWyGa3PC
//3. https://editor.p5js.org/crecord/sketches/ByWfYwbjb

let cnv;

let t = 0; // time variable

let xPos = 1; // starting point for X
let xPos_diff =.1; // increment degree for x. Moderates overall movement shape. Higher number, faster speed.

//sine stuff
let yPos;
let sin_theta = 0;      // Start angle at 0
let cos_theta = 5;      // Start angle at 0
let amp_sin = 0; // Height of wave in cartesian cordinates. Angular velocity in polar
let amp_cos = 0;
let particle_size;
let lpX;
let lpY;
let lpX2;
let lpY2;
let lpX3;
let lpY3;
let cnt=0;
let bass, lowMid, mid, highMid, treble;

function preload() {
audio = loadSound("./audio/Opening to the ambient light.mp3");
}

function setup() {
  cnv = createCanvas(1000, 1000, WEBGL);

  noStroke();
  fill(255, 255, 255);


  fft = new p5.FFT();
  fft.setInput(audio);
  cnv.mouseClicked(togglePlay);

  lpX3 = random(-width/2,width/2);
  lpY3 = random(-height/2,height/2);

  lpX2 = random(-width/2,width/2);
  lpY2 = random(-height/2,height/2);


  // crawlers start in different quadrants
  lpX = random(width/2);
  lpY = random(-height/2);

  lpX4 = random(-width/2);
  lpY4 = random(height/2);

}


function draw() {
  translate(-width/2,-height/2,0); // Translate for the WEBGL coordinat system. Moving elements to top left nad corner of canvas.
  background(0);
  blendMode(REPLACE);
  fft.setInput(audio);
  let waveform = fft.waveform(); // amplitudes along time domain
  let spectrum = fft.analyze();

  bass = fft.getEnergy("bass"); // each an 8bit integer 0-255
  lowMid = fft.getEnergy("lowMid");
  mid = fft.getEnergy("mid");
  highMid = fft.getEnergy("highMid");
  treble = fft.getEnergy("treble");

  /* Mappings*/
  amp_cos = map(bass+lowMid,0,510,0,30);
  amp_sin = map(mid+treble+highMid,0,765,0,30);

  cos_pos  = amp_cos;
  sin_pos = amp_sin;

  ambientMaterial((lowMid+mid)/2);  // controling the materials and shininess from the data
  shininess((treble+highMid)/2);

  particle_size = map(bass+lowMid,0,510,0,7); //original was a size of 0 to 7
  fill((treble+highMid)/2,(lowMid+mid)/2,bass); // color map

 // ambientLight(mid);
  // make an x and y grid of ellipses
  for (let x = 0; x <= width; x = x + 20) {


    /* Call Lights functions */
    light_1(bass);
    light_2((treble+highMid+mid)/3);
    light_3((lowMid+mid+highMid)/3);
    light_4((bass+lowMid)/2);



        xPos = width/2 + cos(cos_theta) * amp_cos;

    for (let y = 0; y <= height; y = y + 20) {
      // set up the yPosition along a sin wave

        cos_theta +=  map(treble+highMid,0,510,.4999,.5); //different theta values for X and Y as we update theta before writing Y poxitions

        sin_theta +=  map(bass+lowMid+mid,0,765,.4999,.5); //different theta values for X and Y as we update theta before writing Y poxitions



       yPos = height/2 + sin(sin_theta) * amp_sin;

      const xAngle = map(xPos, 0, width, - cos_pos * PI, sin_pos * PI );
      const yAngle = map(yPos, 0, height,- sin_pos * PI, cos_pos * PI );
      // and also varies based on the particle's location
      const angle = xAngle * (x / width) + yAngle * (y / height);

      // each particle moves up and down along the y axis and sinde to side on the x
      const myX = x + 30 * cos(2 * PI  + angle); // no x direction movement
      const myY = y + 20 * sin(1 * PI  + angle);

      circle(myX, myY, particle_size); // originally ellipse(myX, myY, particle_size);
    }

  }

  t = t + 0.01; // update time


}


function togglePlay() {
   if (audio.isPlaying()) {
     audio.pause();
   } else {
     audio.loop();
   }
 }

function light_1(lFreq){ // crawler
    if(lpX > width/2  || lpY > height/2 || lpX <= -width/2 || lpY <= -height/2){
      lpX = random(-width/2,width/2);
      lpY = random(-height/2,height/2);
    }

    lpX  = lpX + random(random(-6,-1),random(1,6)); // The randomisation of the random variables creates the crawling behaviour. The ransom limits are weighted to cause a kind of unsure motion.
    lpY  = lpY + random(random(-6,-1),random(1,6));
    let pl1=  pointLight(125+lFreq/2, 125+lFreq/2, 125+lFreq/2, lpX, lpY, 15+(lFreq/250*10)); //dividing lFreq by 250 and getting an absolute value alows for big brightness spikes on big bass hits

}

function light_2(lFreq){
    if(lpX2 > width/2  || lpY2 > height/2 || lpX2 <= -width/2 || lpY2 <= -height/2){
      lpX2 = random(-width/2,width/2); // Where to reset to after leaving screen. Different for each light function
      lpY2 = random(-height/2,height/2);
    }

    lpX2  = lpX2 + random(random(-8,-3),random(2,5));
    lpY2  = lpY2 + random(random(-6,-2),random(1,6));
    let pl2=  pointLight(125+lFreq/2, 125+lFreq/2, 125+lFreq/2, lpX2, lpY2, 15+((lFreq/255)*10));

}


function light_3(lFreq){ //searchlight style light - the direciton changes
    if(lpX3 > width/2  || lpY3 > height/2 || lpX3 <= -width/2 || lpY3 <= -height/2){
      lpX3 = random(-width/2,width/2);
      lpY3 = random(-height/2,height/2);
    }

    lpX3  = lpX3 + random(random(-3,2),random(2,3));
    lpY3  = lpY3 + random(random(-3,2),random(2,3));
    let pl3=  pointLight(125+lFreq/2, 125+lFreq/2, 125+lFreq/2, lpX3, lpY3, 15+((lFreq/255)*10));

}

function light_4(lFreq){ // crawler again with new lpX -- need to fix theese and make them modular/functional functions
    if(lpX4 > width/2  || lpY4 > height/2 || lpX4 <= -width/2 || lpY4 <= -height/2){
      lpX4 = random(-width/2,width/2);
      lpY4 = random(-height/2,height/2);
    }

    lpX4  = lpX4 + random(random(-7,-1),random(1,7)); // The randomisation of the random variables creates the crawling behaviour. The ransom limits are weighted to cause a kind of unsure motion.
    lpY4  = lpY4 + random(random(-8,-1),random(1,8));
    let pl4=  pointLight(125+lFreq/2, 125+lFreq/2, 125+lFreq/2, lpX4, lpY4, 15+((lFreq/255)*10));

}


    /* Light Processing BEfore breaking into functions*/
   /*
  //Light 1
    if(lpX > width/2  || lpY > height/2 || lpX <= -width/2 || lpY <= -height/2){
      lpX = random(width/2);
      lpY = random(height/2);
    }

    lpX  = lpX + random(-3,2);
    lpY  = lpY + random(-3,2);
  //  let pl1=  pointLight(250, 250, 250, lpX, lpY, 10+((bass/255)*10));
    let pl1=  pointLight(bass, bass, bass, lpX, lpY, 15+((bass/255)*10));



    //Light 2 // lgiht is very diuffuse// not enought treble in the piece.
    if(lpX2 > width/2  || lpY2 > height/2 || lpX2 <= -width/2 || lpY2 <= -height/2){
      lpX2 = random(width/2);
      lpY2 = random(height/2);
    }
    lpX2  = lpX2 + random(-4,2);
    lpY2  = lpY2 + random(-2,3);
    let pl2= pointLight((treble+highMid+mid)/3, (treble+highMid+mid)/3, (treble+highMid+mid)/3, lpX2, lpY2, 10+((treble+highMid+mid)/765)*10);


  // Drunk Walker
  if(lpX3 > width/2  || lpY3 > height/2 || lpX3 <= -width/2 || lpY3 <= -height/2){
      lpX3 = random(width/2);
      lpY3 = random(height/2);
    }
    lpX3 += noise(0, cnt) - .5;
    lpY3 += noise(50, cnt) - .5;
    let pl3= pointLight((lowMid+mid+highMid)/3, (lowMid+mid+highMid)/3, (lowMid+mid+highMid)/3, lpX3, lpY3, 5+((lowMid+mid+highMid)/765)*10);
    cnt += .01;
    */
