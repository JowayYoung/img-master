# Img Master <img src="https://img.shields.io/badge/img--master-多功能无限制的图片处理工具-66f.svg">

[![author](https://img.shields.io/badge/author-JowayYoung-f66.svg)](https://github.com/JowayYoung/img-master)
[![version](https://img.shields.io/badge/version-0.0.1-f66.svg)](https://github.com/JowayYoung/img-master)
[![node](https://img.shields.io/badge/node-%3E%3D%2010.0.0-3c9.svg)](https://github.com/JowayYoung/img-master)
[![npm](https://img.shields.io/badge/npm-%3E%3D%205.6.0-3c9.svg)](https://github.com/JowayYoung/img-master)
[![test](https://img.shields.io/badge/test-passing-f90.svg)](https://github.com/JowayYoung/img-master)
[![build](https://img.shields.io/badge/build-passing-f90.svg)](https://github.com/JowayYoung/img-master)
[![coverage](https://img.shields.io/badge/coverage-100%25-09f.svg)](https://github.com/JowayYoung/img-master)
[![license](https://img.shields.io/badge/license-MIT-09f.svg)](https://github.com/JowayYoung/img-master)

> `img-master`是一个多功能无限制的图片处理工具

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
`img-master group`|`img-master g`|分组图片|按图片`尺寸`、`类型`或`大小范围`进行分组

- 推荐使用缩写命令
- 进入需要处理图片的根目录：`cd my-image`，再根据需求执行以上命令
- 使用`https://tinyjpg.com`或`https://tinypng.com`压缩图片会有数量限制，但是使用`img-master c`可绕过其数量限制(`实现原理是随机修改请求头的X-Forwarded-For`)

### 细节

> 压缩图片

- 默认输出目录为`#dist-compress#`
- 图片可任意放置到根目录多层文件夹下，压缩图片后原样输出图片位置到`#dist-compress#`下
- 重新压缩图片时，先移除`#dist-compress#`再生成新的`#dist-compress#`，注意保存压缩过的图片

> 分组图片

- 默认输出目录为`#dist-group#`
- 图片可任意放置到根目录多层文件夹下，分组图片后按照分组依据输出图片位置到`#dist-group#`下
- 重新分组图片时，先移除`#dist-group#`再生成新的`#dist-group#`，注意保存分组过的图片

### 版权

MIT © [Joway Young](https://github.com/JowayYoung)

### 后记

若觉得`img-master`对你有帮助，可在[Issue](https://github.com/JowayYoung/img-master/issues)上`提出你的宝贵建议`，笔者会认真阅读并整合你的建议。喜欢`img-master`的请给一个[Start](https://github.com/JowayYoung/img-master)，或[Fork](https://github.com/JowayYoung/img-master)本项目到自己的`Github`上，根据自身需求定制功能。

**关注公众号`IQ前端`，一个专注于CSS/JS开发技巧的前端公众号，更多前端小干货等着你喔**

![](https://yangzw.vip/static/frontend/account/IQ前端公众号.jpg)