//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        //默认选择assets文件下
        //设置背景图
        var self=this;
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        // const spr: egret.Sprite = new egret.Sprite();
        // spr.graphics.beginFill(0x00ff00);
        // spr.graphics.drawRect(0, 0, 100, 100);
        // spr.graphics.endFill();
        // this.addChild(spr);
        let zhu : egret.Bitmap= this.createBitmapByName("zhu_jpg");
        
        this.addChild(zhu);
        zhu.x=100;
        zhu.y=stageH-200;
        let ren= this.createBitmapByName("ren");
        this.addChild(ren);
        ren.x=120;
        ren.y=stageH-310;


        ren.touchEnabled=true;


        ren.addEventListener( egret.TouchEvent.TOUCH_TAP, aa, this );


        let zhuan : egret.Bitmap= this.createBitmapByName("zhuan");
        
        this.addChild(zhuan);
        zhuan.x=80;
        zhuan.y=stageH-500;

       var scort=0;

        function aa(){
            let jin=this.createBitmapByName("jin");
            jin.x=140;
            jin.y=stageH-550;
            const tw = egret.Tween.get(ren,{ loop: false });
            tw.to({ y: 700 },200);
            tw.to({ y: 820 },200);
            this.addChild(jin);
            const jinA=egret.Tween.get(jin,{loop:false});
            jinA.to({y:500},200)
            //self.removeChild(jinA)
            scort++;
            console.log(scort,8888)
            label.text=scort+'';
        }
        
        var colorLabel: egret.TextField = new egret.TextField();
            colorLabel.text="统计分数"
            colorLabel.x=100;
            colorLabel.y=100;
            this.addChild(colorLabel);

            //分数
        var label=new egret.TextField();
        label.x=250;
        label.y=100;
        this.addChild(label);
        //倒计时
        var allTime=10;
        var endTime=new egret.TextField();
        endTime.x=400;
        endTime.y=200;
        endTime.textColor=0x000000;
        endTime.text=`剩余时间${allTime}S`
        this.addChild(endTime);
        
        function timeS(){
            var timer:egret.Timer = new egret.Timer(1000,10);
            timer.addEventListener(egret.TimerEvent.TIMER,timeStart,self);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, timeEnd, self);
            timer.start();
            
        }
        
        
        timeS();
        //创建文本
        //倒计时开始
        function timeStart(){
            console.log(self,999999999999)
            allTime--;
            console.log(allTime)
            endTime.text=`剩余时间${allTime}S`
        }    
         //倒计时结束   
        function timeEnd(){
            ren.touchEnabled=false;
            
        }
}

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }
    private startGame(e: egret.TouchEvent){
        console.log(11111111,this)
        
    }
    private timerFunc(e){
        console.log("倒计时开始",e)
    }
    private timerComFunc(){
        console.log("倒计时结束")
    }
}