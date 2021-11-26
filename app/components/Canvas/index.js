/* eslint-disable no-unused-vars */
import { Camera, Renderer, Transform } from 'ogl';

import Home from './Home';

export default class Canvas {
  constructor() {
    this.createRenderer();
    this.createScene();
    this.createHome();
    this.createCamera();
  }

  createRenderer() {
    this.renderer = new Renderer();

    this.gl = this.renderer.gl;

    document.body.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);

    this.camera.position.z = 5;
  }

  createScene() {
    this.scene = new Transform();
  }

  createHome() {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
    });
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight,
    });
  }

  update() {
    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
