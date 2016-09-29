# jQ.js

基于jquery原理及方法封装的一个轻量级jQ库，兼容IE低版本浏览器，添加大量的动画效果扩展，只要会jquery的使用，就会使用jQ.js。

##操作说明
1. 使用前先需引包，即将jQ.js引入head标签内 如：`<script src="jQ/jQ.js"></script>` 

2. 模块化的API

	--获取Element的API：类选择器 、 标签选择器 、 id选择器 、 后代选择器 、 子代选择器 、 并集选择器

	--DOM操作模块的API：appendTo 、 append 、perpendTo 、 prepend 、 remove 、 next 、 nextAll
	
	--样式操作模块的API：css

	--属性操作模块的API：hasClass 、 addClass 、 removeClass 、 toggleClass 、 val 、 html 、 attr 、 text

	--事件模块的API：click 、 dbclick 、 mouseover 、 mouseout 、 mouseenter 、 mouseleave 、 keydown 、 keypress 、 keyup 、mousedown 、 mousemove 、 mouseup 、focus 、 blur 、scroll 、load 、 resize

	--独一无二的 hover 方法

	--新增的动画函数AIP：easeinQuad 、 easeoutQuad 、 easeinoutQuad 、 easeinCubic 、 easeoutCubic 、 easeinoutCubic 、 easeinQuart 、 easeoutQuart 、 easeinoutQuart 、 easeinQuint 、easeoutQuint 、easeinoutQuint 等

	--循环遍历API：each

	--去掉字符串前后空格：trim