/*
 * 作者：sym
 * 简介：任意四边形图像变为矩形
 */

/*import {
    getMatrix, perspectiveTransform
} from "./PerspectiveTransform.js"*/


var v_width = 320
var v_height = 480

var p_r = 4
var touch_area = 10
var point_idx = -1

var storeCanvas
var debugText

//从左上开始顺时针旋转
var points = [
    {x: 90,y: 120},
    {x: 240,y: 120},
    {x: 300,y: 450},
    {x: 30,y: 450}
]

window.onload = function(){
    var canvas = document.getElementById('canvas1')
    var g = canvas.getContext('2d')

    debugText = document.getElementById("debug")
    debugText.innerText = "ddb"

    //注册事件
    canvas.addEventListener("mousedown",doMouseDown,false);
    canvas.addEventListener("mouseup",doMouseUp,false);
    canvas.addEventListener("mousemove",doMouseMove,false);
    canvas.addEventListener("mouseout",doMouseOut,false);
    canvas.addEventListener("touchstart",doTouchDown,false)
    canvas.addEventListener("touchmove",doTouchMove,false)
    canvas.addEventListener("touchend",doTouchUp,false)

    storeCanvas = document.createElement("canvas")
    storeCanvas.setAttribute("width",""+v_width)
    storeCanvas.setAttribute("height",""+v_height)
}

live = function() {
            let constraints = {
                video: {width: v_width, height: v_height},
                audio: true
            };
            //获得video摄像头区域
            let video1 = document.getElementById("video1");
            let promise = navigator.mediaDevices.getUserMedia(constraints);
            promise.then(function (MediaStream) {
                video1.srcObject = MediaStream;
                video1.play();
            });
        }
 
takePhoto = function() {
      let vid1 = document.getElementById("video1");
      let can1 = document.getElementById("canvas1");
      let ctx = can1.getContext('2d');
      ctx.drawImage(vid1, 0, 0, v_width, v_height);

      var ctStore = storeCanvas.getContext('2d')
      ctStore.drawImage(vid1, 0, 0, v_width, v_height)
      }
quadrangle = function() {
    let can1 = document.getElementById("canvas1");
    var ct=can1.getContext("2d");
    //画四边形
    ct.beginPath();
    ct.moveTo(points[0].x,points[0].y);  // x0, y0 四边形左上角
    for(var i = 0; i < points.length; i++)
        ct.lineTo(points[(i+1)%4].x,points[(i+1)%4].y);
    ct.closePath();
    ct.stroke();

    //画端点
    for(var i = 0; i < points.length; i++)
    {
        ct.fillStyle = "#fa0022"
        ct.beginPath();
        ct.arc(points[i].x,points[i].y,p_r,0,2*Math.PI);
        ct.fill()
    }
    
}

//鼠标按下响应事件
function doMouseDown(event) {
    var x = event.pageX;
    var y = event.pageY;
    var loc = getLocation(x,y)
    
    point_idx = -1
    for(var i = 0; i < 4; i++)
    {
        if(Math.pow(points[i].x-loc.x,2)+Math.pow(points[i].y-loc.y,2) < Math.pow(touch_area,2))
        {
            point_idx = i;
            break;
        }
    }
    //console.log(point_idx)
}
 
function doMouseUp(event) {
    point_idx = -1
}
function doMouseMove(event) {
    var x = event.pageX;
    var y = event.pageY;
    var loc = getLocation(x,y)

    if(point_idx != -1)
    {
        points[point_idx].x = loc.x
        points[point_idx].y = loc.y
        var ctx = document.getElementById("canvas1").getContext('2d')
        ctx.drawImage(storeCanvas, 0, 0, v_width, v_height)
        quadrangle()
    }
}
function doMouseOut(event) {
    var x = event.pageX;
    var y = event.pageY;
}
function doTouchDown(event) {
    var x = event.touches[0].pageX;
    var y = event.touches[0].pageY;
    var loc = getLocation(x,y)
    alert(x+":"+y)
    
    point_idx = -1
    for(var i = 0; i < 4; i++)
    {
        if(Math.pow(points[i].x-loc.x,2)+Math.pow(points[i].y-loc.y,2) < Math.pow(touch_area+3,2))
        {
            point_idx = i;
            break;
        }
    }
}
function doTouchMove(event) {
    var x = event.touches[0].pageX;
    var y = event.touches[0].pageY;
    var loc = getLocation(x,y)

    if(point_idx != -1)
    {
        points[point_idx].x = loc.x
        points[point_idx].y = loc.y
        var ctx = document.getElementById("canvas1").getContext('2d')
        ctx.drawImage(storeCanvas, 0, 0, v_width, v_height)
        quadrangle()
    }
}
function doTouchUp(event) {
    point_idx = -1
}
 
//获取当前鼠标点击的相对坐标
function getLocation(x, y) {
    var canvas = document.getElementById('canvas1')
    var bbox = canvas.getBoundingClientRect();
    return {
        x: (x - bbox.left) * (canvas.width / bbox.width),
        y: (y - bbox.top) * (canvas.height / bbox.height)
    };
}



test1rev = function() {  // 类似负片效果
    let can1 = document.getElementById("canvas1");
    var ct=can1.getContext("2d");
    var im=ct.getImageData(0,0, can1.width,can1.height);
    for (var i=0;i<im.data.length/4;i++)
    {
        im.data[4*i]=255-im.data[4*i];
        im.data[4*i+1]=255-im.data[4*i+1];
        im.data[4*i+2]=255-im.data[4*i+2];
        //im.data[4*i+3] alpha
    }
    // 把结果呈现在新的画布上
    let can2 = document.getElementById("canvas2");
    var ct2=can2.getContext("2d");
    ct2.putImageData(im,0,0)
}
test2grey = function() {
    var can1 = document.getElementById("canvas1");
    var ct=can1.getContext("2d");
    var wid=can1.width;
    var im=ct.getImageData(0,0, wid, can1.height);
    for (var y=0; y<can1.height; y++)
    {
        for (var x=0; x<wid; x++)
        {
            var grey = im.data[(y*wid+x)*4]*0.3 +
                       im.data[(y*wid+x)*4+1]*0.59 +
                       im.data[(y*wid+x)*4+2]*0.11;
            im.data[(y*wid+x)*4+0] = grey;
            im.data[(y*wid+x)*4+1] = grey;
            im.data[(y*wid+x)*4+2] = grey;
        }      
    }

    let can2 = document.getElementById("canvas2");
    var ct2=can2.getContext("2d");
    ct2.putImageData(im, 0,0)
}

affine = function() {
    var points2 = [
        {x: 0,y: 0},
        {x: 0,y: 0},
        {x: 0,y: 0},
        {x: 0,y: 0},
    ]

    var stct = storeCanvas.getContext('2d')
    var img = stct.getImageData(0,0,v_width,v_height)

    var can2 = document.getElementById("canvas2")
    var ct2 = can2.getContext('2d')
    var img2 = ct2.createImageData(v_width,v_height)

    var min_x = points[0].x
    var max_x = points[0].x
    var min_y = points[0].y
    var max_y = points[0].y
    for(var i = 0; i < 4; i++)
    {
        min_x = Math.min(points[i].x,min_x)
        max_x = Math.max(points[i].x,max_x)
        min_y = Math.min(points[i].y,min_y)
        max_y = Math.max(points[i].y,max_y)
    }
    points2[0].x = min_x
    points2[0].y = min_y
    points2[1].x = max_x
    points2[1].y = min_y
    points2[2].x = max_x
    points2[2].y = max_y
    points2[3].x = min_x
    points2[3].y = max_y

    //var trans_matrix = getMatrix(points,points2)
    var trans_matrix = getMatrix(points2,points)

    for(var y = 0; y < v_height; y++)
    {
        for(var x = 0; x < v_width; x++)
        {
            var i = (y*v_width+x)*4
            if(x>=min_x&&x<=max_x&&y>=min_y&&y<=max_y)
            {
                var op = [{x:0,y:0}]
                op.x = x
                op.y = y
                var np = perspectiveTransform(op,trans_matrix)
                var j = (np.y*v_width+np.x)*4
                img2.data[i] = img.data[j]
                img2.data[i+1] = img.data[j+1]
                img2.data[i+2] = img.data[j+2]
                img2.data[i+3] = img.data[j+3]
            }
            else
            {
                img2.data[i] = img.data[i]
                img2.data[i+1] = img.data[i+1]
                img2.data[i+2] = img.data[i+2]
                img2.data[i+3] = img.data[i+3]
            }
        }
    }

    ct2.putImageData(img2,0,0);
}











/*
 * 作者：sym
 * 简介：进行透视变换
 * 参考：https://blog.csdn.net/m0_43609475/article/details/112847314
 */


function perspectiveTransform(points,matrix)
{
    var new_point = {x:0 ,y:0};
    var temp = (matrix[6][0]*points.x+matrix[7][0]*points.y+1)
    new_point.x = parseInt((matrix[0][0]*points.x+matrix[1][0]*points.y+matrix[2][0])/temp)
    new_point.y = parseInt((matrix[3][0]*points.x+matrix[4][0]*points.y+matrix[5][0])/temp)
    return new_point
}

//求透视变换矩阵，point1为变换前，point2为变换后
function getMatrix(points1,points2)
{
    var A = [
        [0,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,0],
        [0,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,0],
        [0,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,0],
        [0,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,0]
    ]
    var B = [
        [0],[0],[0],[0],[0],[0],[0],[0]
    ]
    for(var i = 0; i < 4; i++)
    {
        A[i*2][0] = points1[i].x
        A[i*2][1] = points1[i].y
        A[i*2][6] = -points1[i].x*points2[i].x
        A[i*2][7] = -points1[i].y*points2[i].x

        A[i*2+1][3] = points1[i].x
        A[i*2+1][4] = points1[i].y
        A[i*2+1][6] = -points1[i].x*points2[i].y
        A[i*2+1][7] = -points1[i].y*points2[i].y

        B[i*2][0] = points2[i].x
        B[i*2+1][0] = points2[i].y
    }
    var inv_A = inv(A)
    return multiply(inv_A,B)
}








/*
 * 作者：sym(copy)
 * 简介：矩阵基本算法
 * 参考：https://blog.csdn.net/XY1790026787/article/details/106144101
 */


//相乘
function multiply(a, b) {
    // 相乘约束
    if (a[0].length !== b.length) {
        throw new Error();
    }
    let m = a.length;
    let p = a[0].length;
    let n = b[0].length;

    // 初始化 m*n 全 0 二维数组
    let c = new Array(m).fill(0).map(arr => new Array(n).fill(0));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < p; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return c;
}

//行列式
function det(square) {
    // 方阵约束
    if (square.length !== square[0].length) {
        throw new Error();
    }
    // 方阵阶数
    let n = square.length;

    let result = 0;
    if (n > 3) {
        // n 阶
        for (let column = 0; column < n; column++) {
            // 去掉第 0 行第 column 列的矩阵
            let matrix = new Array(n - 1).fill(0).map(arr => new Array(n - 1).fill(0));
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - 1; j++) {
                    if (j < column) {
                        matrix[i][j] = square[i + 1][j];
                    } else {
                        matrix[i][j] = square[i + 1][j + 1];
                    }
                }
            }
            result += square[0][column] * Math.pow(-1, 0 + column) * det(matrix);
        }
    } else if (n === 3) {
        // 3 阶
        result = square[0][0] * square[1][1] * square[2][2] +
                 square[0][1] * square[1][2] * square[2][0] +
                 square[0][2] * square[1][0] * square[2][1] -
                 square[0][2] * square[1][1] * square[2][0] -
                 square[0][1] * square[1][0] * square[2][2] -
                 square[0][0] * square[1][2] * square[2][1];
    } else if (n === 2) {
        // 2 阶
        result = square[0][0] * square[1][1] - square[0][1] * square[1][0];
    } else if (n === 1) {
        // 1 阶
        result = square[0][0];
    }
    return result;
}

//转置矩阵
function transpose(matrix) {
    let result = new Array(matrix.length).fill(0).map(arr => new Array(matrix[0].length).fill(0));
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[0].length; j++) {
            result[i][j] = matrix[j][i];
        }
    }
    return result;
}

//伴随矩阵
function adjoint(square) {
    // 方阵约束
    if (square[0].length !== square.length) {
        throw new Error();
    }

    let n = square.length;

    let result = new Array(n).fill(0).map(arr => new Array(n).fill(0));
    for (let row = 0; row < n; row++) {
        for (let column = 0; column < n; column++) {
            // 去掉第 row 行第 column 列的矩阵
            let matrix = [];
            for (let i = 0; i < square.length; i++) {
                if (i !== row) {
                    let arr = [];
                    for (let j = 0; j < square.length; j++) {
                        if (j !== column) {
                            arr.push(square[i][j]);
                        }
                    }
                    matrix.push(arr);
                }
            }
            result[row][column] = Math.pow(-1, row + column) * det(matrix);
        }
    }
    return transpose(result);
}

//逆矩阵
function inv(square) {
    if (square[0].length !== square.length) {
        throw new Error();
    }
    let detValue = det(square);
    let result = adjoint(square);
    
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result.length; j++) {
            result[i][j] /= detValue;
        }
    }
    return result;
}

