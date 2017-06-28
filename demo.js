let horses = [...document.querySelectorAll('.horse')];
let horseWrap = document.querySelector('.horseWrap');
let horseNumElems = [...document.querySelectorAll('.rangeNums>div>i.horseNum')];//排序马匹
let totalDistance = 800;//总共要跑的距离
let duration = [35.0,37,39,...Array(5).fill(1).map(()=>40*(randomBetween(1.1,1.3))).sort()];//预先设定每匹马要跑的时间
let openData = [8,4,5,6,1,3,2,7];//从后台传回的开奖结果
let openResult = new Object();//声明一个对象来存储openData和duration的对应关系
openData.forEach((item,index)=>{//openData和duration对应
    openResult[`horse_${item}`] = duration[index];
});
function horseRun(horses){//马跑的动作函数
    horses.forEach((horse,index)=>{
        horse.style.backgroundImage = `url(./horse_${index+1}_a.png)`;
        horse.style.backgroundSize = '512px';
        horse.style.top = `${-60+index*30}px`;
        horse.style.left = '-50px';//一开始的位置
        horse.style.animation = `horse_run infinite 450ms forwards step-start`;
    });
}
let timeMaps= [[0.35,0.45,0.2],[0.35,0.2,0.45],[0.45,0.2,0.35],[0.45,0.35,0.2],[0.2,0.45,0.35],[0.2,0.35,0.45]];
function createTimeMap(horses,timeMaps){//随机每匹马的时间分配
    let timeObj = new Object();
    horses.forEach((horse,index)=>{
        timeObj[horse.id] = timeMaps[Math.floor(randomBetween(0,6))];
    });
    return timeObj;
}
function horseMove(horses,speeds = {},leftValue = {},total = totalDistance){//赛马
    horseRun(horses);
    let timeMap = createTimeMap(horses,timeMaps);
    let timeout = null;
    let horseWrapLeftValue = 0;
    function move(){
        let horsesLefts = getHorsesLeft(horses);console.log(horsesLefts)
        horses.forEach((horse,index)=>{
            if(parseInt(horsesLefts.get(horse.id))<total/3){//分三段，第一段的速度
                speeds[horse.id] = (total/3)/(openResult[horse.id]*(timeMap[horse.id][0])*16);//第一段占总时间35%，写死
            }else if(parseInt(horsesLefts.get(horse.id))>=total/3&&parseInt(horsesLefts.get(horse.id))<total*2/3){//第二段的速度
                speeds[horse.id] = (total/3)/(openResult[horse.id]*(timeMap[horse.id][1])*16);//第二段占总时间50%，写死
            }else if(parseInt(horsesLefts.get(horse.id))>=total*2/3){//第三段的速度
                speeds[horse.id] = (total/3)/(openResult[horse.id]*(timeMap[horse.id][2])*16);//第三段占总时间15%，写死
            }
            leftValue[horse.id] = leftValue[horse.id] || 0;
            leftValue[horse.id] += speeds[horse.id];
            horse.style.left = `${leftValue[horse.id]}px`;
        });
        let speedMin = Math.min(...Object.values(speeds));
        let speedMax = Math.max(...Object.values(speeds));
        let leftMax = Math.max(...[...horsesLefts.values()].map(value=>parseInt(value)));
        let horsesLeftsKeys = [...horsesLefts.keys()];//马的距离数组
        let sort_horsesLeftsKeys = horsesLeftsKeys.sort().reverse();//排序的马的距离
        let horsesLeftsValues = [...horsesLefts.values()].map(item=>item.split('_')[1]);//马的id数组,马排序
        console.log(horsesLeftsValues)
        if(!JSON.parse(sessionStorage.getItem('horsesLeftsValues'))||JSON.parse(sessionStorage.getItem('horsesLeftsValues')).toString()!=horsesLeftsKeys.toString()){
            sortHorseRange(horseNumElems,horsesLefts,sort_horsesLeftsKeys);//底部实时排名,排名发生改变时重新排名。
        }
        sessionStorage.setItem('horsesLeftsKeys',JSON.stringify(horsesLeftsKeys));//把旧的排名存起来，和之后的排名做比较
        horseWrapLeftValue -= 30;//背景切换速度
        horseWrap.style.backgroundPosition = `${horseWrapLeftValue}px 0`;//背景跟着动
        timeout = setTimeout(move,1000/16);
    }
    move();
}
horseMove(horses);



function randomBetween(a,b){//获取两个数之间的随机数
    return Math.random()*(b-a)+a;
}
function getHorsesLeft(horses){//获取每匹马的left值,即跑的距离
    let horsesLefts = new Map();
    horses.forEach((horse,index)=>{
        let key = window.getComputedStyle(horse).left+'_' + index;
        horsesLefts.set(key,horse.id);
    });
    return horsesLefts;
}
/*把路程分成3段，每段的速度不一样，可中慢快，中快慢，慢快中，慢中快，快慢中，快中慢六种随机一种;
 * 把时间分成三段，[[0.35,0.5,0.15],[0.35,0.15,0.5],[0.5,0.35,0.15],[0.5,0.15,0.35],[0.15,0.5,0.35],[0.15,0.35,0.5]]六种;
 * */
/*function createSpeed(){//随机生成跑步速度
 return Array(8).fill(1).map(()=>(randomBetween(0.7,1)*5));
 }*/
//底部实时排名函数
function sortHorseRange(horseNumElems,horsesLefts,sort_horsesLeftsKeys){
    horseNumElems.forEach((numElem,index)=>{
        numElem.innerText = horsesLefts.get(sort_horsesLeftsKeys[index]);
    });
}

