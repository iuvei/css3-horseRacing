let horses = [...document.querySelectorAll('.horse')];
let duration = [6.0,6.3,6.6,...Array(5).fill(1).map(()=>10*(Math.random()*0.3+0.7))];
let openResult = {
    horse_1:2,
    horse_2:5,
    horse_3:3,
    horse_4:4,
    horse_5:1,
    horse_6:6,
    horse_7:0,
    horse_8:7,
};
horses.forEach((horse,index)=>{
    horse.style.backgroundImage = `url(./horse_${index+1}_a.png)`;
    horse.style.animation = `horse_run infinite 650ms forwards step-start,horse_move 1 ${duration[openResult[`horse_${index+1}`]]}s forwards linear`;
    horse.classList.remove('paused');
});



