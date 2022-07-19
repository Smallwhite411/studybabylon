import React, { Component } from 'react'
import { useEffect } from 'react'
import {  ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 ,Sound } from 'babylonjs'
import * as earcut from 'earcut'
// import musicip from '../../public/music/迷失幻境.mp3'
window.earcut = earcut

export default class BasicScene extends Component {
    constructor(props){
        super(props);
        this.engine = new Engine(this.props) //引擎
        this.scene = this.CreateScene() //创建场景

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

        var music = new Sound("mishi",require('./music/mishi.mp3'), this.scene, null, {
            loop: true,
            autoplay: true,
        });

        music.play();

        return scene;
    }
  render() {
    return (
      <div>BasicScene</div>
    )
  }
}

