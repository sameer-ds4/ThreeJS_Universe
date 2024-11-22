import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GetObjectsOnClick, GetObjectWithName } from './RayCastHelper';
import gsap from 'gsap';

// import { distance } from 'three/webgpu';
// import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
// import { DragControls } from 'three/addons/controls/DragControls.js';

//Declaring the Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

//Camera and Aspect ratio of the camera
const aspectRatio = window.innerWidth/window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000 );
scene.add(camera);
camera.position.z = 50;


//Declaring Cube Geometry and Mesh
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const sunPosition = new THREE.Vector3(0, 0, 0);
const sunTex = textureLoader.load("Static/Textures/2k_sun.jpg");
const sunMaterial = new THREE.MeshBasicMaterial({map : sunTex});
const sunMesh = new THREE.Mesh
(
  sphereGeometry,
  sunMaterial
)
sunMesh.position.copy(sunPosition);
sunMesh.scale.setScalar(5);
scene.add(sunMesh);

const earthTex = textureLoader.load("Static/Textures/2k_earth_daymap.jpg");
const earthMaterial = new THREE.MeshStandardMaterial({map : earthTex});

const moonTex = textureLoader.load("Static/Textures/2k_moon.jpg");
const moonMaterial = new THREE.MeshStandardMaterial({map : moonTex});

const mercuryTex = textureLoader.load("Static/Textures/2k_mercury.jpg");
const mercuryMaterial = new THREE.MeshStandardMaterial({map : mercuryTex});

const venusTex = textureLoader.load("Static/Textures/2k_venus_surface.jpg");
const venusMaterial = new THREE.MeshStandardMaterial({map : venusTex});

const marsTex = textureLoader.load("Static/Textures/2k_mars.jpg");
const marsMaterial = new THREE.MeshStandardMaterial({map : marsTex});

const backgroundTex = cubeTextureLoader.setPath("Static/Standard-Cube-Map/").load
([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png"
  ]);

scene.background = backgroundTex;

const planets = 
[
  {
    name: "Mercury",
    radius: 0.5,
    distance: 7,
    speed: 0.001,
    material: mercuryMaterial,
    moons:
    [

    ]
  },
  {
    name: "Venus",
    radius: 0.85,
    distance: 10,
    speed: 0.003,
    material: venusMaterial,
    moons:
    [

    ]
  },
  {
    name: "Earth",
    radius: 1,
    distance: 14,
    speed: 0.01,
    material: earthMaterial,
    moons: 
    [
      {
        name: "Moon",
        radius: 0.4,
        distance: 2,
        speed: 0.05,
        material: moonMaterial
      }
    ]
  },
  {
    name: "Mars",
    radius: 1.5,
    distance: 22,
    speed: 0.005,
    material: marsMaterial,
    moons:
    [
      {
        name: "Phobos",
        radius: 0.15,
        distance: 1.5,
        speed: 0.005,
        material: moonMaterial
      },
      {
        name: "Deimos",
        radius: 0.07,
        distance: 2.2,
        speed: 0.008,
        material: moonMaterial
      }
    ]
  }
]

const createPlanet = (planet) =>
  {
    const planetMesh = new THREE.Mesh
    (
      sphereGeometry,
      planet.material
    );
    planetMesh.scale.setScalar(planet.radius);
    planetMesh.position.z = planet.distance;
    planetMesh.name = planet.name;
    return planetMesh;
  }
  
  const createMoon = (moon) =>
  {
    const moonMesh = new THREE.Mesh
      (
        sphereGeometry,
        moonMaterial
      );
      moonMesh.scale.setScalar(moon.radius);
      moonMesh.position.z = moon.distance;
      return moonMesh;
  }

const planetMeshes = planets.map((planet) =>
{  
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);

  planet.moons.forEach((moon) => 
  {
    const moonMesh = createMoon(moon);
    planetMesh.add(moonMesh);
  });
  return planetMesh;
});


const light = new THREE.AmbientLight(0xffffff, .1);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 500, 0, 2);
scene.add(pointLight);

//Canvas declared in HTML
const canvas = document.querySelector("canvas.threeJs");

//Declaring Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});

//Renderer properties for Antialiasing manually
renderer.setSize(window.innerWidth, window.innerHeight);
const maxPixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(maxPixelRatio);

//Drag and Rotate controls
const controls = new OrbitControls(camera, canvas);
// const controls = new DragControls(cubeMesh, camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;

///Time.deltaTime implementation
const clock = new THREE.Clock();
let previousTime = 0;

//Event for window resizing and autoadjust Aspect Ratio
window.addEventListener("resize", () => 
{
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/ window.innerHeight;
})

let planetS;

document.addEventListener("click", onClick);

function onClick(Event)
{
  // planetS = GetObjectWithName(Event, window, camera, scene, "Earth");
  planetS = GetObjectsOnClick(Event, window, camera, scene);
  console.log(planetS);
  // planetS.object.add(camera);
  const zD = planetS.object.position;
  camera.lookAt(planetS.object);
  gsap.to(camera.position, {
    z: zD.z + 8,
    x: zD.x + 8,
    y: zD.y + 8,
    duration: 1.2
  });
}

//RenderLoop similar to update
const renderLoop = () =>
{
  const currentTime = clock.getElapsedTime();
  const delta = currentTime - previousTime;
  previousTime = currentTime;

  planetMeshes.forEach((planet, planetIndex) => 
  {
    planet.rotation.y += planets[planetIndex].speed;
    planet.position.z = Math.sin(planet.rotation.y) * planets[planetIndex].distance;
    planet.position.x = Math.cos(planet.rotation.y) * planets[planetIndex].distance;

    planet.children.forEach((moon, moonIndex) =>
    {
      moon.rotation.y += planets[planetIndex].moons[moonIndex].speed;
      moon.position.x = Math.sin(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
      moon.position.z = Math.cos(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
    });
  });

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);

}

renderLoop();
