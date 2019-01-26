class Asteroid {
  constructor(x_, y_, size_ = 64, color_ = "") {
    this.position = new Vector(x_, y_);
    this.velocity = new Vector(Math.random() - 0.5, Math.random() - 0.5);
    this.velocity.mult(10);
    this.acceleration = new Vector(0, 0);
    this.theta = 0;
    this.dtheta = 0; // 0.5 / Math.PI;

    this.size = size_;

    // this.maxForce = 1;
    // this.maxSpeed = 4;
    if (color_ == "") {
      this.color = colorGenerator(Math.random() * 255, Math.random() * 255, Math.random() * 255, 0.5);
    } else {
      this.color = color_;
    }
    this.dom = document.createElementNS(SVGNS, 'polygon');
    this.dom.setAttribute('fill', this.color);
    this.dom.setAttribute('stroke', colorGenerator(50, 50, 50, 1));
  }

  update() {
    this.theta += this.dtheta;
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }


  touchPoint(point) {
    let test = ((this.position.x + this.size / 2 > point.x) &&
      (this.position.x - this.size / 2 < point.x) &&
      (this.position.y + this.size / 2 > point.y) &&
      (this.position.y - this.size / 2 < point.y));
    return test;
  }

  checkRocket(rocket) {
    let test = ((this.position.x + this.size / 2 > rocket.position.x - rocket.size / 2) &&
      (this.position.x - this.size / 2 < rocket.position.x + rocket.size / 2) &&
      (this.position.y + this.size / 2 > rocket.position.y - rocket.size / 2) &&
      (this.position.y - this.size / 2 < rocket.position.y + rocket.size / 2));
    // test = ((this.position.x > rocket.position.x) &&
    //   (this.position.x < rocket.position.x) &&
    //   (this.position.y > rocket.position.y) &&
    //   (this.position.y < rocket.position.y));

    return test;
  }


  explodes() {
    let children = [];
    let dl = this.size / 4;
    let newSize = this.size / 2;
    let expl = 1;
    if (newSize > 8) {
      let child = new Asteroid(this.position.x + dl, this.position.y + dl, newSize, this.color);
      child.velocity = this.velocity.copy()
      child.velocity.add(new Vector(expl * Math.random(), expl * Math.random()));
      children.push(child);
      child = new Asteroid(this.position.x + dl, this.position.y - dl, newSize, this.color);
      child.velocity = this.velocity.copy()
      child.velocity.add(new Vector(expl * Math.random(), -expl * Math.random()));
      children.push(child);
      child = new Asteroid(this.position.x - dl, this.position.y - dl, newSize, this.color);
      child.velocity = this.velocity.copy()
      child.velocity.add(new Vector(-expl * Math.random(), -expl * Math.random()));
      children.push(child);
      child = new Asteroid(this.position.x - dl, this.position.y + dl, newSize, this.color);
      child.velocity = this.velocity.copy()
      child.velocity.add(new Vector(-expl * Math.random(), expl * Math.random()));
      children.push(child);
    }
    return children;
  }

  show() {
    // console.log("lkjlk");
    // console.log(this.size);
    let listPoints = "";
    let dx = new Vector(Math.cos(this.theta), Math.sin(this.theta));
    dx.normalize();
    dx.mult(this.size / 2);
    let dy = new Vector(-dx.y, dx.x);

    let pointA = new Vector(this.position.x, this.position.y);
    let pointB = new Vector(this.position.x, this.position.y);
    let pointC = new Vector(this.position.x, this.position.y);
    let pointD = new Vector(this.position.x, this.position.y);

    pointA.add(dx);
    pointA.add(dy);

    pointB.add(dx);
    pointB.sub(dy);

    pointC.sub(dx);
    pointC.sub(dy);

    pointD.sub(dx);
    pointD.add(dy);

    this.dom.setAttribute('points',
      listXYToPolylinePoints(
        [pointA.x, pointB.x, pointC.x, pointD.x, pointA.x],
        [pointA.y, pointB.y, pointC.y, pointD.y, pointA.y]
      )
    );
  }
}