var SVGNS = "http://www.w3.org/2000/svg";

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
};

colorGenerator = function(r = 0, g = 0, b = 0, alpha = 1) {
  return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
}


class Universe {
  constructor() {
    this.container = document.getElementById("container");
    this.dom = document.createElementNS(SVGNS, "svg");
    this.container.appendChild(this.dom);
    this.viewBox = new ViewBox(this.dom);

    this.selectedPoint = null;
    this.points = [];
    this.curves = [];
    this.init();
    this.addEvents();
    let sides = 16;
  }

  init() {
    // clean everything
    while (this.dom.firstChild != null) {
      this.dom.removeChild(this.dom.firstChild);
    }
    this.curvesDom = document.createElementNS(SVGNS, 'g');
    this.dom.appendChild(this.curvesDom);

    this.pointsDom = document.createElementNS(SVGNS, 'g');
    this.dom.appendChild(this.pointsDom);



    this.points = [];
    this.curves = [];
    this.selectedPoint = null;
  }

  addNewPoint(x_ = 0, y_ = 0) {
    let newPoint = new Point(x_, y_, this);
    this.pointsDom.appendChild(newPoint.dom);
    this.addSelectedPoint(newPoint);
  }

  addSelectedPoint(point_) {
    if (this.points.indexOf(point_) == -1) {
      this.points.push(point_);
    }
  }

  addCurve() {
    if (this.points.length > 0) {
      let newCurve = new BezierCurve(this.points);
      this.curves.push(newCurve);
      this.curvesDom.appendChild(newCurve.dom);
      this.points = [];
    }
  }

  updateDom() {
    for (let point of this.points) {
      point.updateDom();
    }

    for (let curve of this.curves) {
      curve.updateDom();
    }
  }

  addEvents() {
    let thiz = this;

    // KEYBOARD Events
    document.onkeydown = function(e) {
      // console.log(e.key);
      switch (e.key.toUpperCase()) {
        case "ENTER":
          thiz.addCurve();
          break;
        case ' ':
          thiz.init();
          break;
        default:
          break;
      }
    }

    // MOUSE events
    this.container.addEventListener("mousedown", function(e) {
      e.preventDefault();
      thiz.hasMoved = false;
      if (!thiz.selectedPoint) {
        thiz.addNewPoint(
          thiz.viewBox.realX(e.clientX),
          thiz.viewBox.realY(e.clientY)
        );
      }
    }, false);

    document.addEventListener("mousemove", function(e) {
      e.preventDefault();
      thiz.hasMoved = true;
      if (thiz.selectedPoint != null) {
        thiz.selectedPoint.x = thiz.viewBox.realX(e.clientX);
        thiz.selectedPoint.y = thiz.viewBox.realY(e.clientY);
        thiz.updateDom();
      }
    }, false);

    document.addEventListener("mouseup", function(e) {
      e.preventDefault();
      if (thiz.selectedPoint != null && !thiz.hasMoved) {
        thiz.addSelectedPoint(thiz.selectedPoint);
      }
      thiz.selectedPoint = null;
    }, false);

    document.addEventListener("wheel", function(e) {
      e.preventDefault();
      let k = 1.1;
      if (e.deltaY > 0) {
        k = 1 / k;
      }
      thiz.viewBox.scale(e.clientX, e.clientY, k);
    }, false);

    //
    // // TOUCH events
    // this.container.addEventListener("touchstart", function(e) {
    //   e.preventDefault();
    // }, false);
    //
    // this.container.addEventListener("touchmove", function(e) {
    //   e.preventDefault();
    // }, false);
    //
    // this.container.addEventListener("touchend", function(e) {
    //   e.preventDefault();
    // }, false);
    //
    // this.container.addEventListener("touchcancel", function(e) {
    //   e.preventDefault();
    // }, false);
    //
    // this.container.addEventListener("touchleave", function(e) {
    //   e.preventDefault();
    // }, false);

    // OTHER events
    window.onresize = function(e) {
      thiz.viewBox.resize();
    }

    // window.onerror = function(msg, source, noligne, nocolonne, erreur) {
    //   let str = "";
    //   str += msg;
    //   str += " * ";
    //   str += source;
    //   str += " * ";
    //   str += noligne;
    //   str += " * ";
    //   str += nocolonne;
    //   str += " * ";
    //   // str += erreur;
    //   thiz.console(str);
    // }
  }

}

class ViewBox {
  constructor(parent_) {
    this.parent = parent_;
    this.xMin = 0;
    this.yMin = 0;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.set();
  }

  repr() {
    return this.xMin + " " + this.yMin + " " + this.width + " " + this.height;
  }

  set() {
    this.parent.setAttributeNS(null, 'viewBox', this.repr());
  }

  realX(x) {
    // Returns the "real" X in the viewBox from a click on the parent Dom...
    let domRect = this.parent.getBoundingClientRect();
    return (x - domRect.left) / domRect.width * this.width + this.xMin;
  }

  realY(y) {
    // Returns the "real" Y in the viewBox from a click on the parent Dom...
    let domRect = this.parent.getBoundingClientRect();
    return (y - domRect.top) / domRect.height * this.height + this.yMin;
  }

  // Events
  resize() {
    this.height = this.width * window.innerHeight / window.innerWidth;
    this.set();
  }

  scale(x, y, fact = 1) {
    let coorX = this.realX(x);
    let coorY = this.realY(y);

    this.xMin = coorX - (coorX - this.xMin) / fact;
    this.yMin = coorY - (coorY - this.yMin) / fact;
    this.width /= fact;
    this.height /= fact;
    this.set();
  }

  translate(dx, dy) {
    let domRect = this.parent.getBoundingClientRect();
    this.xMin += dx / domRect.width * this.width;
    this.yMin += dy / domRect.height * this.height;
    this.set();
  }
}

let u_ = new Universe();