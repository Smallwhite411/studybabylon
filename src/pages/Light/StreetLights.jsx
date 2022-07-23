import React, { Component } from 'react'
import * as earcut from 'earcut'
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
window.earcut = earcut

export default class StreetLights extends Component {
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
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 40, new BABYLON.Vector3(0, 0, 0)); //这里可以调整摄像机的位置和距离物体的距离
    camera.attachControl(this.props, true);//attachControl  这个是可以让我们控制鼠标。可以操作

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene); //摄像机的位置
    light.intensity = 0.5 //降低环境光灯高度

    const lampLight = new BABYLON.SpotLight("lampLight", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0), Math.PI, 1, scene);
    lampLight.diffuse = BABYLON.Color3.Yellow(); //聚光灯光源，由一点发散开来

	//shape to extrude
	const lampShape = [];
    for(let i = 0; i < 20; i++) {
        lampShape.push(new BABYLON.Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
    }
	lampShape.push(lampShape[0]); //close shape

	//extrusion path
    const lampPath = [];
	lampPath.push(new BABYLON.Vector3(0, 0, 0));
	lampPath.push(new BABYLON.Vector3(0, 10, 0));
    for(let i = 0; i < 20; i++) {
        lampPath.push(new BABYLON.Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
    }
    lampPath.push(new BABYLON.Vector3(3, 11, 0));

    const yellowMat = new BABYLON.StandardMaterial("yellowMat");
    yellowMat.emissiveColor = BABYLON.Color3.Yellow(); //灯罩的颜色

	//extrude lamp
	const lamp = BABYLON.MeshBuilder.ExtrudeShape("lamp", {cap: BABYLON.Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5});
	
    //add bulb
    const bulb = BABYLON.MeshBuilder.CreateSphere("bulb", {diameterX: 1.5, diameterZ: 0.8});
    
    bulb.material = yellowMat;
    bulb.parent = lamp;
    bulb.position.x = 2;
    bulb.position.y = 10.5;

    lampLight.parent = bulb;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:50, height: 50})

    return scene;
  }

  render() {
    return (
      <div>VillageAnimation</div>
    )
  }
}

