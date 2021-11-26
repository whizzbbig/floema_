import { Mesh, Program, Texture } from 'ogl';

import vertex from '../../shaders/plane-vertex.glsl';
import fragment from '../../shaders/plane-fragment.glsl';

export default class Media {
  constructor({ element, geometry, gl, index, scene }) {
    this.element = element;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.index = index;

    this.createTexture();
    this.createProgram();
    this.createMesh();
  }

  createTexture() {
    this.texture = new Texture(this.gl);

    console.log(this.element);

    this.image = new window.Image();
    this.image.crossOrigin = 'anonymous';
    this.image.src = this.element.getAttribute('data-src');
    this.image.onload = (_) => (this.texture.image = this.image);
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: this.texture },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(this.scene);

    this.mesh.position.x = this.index * this.mesh.scale.x;
  }
}
