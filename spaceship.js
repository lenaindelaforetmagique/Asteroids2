class Spaceship {
  constructor(x_, y_, parent_) {
    this.parent = parent_;
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
    this.shootOn = false;

    this.size = 30;

    this.polygon = new Polygon(this.parent);
    this.polygon.addPoint(new Vector(0, this.size));
    this.polygon.addPoint(new Vector(-this.size / 2, -this.size / 2));
    this.polygon.addPoint(new Vector(this.size / 2, -this.size / 2));

    this.dom = this.polygon.dom;
    this.dom.setAttribute('class', 'ship');
  }

  touched(asteroid) {
    let dist = this.position.copy();
    dist.sub(asteroid.position);
    dist = dist.norm();
    if (dist < this.size / 2 + asteroid.size / 2) {
      // this.color = colorGenerator(Math.random() * 255, Math.random() * 255, Math.random() * 255, 0.5);
      // this.dom.setAttribute('fill', this.color);
      return true;
    } else {
      return false;
    }
  }

  shoot() {
    let newRockets = [];

    let nb = Math.trunc((this.parent.levelCount) / 4) + 1;
    let dalpha = Math.PI / 6 / nb;
    for (let i = 0; i < nb; i++) {
      let alpha = this.theta + (nb - 1 - 2 * i) * dalpha / 2;
      // console.log(nb, alpha, this.theta);
      let rocketVelocity = new Vector(Math.sin(alpha), -Math.cos(alpha));
      rocketVelocity.mult(7);
      rocketVelocity.add(this.velocity);
      newRockets.push(new Rocket(this.polygon.points[0].copy(), rocketVelocity));
    }

    for (let rocket of newRockets) {
      this.parent.addRocket(rocket);
    }
    this.shootOn = false;
  }

  accelerate(fact) {
    let dAcc = new Vector(Math.sin(this.theta), -Math.cos(this.theta));
    dAcc.mult(fact * 0.4);
    this.acceleration.add(dAcc);
  }

  rotate(fact) {
    this.dtheta -= fact * Math.PI / 90;
  }

  update() {
    if (this.shootOn) {
      this.shoot();
    }
    if (this.boostOn) {
      this.accelerate(1);
    }
    if (this.brakeOn) {
      this.accelerate(-0.5);
    }
    if (this.turnL) {
      this.rotate(1);
      // this.turnL = false;
    }
    if (this.turnR) {
      this.rotate(-1);
      // this.turnR = false;
    }

    this.theta += this.dtheta;
    this.velocity.add(this.acceleration);
    // console.log(this.velocity.norm());
    this.velocity.limitNorm(20);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.velocity.mult(0.99);
    this.dtheta *= 0.9;
  }

  show() {
    // console.log("lkjlk");
    // console.log(this.size);


    this.polygon.show(this.position, this.theta);

  }
}