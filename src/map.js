import * as THREE from 'https://threejs.org/build/three.module.js';

var maps = [
  {
    "data" : [
      [4, 1, 4, 4, 2, 4, 4, 4, 4, 0],
      [2, 1, 1, 1, 1, 1, 1, 1, 4, 0],
      [4, 4, 4, 4, 4, 4, 2, 1, 4, 0],
      [0, 0, 0, 0, 4, 1, 1, 1, 2, 0],
      [0, 0, 0, 0, 2, 1, 4, 4, 4, 0],
      [0, 0, 0, 0, 4, 1, 4, 0, 0, 0],
      [0, 0, 0, 0, 4, 1, 4, 0, 0, 0],
      [0, 0, 0, 0, 4, 1, 4, 4, 2, 4],
      [0, 0, 0, 0, 2, 1, 1, 1, 1, 4],
      [0, 0, 0, 0, 4, 4, 2, 4, 1, 4]
    ]
  },
  { 
    "data" : [
      [4, 4, 2, 4, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 4, 0, 0, 0, 0, 0, 0],
      [4, 4, 1, 4, 4, 0, 0, 0, 0, 0],
      [0, 2, 1, 1, 4, 2, 4, 4, 2, 4],
      [0, 4, 4, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 2, 4, 4, 4, 2, 4, 4, 4],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]},
  { 
    "data" : [
      [4, 1, 4, 4, 0, 0, 0, 0, 0, 0],
      [2, 1, 1, 4, 0, 0, 0, 0, 0, 0],
      [4, 4, 1, 2, 4, 0, 0, 0, 0, 0],
      [0, 4, 1, 1, 4, 4, 4, 2, 4, 4],
      [0, 4, 2, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 4, 4, 2, 2, 4, 4, 4, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]},
  { 
    "data" : [
      [4, 2, 4, 4, 4, 4, 4, 2, 4, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 4, 0],
      [4, 4, 4, 2, 2, 4, 4, 1, 2, 0],
      [4, 1, 1, 1, 2, 4, 4, 1, 4, 0],
      [4, 1, 4, 1, 1, 1, 1, 1, 4, 0],
      [4, 1, 4, 4, 4, 4, 2, 2, 4, 0],
      [4, 1, 2, 4, 4, 4, 0, 0, 0, 0],
      [4, 1, 1, 1, 1, 2, 0, 0, 0, 0],
      [4, 4, 4, 2, 1, 4, 0, 0, 0, 0],
      [0, 0, 0, 4, 1, 4, 0, 0, 0, 0]
  ]},
  { 
    "data" : [
      [4, 1, 2, 0, 0, 0, 0, 0, 0, 0],
      [4, 1, 1, 4, 0, 0, 0, 0, 0, 0],
      [4, 4, 1, 4, 4, 0, 0, 0, 0, 0],
      [0, 2, 1, 1, 4, 0, 0, 0, 0, 0],
      [0, 4, 4, 1, 2, 0, 0, 0, 0, 0],
      [0, 0, 2, 1, 4, 0, 0, 0, 0, 0],
      [0, 0, 2, 1, 4, 0, 0, 0, 0, 0],
      [0, 0, 4, 1, 4, 2, 4, 2, 0, 0],
      [0, 0, 4, 1, 1, 1, 1, 4, 0, 0],
      [0, 0, 4, 4, 4, 2, 1, 4, 0, 0]
  ]},
  { 
    "data" : [
      [4, 1, 4, 4, 4, 2, 4, 0, 0, 0],
      [4, 1, 4, 1, 1, 1, 4, 0, 0, 0],
      [4, 1, 2, 1, 2, 1, 4, 0, 0, 0],
      [4, 1, 2, 1, 4, 1, 2, 2, 4, 4],
      [4, 1, 4, 1, 4, 1, 1, 1, 1, 1],
      [2, 1, 4, 1, 2, 4, 4, 4, 4, 2],
      [4, 1, 4, 1, 4, 0, 0, 0, 0, 0],
      [4, 1, 4, 1, 4, 0, 0, 0, 0, 0],
      [4, 1, 1, 1, 4, 0, 0, 0, 0, 0],
      [4, 2, 2, 4, 4, 0, 0, 0, 0, 0]
  ]}
];

export function getRandomMap() {
  var randomIndex = Math.floor(Math.random() * maps.length);
  console.log(randomIndex);
  return maps[randomIndex];
}

export function loadMap(mapdata, scene, clickableObjs)
{
  var size_Y = mapdata.data.length;
  var size_X = mapdata.data[0].length;

  const material = new THREE.MeshLambertMaterial();
  const geometry = new THREE.BoxGeometry(2,2,2);
  var basic_cube = new THREE.Mesh(geometry, material);

  const road_material = new THREE.MeshLambertMaterial({color : 0x2c3e50});
  var road_cube = new THREE.Mesh(geometry, road_material);

  const tree_material = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Green color for trees
  const tree_geometry = new THREE.ConeGeometry(1, 4, 8); // Cone-shaped tree

  for(var x  = 0 ; x < size_X ; x++)
  {
    for(var y = 0 ; y < size_Y ;  y++)
    {
        var posx = (x*2) - (size_X/2)*2;
        var posy = (y*2) - (size_Y/2)*2;

        switch(mapdata.data[y][x])
        {
          

          case 0:
              const block = basic_cube.clone();
              block.position.set(posx, 0, posy);
              scene.add(block);
              break

          case 1 :
              var tmpbloc = road_cube.clone();
              tmpbloc.scale.y = 0.8;
              //console.log("omg",posx)
              //console.log(posy)
              tmpbloc.position.set(posx, -0.2 , posy);
              scene.add(tmpbloc);
              break;

          case 2:
              const tree = new THREE.Mesh(tree_geometry, tree_material);
              tree.position.set(posx, 2, posy);
              scene.add(tree);

              const block0 = basic_cube.clone();
              block0.position.set(posx, 0, posy); 
              scene.add(block0);
              break;

          case 4:
              var tmpbloc = basic_cube.clone();
              //console.log("swnasuhuahs",posx)
              //console.log(posy)
              tmpbloc.position.set(posx, 0 , posy);
              scene.add(tmpbloc);
              clickableObjs.push(tmpbloc);
              break;
        }
    }
  }
}

export function extractPath(mapdata) {
  const path = [];
  const visited = new Set(); 

  let y = 0;
  let x = 0;

  while (true) {
    let closestX = -1;
    let closestY = -1;
    let minDistance = Infinity;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const newY = y + dy;
        const newX = x + dx;

        if (newY >= 0 && newY < mapdata.data.length && newX >= 0 && newX < mapdata.data[0].length && !visited.has(`${newY},${newX}`)) {
          if (mapdata.data[newY][newX] === 1) {
            const distance = Math.abs(dx) + Math.abs(dy); 
            if (distance < minDistance) {
              minDistance = distance;
              closestY = newY;
              closestX = newX;
            }
          }
        }
      }
    }

    if (closestX === -1 && closestY === -1) {
      break;
    }

    const posx = (closestX * 2) - (mapdata.data[0].length / 2) * 2;
    const posy = (closestY * 2) - (mapdata.data.length / 2) * 2;

    path.push({ x: posx, y: 0, z: posy });
    visited.add(`${closestY},${closestX}`);

    y = closestY;
    x = closestX;
  }

  return path;
}


