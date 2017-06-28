'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var horses = [].concat(_toConsumableArray(document.querySelectorAll('.horse')));
var horseWrap = document.querySelector('.horseWrap');
var totalDistance = 1000; //总共要跑的距离
var duration = [60.0, 61, 62].concat(_toConsumableArray(Array(5).fill(1).map(function () {
    return 300 * randomBetween(0.22, 0.24);
}).sort())); //预先设定每匹马要跑的时间
var openData = [8, 4, 5, 6, 1, 3, 2, 7]; //从后台传回的开奖结果
var openResult = new Object(); //声明一个对象来存储openData和duration的对应关系
openData.forEach(function (item, index) {
    //openData和duration对应
    openResult['horse_' + item] = duration[index];
});
function horseRun(horses) {
    //马跑的动作函数
    horses.forEach(function (horse, index) {
        horse.style.backgroundImage = 'url(./horse_' + (index + 1) + '_a.png)';
        horse.style.top = 100 + index * 20 + 'px';
        horse.style.animation = 'horse_run infinite 450ms forwards step-start';
    });
}

var timeMaps = [[0.35, 0.45, 0.2], [0.35, 0.2, 0.45], [0.45, 0.2, 0.35], [0.45, 0.35, 0.2], [0.2, 0.45, 0.35], [0.2, 0.35, 0.45]];
function createTimeMap(horses, timeMaps) {
    //随机每匹马的时间分配
    var timeObj = new Object();
    horses.forEach(function (horse, index) {
        timeObj[horse.id] = timeMaps[Math.floor(randomBetween(0, 6))];
    });
    return timeObj;
}
function horseMove(horses) {
    var speeds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var leftValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var total = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : totalDistance;
    //赛马
    horseRun(horses);
    var timeMap = createTimeMap(horses, timeMaps);
    var timeout = null;
    var horseWrapLeftValue = 0;
    var scrollX = 0;
    function move() {
        var horsesLefts = getHorsesLeft(horses);
        horses.forEach(function (horse, index) {
            if (parseInt(horsesLefts[horse.id]) < total / 3) {
                //分三段，第一段的速度
                speeds[horse.id] = total / 3 / (openResult[horse.id] * timeMap[horse.id][0] * 16); //第一段占总时间35%，写死
            } else if (parseInt(horsesLefts[horse.id]) >= total / 3 && parseInt(horsesLefts[horse.id]) < total * 2 / 3) {
                //第二段的速度
                speeds[horse.id] = total / 3 / (openResult[horse.id] * timeMap[horse.id][1] * 16); //第二段占总时间50%，写死
            } else if (parseInt(horsesLefts[horse.id]) >= total * 2 / 3) {
                //第三段的速度
                speeds[horse.id] = total / 3 / (openResult[horse.id] * timeMap[horse.id][2] * 16); //第三段占总时间15%，写死
            }
            leftValue[horse.id] = leftValue[horse.id] || 0;
            leftValue[horse.id] += speeds[horse.id];
            horse.style.left = leftValue[horse.id] + 'px';
        });
        var speedMin = Math.min.apply(Math, _toConsumableArray(Object.values(speeds)));
        var speedMax = Math.max.apply(Math, _toConsumableArray(Object.values(speeds)));
        var leftMax = Math.max.apply(Math, _toConsumableArray(Object.values(horsesLefts).map(function (value) {
            return parseInt(value);
        })));
        horseWrapLeftValue -= 30; //背景切换速度

        horseWrap.style.backgroundPosition = horseWrapLeftValue + 'px 0'; //背景跟着动
        timeout = setTimeout(move, 1000 / 16);
    }
    move();
}
horseMove(horses);
function randomBetween(a, b) {
    //获取两个数之间的随机数
    return Math.random() * (b - a) + a;
}
function getHorsesLeft(horses) {
    //获取每匹马的left值,即跑的距离
    var horsesLefts = new Object();
    horses.forEach(function (horse) {
        return horsesLefts[horse.id] = window.getComputedStyle(horse).left;
    });
    return horsesLefts;
}
/*把路程分成3段，每段的速度不一样，可中慢快，中快慢，慢快中，慢中快，快慢中，快中慢六种随机一种;
 * 把时间分成三段，[[0.35,0.5,0.15],[0.35,0.15,0.5],[0.5,0.35,0.15],[0.5,0.15,0.35],[0.15,0.5,0.35],[0.15,0.35,0.5]]六种;
 * */
/*function createSpeed(){//随机生成跑步速度
 return Array(8).fill(1).map(()=>(randomBetween(0.7,1)*5));
 }*/