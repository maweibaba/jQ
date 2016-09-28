/**
 * Created by Administrator on 2016/9/23.
 */

(function(window){
    //公用的一些属性或者是方法
    var arr = [],
        push = arr.push,
        sort = arr.sort,
        slice = arr.slice,
        splice = arr.splice;

    //浏览器的能力检测
    var support = {};
    support.getElementsByClassName = function(){

        var rnative = /^[^{]+\{\s*\[native \w/;
        return rnative.test(document.getElementsByClassName);
    }();

    // 用来检测：是否支持 addEventListener
    support.addEventListener = !!window.addEventListener;
    // 用来检测：是否支持 attachEvent
    support.attachEvent = !!support.attachEvent;
    // 用来检测：是否支持 removeEventListener
    support.removeEventListtener = !!window.removeEventListener;
    // 用来检测：是否支持 detachEvent
    support.detachEvent = !!window.detachEvent;


    //核心构造函数
    var jQ = function(selector,context){
      return new jQ.fn.init(selector);
    };

    //核心原型
    jQ.fn = jQ.prototype = {
        constructor:jQ,
        length:0,
        selector:"",
        init:function(selector,context){
            //不合法值：null/undefined/0/""
            if(!selector){
                return this;
            }

            //字符串参数
            if(jQ.isString(selector)){
                var first = selector.charAt(0);
                if(first === "<"){
                    push.apply(this, parseHTML(selector));
                }else {
                    push.apply(this, jQ.select(selector,context));
                    //对象数组（伪数组）
                    this.selector = selector;
                }
                return this;
            }

            //DOM对象
            if(jQ.isDom(selector)){
                this[0] = selector;
                this.length = 1;
                return this;
            }

            //jQ对象
            if(jQ.isjQ(selector)){
                return selector;
            }

            //参数为函数（入口函数）
            if(jQ.isFunction(selector)){
                //只能实现多次绑定onload事件
                //但是，无法改变执行时机
                var oldFn = window.onload;
                if(!jQ.isFunction(oldFn)){
                    window.onload = selector;
                }else {
                    window.onload = function(e){
                        oldFn();
                        selector();
                    }
                }
            }
            //DOM对象数组（伪数组）
            if(jQ.isLikeArray(selector)){
                push.apply(this, selector);
                return this;
            }


            //以上处理结束之后，在调用这个jQ函数，返回的结构都是伪数组
        },
        slice:slice,
        sort: sort,
        push: push,
        splice: splice

    };

    //根据html字符串创建对象的函数
    var parseHTML = function(htmlString){
        var results = [];
        var dv = document.createElement("div");
        dv.innerHTML = htmlString;
        results.push.apply(results, dv.childNodes);
        return results;
    };


    //修改原型链的指向
    jQ.fn.init.prototype = jQ.prototype;

    //给框架提供扩展的功能
    jQ.extend = jQ.fn.extend = function(obj){
        var k;
        for(k in obj){
            this[k] = obj[k];
        }
    };


    //作为静态成员来调用
    jQ.extend({
        each:function(obj,callback){
            var i, length;
            if(jQ.isLikeArray(obj)){
                length = obj.length;
                //数组
                for(i = 0; i < length; i++){
                    if(callback.call(obj[i], i, obj[i]) === false){
                        break;
                    }
                }
            }else {
                //对象
                for(i in obj){
                    if(callback.call(obj[i], i, obj[i]) === false){
                        break;
                    }
                }
            }
        },
        trim:function(str){
            if(String.prototype.trim){
                return str.trim();
            }else {
                return str.replace(/^\s+|\s+$/,"");
            }
        }
    });

    //作为实例成员来调用
    jQ.fn.extend({
        each:function(callback){
            jQ.each(this,callback);
            return this;
        }
    });


    //类型判断模块
    jQ.extend({
        isString:function(obj){
            return typeof obj === "string";
        },
        isDom:function(obj){
            return !!obj.nodeType;
        },
        isLikeArray:function(obj){
           return obj && obj.length >=0;
        },
        isjQ:function(obj){
            return "selector" in obj;
        },
        isFunction:function(obj){
            return typeof obj === "function";
        }
    });

    //获取指定的下一个元素节点
    jQ.extend({
        nextSibling:function(node){
            while(node = node.nextSibling){
                if(node.nodeType === 1){
                    return node;
                }
            }
            return null;
        },
        nextSiblingAll:function(node){
            var arr= [];
            while(node = node.nextSibling){
                if(node.nodeType === 1){
                    arr.push(node);
                }
            }
            return arr;
        },
        getTxtContent:function(node){
            var cNodes = node.childNodes,
                txtArr = [];
            jQ.each(cNodes,function(){
               if(this.nodeType === 3){
                   //获取文本节点内容
                   txtArr.push(this.nodeValue);
               }else if(this.nodeType === 1){
                   txtArr = txtArr.concat(jQ.getTxtContent(this));
               }
            });
            return txtArr.join("");
        }
    });

    //DOM操作模块
    jQ.fn.extend({
        appendTo:function(selector){
            var target = jQ(selector),
                source = this,
                currentTarget = null,
                targetLen = target.length - 1,
                arr = [],
                node = null;
            target.each(function(index){
                currentTarget = this;
                source.each(function(){
                    node = (index === targetLen)?this:this.cloneNode(true);
                    currentTarget.appendChild(node);
                    arr.push(node);
                });
            });

            return jQ(arr);
        },
        append:function(selector){
            jQ(selector).appendTo(this);
            return this;
        },
        prependTo:function(selector){
            var target = jQ(selector),
                source = this,
                arr = [],
                node = null;
            [].reverse.call(source);
            target.each(function(index,value){
               source.each(function(){
                   node = (index === target.length - 1)?this:this.cloneNode(true);
                   value.insertBefore(node,value.firstChild);
                   arr.push(node);
               });
            });
            return jQ(arr);

        },
        prepend:function(){
            jQ(selector).prependTo(this);
            return this;
        },
        remove:function(){
            return this.each(function(){
                this.parentNode.removeChild(this);
            });
        },
        next:function(){
            var arr = [],
                node = null;
            this.each(function(){
               node = jQ.nextSibling(this);
                if(node !== null){
                    arr.push(node);
                }
            });
            return jQ(arr);
        },
        nextAll:function(){
            var arr = [];
            this.each(function(){
               // arr = arr.concat(jQ.nextSiblingAll(this));
                //去重操作
                var tempList = jQ.nextSiblingAll(this);
                jQ.each(tempList,function(){
                    var i = arr.indexOf(this);
                    if(i === -1){
                        arr.push(this);
                    }
                });

            });
            return jQ(arr);
        }
    });






    //样式操作模块
    jQ.fn.extend({
       css:function(name,value){
           //判断参数个数
           if(value === undefined){
               if(typeof name === "object"){
                   return this.each(function(){
                        var self = this;
                       jQ.each(name,function(key,value){
                          self.style[key] = value;
                       });
                   });
               }
               //读取样式
               if(window.getComputedStyle){
                   return window.getComputedStyle(this[0])[name];
               }else {
                   return this[0].currentStyle[name];
               }
           }
           return this.each(function(){
              this.style[name] = value;
           });
       }
    });

    //属性操作模块
    jQ.fn.extend({
        //判断类
        hasClass:function(name){
            var hasCls = false;
            this.each(function(){
                var clsName = this.className.trim();
                if((" " + clsName + " ").indexOf(" " + name + "") > -1){
                    hasCls = true;
                    return false;
                }
            });
            return hasCls;
        },
        //添加类
        addClass: function(name) {
            return this.each(function() {
                var clsName = this.className.trim();
                clsName += " " + name;
                this.className = clsName.trim();
            });
        },
        //移除类
        removeClass: function(name) {
            var fn = function() {
                var clsName = " " + this.className.trim() + " ";
                while(clsName.indexOf(" " + name + " ") > -1) {
                    clsName = clsName.replace(" " + name + " ", " ");
                }
                this.className = clsName.trim();
            };
            return this.each(fn);
        },
        //切换类
        toggleClass:function(name){
            this.each(function(){
                jQ(this).hasClass(name)
                    ?jQ(this).removeClass(name)
                    :jQ(this).addClass(name);
            });
        }
    });

    jQ.fn.extend({
       val:function(v){
           //读取
           if(arguments.length === 0){
               return this[0].value;
           }
           if(v === null || v === undefined){
               this[0].value = "";
           }
           //设置
           return this.each(function(){
               this.value = v;
           });
       },
        html:function(htmlString){
           //读取
           if(htmlString === undefined){
               return this[0].innerHTML;
           }
           //设置
            return this.each(function(){
               this.innerHTML = htmlString;
            });
        },
        attr:function(name,value){
            var booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
            if(arguments.length === 1){
               if(booleans.indexOf(name) > -1){
                   return this[0][name];
               }else {
                   return this[0].getAttribute(name);
               }
            }

            if(booleans.indexOf(name) > -1){
                this.each(function(){
                    this[name] = value;
                });
            }else {
                this.each(function(){
                    this.setAttribute(name,value);
                });
            }
            return this;
        },
        text:function(str){
            if(typeof str === "undefined"){
                var txtArr = [];
                if("textContent" in this[0]){
                    this.each(function(){
                        txtArr.push(this.textContent);
                    });
                }else {
                    this.each(function(){
                        txtArr.push(jQ.getTxtContent(this));
                    });
                }
               return txtArr.join("");
            }

            if("textContent" in this[0]){
                this.each(function(){
                   this.textContent = str;
                });
            }else {
                this.each(function(){
                    this.innerHTML = "";
                    //将字符串转化为文本节点
                    var txtNode = document.createTextNode(str);
                    //appendChild只能追加节点
                    this.appendChild(txtNode);
                });
            }
        }
    });

    //事件模块
    jQ.fn.extend({
        on:function(eventName,handler){
            if(support.addEventListener){
                this.each(function(){
                   this.addEventListener(eventName, handler, false);
                });
            }else if(support.attachEvent){
                this.each(function(){
                    var self = this;
                    this.attachEvent("on" + eventName, function(){
                       handler(self, window.event);
                    });
                });
            }else {
                var name = "";
                this.each(function(){
                    var self = this;
                    name = "on" + eventName;
                    var oldFn = this[name];
                    if(typeof oldFn !== "function"){
                        this[name] = function(e){
                            var event = e || window.event;
                            handler.call(self, event);
                        };
                    }else {
                        this[name] = function(e){
                            var event = e || window.event;
                            oldFn.call(self,event);
                            handler.call(self,event);
                        }
                    }
                });
            }
            return this;
        },
        off:function(eventName, handler){
            if(support.removeEventListener){
                this.each(function(){
                    this.removeEventListener(eventName, handler, false);
                });
            }else if(support.detachEvent){
                this.each(function(){
                    this.each(function(){
                        var self = this;
                        this.detachEvent("on" + eventName, function(){
                            handler(self, window.event);
                        });
                    });
                });
            }else {
                this.each(function(){
                    this["on" + eventName] = null;
                });
            }
            return this;
        }
    });

    //单个事件绑定
    var eventNameList =
        ("click dbclick mouseover mouseout mouseenter mouseleave " +
        "keydown keypress keyup " +
        "mousedown mousemove mouseup " +
        "focus blur " +
        "scroll load resize").split(" ");
    jQ.each(eventNameList, function(index,value){
        jQ.fn[value] = function(handler){
           return this.on(value,handler);
        }
    });


    //给框架添加hover方法
    jQ.fn.extend({
        hover:function(fn1, fn2){
            if(fn2 === undefined){
                return this.mouseenter(fn1).mouseleave(fn1);
            }
            return this.mouseenter(fn1).mouseleave(fn2);
        }
    });


    //动画模块


    //选择器模块
    var select = (function(){


       //通过标签名获取元素
        var getElesByTag = function(tagName, context, results){
            results = results || [];
            context = context || document;
            results.push.apply(results,context.getElementsByTagName(tagName));
            return results;
        };

        // 封装通过id来获取元素
        var getElmById = function(id, results) {
            // 作用：初始化参数
            results = results || [];

            results.push( document.getElementById(id) );
            return results;
        };

        //通过类名获取，实现兼容所有的浏览器
        var getElmsByClsName = function(className, context, results){
            results = results || [];
            context = context || document;
            if(support.getElementsByClassName){
                results.push.apply(results, context.getElementsByClassName(className));
            }else {
                jQ.each(getElesByTag("*",context),function(){
                    if((" " + this.className + " ").indexOf(" " + className + " ") > -1){
                        results.push(this);
                    }
                });
            }
            return results;
        };

        // 匹配选择器的正则表达式（简单选择器的匹配）
        var rquickExpr = /^(?:#([\w-]+)|\.([\w-]+)|([\w-]+)|(\*))$/;

        // 实现get函数的功能
        var get = function(selector, context, results) {
            results = results || [];
            context = context || document;

            var m = rquickExpr.exec(selector);
            if(m !== null) {
                if(context.nodeType) {
                    context = [context];
                }
                if(jQ.isString(context)) {
                    context = get(context);
                }

                jQ.each(context, function(index, value) {
                    if(m[1]) {
                        results.push.apply(results, getElmById(m[1]) );
                    } else if(m[2]) {
                        results.push.apply( results, getElmsByClsName(m[2], this) );
                    } else {
                        results.push.apply( results, getElesByTag(selector, this) );
                    }
                });
            }
            return results;
        };

        // 选择器模块核心函数
        var select = function(selector, context, results) {
            results = results || [];
            context = context || document;

            if(!selector) {
                return results;
            }

            jQ.each( selector.split(","), function(index, value) {
                var ctx = context;
                jQ.each(value.trim().split(" "), function(index1, value1) {
                    if(value1 !== "") {
                        ctx = get(value1, ctx);
                    }
                });

                results.push.apply(results, ctx);
            });

            return results;
        };

        return select;

    })();

    jQ.extend({
        select:select
    });

    //暴露jQ
    window.Q = window.jQ = jQ;

})(window);