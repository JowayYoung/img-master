# Img Master

`img-master` is a utility module which can batch operation of the image set. At present, it includes two functions of image grouping and image handling.

## Remark

At present, the function of `img-master` is not perfect, and it will continue to update and maintain new functions.

### Install

- First downloading and installing [GraphicsMagick](http://www.graphicsmagick.org) or [ImageMagick](http://www.imagemagick.org).
- Then using npm for installation `npm install -g img-master`.

### Ready

- First putting all the pictures in the folder(**src**), and it can include the other folder.
- Then executing the command, and the result will be exported to the folder(**dist**).

### Usage

Command | Alias | Description
-- | -- | --
`img-master group` | `img-master g` | Image Grouping
`img-master handle` | `img-master h` | Image Handling

### Image Grouping

`img-master g` Grouping according to size or type.

- Size : Choose answer **size**
- Type : Choose answer **type**

### Image Handling

`img-master h` Selecting batch processing.

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