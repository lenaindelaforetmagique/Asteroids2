class Rocket {
  constructor(position_, velocity_, lifeTime_ = 1500) {
    this.creation = Date.now();
    this.position = position_.copy();
    this.velocity = velocity_.copy();
    this.acceleration = new Vector(0, 0);
    this.lifeTime = lifeTime_;

    this.size = 4;

    this.color = colorGenerator(255, 0, 0, 0.5);
    this.dom = document.createElementNS(SVGNS, 'ellipse');
    this.dom.setAttribute("class", "rocket");
    this.dom.setAttribute('rx', this.size / 2);
    this.dom.setAttribute('ry', this.size / 2);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    this.dom.setAttribute('cx', this.position.x);
    this.dom.setAttribute('cy', this.position.y);
  }

  stillAlive(viewBox) {
    let age = Date.now() - this.creation;
    return age < this.lifeTime;
  }
}

class Grenade {
  constructor(position_, velocity_, parent_, lifeTime_ = 1500) {
    this.creation = Date.now();
    this.position = position_.copy();
    this.velocity = velocity_.copy();
    this.acceleration = new Vector(0, 0);
    this.lifeTime = lifeTime_;
    this.alive = true;
    this.parent = parent_;

    this.size = 8;

    this.color = colorGenerator(255, 0, 0, 0.5);
    this.dom = document.createElementNS(SVGNS, 'ellipse');
    this.dom.setAttribute("class", "grenade");
    this.dom.setAttribute('fill', colorGenerator(0, 255, 0, 1));
    this.dom.setAttribute('rx', this.size / 2);
    this.dom.setAttribute('ry', this.size / 2);
  }

  update() {
    let age = Date.now() - this.creation;
    if (age < this.lifeTime) {
      let alpha = (1 - age / this.lifeTime);
      this.dom.setAttribute('fill', colorGenerator(255 * (1 - alpha), 255 * alpha, 0, 1));
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
    } else {
      // explosion
      this.alive = false;
      let newRockets = [];
      let quantity = 50;
      for (let i = 0; i < quantity; i++) {
        let angle = Math.PI * 2 * i / quantity;
        let rocketPosition = new Vector();
        rocketPosition.add(this.position);
        let rocketVelocity = new Vector(1, 0);
        rocketVelocity.rotate(angle);
        rocketVelocity.mult(10);
        // rocketVelocity.add(this.velocity);
        newRockets.push(new Rocket(rocketPosition, rocketVelocity, 200));
      }
      for (let rocket of newRockets) {
        this.parent.addRocket(rocket);
      }
    }
  }

  show() {
    this.dom.setAttribute('cx', this.position.x);
    this.dom.setAttribute('cy', this.position.y);
  }

  stillAlive(viewBox) {
    return this.alive;
  }
}