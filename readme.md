# Img Master <img src="https://img.shields.io/badge/img--master-多功能无限制的图像批处理工具-66f.svg">

[![author](https://img.shields.io/badge/author-JowayYoung-f66.svg)](https://github.com/JowayYoung/img-master)
[![version](https://img.shields.io/badge/version-0.0.2-f66.svg)](https://github.com/JowayYoung/img-master)
[![node](https://img.shields.io/badge/node-%3E%3D%2010.0.0-3c9.svg)](https://github.com/JowayYoung/img-master)
[![npm](https://img.shields.io/badge/npm-%3E%3D%205.6.0-3c9.svg)](https://github.com/JowayYoung/img-master)
[![test](https://img.shields.io/badge/test-passing-f90.svg)](https://github.com/JowayYoung/img-master)
[![build](https://img.shields.io/badge/build-passing-f90.svg)](https://github.com/JowayYoung/img-master)
[![coverage](https://img.shields.io/badge/coverage-100%25-09f.svg)](https://github.com/JowayYoung/img-master)
[![license](https://img.shields.io/badge/license-MIT-09f.svg)](https://github.com/JowayYoung/img-master)

> `img-master`是一个多功能无限制的图像批处理工具，提供**压缩**、**分组**、**标记**和**变换**四大批处理功能

### 安装

`npm i -g img-master`

> 安装准备

`img-master`某些功能基于`sharp`，所以在安装过程中可能会失败或报错，请通过以下步骤解围。

- 设置**NPM镜像**为淘宝镜像：`npm config set registry https://registry.npm.taobao.org/`
- 设置**NPM模块内置Node镜像**为淘宝镜像：`npm config set disturl https://npm.taobao.org/mirrors/node/`
- 设置**Sharp镜像**为淘宝镜像
	- `npm config set sharp_binary_host https://npm.taobao.org/mirrors/sharp/`
	- `npm config set sharp_libvips_binary_host https://npm.taobao.org/mirrors/sharp-libvips/`
- 若曾经安装失败，请执行`npm cache clean -f`强制清理缓存
- 执行`npm i -g img-master`重新安装

```!
若是多账户电脑(公司环境)，请切换到管理员账号下执行npm i -g img-master重新安装
```

若有兴趣了解`某些模块因NPM镜像问题而安装不上`的解围思路，可查看笔者这篇[《聊聊NPM镜像那些险象环生的坑》](https://juejin.im/post/5edf60d4f265da76b559b6ac)，相信会对你有很大的帮助。

### 使用

命令|缩写|功能|描述
-|-|-|-
`img-master compress`|`img-master c`|压缩图像|基于`TinyJPG`或`TinyPNG`进行压缩
`img-master group`|`img-master g`|分组图像|按照图像`尺寸`、`类型`或`大小范围`进行分组
`img-master mark`|`img-master m`|标记图像|基于`Sharp`进行标记，提供交互式问答调用
`img-master transform`|`img-master t`|变换图像|基于`Sharp`进行变换，提供多配置链式调用

- 推荐使用缩写命令
- 目前只能处理`JPG`和`PNG`的图像
- 可遍历根目录下所有多层文件夹里符合条件的图像文件
- 进入需要处理图像的根目录：`cd my-image`，再根据需求执行以上命令

> 图像压缩

- 使用`https://tinyjpg.com`或`https://tinypng.com`压缩图像会有`20张`的数量限制
- `img-master c`基于以上两个网站进行压缩，但是通过随机修改请求头的`X-Forwarded-For`绕过其数量限制

> 图像变换

- 特点：执行命令可追加多个配置，支持链式调用，变换情况依据配置的顺序而有所不同
- 链式调用：当前配置处理完的图像，以流的方式传入下一个配置进行处理，直至结束，`类似Gulp的流处理`
- 调用结果：不同配置组合的生成图像可能不同，即使相同配置但不同顺序也可能导致生成图像不同

配置|功能|格式(`[]表示可选`)|描述
-|-|-|-
`--blur`|模糊|`0.3~1000`|不设置则不生效
`--extract`|裁剪|`left,top,width,height`|不设置则不生效
`--flip`|平翻|`true`|不设置则不生效
`--flop`|对翻|`true`|不设置则不生效
`--format`|格式|`jpg`或`png`|不设置则使用图像原来的类型
`--grayscale`|灰度|`true`|不设置则不生效
`--negate`|负片|`true`|不设置则不生效
`--normalise`|对比|`true`|不设置则不生效
`--resize`|尺寸|`width,height[,fit]`|若其中一方为0则自动缩放以匹配另一方<br>不设置则不生效
`--rotate`|旋转|`angle[,bgcolor]`|不设置则不生效
`--sharpen`|锐化|`true`或`[sigama,flat,jagged]`|`true`表示执行快速温和的锐化输出<br>sigama在`0.3~1000`间，其余参数必须`>0`<br>不设置则不生效

- **fit**：填充
	- `cover`：裁剪以适应在指定尺寸中
	- `contain`：嵌入在指定尺寸中
	- `fill`：忽略宽高比，拉伸以填满在指定尺寸中
	- `inside`：保留宽高比，将大小调整到尽可能大，同时确保其尺寸小于或等于指定尺寸
	- `outside`：保留宽高比，将大小调整到尽可能小，同时确保其尺寸大于或等于指定尺寸
- **bgcolor**：背景色
	- `transparent`：透明，需配合`--format png`使用
	- `HEX`：16进制色值，可选`#xyz`或`#uvwxyz`
	- `RGB`：RGB色值，`rgba(r,g,b)`
	- `RGBA`：RGBA色值：`rgba(r,g,b,a)`

> 注意事项

- 配置一定要完整输入且正确，格式为`--opt [val]`，不然会报错导致无法执行
- 配置参数间相连只能使用英文逗号`,`，不能使用空格
- 配置详情请参考[sharp-api](https://sharp.pixelplumbing.com/api-constructor)

### 细节

> 压缩图像

- 输出目录为`#compressed-dist#`
- 图像可任意放置到根目录多层文件夹下，压缩图像后原样输出图像位置到`#compressed-dist#`下
- 重新压缩图像时，先移除`#compressed-dist#`再生成新的`#compressed-dist#`，注意保存压缩过的图像

> 分组图像

- 输出目录为`#grouped-dist#`
- 图像可任意放置到根目录多层文件夹下，分组图像后按照分组依据输出图像位置到`#grouped-dist#`下
- 重新分组图像时，先移除`#grouped-dist#`再生成新的`#grouped-dist#`，注意保存分组过的图像

> 标记图像

- 输出目录为`#marked-dist#`
- 图像可任意放置到根目录多层文件夹下，标记图像后原样输出图像位置到`#marked-dist#`下
- 重新标记图像时，先移除`#marked-dist#`再生成新的`#marked-dist#`，注意保存标记过的图像

> 变换图像

- 输出目录为`#transformed-dist#`
- 图像可任意放置到根目录多层文件夹下，变换图像后原样输出图像位置到`#transformed-dist#`下
- 重新变换图像时，先移除`#transformed-dist#`再生成新的`#transformed-dist#`，注意保存变换过的图像

### 示例

所有命令作用一次以下文件夹的图像

![原始图像](https://static.yangzw.vip/npm/img-master/原始图像.png)

> 压缩图像

`img-master c`

![压缩图像命令](https://static.yangzw.vip/npm/img-master/压缩图像命令.png)

![压缩图像](https://static.yangzw.vip/npm/img-master/压缩图像.png)

> 分组图像

`img-master g`

![分组图像命令](https://static.yangzw.vip/npm/img-master/分组图像命令.png)

![分组图像](https://static.yangzw.vip/npm/img-master/分组图像.png)

> 标记图像

`img-master m`

![标记图像命令](https://static.yangzw.vip/npm/img-master/标记图像命令.png)

![标记图像](https://static.yangzw.vip/npm/img-master/标记图像.png)

> 变换图像

`img-master t --resize 300,0 --extract 50,50,100,100 --rotate 200,#3c9 --blur 5 --format png`

![变换图像命令](https://static.yangzw.vip/npm/img-master/变换图像命令.png)

![变换图像](https://static.yangzw.vip/npm/img-master/变换图像.png)

```txt
相同配置但不同顺序也可能导致生成图像不同
```

### 版权

MIT © [Joway Young](https://github.com/JowayYoung)

### 后记

若觉得`img-master`对你有帮助，可在[Issue](https://github.com/JowayYoung/img-master/issues)上`提出你的宝贵建议`，笔者会认真阅读并整合你的建议。喜欢`img-master`的请给一个[Start](https://github.com/JowayYoung/img-master)，或[Fork](https://github.com/JowayYoung/img-master)本项目到自己的`Github`上，根据自身需求定制功能。

**关注公众号`IQ前端`，一个专注于CSS/JS开发技巧的前端公众号，更多前端小干货等着你喔**

![](https://static.yangzw.vip/frontend/account/IQ前端公众号.jpg)