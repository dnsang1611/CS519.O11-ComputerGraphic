kjhadkjfhksdfkj

import * as THREE from 'three';
import {BoxObstacle, SphereObstacle, ConeObstacle, CylinderObstacle} from './Obstacles.js'
import {Coin, Teapot} from './Items.js'
import { Ground } from './Ground.js';
import {CharacterController} from './CharacterController.js'
import {OrbitControls, OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import moonTexture from '../imgs/moon.webp'
import starsTexture from '../imgs/stars.jpg'
import sandTexture from '../imgs/sand.jpg'

var modal = document.getElementById('ModalBox');

function start() {
  modal.style.display = "flex";
  x = document.querySelector(".game_title");
  x.textContent = "Subway Surfers";
  y = document.querySelector(".play_again");
  y.style.display = "none";
}

document.getElementById("arrow").addEventListener("click", start_box);
document.getElementById("play_again").addEventListener("click", restart_game);

function start_box() {
  gamestart = true;
  modal.style.display = "none";
}

function restart_game() {
  document.location.reload();
}

function Game_over() {
  modal.style.display = "flex";

  x = document.querySelector(".game_title");
  if(gameOver)
    x.textContent = "Game Over";
  else if(finish)
    x.textContent = "You Won!";

  y = document.querySelector(".game_score");
  y.textContent = "Your score: " + score;
  y.style.display = "flex";

  z = document.querySelector(".modal-footer");
  z.style.display = "none";

  w = document.querySelector(".play_again");
  w.style.display = "flex";
  w.textContent = "Play Again"
}

start();

// ================ Global variable
let keyboard = {};
var score = 0;
var text2;
var time = 0;
var gamestart = false;
var gameOver = 0;
var finish = 0;
// console.log(gamestart)

text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.width = 100;
text2.style.height = 100;
text2.style.backgroundColor = "white";
text2.innerHTML = "SCORE: "+score;
text2.style.top = 40 + 'px';
text2.style.left = 470 + 'px';
document.body.appendChild(text2);

// =================== Camera, scene, helper =====================
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    50,
)
camera.position.set(0, 5, -10);
const OrbitControls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.castShadow = true;
light.position.set(8, 20, -10);
light.target.position.set(-4, 0, 15);
const lightHelper = new THREE.DirectionalLightHelper(light, 5);

light.shadowCameraLeft = -3000;
light.shadowCameraRight = 3000;
light.shadowCameraTop = 3500;
light.shadowCameraBottom = -3000;
scene.add(lightHelper);
scene.add(light)

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
]);


// Helper
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

// const gridHelper = new THREE.GridHelper(100, 100);
// scene.add(gridHelper);



// ================== GROUND ===========================
//

const textureLoader = new THREE.TextureLoader()

const ground = new Ground(12, 6, 75, 0, -3, 25, sandTexture);
ground.receiveShadow = true;
scene.add(ground);



// ================== OBSTACLES ===========================
//
let obstacles = [
    // new BoxObstacle(3, 3, 3, 2, 20, 0.15, 'red'),
    // new CylinderObstacle(4, 4, -2, 14, 0.2, 'blue'),
    // new SphereObstacle(3, -2, 20, 0.2, 'green'),
    // new ConeObstacle(2, 5, 4, 25, 0.3, 'green'),
];

let items = [];

// t1 = new Coin(0.5, 0.1, 2, 5, 0)
// const box = new THREE.Box3().setFromObject(t1);
// const boxHelper = new THREE.Box3Helper(box)
// scene.add(t1);
// scene.add(boxHelper);
// const teapot = new Teapot(0.5, 4, 0, 0);
// const box2 = new THREE.Box3().setFromObject(teapot);
// const boxHelper2 = new THREE.Box3Helper(box2)
// scene.add(teapot)
// scene.add(boxHelper2);

obstacles.forEach((obs) => {
    scene.add(obs);
    obs.castShadow = true;
})

items.forEach((obs) => {
    scene.add(obs);
    obs.castShadow = true;
})



// ================== CHRACTER ===========================
//
let characterController;
const modelUrl = new URL('../assets/robot.glb', import.meta.url);

new GLTFLoader().load(modelUrl.href, function (gltf) {
    // Model
    const model = gltf.scene;
    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    model.scale.set(1.7, 1.7, 1.7);

    // Bounding Box of Model
    const bbox = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 5.5, 2.25),
      new THREE.MeshBasicMaterial({color: 'green', transparent: true, opacity: 0.5 })
    )

    // Add model to bbox
    bbox.position.y = 2.75;
    model.position.y = -2.75;
    model.position.z = 0;
    bbox.add(model);
    scene.add(bbox);

    // Animation controller
    const gltfAnimation = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap = new Map();
    gltfAnimation.filter(a => a.name != 'TPose').forEach((a) => {
      const clipAction = mixer.clipAction(a);
      // if (a.name == "Armature.001|JumpAnimation")
      //     clipAction.timeScale = 0.5;
      animationsMap.set(a.name, clipAction);
    })

    characterController = new CharacterController(model, bbox, mixer, animationsMap, camera);
})

addKeysListener();

function addKeysListener(){
    window.addEventListener('keydown', function(event){
        keyboard[event.keyCode] = true;
    } , false);
    window.addEventListener('keyup', function(event){
        keyboard[event.keyCode] = false;
    } , false);
}



// ================== ANIMATION ===========================
//
frame_cnt = 0;
const clock = new THREE.Clock();

function animate() {
    const id = requestAnimationFrame( animate );
    const mixerUpdateDelta = clock.getDelta();
    renderer.render(scene, camera);

    // Remove invalid obstacles
    obstacles = obstacles.filter((obs) => {
      if (obs.position.z >= -10)
          return true;
      else {
          const removedObs = scene.getObjectById(obs.id);
          scene.remove(removedObs);
          return false;
      }
    });
    
    items = items.filter((obs) => {
      if (obs.position.z >= -10) 
          return true;
      else {
          const removedObs = scene.getObjectById(obs.id);
          scene.remove(removedObs);
          return false;
      }
    });
    
    text2.innerHTML = "SCORE: " + score;
    
    if(!gameOver && !finish && gamestart)
    {
      // Character
      if (characterController) {
        // Update movement and animation
        characterController.update(mixerUpdateDelta, keyboard);

        // Check if character fall out of ground
        if (characterController.checkBeFallen(ground)) {
            console.log('Fall')
        }

        // Movement and collision of obstacles
        obstacles.forEach((obs) => {
          obs.move();
        })

        if (characterController.checkObstaclesHit(obstacles))
            gameOver = 1;
        
        // Movement and collision of items
        items.forEach((item) => {
            item.move();

          if (characterController.checkItemPickup(item)) {
            const id = scene.getObjectById(item.id);
            
          }
        })

        items = items.filter((item) => {
          item.move(); 

          if (characterController.checkItemPickup(item)) {
            // Remove item
            const rmItem = scene.getObjectById(item.id);
            scene.remove(rmItem);

            // Player earn gold or effect
            if (rmItem instanceof Coin) {
              score += 10;
              console.log('Get coin')
            }
            else if (rmItem instanceof Teapot) {
              console.log('Get High')
            }

            return false;
          }

          return true;
        });
  
        
          
        //   // Check collision with items
        //   var collisionResultsBonusObstacles = ray.intersectObjects(items);
        //   if (collisionResultsBonusObstacles.length > 0 && collisionResultsBonusObstacles[0].distance < directionVector.length())
        //   {
        //       console.log('Coin!');
        //         score += 10;
        //       if (score == 2000){
        //           finish = 1;
        //       }
        //   }
        // }
      }
  
      frame_cnt++;
      if (frame_cnt == 75) {
          const coin1 = new Coin(0.5, 0.1, -3.5, 50, 0.2);
          const coin2 = new Coin(0.5, 0.1, 0, 50, 0.2);
          const teapot = new Teapot(0.5, 3.5, 50, 0.2);
          scene.add(coin1, coin2, teapot);
          items.push(coin1, coin2, teapot);
          
          const obs = new BoxObstacle(3, 3, 3, 0, 50, 0.2, 'red');
          obs.castShadow = true;
          scene.add(obs);
          obstacles.push(obs);

          frame_cnt = 0;
      }
  }
  else {
    text2.style.top = 300 + 'px';
    text2.style.left = 410 + 'px';
    if(gameOver || finish){
      //text2.innerHTML = "GAMEOVER! SCORE: "+score;
      //cancelAnimationFrame(id);
      Game_over();
    }
  }
}

animate();

