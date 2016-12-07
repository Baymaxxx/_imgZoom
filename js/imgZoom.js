;(function () {
    var imgZoom = function (config) {
        this.config = {
            imgSrc:'',
            imgAlt:'',
            w$h:0,
            windowWidth:0,
            windowHeight:0,
            //弹出框宽高
            modalWidth:760,
            modalHeight:500,
            offsetML:'',
            offsetMT:'',
            offsetT:'',
            offsetW:'',
            offsetH:''
        }
    };
    var self, config;
    imgZoom.prototype = {
        //事件 兼容IE和非IE浏览器
        addEvent:function (element, event, listener) {
            if (window.addEventListener){
                element.addEventListener(event,listener,!1);
            }else{
                element.attachEvent('on'+event,listener);
            }
        },
        removeEvent:function (obj, sType, fn) {
            if (window.removeEventListener) {
                obj.removeEventListener(sType, fn, false);
            } else {
                obj.detachEvent('on' + sType, fn);
            }
        },
        prEvent:function (ev) {
            var oEvent = ev || window.event;
            if (oEvent.preventDefault) {
                oEvent.preventDefault();
            }
            return oEvent;
        },
        //添加滑轮事件
        addWheelEvent:function (obj, callback) {
            if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
                self.addEvent(obj, 'DOMMouseScroll', wheel);
            } else {
                self.addEvent(obj, 'mousewheel', wheel);
            }
            function wheel(ev) {
                var oEvent = self.prEvent(ev),
                    delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0;
                callback && callback.call(oEvent, delta);
                return false;
            }
        },
        //兼容getElementsByClassName
        getByClassName: function () {
            if (!document.getElementsByClassName) {
                document.getElementsByClassName = function (className, element) {
                    var children = (element || document).getElementsByTagName('*');
                    var elements = new Array();
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        var classNames = child.className.split(' ');
                        for (var j = 0; j < classNames.length; j++) {
                            if (classNames[j] == className) {
                                elements.push(child);
                                break;
                            }
                        }
                    }
                    return elements;
                };
            }
        },
        //点击事件回调
        clickFun: function (event) {
            var currTarget = event.target||event.srcElement;
            config.imgSrc = currTarget.src;
            config.imgAlt = currTarget.alt;
            //图片宽高比
            config.w$h = currTarget.width/currTarget.height;
            self.addModal();
            //放大后图片事件
            var $oImg = document.getElementById('modalImg');
            self.addEvent($oImg,'mousedown', function(ev) {
                var oEvent = self.prEvent(ev),
                    oParent = $oImg.parentNode,
                    disX = oEvent.clientX - $oImg.offsetLeft,
                    disY = oEvent.clientY - $oImg.offsetTop,
                    startMove = function(ev) {
                        if (oParent.setCapture) {
                            oParent.setCapture();
                        }
                        var oEvent = ev || window.event,
                            l = oEvent.clientX - disX,
                            t = oEvent.clientY - disY;
                        $oImg.style.left = l +'px';
                        $oImg.style.top = t +'px';
                        $oImg.style.marginLeft ='0';
                        $oImg.style.marginTop ='0';
                        oParent.onselectstart = function() {
                            return false;
                        }
                    },
                    endMove = function(ev) {
                        if (oParent.releaseCapture) {
                            oParent.releaseCapture();
                        }
                        oParent.onselectstart = null;
                        self.removeEvent(oParent, 'mousemove', startMove);
                        self.removeEvent(oParent, 'mouseup', endMove);
                    };
                self.addEvent(oParent, 'mousemove', startMove);
                self.addEvent(oParent, 'mouseup', endMove);
                return false;
            });
            /*以鼠标位置为中心的滑轮放大功能*/
            self.addWheelEvent($oImg, function(delta) {
                var modalDivW = document.getElementById('modalDiv').offsetLeft;
                var modalDivH = document.getElementById('modalDiv').offsetTop;
                var mTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                var ratioL = (this.clientX - $oImg.offsetLeft - modalDivW) / $oImg.offsetWidth,
                    ratioT = (this.clientY - $oImg.offsetTop - modalDivH + mTop) / $oImg.offsetHeight,
                    ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1,
                    w = parseInt($oImg.offsetWidth * ratioDelta),
                    h = parseInt($oImg.offsetHeight * ratioDelta),
                    l = Math.round(this.clientX - (w * ratioL)),
                    t = Math.round(this.clientY - (h * ratioT));
                with($oImg.style) {
                    width = w +'px';
                    height = h +'px';
                    left = l - modalDivW +'px';
                    top = t - modalDivH + mTop +'px';
                    marginLeft = 0;
                    marginTop = 0;
                }
            });
            var modalDiv = document.getElementById('modalDiv');
            var mTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                mLeft = document.body.scrollLeft,
                mcHeight = 600,
                mcWidth = document.body.clientWidth;
            modalDiv.style.left = mLeft + mcWidth/2 + 'px';
            modalDiv.style.top = mTop + mcHeight/2 + 'px';
            self.dblClickFun();
        },
        dblClickFun:function (event) {
            var modalImg = document.getElementById("modalImg");
            self.addEvent(modalImg,'dblclick',function () {
                modalImg.style.marginLeft = config.offsetML;
                modalImg.style.marginTop = config.offsetMT;
                modalImg.style.top = config.offsetT;
                modalImg.style.left = "50%";
                modalImg.style.width = config.offsetW;
                modalImg.style.height = config.offsetH;
            });
        },
        appendImg: function () {
            var imgOuterHtml = document.createElement("div");
            imgOuterHtml.id = 'imgOuter';
            document.getElementById('modalDiv').appendChild(imgOuterHtml);
            var imgHtml = document.createElement("img");
            imgHtml.id = "modalImg";
            imgHtml.src = config.imgSrc;
            imgHtml.title = "滚动鼠标滚轮缩放图片";
//                imgHtml.style.width = '100%';
            var imgOuter =  document.getElementById('imgOuter');
            imgOuter.appendChild(imgHtml);
            var modalImg = document.getElementById('modalImg');
            var imgOuterHeight = imgOuter.offsetHeight;
            var modalImgHeight = modalImg.height;
                if(modalImgHeight > imgOuterHeight){
                    modalImg.style.height = imgOuterHeight + 'px';
                    modalImg.style.width = imgOuterHeight*config.w$h + 'px';
                }
                imgHtml.style.marginLeft = '-' + modalImg.width/2 + 'px';
                imgHtml.style.marginTop = '-' + modalImg.height/2 + 'px';
            //0.92=>总高度-按钮占的8%;
            imgHtml.style.top = config.modalHeight*0.92*0.5 + 'px';
            config.offsetML = imgHtml.style.marginLeft;
            config.offsetMT = imgHtml.style.marginTop;
            config.offsetT =  imgHtml.style.top;
            config.offsetW = modalImg.style.width;
            config.offsetH = modalImg.style.height;
        },
        //模态框背景
        addModal: function () {
            //这里取出当前窗口的长与宽。兼容各个浏览器，有滚动条没有滚动条的情况。
            if(document.documentElement.scrollWidth<document.documentElement.clientWidth+document.documentElement.scrollLeft){
                config.windowWidth=document.documentElement.clientWidth+document.documentElement.scrollLeft;
            }
            else{
                config.windowWidth=document.documentElement.scrollWidth;
            }
            if(document.documentElement.scrollHeight<document.documentElement.clientHeight+document.documentElement.scrollTop){
                config.windowHeight=document.documentElement.clientHeight+document.documentElement.scrollTop;
            }
            else{
                config.windowHeight=document.documentElement.scrollHeight;
            }
            var modalDivHtml = document.createElement("div");
            modalDivHtml.id = "modalDiv";
            modalDivHtml.style.width = config.modalWidth + 'px';
            modalDivHtml.style.height = config.modalHeight + 'px';
            modalDivHtml.style.marginLeft ='-' + config.modalWidth/2 + 'px';
            modalDivHtml.style.marginTop ='-' + config.modalHeight/2 + 'px';
            document.body.appendChild(modalDivHtml);
            var inputHtml = document.createElement("input");
            inputHtml.id = "closeBtn";
            inputHtml.type = "button";
            inputHtml.value = "关闭";
            document.getElementById('modalDiv').appendChild(inputHtml);
            var inputHtml = document.createElement("p");
            inputHtml.id = "m-tip";
            inputHtml.innerHTML = "请滚动鼠标滚轮缩放图片," + "<br/>" + "按住鼠标左键进行图片拖拽。";
            document.getElementById('modalDiv').appendChild(inputHtml);
            var bodyMask=document.createElement("div");
            bodyMask.id="bodyMask";
            //这个灰色遮罩层的长与宽就是当前窗口的长与宽。
            bodyMask.style.width=config.windowWidth+"px";
            bodyMask.style.height=config.windowHeight+"px";
            //在body节点下添加这个div
            document.body.appendChild(bodyMask);
            self.appendImg();
            self.removeAll();
        },
        removeAll: function () {
            var modalDiv = document.getElementById('modalDiv');
            var bodyMask = document.getElementById('bodyMask');
            var closeBtn = document.getElementById('closeBtn');
            function removeChild(){
                document.body.removeChild(modalDiv);
                document.body.removeChild(bodyMask);
            }
            if(closeBtn) {
                self.addEvent(closeBtn, 'click', removeChild);
            }
        },
        init: function (data) {
            self = this;config = this.config;
            for(var name in this.config){
                if(data && data[name]) {
                    this.config[name] = data[name];
                }
            }
            self.getByClassName();
            var $img = document.getElementsByClassName('imgZoom');
            for(var i = 0;i < $img.length;i++){
                self.addEvent($img[i],'click',self.clickFun);
            };
        }
    };
    window.imgZoom = imgZoom;
})();
window.onload = function () {
    new imgZoom().init({
        modalWidth:760,
        modalHeight:500
    });
}
