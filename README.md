# Img Master

`img-master` is a utility module which can batch operation of the image set. At present, it includes two functions of image grouping and image handling.

## Remark

At present, the function of `img-master` is not perfect, and it will continue to update and maintain new functions.

### Install

- `npm install -g img-master`
- `yarn add img-master`

### Usage

Command | Alias | Description
-- | -- | --
`img-master group` | `img-master g` | Image Grouping
`img-master handle` | `img-master h` | Image Handling

### Image Grouping

`img-master g` Grouping according to size or type

- Size: Choose answer **size**
- Type: Choose answer **type**

### Image Handling

`img-master h` Selective batch processing

- Resize
	- *The width is fixed, the height is adaptive* : Input answer **100**
	- *The width is adaptive, the height is fixed* : Input answer **0,100**
	- *Custom width and height* : Input answer **100,200**
- Crop
	- *Custom clipping area* : Input answer **100,200,10,20**