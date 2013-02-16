Canvas filters
--------------

This library implements a few image processing filters using the canvas element.

The filters operate on ImageData objects. The filters do not modify the
source ImageData.

Based on http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
Smoke tests online at http://fhtr.org/canvasfilters/

LICENSE
-------
MIT

API Documentation
-----------------

Filters : {


  //
  // Convenience functions
  //

  // filterImage applies a filter function to an image or canvas element.
  // Arguments from the third onwards are passed as extra arguments to the filter function.
  ImageData filterImage(Function filter, Image_or_Canvas image, Filter_arguments var_args, ...)

  // getPixels returns the ImageData object for an image or a canvas element.
  ImageData getPixels(Image_or_Canvas img)

  // toCanvas returns a new canvas filled with the given ImageData object.
  Canvas toCanvas(ImageData pixels)

  // getCanvas creates a canvas of the wanted dimensions
  Canvas getCanvas(int width, int height)

  // createImageData creates an ImageData object of the wanted dimensions
  ImageData createImageData(int width, int height)

  // createImageData creates an ImageData-like object backed by a Float32Array
  // of the wanted dimensions
  ImageDataFloat32 createImageDataFloat32(int width, int height)

  // bilinearSample bilinearly samples the image at the given coordinates.
  // The result is computed by linear blending of the four pixels around x,y.
  [r,g,b,a] bilinearSample(ImageData pixels, float x, float y)

  //
  // Distort filters
  //

  // identity returns a copy of the ImageData
  ImageData identity(ImageData pixels)

  // horizontalFlip flips the image left-right
  ImageData horizontalFlip(ImageData pixels)

  // verticalFlip flips the image upside down
  ImageData verticalFlip(ImageData pixels)

  // distortSine distorts the image by pinching / punching it by the given amount.
  // The distort amounts should be between -0.5 and 0.5.
  ImageData distortSine(ImageData pixels, float xAmount, float yAmount)


  //
  // Color filters
  //

  // luminance converts the image to grayscale using the CIE luminance
  // (0.2126*r + 0.7152*g + 0.0722*b)
  ImageData luminance(ImageData pixels)

  // grayscale converts the image to grayscale using
  // (0.3*r + 0.59*g + 0.11*b)
  ImageData grayscale(ImageData pixels)

  // grayscaleAvg converts the image to grayscale using
  // (r+g+b) / 3
  ImageData grayscaleAvg(ImageData pixels)

  // threshold converts the image to a two-color image with
  // pixels brighter than or equal to the threshold value rendered white and
  // pixels darker than the threshold rendered black
  // The filter uses grayscale to compute the value of a pixel.
  // (0.3*r + 0.59*g + 0.11*b)
  ImageData threshold(ImageData pixels, int threshold)

  // invert inverts the RGB channels of the image.
  // The inverted version of a pixel is [255-r, 255-g, 255-b, a]
  ImageData invert(ImageData pixels)

  // invert inverts the RGB channels of the image.
  // The inverted version of a pixel is [255-r, 255-g, 255-b, a]
  ImageData invert(ImageData pixels)

  // brightnessContrast adjusts the brightness and contrast of the image.
  // The brightness value ranges between -1 .. 1, with 0 being neutral.
  // The contrast value ranges between 0 .. 127, with 1 being neutral.
  ImageData brightnessContrast(ImageData pixels, float brightness, float contrast)

  // applyLUT applies a color lookup table to the image.
  // The lookup table is an object of form
  // {r:Uint8[256], g:Uint8[256], b:Uint8[256], a:Uint8[256]}
  // Result pixel values are calculated by looking up the current value from
  // the corresponding lookup table: [lut.r[r], lut.g[g], lut.b[b], lut.a[a]]
  ImageData applyLUT(ImageData pixels, LookUpTable lut)

  //
  // Convolution filters
  //

  // convolve convolves the image using the weights array as a square
  // row-major convolution matrix.
  // If the opaque argument is set to true the result image will have
  // an opaque alpha channel.
  ImageData convolve(ImageData pixels, Array weights, bool opaque)

  // horizontalConvolve convolves the image using a horizontal weights vector.
  // If the opaque argument is set to true the result image will have
  // an opaque alpha channel.
  ImageData horizontalConvolve(ImageData pixels, Array weights, bool opaque)

  // verticalConvolve convolves the image using a vertical weights vector.
  // If the opaque argument is set to true the result image will have
  // an opaque alpha channel.
  ImageData verticalConvolve(ImageData pixels, Array weights, bool opaque)

  // separableConvolve convolves the image using vertically and horizontally
  // using the supplied vectors. Faster than convolve for separable kernels.
  ImageData separableConvolve(ImageData pixels,
                              Array horizWeights,
                              Array vertWeights,
                              bool opaque)

  // convolveFloat32 is a version of convolve that operates on ImageData-like
  // objects with a Float32Array storing the pixels
  // {width:int, height:int, data:Float32Array}.
  // Useful when you need a high value range or negative values in pixels.
  ImageDataFloat32 convolveFloat32(ImageData pixels, Array weights, bool opaque)

  // horizontalConvolveFloat32 convolves the image using a horizontal weights
  // vector.
  // If the opaque argument is set to true the result image will have
  // an opaque alpha channel.
  ImageDataFloat32 horizontalConvolveFloat32(ImageData pixels,
                                             Array weights,
                                             bool opaque)

  // verticalConvolveFloat32 convolves the image using a vertical weights
  // vector.
  // Returns a ImageDataFloat32.
  // If the opaque argument is set to true the result image will have
  // an opaque alpha channel.
  ImageDataFloat32 verticalConvolveFloat32(ImageData pixels,
                                           Array weights,
                                           bool opaque)

  // separableConvolveFloat32 convolves the image using vertically and
  // horizontally using the supplied vectors. Faster than convolve for separable
  // kernels.
  // Returns a ImageDataFloat32.
  // If the opaque argument is set to true the result image will have
  // an opaque alpha channel.
  ImageDataFloat32 separableConvolveFloat32(ImageData pixels,
                                            Array horizWeights,
                                            Array vertWeights,
                                            bool opaque)


  //
  // Pre-defined convolution filters
  //

  // gaussianBlur applies a gaussian blur kernel of the wanted diameter on the image.
  ImageData gaussianBlur(ImageData pixels, float diameter)

  // laplace applies a Laplace edge detection kernel on the image.
  ImageData laplace(ImageData pixels)

  // sobel applies a Sobel filter on the image.
  // This filter is purely for looks, the red channel encodes absolute vertical
  // gradient and the green channel absolute horizontal gradient.
  ImageData sobel(ImageData pixels)

  // sobelVectors computes the signed horizontal and vertical gradients of the image
  // and returns the array of resulting 2-vectors, packed tightly into a Float32Array
  Float32Vec2ImageData sobelVectors(ImageData pixels)

  // sobelVerticalGradient computes the signed vertical gradient of the image
  ImageDataFloat32 sobelVerticalGradient(ImageData pixels)

  // sobelHorizontalGradient computes the signed horizontal gradient of the image
  ImageDataFloat32 sobelHorizontalGradient(ImageData pixels)


  //
  // Blend operations
  //

  // darkenBlend blends b on top of a, replacing a with b whenever b is darker.
  // The filter operates on a per-channel basis, the result pixels
  // are computed as [min(a.r, b.r), min(a.g, b.g), min(a.b, b.b), alpha(a.a, b.a)]
  // where alpha(a, b) = a + (255-a)*b/255.
  ImageData darkenBlend(ImageData a, ImageData b)

  // lightenBlend blends b on top of a, replacing a with b whenever b is lighter.
  // The filter operates on a per-channel basis, the result pixels
  // are computed as [max(a.r, b.r), max(a.g, b.g), max(a.b, b.b), alpha(a.a, b.a)]
  // where alpha(a, b) = a + (255-a)*b/255.
  ImageData lightenBlend(ImageData a, ImageData b)

  // addBlend blends b on top of a, adding b's values to a.
  // [a.r+b.r, a.g+b.g, a.b+b.b, alpha(a.a, b.a)]
  // where alpha(a, b) = a + (255-a)*b/255.
  ImageData addBlend(ImageData a, ImageData b)

  // subBlend blends b on top of a, subtracting b's values to a.
  // [a.r-(255-b.r), a.g-(255-b.g), a.b-(255-b.b), alpha(a.a, b.a)]
  // where alpha(a, b) = a + (255-a)*b/255.
  ImageData subBlend(ImageData a, ImageData b)

  // multiplyBlend blends b on top of a, multiplying b with a.
  // [a.r*b.r/255, a.g*b.g/255, a.b*b.b/255, alpha(a.a, b.a)]
  // where alpha(a, b) = a + (255-a)*b/255.
  ImageData multiplyBlend(ImageData a, ImageData b)

  // screenBlend blends b on top of a with the screen blend mode.
  // Makes a brighter by an amount determined by b.
  // [255 - (255 - b.c)*(255 - a.c)/255, ...,  alpha(a.a, b.a)]
  // where alpha(a, b) = a + (255-a)*b/255.
  ImageData screenBlend(ImageData a, ImageData b)

  // differenceBlend blends b on top of a by taking the absolute difference
  // between the images.
  // [Math.abs(a.c-b.c), alpha(a.a, b.a)]
  // where alpha(a, b) = a + (255-a)*b/255.
  ImageData differenceBlend(ImageData a, ImageData b)

}
