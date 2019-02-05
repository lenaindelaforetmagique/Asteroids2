class Asteroid {
  constructor(x_ = 0, y_ = 0, parent_, size_ = 100, points_ = []) {
    this.parent = parent_;
    this.position = new Vector(x_, y_);
    let theta = Math.random() * Math.PI * 2;
    this.velocity = new Vector(Math.cos(theta), Math.sin(theta));
    this.velocity.mult(Math.random() * 2 + 1);
    // this.velocity.mult(0);
    this.acceleration = new Vector(0, 0);
    this.theta = 0;
    this.dtheta = (Math.random() - 0.5) / 10; // 0.5 / Math.PI;

    this.size = size_;

    // this.maxForce = 1;
    // this.maxSpeed = 4;

    this.polygon = new PolygonOnTorus(this.parent);

    if (points_.length == 0) {
      let sides = 16;
      for (let i = 0; i < sides; i++) {
        let angle = 2 * Math.PI * i / sides;
        let r = (Math.random() + 2) * this.size / 5;
        this.polygon.addPoint(new Vector(-r * Math.sin(angle), r * Math.cos(angle)));
      }
      // Square
      // this.polygon.addPoint(new Vector(-this.size / 2, -this.size / 2));
      // this.polygon.addPoint(new Vector(this.size / 2, -this.size / 2));
      // this.polygon.addPoint(new Vector(this.size / 2, this.size / 2));
      // this.polygon.addPoint(new Vector(-this.size / 2, this.size / 2));
    } else {
      for (let point of points_) {
        this.polygon.addPoint(point);
      }
    }

    this.setPosAngle(this.position, this.theta);
    this.dom = this.polygon.dom;
    this.dom.setAttribute("class", "asteroid");
  }

  setPosAngle(position_, angle_) {
    this.position = position_.copy();
    this.theta = angle_;
    this.polygon.update(this.position, this.theta);
  }

  update() {
    this.theta += this.dtheta;
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.polygon.update(this.position, this.theta);
  }

  // touchPoint(point) {
  //   let test = ((this.position.x + this.size / 2 > point.x) &&
  //     (this.position.x - this.size / 2 < point.x) &&
  //     (this.position.y + this.size / 2 > point.y) &&
  //     (this.position.y - this.size / 2 < point.y));
  //   return test;
  // }

  checkRocket(rocket) {
    return this.polygon.containsPoint(rocket.position);
  }


  explodes() {
    let children = [];
    let newSize = this.size / 2;
    let dl = this.size / 4 * Math.sqrt(2);
    let expl = 1;
    if (newSize > 13) {
      let newPolygons = this.polygon.polygonDefinition.cutInPieces(4);

      for (let newPoly of newPolygons) {
        let transl = newPoly.reCenter();
        transl.rotate(this.theta);
        let child = new Asteroid(0, 0, this.parent, newSize, newPoly.points);
        let newPos = transl.copy();
        newPos.add(this.position);
        child.setPosAngle(newPos, this.theta);

        let newVel = this.velocity.copy()
        transl.normalize();
        transl.mult(0.3 * Math.random());
        newVel.add(transl);
        child.velocity = newVel;

        child.dtheta = this.dtheta;
        children.push(child);
      }
    }
    return children;
  }

  //
  // explodes_old() {
  //   let children = [];
  //   let dl = this.size / 4 * Math.sqrt(2);
  //   let newSize = this.size / 2;
  //   let expl = 1;
  //   if (newSize > 13) {
  //     for (let i = 0; i < 4; i++) {
  //       let angle = this.theta + i * Math.PI / 2 + Math.PI / 4;
  //       let child = new Asteroid(this.position.x - dl * Math.sin(angle), this.position.y + dl * Math.cos(angle), this.parent, newSize);
  //       child.velocity = this.velocity.copy()
  //       child.velocity.add(new Vector(-Math.sin(angle) * expl * Math.random(), Math.cos(angle) * expl * Math.random()));
  //       child.theta = this.theta;
  //       child.dtheta = this.dtheta;
  //       child.update();
  //       children.push(child);
  //     }
  //   }
  //   return children;
  // }

  show() {
    this.polygon.show();
  }
}