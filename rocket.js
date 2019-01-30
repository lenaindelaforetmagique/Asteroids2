class Rocket {
  constructor(position_, velocity_) {
    this.creation = Date.now();
    this.position = position_.copy();
    this.velocity = velocity_.copy();
    this.acceleration = new Vector(0, 0);

    this.size = 5;

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
    return age < 1000;
  }

}