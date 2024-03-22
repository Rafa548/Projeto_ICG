import * as THREE from 'https://threejs.org/build/three.module.js';

class Enemy {
    constructor(mesh, position, path, target, health, speed) {
        this.mesh = mesh;
        this.position = position;
        this.currentPosition = 0;
        this.path = path;
        this.target = target;
        this.health = health;
        this.speed = speed;
    }
}

const enemies = [];

 // Function to spawn enemies at the start of the path (talvez implementar varios spawns em locais diferentes do mapa (cantos) a ideia seria escolher as pontas 1 meta restantes spawn de enemies logo é preciso de varios paths)
export function spawnEnemies(mapData,path,scene) {
    const size_X = mapData.data.length;
    const size_Y = mapData.data[0].length;

    const enemyMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 32, 16),
        new THREE.MeshBasicMaterial({ color: 0xff0000 }) // Red material for enemy
    );

    var pathlength = path.length;

    const enemyStartPos = new THREE.Vector3(path[0].x,1,path[0].z); 
    //console.log(enemyStartPos)
    const enemyTarget = new THREE.Vector3(path[pathlength-1].x, 1, path[pathlength-1].z);
    const enemyHealth = 100;
    const enemySpeed = 1;
    const enemy = new Enemy(enemyMesh, enemyStartPos, path, enemyTarget, enemyHealth, enemySpeed);
    //console.log(posx,posy)
    scene.add(enemyMesh);
    enemy.mesh.position.set(enemyStartPos.x, enemyStartPos.y, enemyStartPos.z);
    enemies.push(enemy);
    return;
}

export function updateEnemies(mapData,scene) {
    enemies.forEach(enemy => {
        var currentX = enemy.position.x;
        var currentZ = enemy.position.z;

        var path = enemy.path;
        var target = path[enemy.currentPosition];

        const deltaX = target.x - currentX;
        const deltaZ = target.z - currentZ;

        const direction = new THREE.Vector2(deltaX, deltaZ).normalize();

        const speed = 0.01; // Adjust this value to control the speed (lower value = slower speed)

        enemy.mesh.position.x += direction.x * speed;
        enemy.mesh.position.z += direction.y * speed;

        if (Math.abs(enemy.mesh.position.x - target.x) <= speed && Math.abs(enemy.mesh.position.z - target.z) <= speed) {
            enemy.currentPosition++;

            if (enemy.currentPosition >= path.length) {
                scene.remove(enemy.mesh);
                enemies.splice(enemies.indexOf(enemy), 1);
                return;
            }
        }

        enemy.position.x = enemy.mesh.position.x;
        enemy.position.z = enemy.mesh.position.z;
    });
}
