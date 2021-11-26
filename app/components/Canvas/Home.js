import { Plane, Transform } from 'ogl';
import map from 'lodash/map';

import Media from './Media';

export default class {
  constructor({ gl, scene }) {
    this.gl = gl;
    this.group = new Transform();
    this.medias = document.querySelectorAll('.home__gallery__media__image');

    this.createGeometry();
    this.createGallery();

    this.group.setParent(scene);
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGallery() {
    map(this.medias, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
      });
    });
  }
}
