import React, { Component } from 'react'
import * as earcut from 'earcut'
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
window.earcut = earcut

export default class ParentChildren extends Component {
    constructor(props){
        super(props);
        this.engine = new BABYLON.Engine(props) //引擎，这个props 其实也就是从App.js 里面传过来的canvas
        this.scene = this.CreateScene() //创建场景

        this.scene.debugLayer.show({
            embedMode: true
        })

        this.engine.runRenderLoop(()=>{
            this.scene.render()
        })
    }

    CreateScene = ()=>{
        const scene = new BABYLON.Scene(this.engine); //场景需要引擎
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2 , Math.PI/2.5 , 15 , new BABYLON.Vector3(0,0,0)); //这里可以调整摄像机的位置和距离物体的距离
        camera.attachControl(this.props,true);//attachControl  这个是可以让我们控制鼠标。可以操作

        const light = new BABYLON.HemisphericLight("light",new BABYLON.Vector3(0,1,0),this.scene); //摄像机的位置

        const faceColors = [];
        faceColors[0] = BABYLON.Color3.Blue(); //后
        faceColors[1] = BABYLON.Color3.Teal() //前
        faceColors[2] = BABYLON.Color3.Red(); //右
        faceColors[3] = BABYLON.Color3.Purple();  //左
        faceColors[4] = BABYLON.Color3.Green(); //上
        faceColors[5] = BABYLON.Color3.Yellow();  //下

        const boxParent = BABYLON.MeshBuilder.CreateBox("boxp",{faceColors: faceColors})
        const boxChild = BABYLON.MeshBuilder.CreateBox("boxc",{size: 0.5,faceColors: faceColors})

        boxChild.parent = boxParent;
        // boxChild.setParent(boxParent); //设置小盒子的父类是大盒子

        boxChild.position.x = 0;
        boxChild.position.y = 2;
        boxChild.position.z = 0;
    
        boxChild.rotation.x = Math.PI / 4;
        boxChild.rotation.y = Math.PI / 4;
        boxChild.rotation.z = Math.PI / 4;
    
        // boxParent.position.x = 2;
        // boxParent.position.y = 0;
        // boxParent.position.z = 0;
    
        // boxParent.rotation.x = 0;
        // boxParent.rotation.y = 0;
        // boxParent.rotation.z = -Math.PI / 4;


        return scene;
    }


  render() {
    return (
      <div>ParentChildren</div>
    )
  }
}

