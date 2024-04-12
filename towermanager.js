import * as THREE from 'https://threejs.org/build/three.module.js';

class Tower
{
    constructor()
    {
        this.mesh = undefined;
        this.range = 6;
        this.damage = 0.005;
        this.targetEnemy = null;
        this.lines = new Map(); 
    }
}

export class TowerManager
{
    constructor()
    {
        // ---- Tower List ----
        this.towerArray = new Array();

        // ---- Temporary variables ----
        this.newTowerMeshToCreate = undefined;
        this.selectedTower = undefined;
    }

    addTower(newtowermesh)
    {
      var newtower = new Tower();
      newtower.mesh = newtowermesh;
      this.towerArray.push(newtower);
    }

    deleteTower(TowerObj)
    {
        const index = this.towerArray.indexOf(TowerObj);
        if (index > -1) {
          this.towerArray.splice(index, 1);
        }
    }

    getTowerAtPosition(x, z)
    {
        for(var i = 0 ; i < this.towerArray.length ; i++ )
        {
            if(this.towerArray[i].mesh.position.x == x && this.towerArray[i].mesh.position.z == z )
            {
                return this.towerArray[i];
            }
        }
        return null;
    }

    
}

export function clearLinesForOutOfRangeEnemies(towers, enemies, scene) {
  enemies.forEach(enemy => {
      let isInRange = false;
      towers.forEach(tower => {
          // Check if the enemy is within range of any tower
          const distance = Math.sqrt(
              Math.pow(tower.mesh.position.x - enemy.mesh.position.x, 2) +
              Math.pow(tower.mesh.position.z - enemy.mesh.position.z, 2)
          );

          if (distance <= tower.range) {
              isInRange = true;
          }
      });

      // If the enemy is not within range of any tower, remove its line
      if (!isInRange) {
          console.log("Enemy is out of range of all towers!");
          removeLineForEnemy(enemy, scene);
      }
  });
}


export function shootFromTowers(towers, enemies, scene) {
  //clearLinesForOutOfRangeEnemies(towers, enemies, scene)
  towers.forEach(tower => {
      // Check if the tower already has a target or if the target is out of range
      if (!tower.targetEnemy || tower.targetEnemy.health <= 0 || !isEnemyInRange(tower, tower.targetEnemy)) {
          // Find a new target for the tower
          let closestEnemy = null;
          let closestDistance = Infinity;

          enemies.forEach(enemy => {
              // Check if the enemy is already targeted by another tower
              if (isEnemyInRange(tower, enemy)) {
                  const distance = Math.sqrt(
                      Math.pow(tower.mesh.position.x - enemy.mesh.position.x, 2) +
                      Math.pow(tower.mesh.position.z - enemy.mesh.position.z, 2)
                  );
                  if (distance < closestDistance) {
                      closestDistance = distance;
                      closestEnemy = enemy;
                  }
              }
          });

          if (closestEnemy) {
              // Set the enemy as the target for the tower
              tower.targetEnemy = closestEnemy;
              closestEnemy.targetedBy.add(tower); // Mark the enemy as targeted by this tower
          }
      }

      // Shoot at the target enemy if it exists
      if (tower.targetEnemy) {
          shootFromTower(tower, tower.targetEnemy, scene);
      }
  });
}

function shootFromTower(tower, enemy, scene) {
  // Check if enemy is within range of tower
  const distance = Math.sqrt(
      Math.pow(tower.mesh.position.x - enemy.mesh.position.x, 2) +
      Math.pow(tower.mesh.position.z - enemy.mesh.position.z, 2)
  );

  if (distance <= tower.range && enemy.health > 0) {
      // Reduce enemy health
      enemy.health -= tower.damage;
      //console.log(`Tower shot enemy! Enemy health: ${enemy.health}`);

      // Create or update the line connecting tower and enemy
      const line = getOrCreateLine(tower, enemy, scene);
      line.geometry.setFromPoints([
          tower.mesh.position,
          enemy.mesh.position
      ]);

      if (enemy.health <= 0) {
        // Enemy is dead, remove the line for all towers targeting this enemy
        console.log("Enemy is dead!");
        removeLineForEnemy(enemy, scene)
    }
  }
  else {
      console.log("Enemy is out of range of tower!");
      //tower.targetEnemy = null; // Clear the target for the tower
      removeLine(tower, enemy, scene);
  }
}


function removeLineForEnemy(enemy, scene) {
    enemy.targetedBy.forEach(tower => {
        removeLine(tower, enemy, scene);
        tower.targetEnemy = null; // Clear the target for towers targeting this enemy
    });
    enemy.targetedBy.clear(); // Clear the set of towers targeting this enemy
}

function removeLine(tower, enemy, scene) {
  console.log("Removing line");
  console.log(tower.lines);
  console.log(enemy);
  let line = tower.lines.get(enemy);
  console.log("Removing line", line);
  if (line) {
      console.log("Removing line");
      scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
      tower.lines.delete(enemy);
  }
}


function getOrCreateLine(tower, enemy, scene) {
  // Check if line already exists for this tower-enemy pair
  let line = tower.lines.get(enemy);
  if (!line) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
          tower.mesh.position,
          enemy.mesh.position
      ]);
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red color
      line = new THREE.Line(geometry, material);
      scene.add(line);
      tower.lines.set(enemy, line);
  }
  return line;
}



function isEnemyInRange(tower, enemy) {
  const distance = Math.sqrt(
      Math.pow(tower.mesh.position.x - enemy.mesh.position.x, 2) +
      Math.pow(tower.mesh.position.z - enemy.mesh.position.z, 2)
  );
  return distance <= tower.range;
}
