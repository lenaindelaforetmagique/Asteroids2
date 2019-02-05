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
    // result.setAttribute('stroke', "white");
    result.setAttribute('rx', 2);
    result.setAttribute('ry', 2);
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

  area() {
    return -1 * this.vectAB.crossProduct(this.vectCA) / 2;
  }

  centerOfGravity() {
    let center = new Vector();
    center.add(this.pointA);
    center.add(this.pointB);
    center.add(this.pointC);
    center.div(3);
    return center;
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

  refine(maxLength) {
    let result = [];
    let length = [this.vectAB.norm(), this.vectBC.norm(), this.vectCA.norm()];
    let longest = Math.max(...length);
    // console.log(length, longest);

    if (longest < maxLength) {
      // console.log('1');
      result.push(this);
    } else {
      if (this.vectAB.norm() == longest) {
        // console.log('2');
        let newPoint = this.pointA.copy();
        newPoint.add(this.pointB);
        newPoint.div(2);
        let newTriangle1 = new Triangle(this.pointA, newPoint, this.pointC);
        let newTriangle2 = new Triangle(newPoint, this.pointB, this.pointC);
        result = result.concat(newTriangle1.refine(maxLength));
        result = result.concat(newTriangle2.refine(maxLength));

      } else if (this.vectBC.norm() == longest) {
        // console.log('3');
        let newPoint = this.pointB.copy();
        newPoint.add(this.pointC);
        newPoint.div(2);
        let newTriangle1 = new Triangle(this.pointA, this.pointB, newPoint);
        let newTriangle2 = new Triangle(this.pointA, newPoint, this.pointC);
        result = result.concat(newTriangle1.refine(maxLength));
        result = result.concat(newTriangle2.refine(maxLength));
      } else {
        // console.log('4');
        let newPoint = this.pointC.copy();
        newPoint.add(this.pointA);
        newPoint.div(2);
        let newTriangle1 = new Triangle(this.pointA, this.pointB, newPoint);
        let newTriangle2 = new Triangle(newPoint, this.pointB, this.pointC);
        result = result.concat(newTriangle1.refine(maxLength));
        result = result.concat(newTriangle2.refine(maxLength));
      }
    }
    if (result.length == 0) {
      console.log("ahha");
    }
    console.log("**", result.length);
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

  closeSymY() {
    for (let i = this.points.length - 1; i >= 0; i--) {
      let newPoint = this.points[i].copy();
      if (newPoint.x > 0) {
        newPoint.x *= -1;
        this.addPoint(newPoint);
      }
    }
  }

  fact(k_) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].mult(k_);
    }
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
      res += (point.x) + ',' + (point.y) + ' ';
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


  centerOfGravity() {
    if (this.triangles.length == 0) {
      this.triangulate();
    }

    let center = new Vector();
    let totalArea = 0;
    for (let triangle of this.triangles) {
      let area = triangle.area();
      let curCenter = triangle.centerOfGravity();
      curCenter.mult(area);
      center.add(curCenter);
      totalArea += area;
    }
    center.div(totalArea);
    return center;
  }

  center() {

    let res = new Vector();
    for (let point of this.points) {
      res.add(point);
    }
    res.div(this.points.length);
    // console.log("//", res);
    return res;
  }

  reCenter() {
    let centerPos = this.centerOfGravity();
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].sub(centerPos);
    }
    return centerPos;
  }

  cutInPieces(quantity_) {
    let result = [];

    quantity_ = Math.min(quantity_, this.points.length);

    let centerPos = this.centerOfGravity();

    let nbPoints = Math.ceil(this.points.length / quantity_) + 1;

    let j = 0;
    for (let i = 0; i < quantity_; i++) {
      let newPoly = new Polygon();
      newPoly.addPoint(centerPos.copy());
      let k = 0;
      while (k < nbPoints && j < this.points.length) {
        newPoly.addPoint(this.points[j].copy());
        j++;
        k++;
      }
      j--;
      result.push(newPoly);
    }
    result[quantity_ - 1].addPoint(this.points[0]);

    // for (let j = 0; j < result.length; j++) {
    //   result[j].refine();
    // }

    return result;
  }

  segmentLength(i_) {
    if (i_ < 0 || i_ >= this.points.length) {
      i_ = 0;
    }
    let pointA = this.points[i_].copy();
    let pointB;
    if (i_ == this.points.length - 1) {
      pointB = this.points[0].copy();
    } else {
      pointB = this.points[i_ + 1].copy();
    }
    pointA.sub(pointB);
    return pointA.norm();
  }

  insertMidPoint(i_) {
    if (i_ < 0 || i_ >= this.points.length) {
      i_ = 0;
    }
    let pointA = this.points[i_].copy();
    let pointB;
    if (i_ == this.points.length - 1) {
      pointB = this.points[0].copy();
    } else {
      pointB = this.points[i_ + 1].copy();
    }

    let vectAB = pointB.copy();
    vectAB.sub(pointA);
    // let a=vectAB.norm();
    vectAB = new Vector(vectAB.y, -vectAB.x);
    vectAB.mult(0.025 * 1);
    if (vectAB.x > 0) {
      vectAB.mult(-1);
    }


    pointA.add(pointB);
    pointA.div(2);
    pointA.add(vectAB);

    this.points.splice(i_ + 1, 0, pointA);
  }

  refine() {
    let minLength = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < this.points.length; i++) {
      minLength = Math.min(minLength, this.segmentLength(i));
    }
    let maxLength = minLength * 1;

    let i = 0;
    while (i < this.points.length) {
      if (this.segmentLength(i) > maxLength) {
        this.insertMidPoint(i);
      } else {
        i++;
      }
    }
    this.triangulate();
  }

  refine2() {
    console.log("start", this.triangles.length);
    let minLength = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < this.points.length; i++) {
      minLength = Math.min(minLength, this.segmentLength(i));
    }
    let maxLength = Math.min(50, minLength * 3);

    let newTriangles = [];
    for (let triangle of this.triangles) {
      console.log("pasage");
      newTriangles = newTriangles.concat(triangle.refine(maxLength));
    }
    this.triangles = newTriangles;
    console.log("final", this.triangles.length);
  }

}