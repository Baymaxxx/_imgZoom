imgZoom插件：点击图片放大效果

使用方法：

    ①在页面中引入imgZoom.css和imgZoom.js。 

    ②在想放大的图片img标签添加class="imgZoom",
    如： <img src="../image/pic2.jpg" class="imgZoom" alt="pic2"/>

    ③配置显示框宽高，默认宽760，高500：
    如需修改，仅修改imgZoom.js中new imgZoom().init()中modalWidth和modalHeight的值即可。	
    new imgZoom().init({
        modalWidth:760,
        modalHeight:500
    });

兼容性：目前仅测试了chrome 和 IE7及以上，其他浏览器待测试。

