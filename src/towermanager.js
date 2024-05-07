import * as THREE from 'https://threejs.org/build/three.module.js';

class Tower
{
    constructor(type)
    {
        this.mesh = undefined;
        this.range = 6;
       
        this.targetEnemy = null;
        this.lines = new Map();
        this.type = type;

        const damageLookup = {
            'red': 0.04,
            'blue': 0.02,
            'yellow': 0.02,
        };

        this.damage = damageLookup[type] || 0.04;
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

    addTower(newtowermesh,type)
    {
      var newtower = new Tower(type);
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
          if (distance > tower.range) {
             removeLineTowerToEnemy(tower, enemy, scene);
          }
      });

      // If the enemy is not within range of any tower, remove its line
      if (!isInRange) {
          //console.log("Enemy is out of range of all towers!");
          removeLineForEnemy(enemy, scene);
      }
  });
}

function removeLineTowerToEnemy(tower, enemy, scene) {
    let line = tower.lines.get(enemy);
    if (line) {
        scene.remove(line);
        line.geometry.dispose();
        line.material.dispose();
        tower.lines.delete(enemy);
    }
    return;
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

  let can_shoot = isEnemyInRange(tower, enemy);
  if (can_shoot && enemy.health > 0) {
      if (tower.type == "slow") {
        enemy.speed = 0.007;
      }
      enemy.health -= tower.damage;
      //console.log(`Tower shot enemy! Enemy health: ${enemy.health}`);

      // Create or update the line connecting tower and enemy
      let line = getOrCreateLine(tower, enemy, scene);
      line.geometry.setFromPoints([
          tower.mesh.position,
          enemy.mesh.position
      ]);

      if (enemy.health <= 0) {
        
        //console.log("Enemy is dead!");
        removeLineForEnemy(enemy, scene)
        // Enemy is dead, remove the line for all towers targeting this enemy
    }
  }
  else {
      //console.log("Enemy is out of range of tower!");
      //tower.targetEnemy = null; // Clear the target for the tower
      if (tower.targetEnemy) {
          tower.targetEnemy.targetedBy.delete(tower); // Remove the tower from the set of towers targeting the enemy
      }
      removeLine(tower, enemy, scene);
  }
}


function removeLineForEnemy(enemy, scene) {
    enemy.targetedBy.forEach(tower => {
        removeLine(tower, enemy, scene);
        tower.targetEnemy = null; // Clear the target for towers targeting this enemy
    });
    enemy.targetedBy.clear(); // Clear the set of towers targeting this enemy
    return;
}

function removeLine(tower, enemy, scene) {
  let line = tower.lines.get(enemy);
  if (line) {
      scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
      tower.lines.delete(enemy);
  }
  return;
}


function getOrCreateLine(tower, enemy, scene) {
  let line = tower.lines.get(enemy);
  if (!line) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
          tower.mesh.position,
          enemy.mesh.position
      ]);
      if (tower.type == "slow") {
        var material = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Blue color
      }
      else if (tower.type == "aoe") {
        var material = new THREE.LineBasicMaterial({ color: 0xffff00 }); // Yellow color
      }
      else {
        var material = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red color
      }
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
