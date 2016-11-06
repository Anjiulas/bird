/**
 * Created by Administrator on 2016/11/6.
 */

//全局变量区
var kongxi = 150;
window.onload=function(){
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var background = {
        positionX : 0,
        positionY : 0,
        width     : 288,
        height    : 512,
        bgImage   : (function(){var a = new Image() ; a.src = "img/bg_night.png";return a;}()),//在创建对象时 ,  会自动执行自调用函数 ,  子调用函数调用之后为我们返回一张背景图片
        draw      : function(){
            var _this = this;//
            // this.bgImage.onload = function(){
            //因为在onload事件中this指向onload前面的对象,在这里onload前是this.bgImage图片,所以this出现了问题 , 我们在onload外需要 把background保存一下再去使用
            context.drawImage(this.bgImage,_this.positionX,_this.positionY,_this.width,_this.height);
            // }
        }
    }
//障碍物
    var obstruction = {
        positionX : 288,
        positionY : Math.floor(Math.random()*229-228),
        createImg : (function(){   //createImg 是一个数组
            var imgs = [];
            var images = ["img/pipe_down.png","img/pipe_up.png"];
            for(var i=0; i< images.length; i++){
                var a = new Image();
                a.src = images[i];
                imgs.push(a);
            }
            return imgs;
        })(),
        draw     : function(){
            this.positionX -= 2;
            context.drawImage(this.createImg[0],this.positionX,this.positionY,52 , 320);
            context.drawImage(this.createImg[1],this.positionX,this.positionY+320 + kongxi,52 , 320);
            if(this.positionX <= -52){
                this.positionX = 288;
                this.positionY = Math.floor(Math.random()*229-228);
            }
        }
    }

//创建鸟
    var bird = {
        positionX : 80,
        positionY : 200,
        width     : 48,
        height    : 48,
        images    : ["img/bird0_0.png","img/bird0_1.png","img/bird0_2.png"],
        index     : 0,//当前是第几张图片
        wing      : setInterval(function(){
            bird.index ++;
        },200),
        currentImg   : function(){
            var a = new Image() ;
            a.src = this.images[this.index%3];
            return a;
        },
        draw      : function(){
            var _this = this;//
            this.bgImage = this.currentImg();
            // this.bgImage.onload = function(){
            //因为在onload事件中this指向onload前面的对象,在这里onload前是this.bgImage图片,所以this出现了问题 , 我们在onload外需要 把background保存一下再去使用
            _this.positionY += 5
            context.drawImage(this.bgImage,_this.positionX,_this.positionY,_this.width,_this.height);
            // }
        },
        clearTime : function (){
            clearInterval(this.wing)
        }
    }

//方法区
    function drawAll(){

        context.clearRect(0,0,288,512);
        background.draw();
        bird.draw();
        obstruction.draw();
    }

    document.onkeydown = function(e){
        e = e || window.event;
        var keycode = e.keyCode || e.which;
        if(keycode == 32){ //当我们点击空格时的操作

            bird.positionY -= 80;
        }
    }

    function judge(){
        //判断小鸟撞到天花板没有
        if(bird.positionY <= 0){
            clearInterval(timer)
            bird.clearTime();
        }
        //判断小鸟撞到了地板
        if(bird.positionY >= 512-48){
            clearInterval(timer)
            bird.clearTime();
        }
        //判断是否碰撞到了上水管
        if(bird.positionX + bird.width >= obstruction.positionX && bird.positionX <= obstruction.positionX + 52 && bird.positionY <= obstruction.positionY + 320){

            clearInterval(timer)
            bird.clearTime();
        }
        //判断下水管
        if(bird.positionX + bird.width >= obstruction.positionX && bird.positionX <= obstruction.positionX + 52 && bird.positionY + bird.height >= obstruction.positionY + 320 + kongxi){

            clearInterval(timer)
            bird.clearTime();
        }
    }

//方法调用区
    var timer = setInterval(function(){
        drawAll();
        judge()
    },30)

}
