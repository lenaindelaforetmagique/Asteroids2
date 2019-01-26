listXYToPolylinePoints = function(listX, listY) {
  let res = "";
  for (let i = 0; i < listX.length; i++) {
    res += listX[i] + ',' + listY[i] + ' ';
  }
  return res;
}

class Spaceship {
  constructor(x_, y_) {
    this.position = new Vector(x_, y_);
    this.velocity = new Vector(0, 0); //Math.random() - 0.5, Math.random() - 0.5);
    this.velocity.mult(10);
    this.acceleration = new Vector(0, 0);
    this.theta = 0;
    this.dtheta = 0; // 0.5 / Math.PI;

    this.boostOn = false;
    this.brakeOn = false;
    this.turnL = false;
    this.turnR = false;

    this.pointA = this.position.copy();
    this.pointB = this.position.copy();
    this.pointC = this.position.copy();

    this.size = 30;

    // this.maxForce = 1;
    // this.maxSpeed = 4;

    this.color = colorGenerator(Math.random() * 255, Math.random() * 255, Math.random() * 255, 0.5);
    this.dom = document.createElementNS(SVGNS, 'polygon');
    this.dom.setAttribute('fill', this.color);
    this.dom.setAttribute('stroke', colorGenerator(50, 50, 50, 1));
  }

  touched(asteroid) {
    let dist = this.position.copy();
    dist.sub(asteroid.position);
    dist = dist.norm();
    if (dist < this.size / 2 + asteroid.size / 2) {
      this.color = colorGenerator(Math.random() * 255, Math.random() * 255, Math.random() * 255, 0.5);
      this.dom.setAttribute('fill', this.color);
      return true;
    } else {
      return false;
    }
  }

  checkObstacles(obstacles) {
    this.acceleration.add(this.separation(obstacles));
  }

  checkBoids(boids) {
    this.acceleration.add(this.separation(boids));
    if (this.acceleration.norm() == 0) {
      this.acceleration.add(this.cohesion(boids));
    }
    this.acceleration.add(this.alignment(boids));
  }

  accelerate(fact) {
    let dAcc = new Vector(Math.cos(this.theta), Math.sin(this.theta));
    dAcc.mult(fact * 0.4);
    this.acceleration.add(dAcc);
  }

  rotate(fact) {
    this.dtheta -= fact * Math.PI / 360;
  }

  update() {
    if (this.boostOn) {
      this.accelerate(1);
    }
    if (this.brakeOn) {
      this.accelerate(-0.5);
    }
    if (this.turnL) {
      this.rotate(1);
    }
    if (this.turnR) {
      this.rotate(-1);
    }

    this.theta += this.dtheta;
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    // console.log("lkjlk");
    // console.log(this.size);
    let listPoints = "";
    let dx = new Vector(Math.cos(this.theta), Math.sin(this.theta));
    dx.normalize();
    let dy = new Vector(-dx.y, dx.x);

    this.pointA = this.position.copy();
    this.pointB = this.position.copy();
    this.pointC = this.position.copy();

    dx.mult(this.size);
    this.pointA.add(dx);

    dx.div(2);

    this.pointB.sub(dx);
    this.pointC.sub(dx);

    dy.mult(this.size / 2)
    this.pointB.add(dy);
    this.pointC.sub(dy);

    this.dom.setAttribute('points',
      listXYToPolylinePoints(
        [this.pointA.x, this.pointB.x, this.pointC.x, this.pointA.x],
        [this.pointA.y, this.pointB.y, this.pointC.y, this.pointA.y]
      )
    );
  }
}