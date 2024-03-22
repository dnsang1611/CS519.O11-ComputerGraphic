import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader()

export class Ground extends THREE.Mesh {
    constructor (width, height, depth, posX, posY, posZ, texture) {
        super(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({map: textureLoader.load(texture)})
        )

        this.position.set(posX, posY, posZ);

        this.left = this.position.x - this.getWidth() / 2;
        this.right = this.position.x + this.getWidth() / 2;
    }

    getWidth () {
        return this.geometry.parameters.width;
    }

    getHeight () {
        return this.geometry.parameters.height;
    }

    getDepth () {
        return this.geometry.parameters.depth;
    }

    move () {

    }
}