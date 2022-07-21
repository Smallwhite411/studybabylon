import React, { Component } from 'react'
import * as earcut from 'earcut'
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
window.earcut = earcut

export default class VillageAnimation extends Component {
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
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 8, new BABYLON.Vector3(0, 0, 0)); //这里可以调整摄像机的位置和距离物体的距离
    camera.attachControl(this.props, true);//attachControl  这个是可以让我们控制鼠标。可以操作

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene); //摄像机的位置

    const car = this.buildCar(scene) //传进去一个场景

    return scene;
  }

  buildCar = (scene) => {
    console.log("asasgsa",scene)
    const outline = [ //先定好起始位置
      new BABYLON.Vector3(-0.3, 0, -0.1),
      new BABYLON.Vector3(0.2, 0, -0.1),
    ]

    for (let i = 0; i < 20; i++) {
      outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1)); //这是一半的圆，所以是 Math.PI/2  因为分成了20点，所以又要再除以20
    }

    outline.push(new BABYLON.Vector3(0, 0, 0.1));
    outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

    //back formed automatically

    const faceUV = [];
    faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
    faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

    const carMat = new BABYLON.StandardMaterial("carMat");
    carMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/car.png");


    //车身，四个轮子是依附在车身上的，所以这个car也就算是整个小车了
    const car = BABYLON.MeshBuilder.ExtrudePolygon("car", { faceUV: faceUV ,shape: outline, depth: 0.2 , wrap: true});
    car.material = carMat

    car.rotation.x = -Math.PI / 2.36

    //创建车轮的材质
    const wheelRBMat = new BABYLON.StandardMaterial("wheelRB");//声明一个材质的名称
    wheelRBMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png")

    const wheelUV = [];//轮子的UV
    wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
    wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

    const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", { faceUV: wheelUV ,diameter: 0.125, height: 0.05,wrap: true})

    wheelRB.material = wheelRBMat;

    wheelRB.parent = car;
    wheelRB.position.z = -0.1;
    wheelRB.position.x = -0.2;
    wheelRB.position.y = 0.035;

    const wheelRF = wheelRB.clone("wheelRF");
    wheelRF.position.x = 0.1;

    const wheelLB = wheelRB.clone("wheelLB");
    wheelLB.position.y = -0.2 - 0.035;

    const wheelLF = wheelRF.clone("wheelLF");
    wheelLF.position.y = -0.2 - 0.035;


    //动画
    const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                                            //参数名称，旋转轴，每秒帧数，动画类型，动画的方式
    const wheelKeys = []; 

    wheelKeys.push({
      frame: 0, //当帧数为0时，旋转度数为0
      value: 0
    });
    wheelKeys.push({
      frame: 30, //当帧数为30时，旋转度数为360度
      value: 2 * Math.PI
    });
    
    animWheel.setKeys(wheelKeys); //把设置好的关键帧放到这个定义的动画里面

    wheelRB.animations = [];
    wheelRB.animations.push(animWheel);
    wheelRF.animations = [];
    wheelRF.animations.push(animWheel);
    wheelLB.animations = [];
    wheelLB.animations.push(animWheel);
    wheelLF.animations = [];
    wheelLF.animations.push(animWheel);
    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);



    const animCar = new BABYLON.Animation("carAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    const carKeys = []; 

    carKeys.push({
        frame: 0,
        value: -4
    });

    carKeys.push({
        frame: 150,
        value: 4
    });

    carKeys.push({ //每秒30帧，210-150 = 60/30 = 2秒，也就是在x轴位置为4的地方停留 2 秒
        frame: 210,
        value: 4
    });

    animCar.setKeys(carKeys); //设置帧数的启动点

    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 210, true); //最后一个true 是循环播放的意思

  }
  


  render() {
    return (
      <div>VillageAnimation</div>
    )
  }
}

