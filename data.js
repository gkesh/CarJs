"use strict";

class Car{
    constructor(source){
        this.height = 120;
        this.width = 80;
        this.source = source;
        this.design = null;
    }

    get image(){
        let picture = new Image();
        picture.src = this.source;
        return picture;
    }
}

class PC extends Car{
    constructor(source){
        super(source);
        this.design = this.image;
        this.switch = 25;
        this.position = {
            x: 120,
            y: 340
        }
    }
}

class NPC extends Car{
    constructor(source){
        super(source);
        this.design = this.image;
        this.distance = 250;
    }
}

class Data{
    constructor() {
        this.fps = 35;
        this.speed = 10;
        this.increment = 1;
        this.flag = 10;
        this.canvas = {
            width: 320,
            height: 480
        };
        this.lane = {
            width: 10,
            height: 50,
            distance: 100,
            llane: 105,
            rlane: 205,
            color: "#ffffff"
        };
        this.positions = [20, 120, 220];
        this.pc = new PC("assets/images/car02.png");
        this.npc = new NPC("assets/images/car_mit.png");
    }
}