import React, { Component } from 'react'
import {
  ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3, Sound, ParticleSystem, SpotLight,DirectionalLight,
  Color3, StandardMaterial, Texture, Vector4, Mesh, Animation, SceneLoader, Axis, Tools, Space, CubeTexture, SpriteManager, Sprite, Color4, PointerEventTypes, ShadowGenerator
} from 'babylonjs'
import * as earcut from 'earcut'
// import * as from 'babylonjs';
import 'babylonjs-loaders';
import * as GUI from 'babylonjs-gui'
// import musicip from '../pages/picture/music/迷失幻境.mp3'
window.earcut = earcut

export default class SmallVillage extends Component {
  constructor(props) {
    super(props);
    this.engine = new Engine(this.props) //引擎，这个props 其实也就是从App.js 里面传过来的canvas
    this.scene = this.CreateScene() //创建场景

    this.scene.debugLayer.show({
      embedMode: true
    })

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  CreateScene = () => {
    const scene = new Scene(this.engine); //场景需要引擎
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0)); //这里可以调整摄像机的位置和距离物体的距离
    camera.upperBetaLimit = Math.PI / 2.2; //限制摄像机的旋转角度


    camera.attachControl(this.props, true);//attachControl  这个是可以让我们控制鼠标。可以操作

    // const light = new HemisphericLight("light", new Vector3(4, 1, 0), this.scene); //摄像机的位置
    const  light = new DirectionalLight("dir01", new Vector3(1, -1, 1), scene); //这个是旋转方向
    light.position = new Vector3(0, 15, -30); //这个是高度
    light.intensity = 1 //降低环境光灯高度，这样聚光灯照射的才看得出来，要不都是白色的

    const shadowGenerator = new ShadowGenerator(1024,light); //影子发生器，1024应该是在某一范围内才能有影子



    //GUI
    const adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const panel = new GUI.StackPanel();
    panel.width = "220px";
    panel.top = "-25px";
    //设置对其方式
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;//右对齐
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM; //下对齐 综合也就是右下角对齐
    adt.addControl(panel);

    const header = new GUI.TextBlock(); //是一个控件，用于创建文本块控件的
    header.text = "Night to Day";
    header.height = "30px";
    header.color = "white"; //其实这个可有可无，只是起到一个显示的作用
    panel.addControl(header); 

    const slider = new GUI.Slider(); //用于创建滑块控件的类
    slider.minimum = 0; //限制从0到1
    slider.maximum = 1;
    slider.borderColor = "black";
    slider.color = "gray";
    slider.background = "white";
    slider.value = 1; //初始值，最好和上面的相对应  light.intensity = 1 
    slider.height = "20px";
    slider.width = "200px";
    slider.onValueChangedObservable.add((value) => { //事件，当滑动的时候动态改变
        if (light) {
            light.intensity = value;
        }
    });
    panel.addControl(slider);

    //聚光灯
    const lampLight = new SpotLight("lampLight", Vector3.Zero(), new Vector3(0, -1, 0), Math.PI, 1, scene);
                                    //名称  摆放位置  照射方向  扩散角度（现在这个是一个半圆，所谓的半圆是灯光两点到灯之间的夹角）  发散速度
    lampLight.diffuse = Color3.Yellow(); //聚光灯光源，由一点发散开来，上色为黄色

    //为了创建灯柱，我们介绍了另一种通过沿路径挤出形状来创建网格的方法。
    const lampShape = []; 
    for (let i = 0; i < 20; i++) {//分成20份，最大角度是360度
      lampShape.push(new Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
    }
    lampShape.push(lampShape[0]); //关闭

    //柱子的路线
    const lampPath = [];
    lampPath.push(new Vector3(0, 0, 0));
    lampPath.push(new Vector3(0, 10, 0));
    for (let i = 0; i < 20; i++) {
      lampPath.push(new Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
    }
    lampPath.push(new Vector3(3, 11, 0));

    const yellowMat = new StandardMaterial("yellowMat");
    yellowMat.emissiveColor = Color3.Yellow(); //灯泡的颜色

    //柱子
    const lamp = MeshBuilder.ExtrudeShape("lamp", { cap: Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5 });

    //添加一个电灯泡
    const bulb = MeshBuilder.CreateSphere("bulb", { diameterX: 1.5, diameterZ: 0.8 });

    bulb.material = yellowMat;
    bulb.parent = lamp;
    bulb.position.x = 2;
    bulb.position.y = 10.5;
    lamp.position.z = 4.20;
    lamp.position.x = 0.46;
    lamp.rotation.y = Math.PI/6.4
    lamp.scaling = new Vector3(0.5 , 0.5 , 0.5)

    lampLight.parent = bulb;

    const lamp1 = lamp.clone("lamp1");
    lamp1.position.z = -6.33;
    lamp1.position.x = 1.45;
    lamp1.scaling = new Vector3(0.1 , 0.1  ,0.1)
    lamp1.rotation.y = Math.PI / 36;


    //天空盒子
    const skybox = MeshBuilder.CreateBox("skybox", { size: 150 });//天空盒子
    const skyMat = new StandardMaterial("skyMat");
    skyMat.backFaceCulling = false;//剔除模式
    skyMat.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", scene) //反射类型/模式
    skyMat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE; //反射的类型
    skyMat.diffuseColor = new Color3(0, 0, 0);
    skyMat.specularColor = new Color3(0, 0, 0); //反光的颜色
    skybox.material = skyMat;

    //种树
    this.spriteManagerTrees(scene);

    //ufo
    this.spriteManagerUFO(scene);

    //喷泉
    this.fountain(scene)

    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/villagegreen.png");
    groundMat.diffuseTexture.hasAlpha = true;

    const ground = MeshBuilder.CreateGround("ground", { width: 24, height: 24 });
    ground.material = groundMat;
    ground.receiveShadows = true;

    const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", { width: 150, height: 150, subdivisions: 40, minHeight: 0, maxHeight: 10 });

    const largeGroundMat = new StandardMaterial("largeGroundMat");//创建一下材质
    largeGroundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png");
    largeGroundMat.diffuseTexture.hasAlpha = true //开启透明度
    largeGround.material = largeGroundMat
    largeGround.position.y = -0.01; //避免重叠的冲突，所以向下移动了0.01

    // this.buildGround()

    this.buildDwellings()

    this.buildCar(scene,shadowGenerator) //传进去一个场景

    this.CartoonSceneLoader(scene,shadowGenerator)


    var music = new Sound("mishi", require('./music/mishi.mp3'), this.scene, null, {
      loop: true,
      autoplay: true,
    });

    music.play();

    return scene;
  }

  buildCar = (scene,shadowGenerator) => {
    console.log(scene)
    const outline = [ //先定好起始位置
      new Vector3(-0.3, 0, -0.1),
      new Vector3(0.2, 0, -0.1),
    ]

    for (let i = 0; i < 20; i++) {
      outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1)); //这是一半的圆，所以是 Math.PI/2  因为分成了20点，所以又要再除以20
    }

    outline.push(new Vector3(0, 0, 0.1));
    outline.push(new Vector3(-0.3, 0, 0.1));

    //back formed automatically

    const faceUV = [];
    faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new Vector4(0, 0, 1, 0.5);
    faceUV[2] = new Vector4(0.38, 1, 0, 0.5);

    const carMat = new StandardMaterial("carMat");
    carMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/car.png");


    //车身，四个轮子是依附在车身上的，所以这个car也就算是整个小车了
    const car = MeshBuilder.ExtrudePolygon("car", { faceUV: faceUV, shape: outline, depth: 0.2, wrap: true });
    car.material = carMat

    car.rotation.x = -Math.PI / 2
    car.rotation.y = -Math.PI / 2
    car.position.y = 0.58;
    car.position.z = 1.26;
    car.position.x = 3.37;
    car.scaling = new Vector3(3, 3, 3)

    shadowGenerator.addShadowCaster(car , true) //挂在影子生成器上

    //创建车轮的材质
    const wheelRBMat = new StandardMaterial("wheelRB");//声明一个材质的名称
    wheelRBMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/wheel.png")

    const wheelUV = [];//轮子的UV
    wheelUV[0] = new Vector4(0, 0, 1, 1);
    wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new Vector4(0, 0, 1, 1);

    const wheelRB = MeshBuilder.CreateCylinder("wheelRB", { faceUV: wheelUV, diameter: 0.125, height: 0.05, wrap: true })

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
    const animWheel = new Animation("wheelAnimation", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
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



    const animCar = new Animation("carAnimation", "position.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

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

  CartoonSceneLoader = (scene,shadowGenerator) => {
    // Dude

    SceneLoader.ImportMeshAsync("him", "https://playground.babylonjs.com/scenes/Dude/", "Dude.babylon", scene).then((result) => { //网络请求，异步操作 

      const walk = function (turn, dist) {
        this.turn = turn;
        this.dist = dist;
      }
      const track = [];
      track.push(new walk(86, 7));
      track.push(new walk(-85, 14.8));
      track.push(new walk(-93, 16.5));
      track.push(new walk(48, 25.5));
      track.push(new walk(-112, 30.5));
      track.push(new walk(-72, 33.2));
      track.push(new walk(42, 37.5));
      track.push(new walk(-98, 45.2));
      track.push(new walk(0, 47))

      var dude = result.meshes[0];
      dude.scaling = new Vector3(0.008, 0.008, 0.008);
      // dude.rotation.y = -Math.PI/2

      dude.position = new Vector3(-6, 0, 0);
      dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
      const startRotation = dude.rotationQuaternion.clone();

      shadowGenerator.addShadowCaster(dude)

      scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

      let distance = 0;
      let step = 0.015;
      let p = 0;

      scene.onBeforeRenderObservable.add(() => {
        dude.movePOV(0, 0, step);
        distance += step;

        if (distance > track[p].dist) {

          dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
          p += 1;
          p %= track.length;
          if (p === 0) {
            distance = 0;
            dude.position = new Vector3(-6, 0, 0);
            dude.rotationQuaternion = startRotation.clone();
          }
        }

      })
    });
  }

  buildDwellings = () => {
    const detached_house = this.buildHouse(1); //小房子
    detached_house.rotation.y = -Math.PI / 16;
    detached_house.position.x = -6.8;
    detached_house.position.z = 2.5;

    const semi_house = this.buildHouse(2); //大房子
    semi_house.rotation.y = -Math.PI / 16;
    semi_house.position.x = -4.5;
    semi_house.position.z = 3;

    const places = []; //创建一个数组，用于存放小房子的位置
    places.push([1, -Math.PI / 16, -6.8, 2.5]); //四个参数，第一个参数用于指定房子的大小，二三四个参数用与定义位置的距离
    places.push([2, -Math.PI / 16, -4.5, 3]);
    places.push([2, -Math.PI / 16, -1.5, 4]);
    places.push([2, -Math.PI / 3, 1.5, 6]);
    places.push([2, 15 * Math.PI / 16, -6.4, -1.5]);
    places.push([1, 15 * Math.PI / 16, -4.1, -1]);
    places.push([2, 15 * Math.PI / 16, -2.1, -0.5]);
    places.push([1, 5 * Math.PI / 4, 0, -1]);
    places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
    places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
    places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
    places.push([2, Math.PI / 1.9, 4.75, -1]);
    places.push([1, Math.PI / 1.95, 4.5, -3]);
    places.push([2, Math.PI / 1.9, 4.75, -5]);
    places.push([1, Math.PI / 1.9, 4.75, -7]);
    places.push([2, -Math.PI / 3, 5.25, 2]);
    places.push([1, -Math.PI / 3, 6, 4]);

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

  buildBox = (width) => {

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


    var myBox = MeshBuilder.CreateBox("myBox", { faceUV: faceUV, width: width, wrap: true }, this.scene); //wrap 为true的作用就是禁止图片进行旋转

    myBox.position.y = 0.5;

    myBox.material = boxMat;

    return myBox;
  }

  buildGround = () => {
    //添加一个地面
    var ground = MeshBuilder.CreateGround("ground", { width: 15, height: 16 }, this.scene); //地面绑定在这个引擎上
    const groundMat = new StandardMaterial("groundMat"); //漫反射纹理
    groundMat.diffuseColor = new Color3(0, 1, 0); //直接添加一个绿色的纹理
    ground.material = groundMat;

    return ground;
  }

  buildRoof = (width) => {

    //添加一个房顶
    var roof = MeshBuilder.CreateCylinder("roof", { diameter: 1.3, height: 1.4, tessellation: 3 });
    var roofMat = new StandardMaterial("roofMat");
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;
    roof.scaling.y = width * 0.85;

    //给房顶添加纹理
    roofMat.diffuseTexture = new Texture(require("../pages/picture/roof的副本.jpeg"), this.scene)
    roof.material = roofMat;

    return roof;
  }

  buildHouse = (width) => { //把房顶和房体结合到一起
    const box = this.buildBox(width)
    const roof = this.buildRoof(width)

    return Mesh.MergeMeshes([box, roof], true, false, null, false, true); //把房檐和房身组合在一起
  }

  spriteManagerTrees = (scene) => {
    const spriteManagerTrees = new SpriteManager("spriteManagerTrees", "https://playground.babylonjs.com/textures/palm.png", 2000, { width: 512, height: 1024 }, scene)
    //名称，2d图片地址，最大数量
    for (let i = 0; i < 500; i++) {
      const tree = new Sprite("tree" + i, spriteManagerTrees);
      tree.position = new Vector3(
        Math.random() * -30,
        0.5,
        Math.random() * 20 + 8
      )
    }
    for (let i = 0; i < 500; i++) {
      const tree = new Sprite("tree" + i, spriteManagerTrees);
      tree.position = new Vector3(
        Math.random() * 25 + 7,
        0.5,
        Math.random() * -30 + 8
      )
    }
  }

  spriteManagerUFO = (scene) => {
    const spriteManagerUFO = new SpriteManager("ufo", "https://assets.babylonjs.com/environments/ufo.png", 1, { width: 128, height: 76 }, scene);
    const ufo = new Sprite("ufo", spriteManagerUFO);
    ufo.playAnimation(0, 16, true, 125); //从0 到 16 帧 循环播放 延迟125ms 播放
    ufo.position = new Vector3(0, 5, 0);
    ufo.width = 2;
    ufo.height = 1;

  }

  fountain = (scene) => {
    const fountainProfile = [
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(10, 4, 0),
      new Vector3(8, 4, 0),
      new Vector3(8, 1, 0),
      new Vector3(1, 2, 0),
      new Vector3(1, 15, 0),
      new Vector3(3, 17, 0)
    ];

    const fountain = MeshBuilder.CreateLathe("fountain", {
      shape: fountainProfile,
      sideOrientation: Mesh.DOUBLESIDE
    })

    fountain.position.y = 0.02;
    fountain.position.x = 1.07;
    fountain.position.z = 0.5;
    fountain.scaling = new Vector3(0.025, 0.025, 0.025)


    //喷泉粒子
    const particleSystem = new ParticleSystem("particles", 5000, scene); //这和直接添加的粒子是差不多的 都叫particleSystem  5000粒子数
    particleSystem.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png");//加一个纹理

    //粒子发射位置
    particleSystem.emitter = new Vector3(1.1, 0.1, 0.5);
    //粒子喷嘴的大小
    particleSystem.minEmitBox = new Vector3(-0.1, 0, 0);
    particleSystem.maxEmitBox = new Vector3(0.1, 0, 0);

    //颜色
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

    //尺寸，粒子的大小
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    //生命周期
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 3.5;

    //发射速率，也就是每帧发送多少个
    particleSystem.emitRate = 1500;

    //混合模式
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    //重力
    particleSystem.gravity = new Vector3(0, -9.81, 0);

    //发射方向
    particleSystem.direction1 = new Vector3(-2, 8, 2);
    particleSystem.direction2 = new Vector3(2, 8, -2);

    // 角度旋转，也就是例子发射的那个弧度
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // 速度
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.025; //更新速度

    // 开始发射
    // particleSystem.start();

    let switched = false;
    scene.onPointerObservable.add((pointerInfo) => {
      // eslint-disable-next-line default-case
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN: //点击事件，当按下鼠标的时候触发
          if (pointerInfo.pickInfo.hit) { //当点击到喷泉的时候才触发，hit就是点中
            const pickedMesh = pointerInfo.pickInfo.pickedMesh
            if (pickedMesh === fountain) {
              switched = !switched
            }
            if (switched) { //如果为真，也就是点击到了
              particleSystem.start(); //那么就启动粒子系统 
            } else {
              particleSystem.stop();
            }
          }
      }
    })

  }

  render() {
    return (
      <div>BasicScene</div>
    )
  }
}

