import * as THREE from 'three';
import barrelTexture from '../imgs/wine_barrel.jpg';
import meteoTexture from '../imgs/meteorite.jpg'

const textureLoader = new THREE.TextureLoader()

export class BoxObstacle extends THREE.Mesh {
    constructor(width, height, depth, posX, posZ, velocity, color) {
        super(
            new THREE.BoxGeometry(width, height, depth),
            // new THREE.MeshStandardMaterial({
            //     // color: color,
            //     map: textureLoader.load(meteoTexture),
            //     wireframe: true
            // })
            new THREE.PointsMaterial({color: 'red', size: 0.2})
        )

        this.position.set(posX, height / 2, posZ);
        this.velocity = velocity;
    }

    move () {
        this.position.z -= this.velocity;
    }
}


export class CylinderObstacle extends THREE.Mesh {
    constructor(radius, height, posX, posZ, velocity, color) {
        super(
            new THREE.CylinderGeometry(radius, radius, height, 20),
            new THREE.MeshStandardMaterial({
                // color: color,
                map: textureLoader.load(meteoTexture),
            })
        )

        this.position.set(posX, radius, posZ);
        this.radius = radius;
        this.rotateZ(Math.PI * 0.5);
        this.velocity = velocity;
    }

    move () {
        this.rotateY(2 * this.velocity / this.radius);
        this.position.z -= this.velocity;
    }
}

export class SphereObstacle extends THREE.Points {
    constructor (radius, posX, posZ, velocity, color) {
        super(
            new THREE.SphereGeometry(radius, 20, 20),
            // new THREE.MeshStandardMaterial({
            //     // color: color,
            //     // map: textureLoader.load(meteoTexture),
                
            // })
            new THREE.PointsMaterial({color: color, size: 0.2})
        )

        this.position.set(posX, radius, posZ);
        this.radius = radius;
        this.velocity = velocity;
    }

    move () {
        this.rotateX(- 2 * this.velocity / this.radius);
        this.position.z -= this.velocity;
    }
}

export class ConeObstacle extends THREE.Mesh {
    constructor (radius, height, posX, posZ, velocity, color) {
        super(
            new THREE.ConeGeometry(radius, height, 20, 20),
            new THREE.MeshStandardMaterial({
                // color: color,
                map: textureLoader.load(meteoTexture),
            })
        )

        this.position.set(posX, height, posZ);
        this.rotateX(- Math.PI * 0.5);
        this.velocity = velocity;
    }

    move() {
        this.rotateY(0.2);
        this.position.z -= this.velocity;
    }
}



