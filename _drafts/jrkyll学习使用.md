---
layout: post
title: "css的利器：使用Sass样式"
date: 2017-04-25 19:00:00 +0800 
categories: 研究生涯
tag: Sass
---
* content
{:toc}

>http://jekyll.com.cn/docs/structure/
在使用jrkyll之前我很早就用过gitpage功能,将gitpage作为我的作品展示页用;最近想重新将我的博客运行起来,但又不想在花那钱租云服务器了。因而想到了用gitpage搭建一个静态展示用的网页,用于发表文章和做随笔记录。

由于不想在做繁杂的文章目录维护，因而找到了jekyll工具。
<!-- more -->

### jrkyll头信息
这里的头信息非常关键，它是用来实现文章目录生成、文章分类的核心。
其中的属性layout为当前页面需要套用的模板，其余的字面意思。
它会把categories相同的归到同一目录下；方便查看管理。
```js
---
layout: post
title: "jeky学习使用"
date: 2017-10-16 09:00:00 +0800 
categories: 博客搭建
tag: blog
---
```


### 解决**plugins: [jekyll-paginate]**引起的报错
起初在跟目录下创建了插件文件夹`_plugins`,将从github上找到的`jekyll-paginate`文件放入了该文件夹下,但是不知道出入什么原因一直提示`undefined method pagination_enabled`；然后我想或许直接下载这包是否管用呢？尝试了下解决了问题。

需要用ruby的包管理器下载插件jekyll-paginate
由于内网所以加入代理,下载成功后及恢复正常。
```js
gem install --http-proxy http://proxy1.bj.petrochina:8080 jekyll-paginate
```

### 解决jekyll无法本地预览中文文件的问题
由于配置文件里的categories中用了中文,当在本地预览时会出现无法找到文件的情况,因为jekyll会根据此配置信息加入一个类别文件夹作为文章目录。

在这里记录一下我在网上找到的解决办法。

修改安装目录\Ruby22-x64\lib\ruby\2.2.0\webrick\httpservlet下的filehandler.rb文件，建议先备份。
找到下列两处，添加一句（+的一行为添加部分）
* 第一处
```js
path = req.path_info.dup.force_encoding(Encoding.find("filesystem"))
+ path.force_encoding("UTF-8") # 加入编码
if trailing_pathsep?(req.path_info)
```
* 第二处
```js
break if base == "/"
+ base.force_encoding("UTF-8") #加入編碼
break unless File.directory?(File.expand_path(res.filename + base))
```