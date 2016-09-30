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
    var easingFnList = {
        linear: function(x, t, b, c, d) {
            return t * (c - b) / d;
        },
        swing: function(x, t, b, c, d) {
            var a = 2 * (c - b) / (d * d),
                v_0 = a * d;
            return v_0 * t - 1/2 * a * t * t;
        },
        easeinQuad: function (x, t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeoutQuad: function (x, t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeinoutQuad: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeinCubic: function (x, t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },
        easeoutCubic: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeinoutCubic: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },
        easeinQuart: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },
        easeoutQuart: function (x, t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeinoutQuart: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        easeinQuint: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },
        easeoutQuint: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeinoutQuint: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },
        easeinSine: function (x, t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeoutSine: function (x, t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeinoutSine: function (x, t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },
        easeinExpo: function (x, t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeoutExpo: function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeinoutExpo: function (x, t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeinCirc: function (x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeoutCirc: function (x, t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeinoutCirc: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },
        easeinElastic: function (x, t, b, c, d, a, p) {
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeinBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeoutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeinoutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeoutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        }
    };

    //维护一个键值对
    var targetKV = {
      left: "offsetLeft",
      top: "offsetTop",
      width: "offsetWidth",
       height: "offsetHeight"
    };

    //用来获取起始位置
    var getStartPosition = function(node,target){
        var o = {};
        for(var k in target){
            o[k] = node[targetKV[k]];
        }
        return o;
    };

    //用来获取总的距离
    var getTotalDistance = function(node,target){
        var o = {};
        for(var k in target){
            o[k] =target[k] - node[targetKV[k]];
        }
        return o;
    };

    //用来获取已经经过的距离
    var getTween = function(x, t, startPositions, target, duration, easing){
        var o = {};
        for(var k in target){
            o[k] =easingFnList[easing](null, t, startPositions[k], target[k],duration);
        }
        return o;
    };

    //用来设置样式
    var setStyle = function(node, target, startPositions, tweens){
        for(var k in target){
           node.style[k] = startPositions[k] + tweens[k] + "px";
        }
    };

    jQ.fn.extend({
       animate:function(target, duration, easing){
           var node  = this[0];

           var startPositions = getStartPosition(node,target),
              totalDistance = getTotalDistance(node, target),
               startTime = +new Date,
               passingTime = 0,
               timerId = null,
               tweens = 0;
           var play = function(){
               passingTime = +new Date - startTime;
               if(passingTime >= duration){
                   tweens = totalDistance;
                   clearInterval(timerId);
               }else {
                   tweens = getTween(null, passingTime, startPositions, target, duration, easing);
               }
               setStyle(node, target, startPositions, tweens);
           };

           play();
           timerId = setInterval(play, 20);

       }
    });



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
