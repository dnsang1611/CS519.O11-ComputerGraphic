import * as THREE from 'three';

export class Coin extends THREE.Mesh {
    constructor (radius, height, posX, posZ, velocity, color=0xffff00) {
        super(
            new THREE.CylinderGeometry(radius, radius, height, 30, true),
            new THREE.MeshPhongMaterial({ color: color })
        );

        this.radius = radius;

        this.position.set(posX, 1.5, posZ);
        this.rotateX(- Math.PI * 0.5);

        this.velocity = velocity;
    }

    updateSides () {
        this.front = this.position.z + this.radius / 2;
        this.back = this.position.z - this.radius / 2;
        this.right = this.position.x + this.radius / 2;
        this.left = this.position.x - this.radius / 2;
        this.top = this.position.y + this.radius / 2;
        this.bottom = this.position.y - this.radius / 2;
    }

    move() {
        this.updateSides();
        this.rotateZ(this.velocity);
        this.position.z -= this.velocity;
    }
}

// 0.3, 0.3, 0.1
// 0.5

export class Teapot extends THREE.Mesh {
    constructor (size, posX, posZ, velocity) {
        super(
            new THREE.TeapotGeometry(size),
            new THREE.MeshStandardMaterial({color: 'green'})
        )

        this.size = size;

        this.position.set(posX, 1.5, posZ);

        this.velocity = velocity;

        this.updateSides();
    }

    updateSides () {
        this.front = this.position.z + this.size / 2;
        this.back = this.position.z - this.size / 2;
        this.right = this.position.x + this.size / 2;
        this.left = this.position.x - this.size / 2;
        this.top = this.position.y + this.size / 2;
        this.bottom = this.position.y - this.size / 2;
    }

    move() {
        this.position.z -= this.velocity;
        this.updateSides();
    }
}