import * as THREE from 'https://threejs.org/build/three.module.js';

export var map0_data = {
  "data" : [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
  ]
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

  for(var x  = 0 ; x < size_X ; x++)
  {
    for(var y = 0 ; y < size_Y ;  y++)
    {
        var posx = (x*2) - (size_X/2)*2;
        var posy = (y*2) - (size_Y/2)*2;

        switch(mapdata.data[y][x])
        {
          case 0:
              var tmpbloc = basic_cube.clone();
              //console.log("swnasuhuahs",posx)
              //console.log(posy)
              tmpbloc.position.set(posx, 0 , posy);
              scene.add(tmpbloc);
              clickableObjs.push(tmpbloc);
          break;

          case 1 :
            var tmpbloc = road_cube.clone();
            tmpbloc.scale.y = 0.8;
            //console.log("omg",posx)
            //console.log(posy)
            tmpbloc.position.set(posx, -0.2 , posy);
            scene.add(tmpbloc);
          break;
        }
    }
  }
}

export function extractPath(mapdata) {
  const path = [];
  const visited = new Set(); // Track visited positions

  let y = 0;
  let x = 0;

  while (true) {
    // Find closest unvisited "1"
    let closestX = -1;
    let closestY = -1;
    let minDistance = Infinity;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const newY = y + dy;
        const newX = x + dx;

        // Check valid coordinates and avoid going back
        if (newY >= 0 && newY < mapdata.data.length && newX >= 0 && newX < mapdata.data[0].length && !visited.has(`${newY},${newX}`)) {
          if (mapdata.data[newY][newX] === 1) {
            const distance = Math.abs(dx) + Math.abs(dy); // Manhattan distance
            if (distance < minDistance) {
              minDistance = distance;
              closestY = newY;
              closestX = newX;
            }
          }
        }
      }
    }

    // No more "1" found, break the loop
    if (closestX === -1 && closestY === -1) {
      break;
    }

    // Update path and visited positions
    const posx = (closestX * 2) - (mapdata.data[0].length / 2) * 2;
    const posy = (closestY * 2) - (mapdata.data.length / 2) * 2;

    path.push({ x: posx, y: 0, z: posy });
    visited.add(`${closestY},${closestX}`);

    y = closestY;
    x = closestX;
  }

  return path;
}


