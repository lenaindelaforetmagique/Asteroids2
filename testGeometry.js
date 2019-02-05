var SVGNS = "http://www.w3.org/2000/svg";
colorGenerator = function(r = 0, g = 0, b = 0, alpha = 1) {
  return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
}

class Universe {
  constructor() {
    this.container = document.getElementById("container");
    this.dom = document.createElementNS(SVGNS, "svg");
    this.container.appendChild(this.dom);
    this.viewBox = new ViewBox(this.dom);

    this.domObjects = [];

    this.points = [];
    this.polygon = null;


    // // for debug
    // // let pA = new Vector(30, 30);
    // // let pB = new Vector(130, 80);
    // // let pC = new Vector(80, 130);
    //
    // this.debugPoints = [];
    // // this.debugTriangle = new Triangle(pA, pB, pC);
    // // this.dom.appendChild(this.debugTriangle.domRepr());

    this.addEvents();
    this.lastUpdate = Date.now();
  }

  init() {
    // clean everything
    for (let domObject of this.domObjects) {
      this.dom.removeChild(domObject);
    }

    this.domObjects = [];
    this.points = [];
    this.polygon = null;
  }


  addEvents() {
    let thiz = this;

    // KEYBOARD Events
    document.onkeydown = function(e) {
      console.log(e.key);
      switch (e.key.toUpperCase()) {
        case "ENTER":
          if (thiz.points.length > 0) {
            // create polygon
            thiz.polygon = new Polygon(thiz.points);
            let dom = thiz.polygon.domRepr();
            thiz.dom.appendChild(dom);
            thiz.domObjects.push(dom);
            thiz.points = [];
          }
          break;
        case ' ':
          thiz.init();
          break;
          // case 'S':
          //   // refine
          //   if (thiz.polygon != null) {
          //     thiz.polygon.refine();
          //     let dom = thiz.polygon.domRepr();
          //     thiz.init();
          //     thiz.dom.appendChild(dom);
          //     thiz.domObjects.push(dom);
          //   }
          //   break;

        case 'R':
          // refine
          if (thiz.polygon != null) {
            thiz.polygon.refine2();
            let dom = thiz.polygon.domRepr();
            // thiz.init();
            thiz.dom.appendChild(dom);
            thiz.domObjects.push(dom);
          }
          break;
        default:
          break;
      }
    }


    // MOUSE events
    this.container.addEventListener("mousedown", function(e) {
      e.preventDefault();
      // console.log(e);
      if (e.button == 0) {
        // ajoute point
        let point = new Vector(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
        thiz.points.push(point);
        let dom = point.domRepr();

        thiz.dom.appendChild(dom);
        thiz.domObjects.push(dom);
      }

    }, false);

    // this.container.addEventListener("mousemove", function(e) {
    //   e.preventDefault();
    //   // console.log(e);
    //   if (e.button == 0) {
    //     // ajoute point
    //     let point = new Vector(thiz.viewBox.realX(e.clientX), thiz.viewBox.realY(e.clientY));
    //     let dom = point.domRepr();
    //     console.log(thiz.asteroids[0]);
    //     if (thiz.spaceship.polygon.containsPoint(point)) {
    //       // if (thiz.asteroids[0].polygon.containsPoint(point)) {
    //       dom.setAttribute('fill', "red");
    //     }
    //     thiz.dom.appendChild(dom);
    //     // thiz.debugPoints.push(point);
    //   } else {
    //     //affiche polygone
    //     let polyg = new Polygon(thiz.debugPoints);
    //     thiz.dom.appendChild(polyg.domRepr());
    //
    //     thiz.debugPoints = [];
    //
    //   }
    //
    // }, false);

  }

  update() {

  }

  show() {

  }

  refresh() {
    let now = Date.now();
    if (now - this.lastUpdate > 20) {
      this.lastUpdate = now;
      if (this.alive) {
        this.update();
        this.show();
      }
    }
  }

  controlEdges(obj) {
    let tol = 0;
    while (obj.position.x + tol < this.viewBox.xMin) {
      obj.position.x += this.viewBox.width + 2 * tol;
    }
    while (obj.position.x - tol > this.viewBox.xMin + this.viewBox.width) {
      obj.position.x -= this.viewBox.width + 2 * tol;
    }

    while (obj.position.y + tol < this.viewBox.yMin) {
      obj.position.y += this.viewBox.height + 2 * tol;
    }
    while (obj.position.y - tol > this.viewBox.yMin + this.viewBox.height) {
      obj.position.y -= this.viewBox.height + 2 * tol;
    }
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