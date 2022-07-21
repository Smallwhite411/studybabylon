import React, { Component } from 'react'
import {  ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 ,Sound ,
        Color3,StandardMaterial,Texture,Vector4, Mesh,SceneLoader } from 'babylonjs'
import * as earcut from 'earcut'
// import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
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
        const camera = new ArcRotateCamera("camera", -Math.PI/2 , Math.PI/2.5 , 15 , new Vector3(0,0,0)); //这里可以调整摄像机的位置和距离物体的距离
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

        this.buildDwellings()
        // SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb");

        var music = new Sound("mishi",require('./music/mishi.mp3'), this.scene, null, {
            loop: true,
            autoplay: true,
        });

        music.play();

        return scene;
    }

    buildDwellings = ()=>{
      const detached_house = this.buildHouse(1); //小房子
      detached_house.rotation.y = -Math.PI / 16;
      detached_house.position.x = -6.8;
      detached_house.position.z = 2.5;
  
      const semi_house = this.buildHouse(2); //大房子
      semi_house.rotation.y = -Math.PI / 16;
      semi_house.position.x = -4.5;
      semi_house.position.z = 3;

      const places = []; //创建一个数组，用于存放小房子的位置
      places.push([1, -Math.PI / 16, -6.8, 2.5 ]); //四个参数，第一个参数用于指定房子的大小，二三四个参数用与定义位置的距离
      places.push([2, -Math.PI / 16, -4.5, 3 ]);
      places.push([2, -Math.PI / 16, -1.5, 4 ]);
      places.push([2, -Math.PI / 3, 1.5, 6 ]);
      places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
      places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
      places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
      places.push([1, 5 * Math.PI / 4, 0, -1 ]);
      places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
      places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
      places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
      places.push([2, Math.PI / 1.9, 4.75, -1 ]);
      places.push([1, Math.PI / 1.95, 4.5, -3 ]);
      places.push([2, Math.PI / 1.9, 4.75, -5 ]);
      places.push([1, Math.PI / 1.9, 4.75, -7 ]);
      places.push([2, -Math.PI / 3, 5.25, 2 ]);
      places.push([1, -Math.PI / 3, 6, 4 ]);
  
      //Create instances from the first two that were built 
      const houses = [];
      for (let i = 0; i < places.length; i++) {
          if (places[i][0] === 1) {
              houses[i] = detached_house.createInstance("house" + i);
          }
          else {
              houses[i] = semi_house.createInstance("house" + i);
          }
          houses[i].rotation.y = places[i][1];
          houses[i].position.x = places[i][2];
          houses[i].position.z = places[i][3];
      }
    }

    buildBox = (width)=>{

      const boxMat = new StandardMaterial("boxMat");
      if (width === 2) {
         boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png") 
      }
      else { //这两张png 图片的大小是不一样的
          boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png");   
      }
  
      //options parameter to set different images on each side
      const faceUV = [];
      if (width === 2) { //单个房子的下部分
          faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
          faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
          faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
          faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
      }
      else {
        faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //后
        faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //前
        faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //右
        faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //左
      }


      var myBox = MeshBuilder.CreateBox("myBox", {faceUV: faceUV,width: width,wrap: true}, this.scene); //wrap 为true的作用就是禁止图片进行旋转
      // myBox.scaling.x = 0.61;
      // myBox.scaling.y = 0.49;
      // myBox.scaling.z = 0.55;
      // myBox.position.y = 0.49
      myBox.position.y = 0.5;

      myBox.material = boxMat;

      return myBox;
    }

    buildGround = () =>{
      //添加一个地面
      var ground = MeshBuilder.CreateGround("ground", {width:15, height:16},this.scene); //地面绑定在这个引擎上
      const groundMat = new StandardMaterial("groundMat"); //漫反射纹理
      groundMat.diffuseColor = new Color3(0, 1, 0); //直接添加一个绿色的纹理
      ground.material = groundMat; 

      return ground;
    }

    buildRoof = (width)=>{
      
      //添加一个房顶
      var roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.4, tessellation: 3});
      var roofMat = new StandardMaterial("roofMat");
      roof.scaling.x = 0.75;
      roof.rotation.z = Math.PI / 2;
      roof.position.y = 1.22;
      roof.scaling.y = width*0.85;

      //给房顶添加纹理
      roofMat.diffuseTexture = new Texture(require("../pages/picture/roof的副本.jpeg"),this.scene)
      roof.material = roofMat;

      return roof;
    }

    buildHouse = (width)=>{ //把房顶和房体结合到一起
      const box = this.buildBox(width)
      const roof = this.buildRoof(width)
  
      return Mesh.MergeMeshes([box, roof], true, false, null, false, true); //把房檐和房身组合在一起
    }

  render() {
    return (
      <div>BasicScene</div>
    )
  }
}

