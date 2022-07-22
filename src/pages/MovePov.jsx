import React, { Component } from 'react'
import * as earcut from 'earcut'
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
window.earcut = earcut

export default class movePOV extends Component {
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

    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.25}); //创建一个小球

    sphere.position = new BABYLON.Vector3(2, 0, 2); //起始位置

    //draw lines to form a triangle
    const points = []; //存放点的数组
    points.push(new BABYLON.Vector3(2, 0, 2));
    points.push(new BABYLON.Vector3(2, 0, -2));
    points.push(new BABYLON.Vector3(-2, 0, -2));
    points.push(points[0]);  //封闭曲线

    BABYLON.MeshBuilder.CreateLines("triangle", {points: points}) //创建线，连接起来成为一个三角形

    const slide = function (turn, dist) { //after covering dist apply turn
        this.turn = turn;
        this.dist = dist;
    }
    
    const track = [];
    track.push(new slide(Math.PI / 2, 4)); //其实始终都是前方面在正面，到达一个点的时候就进行旋转，然后把前方的面正对，这两个参数第一个参数是旋转的角度，第二个参数是移动的距离
    track.push(new slide(3 * Math.PI / 4, 8)); //第二个移动的距离应该把第一次移动的距离也加上，也就是4+4 = 8，下面以此类推
    track.push(new slide(3 * Math.PI / 4, 8 + 4 * Math.sqrt(2)));

    let distance = 0;//移动了多少距离
    let step = 0.05; //每一帧要走多远
    let p = 0; //第几段线

    scene.onBeforeRenderObservable.add(() => { //动态的移动
		sphere.movePOV(0, 0, step); //小球其实一直是朝着z轴的负半轴移动
        distance += step; //移动多少距离是 step的累加，这个是相对位置
              
        if (distance > track[p].dist) {     //如果移动的距离大于这条线的长度的话，就动态转向    
            sphere.rotate(BABYLON.Axis.Y, track[p].turn, BABYLON.Space.LOCAL); //这个函数很重要，rotate是动态旋转的意思，rotation 是静态旋转 
                        //沿着那个轴进行的旋转，旋转的角度，沿着那个坐标去旋转
            p +=1; //段数加一
            p %= track.length; //这一步是归零的操作
            if (p === 0) {
                distance = 0;
                sphere.position = new BABYLON.Vector3(2, 0, 2); //回到起始点，这一步的作用主要是因为在track这个数组的第三个线的长度有一个√2，有误差，所以我们手动让他回到起始点，这样就没问题了
                sphere.rotation = BABYLON.Vector3.Zero();//
            }
        }
    });
    return scene;
  }

  render() {
    return (
      <div>VillageAnimation</div>
    )
  }
}

