class Rocket {
  constructor(spaceship) {
    this.position = spaceship.pointA.copy();
    this.velocity = new Vector(0, 0); // spaceship.velocity.copy();

    let speed = new Vector(Math.cos(spaceship.theta), Math.sin(spaceship.theta));
    speed.mult(10);
    this.velocity.add(speed);

    this.acceleration = new Vector(0, 0);

    this.size = 5;

    this.color = colorGenerator(255, 0, 0, 0.5);
    this.dom = document.createElementNS(SVGNS, 'ellipse');
    this.dom.setAttribute("class", "rocket");
    // this.dom.setAttribute('fill', this.color);
    // this.dom.setAttribute('stroke', colorGenerator(50, 50, 50, 1));

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

  outOfBounds(viewBox) {
    return (
      (this.position.x + this.size < viewBox.xMin) ||
      (this.position.x - this.size > viewBox.xMin + viewBox.width) ||
      (this.position.y + this.size < viewBox.yMin) ||
      (this.position.y - this.size > viewBox.yMin + viewBox.height)
    );
  }

}