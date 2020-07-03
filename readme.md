# Img Master <img src="https://img.shields.io/badge/img--master-多功能无限制的图片批处理工具-66f.svg">

[![author](https://img.shields.io/badge/author-JowayYoung-f66.svg)](https://github.com/JowayYoung/img-master)
[![version](https://img.shields.io/badge/version-0.0.1-f66.svg)](https://github.com/JowayYoung/img-master)
[![node](https://img.shields.io/badge/node-%3E%3D%2010.0.0-3c9.svg)](https://github.com/JowayYoung/img-master)
[![npm](https://img.shields.io/badge/npm-%3E%3D%205.6.0-3c9.svg)](https://github.com/JowayYoung/img-master)
[![test](https://img.shields.io/badge/test-passing-f90.svg)](https://github.com/JowayYoung/img-master)
[![build](https://img.shields.io/badge/build-passing-f90.svg)](https://github.com/JowayYoung/img-master)
[![coverage](https://img.shields.io/badge/coverage-100%25-09f.svg)](https://github.com/JowayYoung/img-master)
[![license](https://img.shields.io/badge/license-MIT-09f.svg)](https://github.com/JowayYoung/img-master)

> `img-master`是一个多功能无限制的图片批处理工具，提供**压缩**、**分组**和**变换**三大批处理功能

### 安装

`npm i -g img-master`

> 安装准备

`img-master`某些功能基于`sharp`，所以在安装过程中可能会失败或报错，请通过以下步骤解围。

- 设置**NPM镜像**为淘宝镜像：`npm config set registry https://registry.npm.taobao.org/`
- 设置**NPM模块内置Node镜像**为淘宝镜像：`npm config set disturl https://npm.taobao.org/mirrors/node/`
- 设置**Share镜像**为淘宝镜像
	- `npm config set sharp_binary_host https://npm.taobao.org/mirrors/sharp/`
	- `npm config set sharp_libvips_binary_host https://npm.taobao.org/mirrors/sharp-libvips/`
- 若曾经安装失败，请执行`npm cache clean -f`强制清理缓存
- 执行`npm i -g img-master`重新安装

```!
若是多账户电脑(公司环境)，请切换到管理员账号下执行npm i -g img-master重新安装
```

若有兴趣了解`某些模块因NPM镜像问题而安装不上`的解围思路，可查看笔者这篇[《聊聊NPM镜像那些险象环生的坑》](https://juejin.im/post/5edf60d4f265da76b559b6ac)，相信会对你帮助很大。

### 使用

命令|缩写|功能|描述
-|-|-|-
`img-master compress`|`img-master c`|压缩图片|基于`TinyJPG`或`TinyPNG`进行压缩
`img-master group`|`img-master g`|分组图片|按照图片`尺寸`、`类型`或`大小范围`进行分组
`img-master transform`|`img-master t`|变换图片|基于`Sharp`进行变换

- 推荐使用缩写命令
- 进入需要处理图片的根目录：`cd my-image`，再根据需求执行以上命令
- 使用`https://tinyjpg.com`或`https://tinypng.com`压缩图片会有数量限制，但是使用`img-master c`可绕过其数量限制(`实现原理是随机修改请求头的X-Forwarded-For`)

> 图片变换

- 命令：`img-master transform`或`img-master t`
- 特点：执行命令可追加多个配置，支持链式调用，变换情况依据配置的顺序进行
- 链式调用：当前配置处理完的图片，以流的方式传入下一个配置进行处理，直至结束，`类似Gulp的流处理`
- 调用结果：不同配置组合的生成图片可能不同，即使相同配置但不同顺序也可能导致生成图片不同

配置|功能|格式(`[]表示可选`)|描述
-|-|-|-
`--extract`|裁剪区域|`left,top,width,height`|不设置则不生效
`--format`|输出类型|`jpg`或`png`|不设置则使用图片原来的类型
`--resize`|重置尺寸|`width,height[,fit]`|不设置则不生效，若其中一方为0则自动缩放以匹配另一方
`--rotate`|旋转角度|`angle[,bgcolor]`|不设置则不生效

- **fit**：填充规则
	- `cover`：裁剪以适应在指定尺寸中
	- `contain`：嵌入在指定尺寸中
	- `fill`：忽略宽高比，拉伸以填满在指定尺寸中
	- `inside`：保留宽高比，将大小调整到尽可能大，同时确保其尺寸小于或等于指定尺寸
	- `outside`：保留宽高比，将大小调整到尽可能小，同时确保其尺寸大于或等于指定尺寸
- **bgcolor**：背景色规则(`不能使用空格隔开`)
	- `transparent`：透明，需配合`--format png`使用
	- `HEX`：16进制色值，可选`#xyz`或`#uvwxyz`
	- `RGB`：RGB色值，`rgba(r,g,b)`
	- `RGBA`：RGBA色值：`rgba(r,g,b,a)`

> 注意事项

- 配置一定要输入完整且正确，格式为`--opt [val]`，不然会报错导致无法执行

### 细节

> 压缩图片

- 输出目录为`#compressed-dist#`
- 图片可任意放置到根目录多层文件夹下，压缩图片后原样输出图片位置到`#compressed-dist#`下
- 重新压缩图片时，先移除`#compressed-dist#`再生成新的`#compressed-dist#`，注意保存压缩过的图片

> 分组图片

- 输出目录为`#grouped-dist#`
- 图片可任意放置到根目录多层文件夹下，分组图片后按照分组依据输出图片位置到`#grouped-dist#`下
- 重新分组图片时，先移除`#grouped-dist#`再生成新的`#grouped-dist#`，注意保存分组过的图片

> 变换图片

- 输出目录为`#transformed-dist#`
- 图片可任意放置到根目录多层文件夹下，变换图片后原样输出图片位置到`#transformed-dist#`下
- 重新变换图片时，先移除`#transformed-dist#`再生成新的`#transformed-dist#`，注意保存变换过的图片

### 版权

MIT © [Joway Young](https://github.com/JowayYoung)

### 后记

若觉得`img-master`对你有帮助，可在[Issue](https://github.com/JowayYoung/img-master/issues)上`提出你的宝贵建议`，笔者会认真阅读并整合你的建议。喜欢`img-master`的请给一个[Start](https://github.com/JowayYoung/img-master)，或[Fork](https://github.com/JowayYoung/img-master)本项目到自己的`Github`上，根据自身需求定制功能。

**关注公众号`IQ前端`，一个专注于CSS/JS开发技巧的前端公众号，更多前端小干货等着你喔**

![](https://yangzw.vip/static/frontend/account/IQ前端公众号.jpg)