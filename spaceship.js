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

    this.size = 20;

    this.polygon = new PolygonOnTorus(this.parent);
    // // Triangle
    // this.polygon.addPoint(new Vector(0, -this.size));
    // this.polygon.addPoint(new Vector(this.size / 2, this.size / 2));
    // this.polygon.addPoint(new Vector(-this.size / 2, this.size / 2));

    // // W
    // this.polygon.addPoint(new Vector(0, 0));
    // this.polygon.addPoint(new Vector(10, 20));
    // this.polygon.addPoint(new Vector(20, 0));
    // this.polygon.addPoint(new Vector(10, -20));
    // this.polygon.addPoint(new Vector(12, -24));
    // this.polygon.addPoint(new Vector(24, 0));
    // this.polygon.addPoint(new Vector(24 - 12 * 1.15, 0 + 24 * 1.15));
    // this.polygon.addPoint(new Vector(0, 8));

    // X-wing
    this.polygon.addPoint(new Vector(1, -60));
    this.polygon.addPoint(new Vector(8, 0));
    this.polygon.addPoint(new Vector(39, 4));
    this.polygon.addPoint(new Vector(40, -20));
    this.polygon.addPoint(new Vector(41, -20));
    this.polygon.addPoint(new Vector(41, 15));
    this.polygon.addPoint(new Vector(40, 15));
    this.polygon.addPoint(new Vector(40, 10));
    this.polygon.addPoint(new Vector(8, 15));
    this.polygon.addPoint(new Vector(6, 20));


    this.polygon.closeSymY();
    this.polygon.fact(0.5);

    this.dom = this.polygon.dom;
    this.dom.setAttribute('class', 'ship');


    let angle = Math.PI / 80;
    this.shootStarts = [
      [new Vector(0, -30), 0],
      [new Vector(0, -30), 0, new Vector(0, -33), 0],
      [new Vector(20.5, -10), -angle, new Vector(-20.5, -10), angle, new Vector(20.5, -13), -angle, new Vector(-20.5, -13), angle],
      [new Vector(0, -30), 0, new Vector(0, -33), 0, new Vector(20.5, -10), -angle, new Vector(-20.5, -10), angle, new Vector(20.5, -13), -angle, new Vector(-20.5, -13), angle]
    ];

  }

  intersectsAsteroid(asteroid) {
    return this.polygon.containsPolygon(asteroid.polygon);
    // let dist = this.position.copy();
    // dist.sub(asteroid.position);
    // dist = dist.norm();
    // if (dist < this.size / 2 + asteroid.size / 2) {
    //   // this.color = colorGenerator(Math.random() * 255, Math.random() * 255, Math.random() * 255, 0.5);
    //   // this.dom.setAttribute('fill', this.color);
    //   return true;
    // } else {
    //   return false;
    // }
  }

  shoot() {
    let newRockets = [];

    let levelShoot = Math.min(this.shootStarts.length - 1, Math.trunc((this.parent.levelCount) / 4));
    for (let i = 0; i < this.shootStarts[levelShoot].length; i += 2) {
      let rocketPosition = this.shootStarts[levelShoot][i].copy();
      rocketPosition.rotate(this.theta);
      rocketPosition.add(this.position);
      let alpha = this.theta;
      let rocketVelocity = new Vector(Math.sin(alpha), -Math.cos(alpha));
      rocketVelocity.rotate(this.shootStarts[levelShoot][i + 1]);
      rocketVelocity.mult(10);
      rocketVelocity.add(this.velocity);
      newRockets.push(new Rocket(rocketPosition, rocketVelocity));
    }


    // // let dalpha = Math.PI / 6 / nb;
    // let rocketPosition = new Vector(0, -30); //-this.size);
    // rocketPosition.rotate(this.theta);
    // rocketPosition.add(this.position);
    // for (let i = 0; i < nb; i++) {
    //   let alpha = this.theta + (nb - 1 - 2 * i) * dalpha / 2;
    //   // console.log(this.theta, alpha);
    //   let rocketVelocity = new Vector(Math.sin(alpha), -Math.cos(alpha));
    //   rocketVelocity.mult(10);
    //   rocketVelocity.add(this.velocity);
    //   newRockets.push(new Rocket(rocketPosition, rocketVelocity));
    // }

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
    this.velocity.limitNorm(20);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.velocity.mult(0.98);
    this.dtheta *= 0.9;

    this.polygon.update(this.position, this.theta);
  }

  show() {
    this.polygon.show();
  }
}