//-----------------------------------------------------------------------------
class Vector {
  constructor(x_ = 0, y_ = 0) {
    this.x = x_;
    this.y = y_;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  norm() {
    let res = Math.sqrt(this.x ** 2 + this.y ** 2);
    return res;
  }

  normalize() {
    let norm_ = this.norm();
    if (norm_ > 0) {
      this.x /= norm_;
      this.y /= norm_;
    }
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  mult(scal) {
    this.x *= scal;
    this.y *= scal;
  }

  div(scal) {
    this.x /= scal;
    this.y /= scal;
  }

  limitNorm(maxNorm) {
    let norm_ = this.norm();
    if (norm_ > maxNorm) {
      this.mult(maxNorm / norm_);
    }
  }

  dotProduct(other) {
    let res = 0;
    res += this.x * other.x;
    res += this.y * other.y;
    return res;
  }

  crossProduct(other) {
    // as vector are in the plane, only Z-component is returned
    return this.x * other.y - this.y * other.x;
  }

  rotate(angle) {
    let new_x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    let new_y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = new_x;
    this.y = new_y;
  }

  domRepr() {
    let result = document.createElementNS(SVGNS, 'ellipse');
    result.setAttribute('fill', "blue");
    result.setAttribute('stroke', "white");
    result.setAttribute('rx', 5);
    result.setAttribute('ry', 5);
    result.setAttribute('cx', this.x);
    result.setAttribute('cy', this.y);
    return result;
  }
}

distance = function(vect1, vect2) {
  let res = new Vector(vect1.x, vect1.y);
  res.sub(vect2);
  return res.norm();
}


//-----------------------------------------------------------------------------
class Triangle {
  constructor(pointA_, pointB_, pointC_) {
    // clockwise ABC
    this.pointA = pointA_;
    this.pointB = pointB_;
    this.pointC = pointC_;

    this.vectAB = this.pointB.copy();
    this.vectAB.sub(this.pointA);
    this.vectBC = this.pointC.copy();
    this.vectBC.sub(this.pointB);
    this.vectCA = this.pointA.copy();
    this.vectCA.sub(this.pointC);
  }

  containsPoint(point_) {
    let vectAP = point_.copy();
    vectAP.sub(this.pointA);
    let vectBP = point_.copy();
    vectBP.sub(this.pointB);
    let vectCP = point_.copy();
    vectCP.sub(this.pointC);

    if (
      (this.vectAB.crossProduct(vectAP) >= 0) &&
      (this.vectBC.crossProduct(vectBP) >= 0) &&
      (this.vectCA.crossProduct(vectCP) >= 0)
    ) {
      return true;
    } else {
      return false;
    }
  }

  listPts() {
    let res = "";
    res += this.pointA.x + ',' + this.pointA.y + ' ';
    res += this.pointB.x + ',' + this.pointB.y + ' ';
    res += this.pointC.x + ',' + this.pointC.y;
    return res;
  }

  domRepr() {
    let result = document.createElementNS(SVGNS, 'polygon');
    result.setAttribute('points', this.listPts());
    result.setAttribute('fill', "rgba(255,255,255,0.5)");
    result.setAttribute('stroke', "white");
    return result;
  }
}

//-----------------------------------------------------------------------------
class Polygon {
  constructor(points_ = []) {
    this.points = points_;
    this.triangles = [];

    this.radius = 0;
    this.calculateRadius();
  }

  addPoint(point_) {
    this.points.push(point_);
    this.calculateRadius();
  }

  calculateRadius() {
    this.radius = 0;
    for (let point of this.points) {
      this.radius = Math.max(this.radius, point.norm());
    }
  }

  triangulate() {
    let indices = [];
    for (let i = 0; i < this.points.length; i++) {
      indices.push(i);
    }
    while (indices.length > 2) {
      let found = false;
      let i = -1;
      while (!found && i < indices.length) {
        i++;
        found = this.checkTriangle(indices[i], indices[i + 1], indices[i + 2]);
      }

      // add found triangle
      this.triangles.push(new Triangle(
        this.points[indices[i]],
        this.points[indices[i + 1]],
        this.points[indices[i + 2]]
      ));
      indices.splice(i + 1, 1);
    }
  }

  checkTriangle(i_, j_, k_) {
    // returns true if triangle is "clockwise" and contains no point

    // triangle "clockwise" AB^AC > 0
    let vectAB = this.points[j_].copy();
    vectAB.sub(this.points[i_]);
    let vectAC = this.points[k_].copy();
    vectAC.sub(this.points[i_]);

    if (vectAB.crossProduct(vectAC) < 0) {
      return false;
    } else {
      //
      let pointContained = false;
      let triangle = new Triangle(this.points[i_], this.points[j_], this.points[k_]);
      let l = 0;
      while (!pointContained && l < this.points.length) {
        if (l != i_ && l != j_ && l != k_) {
          pointContained = triangle.containsPoint(this.points[l]);
        }
        l++;
      }
      return !pointContained;
    }
  }

  containsPoint(point_) {
    if (this.triangles.length == 0) {
      this.triangulate();
    }
    let pointIsContained = false;

    if (point_.norm() < this.radius) {
      let i = 0;
      while (!pointIsContained && i < this.triangles.length) {
        pointIsContained = this.triangles[i].containsPoint(point_);
        i++;
      }
    }
    return pointIsContained
  }

  listPts() {
    let res = "";
    for (let point of this.points) {
      res += point.x + ',' + point.y + ' ';
    }
    return res;
  }

  domRepr() {
    if (this.triangles.length == 0) {
      this.triangulate();
    }

    let dom = document.createElementNS(SVGNS, 'g');
    for (let tgle of this.triangles) {
      dom.appendChild(tgle.domRepr());
    }
    return dom;
  }
}