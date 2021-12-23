/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
import { Plane, Transform } from 'ogl';

import GSAP from 'gsap';

import map from 'lodash/map';

import Gallery from './Gallery';

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.sizes = sizes;

    this.group = new Transform();

    this.createGeometry();
    this.createGalleries();

    this.onResize({
      sizes: this.sizes,
    });

    this.group.setParent(scene);

    this.show();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGalleries() {
    this.galleriesElements = document.querySelectorAll('.about__gallery');

    this.galleries = map(this.galleriesElements, (element, index) => {
      return new Gallery({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
      });
    });
  }

  // Animations
  show() {
    map(this.galleries, (gallery) => gallery.show());
  }

  hide() {
    map(this.galleries, (gallery) => gallery.hide());
  }

  // Events

  onResize(e) {
    map(this.galleries, (gallery) => gallery.onResize(e));
  }

  onTouchDown(e) {
    map(this.galleries, (gallery) => gallery.onTouchDown(e));
  }

  onTouchMove(e) {
    map(this.galleries, (gallery) => gallery.onTouchMove(e));
  }

  onTouchUp(e) {
    map(this.galleries, (gallery) => gallery.onTouchUp(e));
  }

  onWheel({ pixelX, pixelY }) {}

  // Update

  update(scroll) {
    map(this.galleries, (gallery) => gallery.update(scroll));
  }

  // Destroy
  destroy() {
    map(this.galleries, (gallery) => gallery.destroy());
  }
}
