class Asteroid {
  constructor(x_, y_, parent_, size_ = 64) {
    this.parent = parent_;
    this.position = new Vector(x_, y_);
    let theta = Math.random() * Math.PI * 2;
    this.velocity = new Vector(Math.cos(theta), Math.sin(theta));
    this.velocity.mult(Math.random() * 2 + 1);

    this.acceleration = new Vector(0, 0);
    this.theta = 0;
    this.dtheta = 0; // 0.5 / Math.PI;

    this.size = size_;

    // this.maxForce = 1;
    // this.maxSpeed = 4;

    this.polygon = new PolygonOnTorus(this.parent);
    this.polygon.addPoint(new Vector(-this.size / 2, -this.size / 2));
    this.polygon.addPoint(new Vector(this.size / 2, -this.size / 2));
    this.polygon.addPoint(new Vector(this.size / 2, this.size / 2));
    this.polygon.addPoint(new Vector(-this.size / 2, this.size / 2));
    this.dom = this.polygon.dom;
    this.dom.setAttribute("class", "asteroid");
  }

  update() {
    this.theta += this.dtheta;
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.polygon.update(this.position, this.theta);
  }

  touchPoint(point) {
    let test = ((this.position.x + this.size / 2 > point.x) &&
      (this.position.x - this.size / 2 < point.x) &&
      (this.position.y + this.size / 2 > point.y) &&
      (this.position.y - this.size / 2 < point.y));
    return test;
  }

  checkRocket(rocket) {
    return this.polygon.containsPoint(rocket.position);
  }


  explodes() {
    let children = [];
    let dl = this.size / 4;
    let newSize = this.size / 2;
    let expl = 1;
    if (newSize > 8) {
      let child = new Asteroid(this.position.x + dl, this.position.y + dl, this.parent, newSize);
      child.velocity = this.velocity.copy()
      child.velocity.add(new Vector(expl * Math.random(), expl * Math.random()));
      children.push(child);
      child = new Asteroid(this.position.x + dl, this.position.y - dl, this.parent, newSize);
      child.velocity = this.velocity.copy()
      child.velocity.add(new Vector(expl * Math.random(), -expl * Math.random()));
      children.push(child);
      child = new Asteroid(this.position.x - dl, this.position.y - dl, this.parent, newSize);
      child.velocity = this.velocity.copy()
      child.velocity.add(new Vector(-expl * Math.random(), -expl * Math.random()));
      children.push(child);
      child = new Asteroid(this.position.x - dl, this.position.y + dl, this.parent, newSize);
      child.velocity = this.velocity.copy()
      child.velocity.add(new Vector(-expl * Math.random(), expl * Math.random()));
      children.push(child);
    }
    return children;
  }

  show() {
    this.polygon.show();
  }
}