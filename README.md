# Img Master

`img-master` is a utility module which can batch operation of the image set. At present, it includes two functions of image grouping and image handling.

## Remark

At present, the function of `img-master` is not perfect, and it will continue to update and maintain new functions.

### Install

- First download and install [GraphicsMagick](http://www.graphicsmagick.org) or [ImageMagick](http://www.imagemagick.org).
- Then either use npm `npm install -g img-master`

### Usage

Command | Alias | Description
-- | -- | --
`img-master group` | `img-master g` | Image Grouping
`img-master handle` | `img-master h` | Image Handling

### Image Grouping

`img-master g` Grouping according to size or type

- Size : Choose answer **size**
- Type : Choose answer **type**

### Image Handling

`img-master h` Selective batch processing

- Resize
	- *Input width(fixed) and height(adaptive)* : **100**
	- *Input width(adaptive) and height(fixed)* : **0,100**
	- *Input size* : **100,200**
- Crop
	- *Input clipping area* : **100,200,10,20**
- Format
	- *Select extension* : **png** or **jpg**
- Compress
	- *Input quality* : **60** (0 < quality <= 100)