import React, { Component } from 'react'
import { useEffect } from 'react'
import {  ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3  } from 'babylonjs'
import * as earcut from 'earcut'
window.earcut = earcut

export default class BasicScene extends Component {
    constructor(props){
        super(props);
        this.engine = new Engine(this.props)
        this.scene = this.CreateScene()

        this.scene.debugLayer.show({
            embedMode: true
        })

        this.engine.runRenderLoop(()=>{
            this.scene.render()
        })
    }

    CreateScene = ()=>{
        const scene = new Scene(this.engine);
        const camera = new ArcRotateCamera("camera", -Math.PI/2 , Math.PI/2.5 , 3 , new Vector3(0,0,0));
        camera.attachControl(this.props,true);//attachControl  这个是可以让我们控制鼠标。可以操作

        const light = new HemisphericLight("light",new Vector3(0,1,0),this.scene);
        // const box = MeshBuilder.CreateBox("box",{});

        const outline = [
            new Vector3(-0.3, 0, -0.1),
            new Vector3(0.2, 0, -0.1),
        ]

        //curved front
        for (let i = 0; i < 20; i++) {
            outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
        }

        //top
        outline.push(new Vector3(0, 0, 0.1));
        outline.push(new Vector3(-0.3, 0, 0.1));

        const car = new MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2});

        return scene;
    }
  render() {
    return (
      <div>BasicScene</div>
    )
  }
}

