import * as THREE from 'three';

export function GetObjectWithName(Event, window, camera, scene, name)
{
  const rayCaster = new THREE.Raycaster();
  const getFirstValue = true;

  const MousePointer = MousePosition(Event, window);
  const Intersections = CheckRayIntersection(MousePointer, camera, rayCaster, scene);
  const Names = GetObjectsByName(Intersections, name);

  if(typeof Names[0] != "unnamed")
    return Names[0];
  // if(Names.length > 0)
  // {
  //   console.log("ajdfhvkuaedfvhseivsb");
  // }
  
  return null;
}

export function GetObjectsOnClick(Event, window, camera, scene)
{
  const rayCaster = new THREE.Raycaster();
  // const getFirstValue = true;

  const MousePointer = MousePosition(Event, window);
  const Intersections = CheckRayIntersection(MousePointer, camera, rayCaster, scene);

  return intersections;
}

export function MousePosition(event, window)
{
  let mousePos = new THREE.Vector2();

  mousePos.x = (event.clientX/ window.innerWidth) * 2 - 1;
  mousePos.y = -(event.clientY/ window.innerHeight) * 2 + 1;

  console.log(mousePos);

  return mousePos;
}

export function CheckRayIntersection(mousePointer, camera, raycaster, scene)
{
  raycaster.setFromCamera(mousePointer, camera);

  let intersections = raycaster.intersectObjects(scene.children);

  console.log(intersections.length);
  if (intersections.length > 0) {
    // If an intersection is found, 'intersects[0]' will be the first object hit
    const selectedMesh = intersections[0].object;
    // console.log('Clicked on:', selectedMesh);
    // You can now perform actions with the selected mesh
  }

  return intersections;
}

export function GetObjectsByName(objectList, name)
{
  const planetObjects = [];

  objectList.forEach(object => 
  {
    const objectName = object.object.name || "unnamed";
    objectName.includes(name) ? planetObjects.push(object.object) : null;
  });

  return planetObjects;
}