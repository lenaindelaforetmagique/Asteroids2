//-----------------------------------------------------------------------------
class PolygonOnTorus {
  constructor(parent_, points_ = []) {
    this.parent = parent_;
    this.viewBox = this.parent.viewBox;

    this.polygonDefinition = new Polygon(points_);

    this.dom = document.createElementNS(SVGNS, 'g');

    this.position = new Vector();
    this.angle = 0;
  }

  addPoint(point) {
    this.polygonDefinition.addPoint(point);
    this.calculated = false;
  }

  cleanDom() {
    while (this.dom.firstChild) {
      this.dom.removeChild(this.dom.firstChild);
    }
  }

  containsPoint(point) {
    let contained = false;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let pointCopy = point.copy();
        pointCopy.sub(new Vector((i - 1) * this.viewBox.width, (j - 1) * this.viewBox.height))
        pointCopy.sub(this.position);
        pointCopy.rotate(-this.angle);
        if (this.polygonDefinition.containsPoint(pointCopy)) {
          contained = true;
          break;
        }
      }
      if (contained) {
        break;
      }
    }
    return contained;
  }

  containsPolygon(other, checkOther = true) {
    let contained = false;

    // // draft approach
    // let dist = Number.MAX_SAFE_INTEGER;
    // for (let i = 0; i < 3; i++) {
    //   for (let j = 0; j < 3; j++) {
    //     let calDist = this.position.copy();
    //     calDist.add(new Vector((i - 1) * this.viewBox.width, (j - 1) * this.viewBox.height));
    //     calDist.sub(other.position);
    //     dist = Math.min(dist, calDist.norm());
    //   }
    // }
    // if (dist < this.polygonDefinition.radius + other.polygonDefinition.radius) {}

    for (let point of other.polygonDefinition.points) {
      let pointCopy = point.copy();
      pointCopy.rotate(other.angle);
      pointCopy.add(other.position);

      if (this.containsPoint(pointCopy)) {
        contained = true;
        break;
      }
    }

    if (checkOther && !contained) {
      contained = other.containsPolygon(this, false);
    }

    return contained;
  }

  update(position_, angle_) {
    this.position = position_;
    this.angle = angle_;
  }


  show() {
    this.cleanDom();

    // copies ? check borders
    let grid = [
      [false, false, false],
      [false, true, false],
      [false, false, false]
    ];

    let xlim1 = 0 + this.polygonDefinition.radius;
    let xlim2 = this.viewBox.width - this.polygonDefinition.radius;

    let ylim1 = 0 + this.polygonDefinition.radius;
    let ylim2 = this.viewBox.height - this.polygonDefinition.radius;

    if (this.position.x < xlim1) {
      grid[0][0] = true;
      grid[0][1] = true;
      grid[0][2] = true;
    }
    if (this.position.x > xlim2) {
      grid[2][0] = true;
      grid[2][1] = true;
      grid[2][2] = true;
    }

    if (this.position.y < ylim1) {
      grid[0][0] = true;
      grid[1][0] = true;
      grid[2][0] = true;
    }
    if (this.position.y < ylim2) {
      grid[0][2] = grid[0][2] && true;
      grid[1][2] = grid[1][2] && true;
      grid[2][2] = grid[2][2] && true;
    }

    let rotation = " rotate(" + (this.angle * 180 / Math.PI) + ")";

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let translation = "translate( " +
          (this.position.x - (i - 1) * this.viewBox.width) + "," +
          (this.position.y - (j - 1) * this.viewBox.height) + ")";
        let polygon = document.createElementNS(SVGNS, 'polygon');
        polygon.setAttribute('points', this.polygonDefinition.listPts());
        polygon.setAttribute("transform", translation + rotation);
        this.dom.appendChild(polygon);
      }
    }
  }
}