import React, { Component } from 'react'
import * as earcut from 'earcut'
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
window.earcut = earcut

export default class DistantHills extends Component {
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

    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/villagegreen.png");
    groundMat.diffuseTexture.hasAlpha = true;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:24, height:24});
    ground.material = groundMat;

    const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {width:150, height:150, subdivisions: 40, minHeight:0, maxHeight: 10});

    const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");//创建一下材质
    largeGroundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png");
    largeGroundMat.diffuseTexture.hasAlpha = true //开启透明度
    largeGround.material = largeGroundMat
    largeGround.position.y = -0.01; //避免重叠的冲突，所以向下移动了0.01

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(4, 1, 0), this.scene); //摄像机的位置

    return scene;
  }

  render() {
    return (
      <div>CartoonCharacters</div>
    )
  }
}

