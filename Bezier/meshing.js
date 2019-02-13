class Point {
  constructor(x_ = 0, y_ = 0) {
    this.x = x_;
    this.y = y_;

    this.dom = document.createElementNS(SVGNS, 'ellipse');
    this.dom.setAttribute("class", "Point");
    this.dom.setAttribute('rx', 5);
    this.dom.setAttribute('ry', 5);
    this.dom.setAttribute('cx', this.x);
    this.dom.setAttribute('cy', this.y);
  }

}


class Node {
  constructor(x_ = 0, y_ = 0) {
    this.position = new Vector(x_, y_);
    // this.x = x_;
    // this.y = y_;

    this.dom = document.createElementNS(SVGNS, 'ellipse');
    this.dom.setAttribute("class", "Node");
    this.dom.setAttribute('rx', 2);
    this.dom.setAttribute('ry', 2);
    this.dom.setAttribute('cx', this.position.x);
    this.dom.setAttribute('cy', this.position.y);
  }


}

TGLEcount = 0;

class Triangle {
  constructor(node0, node1, node2, parent_) {
    this.parent = parent_;
    this.nodes = [node0, node1, node2];
    this.neighbours = [null, null, null];

    this.edges = [];
    let vect = this.nodes[1].position.copy();
    vect.sub(this.nodes[0].position);
    this.edges.push(vect);
    vect = this.nodes[2].position.copy();
    vect.sub(this.nodes[1].position);
    this.edges.push(vect);
    vect = this.nodes[0].position.copy();
    vect.sub(this.nodes[2].position);
    this.edges.push(vect);

    this.dom = document.createElementNS(SVGNS, 'g');
    this.shape = document.createElementNS(SVGNS, 'polygon');
    this.shape.setAttribute("class", "triangle");
    this.dom.appendChild(this.shape);

    // this.label = document.createElementNS(SVGNS, 'text');
    // let cog = this.centerOfGravity();
    // this.label.setAttribute("x", cog.x);
    // this.label.setAttribute("y", cog.y);

    this.ID = TGLEcount;
    // this.label.innerHTML = this.ID;
    // this.dom.appendChild(this.label);



    // this.checkAngles();
    this.updateDom();
  }

  centerOfGravity() {
    let center = new Vector();
    for (let i = 0; i < 3; i++) {
      center.add(this.nodes[i].position);
    }
    center.div(3);
    return center;
  }

  angle(i_) {
    i_ = i_ % 3;
    let vect01 = this.nodes[(i_ + 1) % 3].position.copy();
    vect01.sub(this.nodes[i_].position);
    let vect02 = this.nodes[(i_ + 2) % 3].position.copy();
    vect02.sub(this.nodes[i_].position);

    return angle(vect01, vect02);
  }

  checkAngles() {
    let res = 0;
    console.log("//////////");
    console.log(this.angle(0) * 180 / Math.PI);
    console.log(this.angle(1) * 180 / Math.PI);
    console.log(this.angle(2) * 180 / Math.PI);
    console.log(this.angle(0) + this.angle(1) + this.angle(2));
  }

  updateDom() {
    let list = "";
    for (let node of this.nodes) {
      list += (node.position.x) + ',' + (node.position.y) + ' ';
    }
    this.shape.setAttribute('points', list);
  }

  addNeighbour(other, continue_ = true) {
    let other0 = this.nodes.indexOf(other.nodes[0]);
    let other1 = this.nodes.indexOf(other.nodes[1]);
    let other2 = this.nodes.indexOf(other.nodes[2]);

    let cpt = 0;
    cpt += (other0 >= 0) ? 1 : 0;
    cpt += (other1 >= 0) ? 1 : 0;
    cpt += (other2 >= 0) ? 1 : 0;

    if (cpt == 2) {
      let thisPos;
      if (other0 < 0) {
        // 0 is not seen > 2
        thisPos = other2;
      } else if (other1 < 0) {
        // 1 is not seen > 0
        thisPos = other0;
      } else {
        // 2 is not seen > 1
        thisPos = other1;
      }
      // if (this.neighbours[thisPos] != null) {
      //   console.log("deja");
      // }
      this.neighbours[thisPos] = other;
      if (continue_) {
        other.addNeighbour(this, false);
      }
    }
  }

  removeNeighbour(other, continue_ = true) {
    let pos = this.neighbours.indexOf(other);
    if (pos >= 0) {
      this.neighbours[pos] = null;
      if (continue_) {
        other.removeNeighbour(this, false);
      }
    }
  }

  containsPoint(point_) {
    let vectAP = point_.copy();
    vectAP.sub(this.nodes[0].position);
    let vectBP = point_.copy();
    vectBP.sub(this.nodes[1].position);
    let vectCP = point_.copy();
    vectCP.sub(this.nodes[2].position);

    if (
      (this.edges[0].crossProduct(vectAP) >= 0) &&
      (this.edges[1].crossProduct(vectBP) >= 0) &&
      (this.edges[2].crossProduct(vectCP) >= 0)
    ) {
      return true;
    } else {
      return false;
    }
  }

  maxLength() {
    let maxValue = this.edges[0].norm();
    let imax = 0;
    for (let i = 1; i < 3; i++) {
      let norm = this.edges[i].norm();
      if (norm > maxValue) {
        maxValue = norm;
        imax = i;
      }
    }
    return [imax, maxValue];
  }



}

class Polygon {
  constructor(points_ = []) {
    this.points = points_;
    this.triangles = [];
    this.nodes = [];

    this.dom = document.createElementNS(SVGNS, 'g');
    this.contour = document.createElementNS(SVGNS, 'polygon');
    this.contour.setAttribute("class", 'base');
    this.dom.appendChild(this.contour);

    this.meshing = document.createElementNS(SVGNS, 'g');
    this.meshing.setAttribute("class", 'meshing ');
    this.dom.appendChild(this.meshing);

    this.color = colorGenerator(Math.random() * 256, Math.random() * 256, Math.random() * 256, 0.7);

    this.updateDom();
  }

  updateDom() {
    let list = "";
    for (let point of this.points) {
      list += (point.x) + ',' + (point.y) + ' ';
    }
    this.contour.setAttribute('points', list);

    while (this.meshing.firstChild != null) {
      this.meshing.removeChild(this.meshing.firstChild);
    }
    let str = "";
    for (let i = 0; i < this.triangles.length; i++) {
      this.meshing.appendChild(this.triangles[i].dom);
      str += " - " + this.triangles[i].ID;
    }
    // console.log(str);
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

  addPoint(point_) {
    let newPoint = new Vector(point_.x, point_.y);
    this.points.push(point_);
    this.updateDom();
  }

  addNode(point_) {
    let newNode = new Node(point_.x, point_.y);
    this.nodes.push(newNode);
    this.updateDom();
  }

  addTriangle(node0, node1, node2) {
    TGLEcount++;
    let newTriangle = new Triangle(node0, node1, node2, this);

    newTriangle.shape.setAttribute('fill', this.color);
    // consolidation
    for (let triangle of this.triangles) {
      if (triangle != null) {
        triangle.addNeighbour(newTriangle);
      }
    }

    this.triangles.push(newTriangle);
  }

  removeTriangle(triangle_) {
    let pos = this.triangles.indexOf(triangle_);

    for (let neighbour of triangle_.neighbours) {
      if (neighbour != null) {
        triangle_.removeNeighbour(neighbour);
      }
    }
    this.triangles[pos] = null;
    // this.triangles.splice(pos, 1);
  }

  cleanTrianglesTable() {
    let i = 0;
    while (i < this.triangles.length) {
      if (this.triangles[i] == null) {
        this.triangles.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  angle(i_, j_, k_) {
    // return the angle formed by vectors IJ and JK
    // console.log(i_, j_, k_);
    let vect_ij = this.nodes[j_].copy();
    vect_ij.sub(this.nodes[i_]);
    let vect_jk = this.nodes[k_].copy();
    vect_jk.sub(this.nodes[j_]);
    return angle(vect_ij, vect_jk) * 180 / Math.PI;
  }

  triangulate() {
    // createNodes
    let indices = [];
    for (let i = 0; i < this.points.length; i++) {
      this.nodes.push(new Node(this.points[i].x, this.points[i].y));
      indices.push(i);
    }

    while (indices.length > 2) {
      let found = false;
      let i = -1;
      while (!found && i < indices.length) {
        i++;
        found = this.checkTriangle(indices[i], indices[i + 1], indices[i + 2]);
      }

      this.addTriangle(
        this.nodes[indices[i]],
        this.nodes[indices[i + 1]],
        this.nodes[indices[i + 2]]
      );
      indices.splice(i + 1, 1);
    }

    //
    this.improveTriangulation();
    this.updateDom();
  }



  mesh(maxSize = Number.MAX_SAFE_INTEGER) {
    // create nodes
    // for (let point of this.points) {
    //   this.addNode(point);
    // }
    //
    // this.triangulate();
  }

  refine(all = true) {
    // let minLength = Number.MAX_SAFE_INTEGER;
    // for (let i = 0; i < this.points.length; i++) {
    //   minLength = Math.min(minLength, this.segmentLength(i));
    // }

    let maxValues = this.maxTriangleSize();


    if (all) {
      // let maxLength = minLength * 2;
      let maxLength = maxValues[2] / 2;
      while (maxValues[2] > maxLength) {
        this.reduceTriangleSize(this.triangles[maxValues[0]], maxValues[1]);
        this.improveTriangulation();
        maxValues = this.maxTriangleSize();
      }
    } else {
      this.reduceTriangleSize(this.triangles[maxValues[0]], maxValues[1]);
      this.improveTriangulation();
    }

    this.updateDom();
  }


  segmentLength(i_) {
    if (i_ < 0 || i_ >= this.points.length) {
      i_ = 0;
    }
    let pointA = new Vector(this.points[i_].x, this.points[i_].y);
    i_ = (i_ + 1) % this.points.length;
    let pointB = new Vector(this.points[i_].x, this.points[i_].y);
    pointA.sub(pointB);
    return pointA.norm();
  }


  maxTriangleSize() {
    let maxValue = 0;
    let iMax = 0;
    let jMax = 0;
    for (let i = 0; i < this.triangles.length; i++) {
      let val = this.triangles[i].maxLength();
      if (val[1] > maxValue) {
        iMax = i;
        jMax = val[0];
        maxValue = val[1];
      }
    }
    return [iMax, jMax, maxValue];
  }

  reduceTriangleSize(triangle1, side) {
    let triangle2 = triangle1.neighbours[side];

    let newNode = triangle1.nodes[side].position.copy();
    newNode.add(triangle1.nodes[(side + 1) % 3].position);
    newNode.div(2);
    this.addNode(newNode);
    newNode = this.nodes.last();

    this.removeTriangle(triangle1);

    this.addTriangle(newNode, triangle1.nodes[(side + 1) % 3], triangle1.nodes[(side + 2) % 3]);
    this.addTriangle(newNode, triangle1.nodes[(side + 2) % 3], triangle1.nodes[side]);

    // console.log(triangle1, side);
    if (triangle2 != null) {
      let side = triangle2.maxLength()[0];

      this.removeTriangle(triangle2);

      this.addTriangle(newNode, triangle2.nodes[(side + 1) % 3], triangle2.nodes[(side + 2) % 3]);
      this.addTriangle(newNode, triangle2.nodes[(side + 2) % 3], triangle2.nodes[side]);
    }

  }


  swapTriangles(triangle1, triangle2) {
    let result = false;
    let pos1 = this.triangles.indexOf(triangle1);
    let pos2 = this.triangles.indexOf(triangle2);

    let neigh12 = triangle1.neighbours.indexOf(triangle2);
    let neigh21 = triangle2.neighbours.indexOf(triangle1);

    if (neigh12 >= 0 && neigh21 >= 0) {
      let numNode1 = (neigh12 + 2) % 3;
      let numNode2 = (neigh21 + 2) % 3;

      let alpha1 = triangle1.angle(numNode1);
      let alpha2 = triangle2.angle(numNode2);
      if (alpha1 + alpha2 > Math.PI) {
        // console.log("swap!");
        // -- deletion
        this.removeTriangle(triangle1);
        this.removeTriangle(triangle2);

        this.addTriangle(triangle1.nodes[numNode1], triangle1.nodes[(numNode1 + 1) % 3], triangle2.nodes[numNode2]);
        this.addTriangle(triangle2.nodes[numNode2], triangle2.nodes[(numNode2 + 1) % 3], triangle1.nodes[numNode1]);

        result = true;
      }
    }
    return result;
  }


  improveTriangulation() {
    let i = 0;
    while (i < this.triangles.length) {
      if (this.triangles[i] != null) {
        let changed = false;
        let j = 0;
        while (!changed && j < 3) { //this.triangles[i].neighbours.length) {
          if (this.triangles[i].neighbours[j] != null) {
            changed = this.swapTriangles(this.triangles[i], this.triangles[i].neighbours[j]);
          }
          j++;
        }
      }
      i++;
    }

    // cleaning
    this.cleanTrianglesTable();

    this.updateDom();
  }

  checkTriangle(i_, j_, k_) {
    // returns true if triangle is "clockwise" and contains no point

    // triangle "clockwise" AB^AC > 0
    let vectAB = this.nodes[j_].position.copy();
    vectAB.sub(this.nodes[i_].position);
    let vectAC = this.nodes[k_].position.copy();
    vectAC.sub(this.nodes[i_].position);

    if (vectAB.crossProduct(vectAC) < 0) {
      return false;
    } else {
      //
      let pointContained = false;
      let triangle = new Triangle(this.nodes[i_], this.nodes[j_], this.nodes[k_]);
      let l = 0;
      while (!pointContained && l < this.nodes.length) {
        if (l != i_ && l != j_ && l != k_) {
          pointContained = triangle.containsPoint(this.nodes[l].position);
        }
        l++;
      }
      return !pointContained;
    }
  }

}

class Polygon_old {
  listPts() {
    let res = "";
    for (let point of this.points) {
      res += (point.x) + ',' + (point.y) + ' ';
    }
    return res;
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
    return res;
  }

  reCenter() {
    let centerPos = this.centerOfGravity();
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].sub(centerPos);
    }
    return centerPos;
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

    // let vectAB = pointB.copy();
    // vectAB.sub(pointA);
    // // let a=vectAB.norm();
    // vectAB = new Vector(vectAB.y, -vectAB.x);
    // vectAB.mult(0.025 * 1);
    // if (vectAB.x > 0) {
    //   vectAB.mult(-1);
    // }


    pointA.add(pointB);
    pointA.div(2);
    // pointA.add(vectAB);

    this.points.splice(i_ + 1, 0, pointA);
  }

  refine() {
    let minLength = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < this.points.length; i++) {
      minLength = Math.min(minLength, this.segmentLength(i));
    }
    let maxLength = minLength * 3;

    let i = 0;
    while (i < this.points.length) {
      if (this.segmentLength(i) > maxLength) {
        this.insertMidPoint(i);
      } else {
        i++;
      }
    }
  }

  refine2() {
    let minLength = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < this.points.length; i++) {
      minLength = Math.min(minLength, this.segmentLength(i));
    }
    let maxLength = minLength * 2;

    let newTriangles = [];
    for (let triangle of this.triangles) {
      newTriangles = newTriangles.concat(triangle.refine(maxLength));
    }
    this.triangles = newTriangles;
  }

}