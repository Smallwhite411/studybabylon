import React, { Component } from 'react'
import {
    Engine,  Scene, 
    Color3, StandardMaterial, Texture,MeshBuilder, Vector4, Mesh, Animation, SceneLoader, Axis, Tools, Space, CubeTexture, SpriteManager, Sprite, Color4, PointerEventTypes, ShadowGenerator
} from 'babylonjs'
import * as BABYLON from 'babylonjs';
import * as earcut from 'earcut'
// import * as from 'babylonjs';
import 'babylonjs-loaders';
// import musicip from '../pages/picture/music/迷失幻境.mp3'
window.earcut = earcut

var lights = {}; //初始化一个光源
var env = {};
var bottle = {};
var table = {};

export default class SmallVillage extends Component {
    constructor(props) {
        super(props);
        this.engine = new Engine(this.props) //引擎，这个props 其实也就是从App.js 里面传过来的canvas的dom
        //引擎是最重要的，将获取到的dom节点放在Engine 里面的生成一个存在于当前dom节点上的引擎
        this.scene = this.CreateScene() //创建场景

        this.scene.debugLayer.show({
            embedMode: true
        })

        this.engine.runRenderLoop(() => { //不断的进行渲染
            this.scene.render()
        })
    }

    CreateScene = () => {
        const scene = new Scene(this.engine); //场景需要引擎

        this.initScene(scene, this.props);

        this.loadMeshes(scene)



        return scene;
    }

    initScene = async (scene, canvas) => { //初始化一个场景函数

        const camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(0), BABYLON
            .Tools.ToRadians(70), 0.5, new BABYLON.Vector3(0.0, 0.1, 0.0), scene); //环形旋转相机
        // Tools.ToRadians  将角度转换为弧度
        camera.minZ = 0.01; //相机可以看到的最小距离
        camera.wheelDeltaPercentage = 0.01; //鼠标滚轮增量的速度
        camera.upperRadiusLimit = 0.5; //相机到目标的最大允许距离（相机不能进一步）
        camera.lowerRadiusLimit = 0.011; //相机到目标的最小允许距离（相机不能更近）
        camera.upperBetaLimit = 5.575; //纬度轴上的最大允许角度，也就是y 轴 ，还是用角度值看着好理解    Math.PI/2
        camera.lowerBetaLimit = 0;  //y轴最小允许角度
        camera.panningAxis = new BABYLON.Vector3(0, 0, 0); //位置
        camera.attachControl(canvas, true); //给鼠标和键盘权限

        env.lighting = BABYLON.CubeTexture.CreateFromPrefilteredData( //创建并返回一个由预过滤数据(如IBL Baker或Lys)创建的纹理。
            "https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/env/hamburg_hbf.env",
            scene); //定义纹理附加到整个场景上，这是一个
        env.lighting.name = "hamburg_hbf";
        env.lighting.gammaSpace = false; //定义纹理是否包含伽玛空间中的数据(大部分png/jpg边凹凸)。  不包含
        env.lighting.rotationY = BABYLON.Tools.ToRadians(0); //在y轴上的旋转角度
        scene.environmentTexture = env.lighting; //纹理使用在所有的pbr材料作为反射纹理。

        env.skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
            size: 1000.0    //这个盒子是整个空间的大小
        }, scene);
        env.skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        env.skyboxMaterial.backFaceCulling = false;
        env.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture( //环境贴图只能配合reflectionTexture 中使用
            "https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/skybox/hamburg", //里面有六张图片
            scene);
        env.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        env.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        env.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        env.skybox.material = env.skyboxMaterial;

        lights.dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0.60, -0.7,
            0.63), scene); //方向光，或者可以说是太阳光
        lights.dirLight.position = new BABYLON.Vector3(-0.05, 0.35, -0.05);
        lights.dirLight.shadowMaxZ = 0.45; //设置阴影投影裁剪的最大z值。
        lights.dirLight.intensity = 10; //光照强度
    }

    loadMeshes = async (scene) => {
        bottle.file = await BABYLON.SceneLoader.AppendAsync(
            "https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/gltf/sodaBottle.gltf"
        );
        bottle.glass = scene.getMeshByName("sodaBottle_low");
        bottle.liquid = scene.getMeshByName("soda_low");
        bottle.root = bottle.glass.parent;
        bottle.glass.alphaIndex = 2;
        bottle.liquid.alphaIndex = 1;
        bottle.glassLabels = bottle.glass.clone("glassLabels");
        bottle.glassLabels.alphaIndex = 0;
        table.file = await BABYLON.SceneLoader.AppendAsync(
            "https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/gltf/table.gltf"
        );
        table.mesh = scene.getMeshByName("table_low");
        bottle.root.position = new BABYLON.Vector3(-0.09, 0.0, -0.09);
        bottle.root.rotation = new BABYLON.Vector3(0.0, 4.0, 0.0);
        lights.dirLight.includedOnlyMeshes.push(table.mesh);
    }


    render() {
        return (
            <div>BasicScene</div>
        )
    }
}

