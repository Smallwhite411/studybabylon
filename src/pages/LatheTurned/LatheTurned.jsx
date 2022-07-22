import React, { Component } from 'react'
import * as earcut from 'earcut'
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
window.earcut = earcut

export default class LatheTurned extends Component {
  constructor(props) {
    super(props);
    this.engine = new BABYLON.Engine(props) //引擎，这个props 其实也就是从App.js 里面传过来的canvas
    this.scene = this.CreateScene() //创建场景

    this.scene.debugLayer.show({
      embedMode: true
    })

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  CreateScene = () => {
    const scene = new BABYLON.Scene(this.engine); //场景
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 200, new BABYLON.Vector3(0, 0, 0)); //这里可以调整摄像机的位置和距离物体的距离
    camera.attachControl(this.props, true);//attachControl  这个是可以让我们控制鼠标。可以操作
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(4, 1, 0), this.scene); //摄像机的位置

    const fountainProfile = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(10, 0, 0),
        new BABYLON.Vector3(10, 4, 0),
        new BABYLON.Vector3(8, 4, 0),
        new BABYLON.Vector3(8, 1, 0),
        new BABYLON.Vector3(1, 2, 0),
        new BABYLON.Vector3(1, 15, 0),
        new BABYLON.Vector3(3, 17, 0)
    ];

    const fountain = BABYLON.MeshBuilder.CreateLathe("fountain",{
        shape: fountainProfile,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE 
    })

    fountain.position.y = -5;

    //喷泉粒子
    const particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene); //这和直接添加的粒子是差不多的 都叫particleSystem  5000粒子数
    particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/flare.png");//加一个纹理

    //粒子发射位置
    particleSystem.emitter = new BABYLON.Vector3(0 , 10 , 0); 
    //粒子喷嘴的大小
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.1 , 0 , 0);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.1 , 0 , 0);

    //颜色
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    //尺寸，粒子的大小
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    //生命周期
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 3.5;

    //发射速率，也就是每帧发送多少个
    particleSystem.emitRate = 1500;

    //混合模式
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    //重力
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    //发射方向
    particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
    particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

    // 角度旋转，也就是例子发射的那个弧度
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // 速度
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.025; //更新速度

    // 开始发射
    // particleSystem.start();

    let switched = false;
    scene.onPointerObservable.add((pointerInfo)=>{
            // eslint-disable-next-line default-case
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN: //点击事件，当按下鼠标的时候触发
                if(pointerInfo.pickInfo.hit){ //当点击到喷泉的时候才触发，hit就是点中
                    const pickedMesh = pointerInfo.pickInfo.pickedMesh
                    if(pickedMesh === fountain){
                        switched = !switched
                    }
                    if(switched){ //如果为真，也就是点击到了
                        particleSystem.start(); //那么就启动粒子系统 
                    } else {
                        particleSystem.stop();
                    }
                }
            }
    })

    return scene;
  }

  render() {
    return (
      <div>LatheTurned</div>
    )
  }
}

