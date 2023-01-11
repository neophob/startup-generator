const FMath = require('./FMath.js');
const fMath = new FMath();

// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm

// note about the fxrand() function
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always
//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//

const W = 320;
const H = 320;
a.width = W;
a.height = H;
const img = c.createImageData(W, H);

for (let i = 0; i < W*H*4; i += 4) {
  img.data[i] = 0; // R
  img.data[i + 1] = 0; // G
  img.data[i + 2] = 0; // B
  img.data[i + 3] = 255; // A
}

const colorIntens = 28 + (fxrand() * 120) | 0;
const cyRand = fxrand();
const sqrtMuller = (fxrand() * 150) | 0;
let sizeRand = 8 + (fxrand() * 11) | 0;
let sizeRand2 = 6 + (fxrand() * 5) | 0;
let speed = 0.02 + fxrand() * 0.04;
let size = W/sizeRand;
let sizeCyPlasma = (4 + fxrand() * 11) | 0;

window.$fxhashFeatures = {
  "Intensity": colorIntens,
  "PlasmaA": cyRand,
  "PlasmaB": sizeRand,
  "PlasmaC": sizeRand2,
  "Size": sizeRand,
  "Speed": (speed)*100,
}
let t = 0.0;

function updateLoop(tx) {
  t += speed;

  for (let i = 0; i < W*8*4; i += 4) {
    img.data[i] = 0; // R
    img.data[i + 1] = 0; // G
    img.data[i + 2] = 0; // B
    img.data[i + 3] = 255; // A
  }

  if (fxrand() > 0.97) {
    const rr = (fxrand() * 4) | 0;
    switch (rr) {
      case 0:
        speed = 0.02 + fxrand() * 0.04;
        break;
      case 1:
        sizeRand = 8 + (fxrand() * 11) | 0;
        size = W/sizeRand;
        break;
      case 2:
        sizeRand2 = 6 + (fxrand() * 5) | 0;
        break;
      case 3:
        sizeCyPlasma = (4 + fxrand() * 11) | 0;
        break;
    }
  }

  let index = 0;
  for (let y = 0; y < H; y++) {
    const ys = y / size;
    const cy=y / size/sizeCyPlasma + cyRand * fMath.cos(t / 3);
    const sinYs = fMath.sin((ys + t) / 2);

    for (let x = 0; x < W; x++) {
          const xs = x / size;
          const cx = x / size / sizeRand2 + cyRand * fMath.sin(t/4);
          let plasma = fMath.sin(xs + t);
          plasma += fMath.sin(( xs + ys + t) / 2);
          plasma += sinYs;
          plasma += fMath.sin( Math.sqrt(sqrtMuller * (cx * cx + cy * cy + 1) ) + t);

          const color = fMath.sin(plasma * 3.14);

          img.data[index] = img.data[index + 1] = img.data[index + 2] =
            77 + colorIntens * color;
          index+=4;
        }
  }

  const AAA = fxrand() > 0.99 ? 8+8*((fxrand() * 12) | 0) : 0;

  // dither
  const pixel = img.data;
  const w4 = 4*W;
  const w8 = 8*W;
  for (let i = 0; i<W*H*4; i += 4) {
    const mono = pixel[i] <= 128 ? 0 : 255;
    const err  = (pixel[i] - mono) >> 3;
    pixel[i] = mono;
    [i+4, i+8, i+w4-4, i+w4, i+w4+4, i+w8].forEach((ofs) => {
      pixel[ofs+AAA] += err;
    });
    pixel[i+1] = pixel[i+2] = pixel[i];
  }

  const randomLarge = fxrand() > 0.97 ? (H/2)*W*4 : 0;

  // blurrrr
  const aa3 = (45*fMath.atan(fxrand()) ) | 0;
  const divv = fxrand() > 0.5 ? (3+(fxrand()*2))|0 : 4;
   for (let i = W*aa3*4; i<(W*aa3*7+ randomLarge); i += 1) {
    pixel[i] = (pixel[i+4] + pixel[i-4] + pixel[i-W*4] + pixel[i-W*4])/divv;
    i++;
    pixel[i] = (pixel[i+4] + pixel[i-4] + pixel[i-W*4] + pixel[i-W*4])/divv;
    i++;
    pixel[i] = (pixel[i+4] + pixel[i-4] + pixel[i-W*4] + pixel[i-W*4])/divv;
    i++;
  }

  // glitch
  const aa = (50*fMath.cos(fxrand()) + (H/8+fMath.cos(t/8) * H/2)) | 0;
  for (let i = W*aa*4; i<(W*aa*5 + randomLarge); i += 4) {
    if (pixel[i]>0) {
      pixel[i] = 0;
      pixel[i-4] = 255;
      pixel[i+4+2] = 255;
    }
  }

  // moar glitch
  const aa2 = (55*fMath.sin(fxrand()) + (H/12+fMath.sin(t/5) * H/2)) | 0;
   for (let i = W*aa2*4; i<(W*aa2*5 + randomLarge); i += 4) {
    pixel[i] = (pixel[i+4] + pixel[i-4] + pixel[i-W*4] + pixel[i-W*4])/4;
    i++;
    pixel[i] = (pixel[i+4] + pixel[i-4] + pixel[i-W*4] + pixel[i-W*4])/4;
    i++;
    pixel[i] = (pixel[i+4] + pixel[i-4] + pixel[i-W*4] + pixel[i-W*4])/4;
  }

  c.putImageData(img, 0, 0);
  requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);
