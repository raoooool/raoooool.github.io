/**
 * @param Snake 蛇类
 */
function Snake() {
    //constructor
    this.body = [];
    for (let i = 300; i < 310; i++) {
        this.body.push(map[i]);
    }
    this.head = this.body[this.body.length - 1];

    //方法
    //行走方法
    this.walk = function (direction) {
        util.clearAllInterval();
        let speed = sessionStorage.getItem('speed');
        if(!speed) speed = 100;
        setInterval(() => {
            switch (direction) {
                case 1:
                    this.head = map[this.head.INDEX - 32]; //上
                    sessionStorage.setItem('direction',1);
                    break;
                case 2:
                    this.head = map[this.head.INDEX + 1]; //右
                    sessionStorage.setItem('direction',2);
                    break;
                case 3:
                    this.head = map[this.head.INDEX + 32]; //下
                    sessionStorage.setItem('direction',3);
                    break;
                case 4:
                    this.head = map[this.head.INDEX - 1]; //左
                    sessionStorage.setItem('direction',4);
                    break;
            }
            this.body.push(this.head);
            //判断吃到食物
            if (this.head.INDEX == food.INDEX) {
                food = new Food;
                score.addScore();
            } else {
                this.body.shift();
            }
            util.freshColor();
            util.judgeGameOver();
        }, speed);
    }
}

/**
 * @param MapPoint 地图点类
 */
let INDEX = -1;
function MapPoint() {
    //constructor
    INDEX++;
    let mapPoint = document.createElement('div');
    mapPoint.style = 'background-color:whitesmoke;margin:2px;width:15px;height:15px;border-radius:15px;';
    document.getElementById('map').appendChild(mapPoint);
    mapPoint.state = 0;
    mapPoint.INDEX = INDEX;
    //方法
    //设置点状态
    mapPoint.setState = function (s) {
        this.state = s;
        switch (this.state) {
            case 1:
                this.style.backgroundColor = 'black';
                break;
            default:
                this.style.backgroundColor = 'whitesmoke';
                break;
        }
    }

    return mapPoint;
}

/**
 * @param Map 地图类
 */
function Map() {
    //constructor
    let map = [];
    for (let i = 0; i < 1024; i++) {
        map.push(new MapPoint);
    }
    return map;
}

/**
 * @param Food 食物类
 */
function Food() {
    function GenerateFood() {
        let r = Math.floor(Math.random() * 1000);
        if (r % 32 == 0 || r % 32 == 31 || (r > 0 && r < 32) || (r > 992 && r < 1024)) r = GenerateFood();
        for (let i = 0; i < snake.body.length; i++) {
            if (r == snake.body[i].INDEX) r = GenerateFood();
        }
        return r;
    }
    return map[GenerateFood()];
}

/**
 * @param Util 工具类
 */
function Util() {
    //刷新颜色
    this.freshColor = function () {
        for (let i = 0; i < map.length; i++) {
            map[i].style.backgroundColor = 'whitesmoke';
            if(map[i].INDEX % 32 == 0 || map[i].INDEX % 32 == 31 || (map[i].INDEX > 0 && map[i].INDEX < 32) || (map[i].INDEX > 992 && map[i].INDEX < 1024)){
                map[i].style.backgroundColor = 'gainsboro';
            }
        }
        for (let i = 0; i < snake.body.length; i++) {
            snake.body[i].style.backgroundColor = 'black';
        }
        if (food) food.style.backgroundColor = 'green';
        snake.head.style.backgroundColor = 'red';
    }
    //判断GameOver
    this.judgeGameOver = function () {
        let head = snake.head;
        let body = snake.body;
        let isGameOver = false;
        //判断撞墙
        if (head.INDEX % 32 == 0 || head.INDEX % 32 == 31 || (head.INDEX > 0 && head.INDEX < 32) || (head.INDEX > 992 && head.INDEX < 1024)) {
            isGameOver = true;
        }
        //判断自己吃自己
        for (let i = 0; i < body.length - 1; i++) {
            if (body[i].INDEX == head.INDEX) isGameOver = true;
        }

        if (isGameOver){
            alert('Game Over');
            location.reload();
        }
    }
    //清空Interval
    this.clearAllInterval = function () {
        let j = setInterval(() => { }, 0);
        for (let i = j; i >= 0; i--) {
            clearInterval(i);
        }
    }
    //调整难度
    this.justifyDifficult = function(difficult){
        if(event){
            let b = document.querySelectorAll('.difficult > button');
            for(let i=0;i<b.length;i++){
                b[i].classList.remove('checkedDifficult');
            }
            event.target.classList.add('checkedDifficult');
            // location.reload();
        }
        switch (difficult) {
            case -1:
                sessionStorage.setItem('speed',200);
                break;
            case 0:
                sessionStorage.setItem('speed',100);
                break;
            case 1:
                sessionStorage.setItem('speed',50);
                break;
            case 2:
                sessionStorage.setItem('speed',10);
                break;
        }
    }
    //init方法
    this.init = function(){
        util.justifyDifficult(0);
        util.freshColor();
    }
}

/**
 * @param KeyBoard 键盘类
 */
function KeyBoard() {
    this.listener = function () {
        switch (event.key.toLowerCase()) {
            case 'w':
                if(sessionStorage.getItem('direction') != 3) snake.walk(1);
                break;
            case 'd':
                if(sessionStorage.getItem('direction') != 4) snake.walk(2);
                break;
            case 's':
                if(sessionStorage.getItem('direction') != 1) snake.walk(3);
                break;
            case 'a':
                if(sessionStorage.getItem('direction') != 2) snake.walk(4);
                break;
        }
    }
}

/**
 * @param Score 分数
 */
function Score() {
    this.score = 0;
    this.addScore = function(){
        this.score++;
        document.getElementById('score').innerText = this.score;
    }
}

let map = new Map;
let snake = new Snake;
let food = new Food;
let keyBoard = new KeyBoard;
let util = new Util;
let score = new Score;

util.init();