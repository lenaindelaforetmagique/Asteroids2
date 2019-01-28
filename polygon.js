listXYToPolylinePoints = function(listX, listY) {
  let res = "";
  for (let i = 0; i < listX.length; i++) {
    res += listX[i] + ',' + listY[i] + ' ';
  }
  return res;
}

class Polygon {
  constructor(parent_) {
    this.parent = parent_;
    this.viewBox = this.parent.viewBox;

    this.pointsOrigin = [];
    this.points = [];

    // this.polygons = [];

    this.dom = document.createElementNS(SVGNS, 'g');
    // this.parent.appendChild(this.dom);
  }

  addPoint(point) {
    this.pointsOrigin.push(point);
  }

  listPts() {
    let res = "";
    for (let point of this.points) {
      res += point.x + ',' + point.y + ' ';
    }
    return res;
  }

  cleanDom() {
    while (this.dom.firstChild) {
      this.dom.removeChild(this.dom.firstChild);
    }
  }

  show(position_, angle_) {
    // console.log(position_);
    // calculates positions
    this.points = [];
    // console.log(this.pointsOrigin);
    for (let point of this.pointsOrigin) {
      let pointCopy = point.copy()
      pointCopy.rotate(angle_);
      pointCopy.add(position_);
      this.points.push(pointCopy);
    }


    // deletes everything
    this.cleanDom();

    // master polygon
    let polygon = document.createElementNS(SVGNS, 'polygon');
    polygon.setAttribute('points', this.listPts());
    this.dom.appendChild(polygon);

    // copies ? check borders
    let copyUL = false;
    let copyL = false;
    let copyBL = false;
    let copyU = false;
    let copyB = false;
    let copyUR = false;
    let copyR = false;
    let copyBR = false;

    for (let point of this.points) {
      if (point.x < 0) {
        if (point.y < 0) {
          copyUL = true;
        } else if (point.y < this.viewBox.height) {
          copyL = true;
        } else {
          copyBL = true;
        }
      } else if (point.x < this.viewBox.width) {
        if (point.y < 0) {
          copyU = true;
        } else if (point.y > this.viewBox.height) {
          copyB = true;
        }
      } else {
        if (point.y < 0) {
          copyUR = true;
        } else if (point.y < this.viewBox.height) {
          copyR = true;
        } else {
          copyBR = true;
        }
      }
    }

    // copies if needed
    if (copyUL) {
      let copy = polygon.cloneNode();
      copy.setAttribute("transform", "translate(" + this.viewBox.width + "," + this.viewBox.height + ")");
      this.dom.appendChild(copy);
    }
    if (copyL) {
      let copy = polygon.cloneNode();
      copy.setAttribute("transform", "translate(" + this.viewBox.width + ",0)");
      this.dom.appendChild(copy);
    }
    if (copyBL) {
      let copy = polygon.cloneNode();
      copy.setAttribute("transform", "translate(" + this.viewBox.width + "," + -this.viewBox.height + ")");
      this.dom.appendChild(copy);
    }
    if (copyU) {
      let copy = polygon.cloneNode();
      copy.setAttribute("transform", "translate( 0," + this.viewBox.height + ")");
      this.dom.appendChild(copy);
    }
    if (copyB) {
      let copy = polygon.cloneNode();
      copy.setAttribute("transform", "translate( 0," + -this.viewBox.height + ")");
      this.dom.appendChild(copy);
    }
    if (copyUR) {
      let copy = polygon.cloneNode();
      copy.setAttribute("transform", "translate(" + -this.viewBox.width + "," + this.viewBox.height + ")");
      this.dom.appendChild(copy);
    }
    if (copyR) {
      let copy = polygon.cloneNode();
      copy.setAttribute("transform", "translate(" + -this.viewBox.width + ",0)");
      this.dom.appendChild(copy);
    }
    if (copyBR) {
      let copy = polygon.cloneNode();
      copy.setAttribute("transform", "translate(" + -this.viewBox.width + "," + -this.viewBox.height + ")");
      this.dom.appendChild(copy);
    }
  }
}