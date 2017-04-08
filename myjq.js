function getStyle(elem,prop){
    if(elem.currentStyle){//ie
        return elem.currentStyle[prop];
    }else if(window.getComputedStyle){//标准浏览器
        return getComputedStyle(elem,false)[prop];
    }else{
        return elem.style[prop]//内联样式
    }
}
function addEvent(elem,type,handler){
    if(elem.addEventListener){
        elem.addEventListener(type,handler,false);
    }else if(elem.attachEvent){
        elem.attachEvent('on'+type,handler);
    }else{
        elem['on'+type]=handler;
    }
}
function getClass(clsName){
    if(document.getElementsByClassName){
        return document.getElementsByClassName(clsName);
    }
    var arr = [];
    var dom = document.getElementsByTagName("*");
    for(var i=0;i<dom.length;i++){
        if(dom[i].className==clsName){
            arr.push(dom[i]);
        }
    }
    return arr;
}
function $(args){
    return new MyJq(args);
}
function MyJq(args){
    this.elements = [];
    //先判断args的类型
    switch(typeof args){
        case 'function'://是个函数，就是文档就绪函数
            window.addEventListener('load',args,false);
            break;
        case 'string'://是不是选择器,可能是id tag class等
            var firstLetter = args.charAt(0);//取出字符串第一个字符
            //重点：为$符号返回一个自定义对象，可能$选中的元素不止一个，
            //可能需要给其中每一个元素都加上一个点击事件啥的，
            //所以需要是一个数组，遍历里面所有的元素，给每个元素绑定事件
            switch (firstLetter){
                case '#'://id选择器
                    this.elements.push(document.getElementById(args.substring(1)));
                    //不确定返回的数组还是单个对象，就直接都让都是数组
                    break;
                case '.'://class选择器
                    this.elements = getClass(args.substring(1));
                    break;
                default:
                    this.elements = document.getElementsByTagName(args);
            }
            break;
        case 'object':
            this.elements.push(args);
            break;
    }
}
MyJq.prototype.addClass = function(clsName){
    for(var i=0;i<this.elements.length;i++){
        var re = new RegExp("\\b"+clsName+"\\b",'g');
        if(!re.test(this.elements[i].className)){
            this.elements[i].className += ' '+clsName;
            this.elements[i].className = MyJq.trim(this.elements[i].className);
        }
    }
    return this;//如果想要链式操作，就在原型方法里也返回this，返回new出来的对象
};
MyJq.prototype.height = function(lg){
    if(lg){
        for(var i=0;i<this.elements.length;i++){
            this.elements[i].style.height = lg + 'px';
        }
        return this;
    }else{
        return getStyle(this.elements[0],'height');
    }

};
//封装事件的方法
MyJq.prototype.on = function(type,selector,fn){
    if(typeof selector=='string'){//取出事件源，判断其事件源和selector是不是一样
        for(var i=0;i<this.elements.length;i++){
            addEvent(this.elements[i],type,function(e){
                e = e||window.event;
                target = e.target||e.srcElement;
                switch(selector.charAt(0)){
                    case '.':
                        var string = target.className.split(" ");
                        for(var i=0;i<string.length;i++){
                            if(string[i]==selector.substring(1)){
                                alert(target.innerHTML);
                            }
                        }
                        break;
                    case '#':
                        if(target.id==selector.substring(1)){
                            alert(target.innerHTML);
                        }
                        break;
                    default:
                        if(target.tagName == selector.toUpperCase()){
                            alert(target.innerHTML);
                        }
                }

            });
        }
    }else if(typeof selector=='function'&&fn==""){
        for(var i=0;i<this.elements.length;i++){
            addEvent(this.elements[i],type,selector);
        }
    }else{
        return false;
    }
}
MyJq.trim = function(str){
    var re = /^\s+|\s+$/g;
    return str.replace(re,'');
};

