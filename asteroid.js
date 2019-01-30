class Asteroid {
  constructor(x_, y_, parent_, size_ = 100) {
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
    for (let i = 0; i < 7; i++) {
      let angle = 2 * Math.PI * i / 7;
      let r = (Math.random() + 0.5) * this.size / 2;
      this.polygon.addPoint(new Vector(-r * Math.sin(angle), r * Math.cos(angle)));
    }

    // this.polygon.addPoint(new Vector(-this.size / 2, -this.size / 2));
    // this.polygon.addPoint(new Vector(this.size / 2, -this.size / 2));
    // this.polygon.addPoint(new Vector(this.size / 2, this.size / 2));
    // this.polygon.addPoint(new Vector(-this.size / 2, this.size / 2));
    this.polygon.update(this.position, this.theta);
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
    let dl = this.size / 4 * Math.sqrt(2);
    let newSize = this.size / 2;
    let expl = 1;
    if (newSize > 13) {
      for (let i = 0; i < 4; i++) {
        let angle = this.theta + i * Math.PI / 2 + Math.PI / 4;
        let child = new Asteroid(this.position.x - dl * Math.sin(angle), this.position.y + dl * Math.cos(angle), this.parent, newSize);
        child.velocity = this.velocity.copy()
        child.velocity.add(new Vector(-Math.sin(angle) * expl * Math.random(), Math.cos(angle) * expl * Math.random()));
        child.theta = this.theta;
        children.push(child);
      }
    }
    return children;
  }

  show() {
    this.polygon.show();
  }
}