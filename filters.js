Filters = {};
Filters.getPixels = function(img) {
  var c,ctx;
  if (img.getContext) {
    c = img;
    try { ctx = c.getContext('2d'); } catch(e) {}
  }
  if (!ctx) {
    c = this.getCanvas(img.width, img.height);
    ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
  }
  return ctx.getImageData(0,0,c.width,c.height);
};

Filters.tmpCanvas = document.createElement('canvas');
Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

Filters.createImageData = function(w,h) {
  return this.tmpCtx.createImageData(w,h);
};

Filters.getCanvas = function(w,h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

Filters.filterImage = function(filter, image, var_args) {
  var args = [this.getPixels(image)];
  for (var i=2; i<arguments.length; i++) {
    args.push(arguments[i]);
  }
  return filter.apply(null, args);
};

Filters.toCanvas = function(pixels) {
  var canvas = this.getCanvas(pixels.width, pixels.height);
  canvas.getContext('2d').putImageData(pixels, 0, 0);
  return canvas;
};

Filters.identity = function(pixels, args) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  for (var i=0; i<d.length; i++) {
    dst[i] = d[i];
  }
  return output;
};

Filters.luminance = function(pixels, args) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    // CIE luminance for the RGB
    var v = 0.2126*r + 0.7152*g + 0.0722*b;
    dst[i] = dst[i+1] = dst[i+2] = v;
    dst[i+3] = d[i+3];
  }
  return output;
};

Filters.grayscale = function(pixels, args) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = 0.3*r + 0.59*g + 0.11*b;
    dst[i] = dst[i+1] = dst[i+2] = v;
    dst[i+3] = d[i+3];
  }
  return output;
};

Filters.grayscaleAvg = function(pixels, args) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = (r+g+b) / 3;
    dst[i] = dst[i+1] = dst[i+2] = v;
    dst[i+3] = d[i+3];
  }
  return output;
};

Filters.desaturate = function(pixels, factor) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  var f1 = 1-factor;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = 0.3*r + 0.59*g + 0.11*b;
    dst[i] = f1*dst[i] + factor*v; 
    dst[i+1] = f1*dst[i+1] + factor*v;
    dst[i+2] = f1*dst[i+2] + factor*v;
    dst[i+3] = d[i+3];
  }
  return output;
};

Filters.threshold = function(pixels, threshold) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var d = pixels.data;
  var dst = output.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = (0.3*r + 0.59*g + 0.11*b >= threshold) ? 255 : 0;
    dst[i] = dst[i+1] = dst[i+2] = v;
    dst[i+3] = d[i+3];
  }
  return output;
};

Filters.invert = function(pixels) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var d = pixels.data;
  var dst = output.data;
  for (var i=0; i<d.length; i+=4) {
    dst[i] = 255-d[i];
    dst[i+1] = 255-d[i+1];
    dst[i+2] = 255-d[i+2];
    dst[i+3] = d[i+3];
  }
  return output;
};

Filters.convolve = function(pixels, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
          var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
          var srcOff = (scy*sw+scx)*4;
          var wt = weights[cy*side+cx];
          r += src[srcOff] * wt;
          g += src[srcOff+1] * wt;
          b += src[srcOff+2] * wt;
          a += src[srcOff+3] * wt;
        }
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};

if (!window.Float32Array)
  Float32Array = Array;

Filters.convolveFloat32 = function(pixels, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = {
    width: w, height: h, data: new Float32Array(w*h*4)
  };
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
          var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
          var srcOff = (scy*sw+scx)*4;
          var wt = weights[cy*side+cx];
          r += src[srcOff] * wt;
          g += src[srcOff+1] * wt;
          b += src[srcOff+2] * wt;
          a += src[srcOff+3] * wt;
        }
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};

Float32Array.prototype.normalizeInPlace = function() {
  var sum = 0;
  for (var i=0; i<this.length; i++) {
    sum += this[i];
  }
  var recip = 1/sum;
  for (var j=0; j<this.length; j++) {
    this[j] *= recip;
  }
  return this;
};
Float32Array.prototype.copy = function() {
  var arr = new Float32Array(this.length);
  for (var i=0; i<this.length; i++) {
    arr[i] = this[i];
  }
  return arr;
};
Float32Array.prototype.normalize = function() {
  return this.copy().normalizeInPlace();
};

Filters.gaussian5Kernel = new Float32Array([
  1,  4,  7,  4, 1, 
  4, 16, 26, 16, 4, 
  7, 26, 41, 26, 7, 
  4, 16, 26, 16, 4, 
  1,  4,  7,  4, 1
]);
Filters.gaussian5Kernel.normalizeInPlace();

Filters.gaussian3Kernel = new Float32Array([
  16, 26, 16,
  26, 41, 26, 
  16, 26, 16 
]);
Filters.gaussian3Kernel.normalizeInPlace();

Filters.gaussian5 = function(pixels) {
  return Filters.convolve(pixels, Filters.gaussian5Kernel, false);
};

Filters.gaussian3 = function(pixels) {
  return Filters.convolve(pixels, Filters.gaussian3Kernel, false);
};

Filters.laplace = function(pixels) {
  return Filters.convolve(pixels, [
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1
  ], true);
};

Filters.sobelVerticalGradient = function(px) {
  return this.convolveFloat32(
    px,
    [-1,-2,-1,
      0, 0, 0,
      1, 2, 1]);
};

Filters.sobelHorizontalGradient = function(px) {
  return this.convolveFloat32(
    px,
    [-1,0,1,
     -2,0,2,
     -1,0,1]);
};

Filters.sobelVectors = function(px) {
  var vertical = this.sobelVerticalGradient(px);
  var horizontal = this.sobelHorizontalGradient(px);
  var id = {width: vertical.width, height: vertical.height, 
            data: new Float32Array(vertical.width*vertical.height*8)};
  var vd = vertical.data;
  var hd = horizontal.data;
  var idd = id.data;
  for (var i=0,j=0; i<idd.length; i+=2,j++) {
    idd[i] = hd[j];
    idd[i+1] = vd[j];
  }
  return id;
};

Filters.sobel = function(px) {
  px = Filters.grayscale(px);
  var vertical = Filters.sobelVerticalGradient(px);
  var horizontal = Filters.sobelHorizontalGradient(px);
  var id = Filters.createImageData(vertical.width, vertical.height);
  for (var i=0; i<id.data.length; i+=4) {
    var v = Math.abs(vertical.data[i]);
    id.data[i] = v;
    var h = Math.abs(horizontal.data[i]);
    id.data[i+1] = h;
    id.data[i+2] = (v+h)/4;
    id.data[i+3] = 255;
  }
  return id;
};


Filters.darkenBlend = function(below, above) {
  var output = Filters.createImageData(below.width, below.height);
  var a = below.data;
  var b = above.data;
  var dst = output.data;
  for (var i=0; i<a.length; i+=4) {
    dst[i] = Math.min(a[i],b[i]);
    dst[i+1] = Math.min(a[i+1],b[i+1]);
    dst[i+2] = Math.min(a[i+2],b[i+2]);
    dst[i+3] = a[i+3]+((255-a[i+3])*b[i+3])/255;
  }
  return output;
};

Filters.lightenBlend = function(below, above) {
  var output = Filters.createImageData(below.width, below.height);
  var a = below.data;
  var b = above.data;
  var dst = output.data;
  for (var i=0; i<a.length; i+=4) {
    dst[i] = Math.max(a[i],b[i]);
    dst[i+1] = Math.max(a[i+1],b[i+1]);
    dst[i+2] = Math.max(a[i+2],b[i+2]);
    dst[i+3] = a[i+3]+((255-a[i+3])*b[i+3])/255;
  }
  return output;
};

Filters.multiplyBlend = function(below, above) {
  var output = Filters.createImageData(below.width, below.height);
  var a = below.data;
  var b = above.data;
  var dst = output.data;
  for (var i=0; i<a.length; i+=4) {
    dst[i] = (a[i]*b[i])/255;
    dst[i+1] = (a[i+1]*b[i+1])/255;
    dst[i+2] = (a[i+2]*b[i+2])/255;
    dst[i+3] = a[i+3]+((255-a[i+3])*b[i+3])/255;
  }
  return output;
};

Filters.screenBlend = function(below, above) {
  var output = Filters.createImageData(below.width, below.height);
  var a = below.data;
  var b = above.data;
  var dst = output.data;
  for (var i=0; i<a.length; i+=4) {
    dst[i] = 255 - (((255 - b[i])*(255 - a[i]))/255);
    dst[i+1] = 255 - (((255 - b[i+1])*(255 - a[i+1]))/255);
    dst[i+2] = 255 - (((255 - b[i+2])*(255 - a[i+2]))/255);
    dst[i+3] = a[i+3]+((255-a[i+3])*b[i+3])/255;
  }
  return output;
};

Filters.addBlend = function(below, above) {
  var output = Filters.createImageData(below.width, below.height);
  var a = below.data;
  var b = above.data;
  var dst = output.data;
  for (var i=0; i<a.length; i+=4) {
    dst[i] = (a[i]+b[i]);
    dst[i+1] = (a[i+1]+b[i+1]);
    dst[i+2] = (a[i+2]+b[i+2]);
    dst[i+3] = a[i+3]+((255-a[i+3])*b[i+3])/255;
  }
  return output;
};

Filters.subBlend = function(below, above) {
  var output = Filters.createImageData(below.width, below.height);
  var a = below.data;
  var b = above.data;
  var dst = output.data;
  for (var i=0; i<a.length; i+=4) {
    dst[i] = (a[i]+b[i]-255);
    dst[i+1] = (a[i+1]+b[i+1]-255);
    dst[i+2] = (a[i+2]+b[i+2]-255);
    dst[i+3] = a[i+3]+((255-a[i+3])*b[i+3])/255;
  }
  return output;
};

Filters.differenceBlend = function(below, above) {
  var output = Filters.createImageData(below.width, below.height);
  var a = below.data;
  var b = above.data;
  var dst = output.data;
  for (var i=0; i<a.length; i+=4) {
    dst[i] = Math.abs(a[i]-b[i]);
    dst[i+1] = Math.abs(a[i+1]-b[i+1]);
    dst[i+2] = Math.abs(a[i+2]-b[i+2]);
    dst[i+3] = a[i+3]+((255-a[i+3])*b[i+3])/255;
  }
  return output;
};
