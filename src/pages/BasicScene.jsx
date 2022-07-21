import React, { Component } from 'react'
import { useEffect } from 'react'
import {  ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 ,Sound ,
        Color3,StandardMaterial,Texture,Vector4, Mesh } from 'babylonjs'
import * as earcut from 'earcut'
// import musicip from '../pages/picture/music/迷失幻境.mp3'
window.earcut = earcut

export default class BasicScene extends Component {
    constructor(props){
        super(props);
        this.engine = new Engine(this.props) //引擎，这个props 其实也就是从App.js 里面传过来的canvas
        this.scene = this.CreateScene() //创建场景

        this.scene.debugLayer.show({
            embedMode: true
        })

        this.engine.runRenderLoop(()=>{
            this.scene.render()
        })
    }

    CreateScene = ()=>{
        const scene = new Scene(this.engine); //场景需要引擎
        const camera = new ArcRotateCamera("camera", -Math.PI/2 , Math.PI/2.5 , 3 , new Vector3(0,0,0));
        camera.attachControl(this.props,true);//attachControl  这个是可以让我们控制鼠标。可以操作

        const light = new HemisphericLight("light",new Vector3(0,1,0),this.scene); //摄像机的位置
        // const box = MeshBuilder.CreateBox("box",{});

        // const outline = [
        //     new Vector3(-0.3, 0, -0.1),
        //     new Vector3(0.2, 0, -0.1),
        // ]

        // //curved front
        // for (let i = 0; i < 20; i++) {
        //     outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
        // }

        // //top
        // outline.push(new Vector3(0, 0, 0.1));
        // outline.push(new Vector3(-0.3, 0, 0.1));

        // const car = new MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2});

        this.buildGround()
        this.buildHouse()

        var music = new Sound("mishi",require('./music/mishi.mp3'), this.scene, null, {
            loop: true,
            autoplay: true,
        });

        music.play();

        return scene;
    }

    buildBox = ()=>{
      var faceUV = [];
      faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //后
      faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //前
      faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //右
      faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //左
      faceUV[4] = new Vector4(0.5, 0.0, 0.75, 1.0)//上
      faceUV[5] = new Vector4(0.0, 0.0, 0.25, 1.0); //下


      var myBox = MeshBuilder.CreateBox("myBox", {faceUV: faceUV,height: 2, width: 2, depth: 2,wrap: true}, this.scene); //wrap 为true的作用就是禁止图片进行旋转
      myBox.scaling.x = 0.61;
      myBox.scaling.y = 0.49;
      myBox.scaling.z = 0.55;
      myBox.position.y = 0.49
      // myBox.rotation.x = Math.PI / 12;


      const boxMat = new StandardMaterial("boxMat");
      boxMat.diffuseTexture = new Texture(require("../pages/picture/semihouse的副本.png"));

      myBox.material = boxMat;

      return myBox;
    }

    buildGround = () =>{
      //添加一个地面
      var ground = MeshBuilder.CreateGround("ground", {width:10, height:10},this.scene); //地面绑定在这个引擎上
      const groundMat = new StandardMaterial("groundMat"); //漫反射纹理
      groundMat.diffuseColor = new Color3(0, 1, 0); //直接添加一个绿色的纹理
      ground.material = groundMat; 

      return ground;
    }

    buildRoof = ()=>{
      
      //添加一个房顶
      var roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
      var roofMat = new StandardMaterial("roofMat");
      roof.scaling.x = 0.75;
      roof.rotation.z = Math.PI / 2;
      roof.position.y = 1.17;

      //给房顶添加纹理
      roofMat.diffuseTexture = new Texture(require("../pages/picture/roof的副本.jpeg"),this.scene)
      roof.material = roofMat;

      return roof;
    }

    buildHouse = ()=>{ //把房顶和房体结合到一起
      const box = this.buildBox()
      const roof = this.buildRoof()
  
      return Mesh.MergeMeshes([box, roof], true, false, null, false, true); //把房檐和房身组合在一起
    }

  render() {
    return (
      <div>BasicScene</div>
    )
  }
}

