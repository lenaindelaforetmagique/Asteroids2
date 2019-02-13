pointList_to_string = function(points_) {
  let list = "";
  for (let point of points_) {
    list += (point.x) + ',' + (point.y) + ' ';
  }
  return list;
}


class SimplePoint {
  constructor(x_ = 0, y_ = 0) {
    this.x = x_;
    this.y = y_;
  }
}

class Point {
  constructor(x_ = 0, y_ = 0, parent_) {
    this.x = x_;
    this.y = y_;
    this.parent = parent_;

    this.dom = document.createElementNS(SVGNS, 'ellipse');
    this.dom.setAttribute("class", "Point");
    this.dom.setAttribute('rx', 5);
    this.dom.setAttribute('ry', 5);

    this.addEvents();
    this.updateDom();
  }

  updateDom() {
    this.dom.setAttribute('cx', this.x);
    this.dom.setAttribute('cy', this.y);
  }

  addEvents() {
    var thiz = this;
    this.dom.addEventListener("mousedown", function(e) {
      e.preventDefault();
      thiz.parent.selectedPoint = thiz;
    }, false);
  }

}


class BezierCurve {
  constructor(points_ = []) {
    this.nodes = points_;

    this.dom = document.createElementNS(SVGNS, 'g');
    this.segments = document.createElementNS(SVGNS, 'polyline');
    this.segments.setAttribute('class', 'segments');
    this.dom.appendChild(this.segments);

    this.curve = document.createElementNS(SVGNS, 'polyline');
    this.curve.setAttribute('class', 'curve');
    this.dom.appendChild(this.curve);

    this.updateDom();
  }

  updateDom() {
    for (let node of this.nodes) {
      node.updateDom();
    }
    this.segments.setAttribute('points', pointList_to_string(this.nodes));
    this.curve.setAttribute('points', pointList_to_string(this.calculatePoints()));
  }

  calculatePoints() {
    let result = [];
    let nbPts = 100;
    for (let i = 0; i < nbPts; i++) {
      let fact = i / (nbPts - 1);
      let newPointList = this.reduceList(this.nodes, fact);
      while (newPointList.length > 1) {
        newPointList = this.reduceList(newPointList, fact);
      }
      result.push(newPointList[0]);
    }
    return result;
  }

  reduceList(list_, fact = 0) {
    let result = [];
    for (let i = 0; i < list_.length - 1; i++) {
      let newX = list_[i].x * (1 - fact) + list_[i + 1].x * fact;
      let newY = list_[i].y * (1 - fact) + list_[i + 1].y * fact;
      result.push(new SimplePoint(newX, newY));
    }
    return result;
  }



}