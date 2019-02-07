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

    this.points = [];

    this.nodes = [];
    this.polygons = [];

    this.addEvents();
  }

  init() {
    // clean everything
    while (this.dom.firstChild != null) {
      this.dom.removeChild(this.dom.firstChild);
    }

    this.nodes = [];
    this.points = [];
    this.polygon = null;
  }

  addPoint(x_ = 0, y_ = 0) {
    let newPoint = new Point(x_, y_);
    this.points.push(newPoint);
    this.dom.appendChild(newPoint.dom);
  }

  addNode(x_ = 0, y_ = 0) {
    let newNode = new Node(x_, y_);
    this.nodes.push(newNode);
    this.dom.appendChild(newNode.dom);
  }

  addPolygon() {
    if (this.points.length > 0) {
      let newPolygon = new Polygon(this.points);
      this.polygons.push(newPolygon);
      this.dom.appendChild(newPolygon.dom);
      this.points = [];
    }
  }


  addEvents() {
    let thiz = this;
    // KEYBOARD Events
    document.onkeydown = function(e) {
      // console.log(e.key);
      switch (e.key.toUpperCase()) {
        case "ENTER":
          thiz.addPolygon();
          break;
        case ' ':
          thiz.init();
          break;
        case 'T':
          thiz.polygons.last().triangulate();
          break;
        case 'I':
          thiz.polygons.last().improveTriangulation();
          break;
        case 'R':
          thiz.polygons.last().refine();
          break;
        case 'M':
          thiz.polygons.last().mesh();
          break;

          // case 'R':
          //   // refine
          //   if (thiz.polygon != null) {
          //     thiz.polygon.refine2();
          //     let dom = thiz.polygon.domRepr();
          //     // thiz.init();
          //     thiz.dom.appendChild(dom);
          //   }
          //   break;
        default:
          break;
      }
    }


    // MOUSE events
    this.container.addEventListener("mousedown", function(e) {
      e.preventDefault();
      if (e.ctrlKey) {
        thiz.addNode(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
      } else {
        thiz.addPoint(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
      }
    }, false);
  }

}

class ViewBox {
  constructor(parent_) {
    this.parent = parent_;
    this.xMin = 0;
    this.yMin = 0;
    this.width = 600; //window.innerWidth;
    this.height = 600; //window.innerHeight;
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