/**
 * [Pixel description]
 * Value of all parameters is between 0-255
 * 
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 */
var Pixel = function(r, g, b, a) {
  return {
    red: r,
    green: g,
    blue: b,
    alpha: a
  }
};

/**
 * [TwoDArray description]
 *
 * @example createArray(2);
 * @example createArray(3, 2);
 *
 * @see http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
 * 
 * @param {number} length
 */
var TwoDArray = function(length) {
  var arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);

    while(i--) {
      arr[length-1 - i] = TwoDArray.apply(this, args);
    }
  }

  return arr;
};

var ImgPro = function(imageData) {

  /** @type {ImageData} */
  this.originalImageData = imageData;

  /** @type {Uint8ClampedArray} */
  this.imageData = new Uint8ClampedArray(this.originalImageData.data.length),

  /** @type {number} */
  this.width = this.originalImageData.width;

  /** @type {number} */
  this.height = this.originalImageData.height;

  /** @type {TwoDArray} the formatted original data  */
  this.data = new TwoDArray(this.width, this.height);

  /** @type {TwoDArray} the formatted original data that has been passed some filter */
  this.result = new TwoDArray(this.width, this.height);

  /**
   * [clone description]
   * Clone object
   * TODO: move to util class
   *
   * @see http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
   * 
   * @param  {Object} obj
   * @return {Object}
   */
  this.clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
  };

  /**
   * Init
   * - Setup data
   */
  this.init = function() {
    var i = 0,
      j = 0;

    for (i = 0; i < this.width; i++) {
      for (j = 0; j < this.height; j++) {
        var startIndex = j * this.width * 4 + i * 4,
          pixel = new Pixel(
            this.originalImageData.data[startIndex + 0],
            this.originalImageData.data[startIndex + 1],
            this.originalImageData.data[startIndex + 2],
            this.originalImageData.data[startIndex + 3]
          );

        this.data[i][j] = pixel;
      }
    }

    this.result = this.clone(this.data);
  };

  /**
   * Update ImageData from "this.result"
   * used by `this.toImageData` only
   */
  this.updateImageData = function() {
    var i = 0,
      j = 0;

    for (i = 0; i < this.width; i++) {
      for (j = 0; j < this.height; j++) {
        var startIndex = j * this.width * 4 + i * 4;

        this.imageData[startIndex + 0] = this.result[i][j].red;
        this.imageData[startIndex + 1] = this.result[i][j].green;
        this.imageData[startIndex + 2] = this.result[i][j].blue;
        this.imageData[startIndex + 3] = this.result[i][j].alpha;
      }
    }
  };

  /**
   * Return ImageData from "this.data"
   * 
   * @return {ImageData}
   */
  this.toImageData = function() {
    this.updateImageData();

    return (new ImageData(this.imageData, this.width, this.height));
  };

  /**
   * [toGrayscale description]
   * 
   * @return {TwoDArray}
   */
  this.toGrayscale = function() {
    var i = 0,
      j = 0;

    for (j = 0; j < this.height; j++) {
      for (i = 0; i < this.width; i++ ) {
        var value = (0.21 * this.data[i][j].red) +
          (0.71 * this.data[i][j].green) +
          (0.08 * this.data[i][j].blue);

        this.result[i][j].red   = value;
        this.result[i][j].green = value;
        this.result[i][j].blue  = value;
        this.result[i][j].alpha = this.data[i][j].alpha;
      }
    }

    return this.result;
  };

  /**
   * [toInvert description]
   * 
   * @return {TwoDArray}
   */
  this.toInvert = function() {
    var i = 0,
      j = 0;

    for (j = 0; j < this.height; j++) {
      for (i = 0; i < this.width; i++ ) {
        this.result[i][j].red   = 255 - this.data[i][j].red;
        this.result[i][j].green = 255 - this.data[i][j].green;
        this.result[i][j].blue  = 255 - this.data[i][j].blue;
        this.result[i][j].alpha = this.data[i][j].alpha;
      }
    }

    return this.result;
  };

  /**
   * Rotate 180deg
   * TODO: optimize logic
   * 
   * @return {TwoDArray}
   */
  this.toRotate = function() {
    var i = 0,
      j = 0;

    for (j = 0; j < this.height; j++) {
      for (i = 0; i < this.width; i++ ) {
        this.result[i][j].red   = this.data[this.width - i - 1][this.height - j - 1].red;
        this.result[i][j].green = this.data[this.width - i - 1][this.height - j - 1].green;
        this.result[i][j].blue  = this.data[this.width - i - 1][this.height - j - 1].blue;
        this.result[i][j].alpha = this.data[this.width - i - 1][this.height - j - 1].alpha;
      }
    }

    return this.result;
  };

  /**
   * Flip
   * TODO: optimize logic
   * 
   * @return {TwoDArray}
   */
  this.toFlip = function() {
    var i = 0,
      j = 0;

    for (j = 0; j < this.height; j++) {
      for (i = 0; i < this.width; i++ ) {
        this.result[i][j].red   = this.data[this.width - i - 1][j].red;
        this.result[i][j].green = this.data[this.width - i - 1][j].green;
        this.result[i][j].blue  = this.data[this.width - i - 1][j].blue;
        this.result[i][j].alpha = this.data[this.width - i - 1][j].alpha;
      }
    }

    return this.result;
  };

  /**
   * [filter3x3Pixel description]
   * used by `this.filter3x3` only
   * 
   * @param {TwoDArray} data
   * @param {TwoDArray} filter
   * @param {number} i index of width
   * @param {number} j index of height
   *
   * @return {Pixel}
   */
  this.filter3x3Pixel = function(data, filter, i, j) {
    var k = 0,
      l = 0,
      red = 0,
      green = 0,
      blue = 0,
      alpha = 0;

    // height
    for (l = 0; l < 3; l++) {
      // width
      for (k = 0; k < 3; k++) {
        red   += filter[k][l] * this.data[i + k - 1][j + l - 1].red;
        green += filter[k][l] * this.data[i + k - 1][j + l - 1].green;
        blue  += filter[k][l] * this.data[i + k - 1][j + l - 1].blue;
        alpha += filter[k][l] * this.data[i + k - 1][j + l - 1].alpha;
      }
    }

    return (new Pixel(
      Math.round(red),
      Math.round(green),
      Math.round(blue),
      Math.round(alpha)
    ));
  };

  /**
   * [filter3x3 description]
   * TODO: fix the top and left border
   * 
   * @param  {TwoDArray} filter size 3x3 only
   * 
   * @return {TwoDArray}
   */
  this.filter3x3 = function(filter) {
    var i = 0,
      j = 0;

    for (j = 1; j < this.height - 1; j++) {
      for (i = 1; i < this.width - 1; i++ ) {
        this.result[i][j] = this.filter3x3Pixel(this.data, filter, i, j);;
      }
    }

    return this.result;
  };

  this.toBlur = function() {
    return this.toBoxBlur();
  };

  this.toBoxBlur = function() {
    var filter = [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9]
    ];

    return this.filter3x3(filter);
  };

  this.toGaussianBlur = function() {
    var filter = [
      [1 / 16, 2 / 16, 1 / 16],
      [2 / 16, 4 / 16, 2 / 16],
      [1 / 16, 2 / 16, 1 / 16]
    ];

    return this.filter3x3(filter);
  };

  this.toSharpen = function() {
    var filter = [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ];

    return this.filter3x3(filter);
  };

  this.init();
};

self.onmessage = function(e) {
  var imageData = JSON.parse(e.data.imageData),
    boxId = e.data.boxId,
    func = e.data.func,
    msg = {};

  imageData = new ImageData(
    (new Uint8ClampedArray(imageData.data)),
    imageData.width,
    imageData.height
  );

  imgPro = new ImgPro(imageData);
  imgPro[func]();
  imageData = imgPro.toImageData();

  // prepare data for sending
  var arrayedImageData = {};
  // need to be array
  arrayedImageData['data'] = Array.from(imageData.data);
  arrayedImageData['width'] = imageData.width;
  arrayedImageData['height'] = imageData.height;

  var msg = {
    'imageData' : JSON.stringify(arrayedImageData),
    'func'      : 'toGrayscale'
  };
  self.postMessage(msg);
};
