var SVGNS = "http://www.w3.org/2000/svg";
colorGenerator = function(r = 0, g = 0, b = 0, alpha = 1) {
  return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
}

class Universe {
  constructor() {
    this.spaceship = null;
    this.asteroids = [];
    this.rockets = [];

    // this.boids = [];
    // this.obstacles = [];

    this.container = document.getElementById("container");
    this.dom = document.createElementNS(SVGNS, "svg");
    this.container.appendChild(this.dom);
    this.viewBox = new ViewBox(this.dom);
    this.textBlock = new TextBlock();
    this.addEvents();
    this.lastUpdate = Date.now();

    this.levelCount = 1;
    this.resetGame();

  }

  resetGame() {
    this.createSpaceship(this.viewBox.width / 2, this.viewBox.height / 2);
    this.killAllAsteroids();
    this.loadLevel();
  }

  nextLevel() {
    this.levelCount += 1;
    this.loadLevel();
  }

  loadLevel() {
    for (let i = 0; i < this.levelCount; i++) {
      let side = Math.random();
      let x = 0;
      let y = 0;
      if (side < 0.25) {
        //top
        x = Math.random() * this.viewBox.width;
        y = -10;
      } else if (side < 0.5) {
        //bottom
        x = Math.random() * this.viewBox.width;
        y = this.viewBox.height + 10;
      } else if (side < 0.75) {
        //left
        x = -10;
        y = Math.random() * this.viewBox.height;
      } else {
        // right
        x = this.viewBox.height + 10;
        y = Math.random() * this.viewBox.height;
      }
      this.createAsteroid(x, y);
    }
  }

  killAllAsteroids() {
    for (let asteroid of this.asteroids) {
      this.dom.removeChild(asteroid.dom);
    }
    this.asteroids = [];
  }


  createSpaceship(x_ = 0, y_ = 0) {
    if (this.spaceship != null) {
      this.dom.removeChild(this.spaceship.dom);
    }

    this.spaceship = new Spaceship(x_, y_);
    this.dom.appendChild(this.spaceship.dom);
  }

  createRocket() {
    let newRocket = new Rocket(this.spaceship);
    this.dom.appendChild(newRocket.dom);
    this.rockets.push(newRocket);
  }

  createAsteroid(x_, y_) {
    this.addAsteroid(new Asteroid(x_, y_));
  }

  addAsteroid(asteroid_) {
    this.dom.appendChild(asteroid_.dom);
    this.asteroids.push(asteroid_);
  }

  addEvents() {
    let thiz = this;
    this.boid_obstacle_selector = true;

    this.console = function(chaine) {
      thiz.textBlock.log.textContent = chaine;
    }


    this.shootOff = true;

    // KEYBOARD Events
    document.onkeydown = function(e) {
      // console.log(e.key);
      switch (e.key) {
        case "Control":
          if (thiz.shootOff) {
            thiz.createRocket();
            thiz.shootOff = false;
          }
          break;
        case "ArrowLeft":
          thiz.spaceship.turnL = true;
          break;
        case "ArrowRight":
          thiz.spaceship.turnR = true;
          break;
        case "ArrowUp":
          thiz.spaceship.boostOn = true;
          break;
        case "ArrowDown":
          thiz.spaceship.brakeOn = true;
          break;

        default:
          break;
      }
    }
    document.onkeyup = function(e) {
      switch (e.key) {
        case "Control":
          thiz.shootOff = true;
          break;
        case "ArrowLeft":
          thiz.spaceship.turnL = false;
          break;
        case "ArrowRight":
          thiz.spaceship.turnR = false;
          break;
        case "ArrowUp":
          thiz.spaceship.boostOn = false;
          break;
        case "ArrowDown":
          thiz.spaceship.brakeOn = false;
          break;

        default:
          break;
      }
    }

    // TEXTblock events
    // this.textBlock.btn1.addEventListener("mousedown", function(e) {
    //   thiz.clickFired = true;
    //
    //   thiz.boid_obstacle_selector = !thiz.boid_obstacle_selector;
    //   thiz.textBlock.btn1_toggle(thiz.boid_obstacle_selector);
    //   e.preventDefault();
    // }, false);
    //
    // this.textBlock.btn1.addEventListener("touchstart", function(e) {
    //   thiz.clickFired = true;
    //
    //   thiz.boid_obstacle_selector = !thiz.boid_obstacle_selector;
    //   thiz.textBlock.btn1_toggle(thiz.boid_obstacle_selector);
    //   e.preventDefault();
    // }, false);



    // MOUSE events
    // this.container.addEventListener("mousedown", function(e) {
    //   e.preventDefault();
    //   if (!thiz.clickFired) {
    //     thiz.mouseDown = true;
    //     thiz.mouseClick(e.clientX, e.clientY);
    //   }
    // }, false);
    //
    // this.container.addEventListener("mousemove", function(e) {
    //   e.preventDefault();
    //   if (thiz.mouseDown) {
    //     thiz.mouseClick(e.clientX, e.clientY);
    //   }
    // }, false);
    //
    // this.container.addEventListener("mouseup", function(e) {
    //   e.preventDefault();
    //   thiz.mouseDown = false;
    //   thiz.clickFired = false;
    // }, false);

    this.container.addEventListener("wheel", function(e) {
      e.preventDefault();
      let k = 1.1;
      if (e.deltaY > 0) {
        k = 1 / k;
      }
      thiz.viewBox.scale(e.clientX, e.clientY, k);
    }, false);


    // TOUCH events
    // this.container.addEventListener("touchstart", function(e) {
    //   e.preventDefault();
    //   if (!thiz.clickFired) {
    //     thiz.mouseDown = true;
    //     thiz.touchEvent.saveEvent(e);
    //     // if (thiz.touchEvent.size == 0) {
    //     //   thiz.mouseClick(thiz.touchEvent.x, thiz.touchEvent.y);
    //     // }
    //   }
    // }, false);
    //
    // this.container.addEventListener("touchmove", function(e) {
    //   e.preventDefault();
    //   let newTouch = new TouchEvent();
    //   newTouch.saveEvent(e, true);
    //   if (newTouch.size == 0) {
    //     thiz.mouseClick(newTouch.x, newTouch.y);
    //   } else {
    //     let dx = newTouch.x - thiz.touchEvent.x;
    //     let dy = newTouch.y - thiz.touchEvent.y;
    //     thiz.viewBox.translate(-dx, -dy);
    //     thiz.viewBox.scale(newTouch.x, newTouch.y, newTouch.size / thiz.touchEvent.size);
    //   }
    //   thiz.touchEvent = newTouch;
    // }, false);
    //
    // this.container.addEventListener("touchend", function(e) {
    //   e.preventDefault();
    //   if (!thiz.clickFired && !thiz.touchEvent.hasMoved) {
    //     if (thiz.touchEvent.size == 0) {
    //       thiz.mouseClick(thiz.touchEvent.x, thiz.touchEvent.y);
    //     }
    //   }
    //
    //   thiz.mouseDown = false;
    //   thiz.clickFired = false;
    //   thiz.touchEvent.reset();
    // }, false);
    //
    // this.container.addEventListener("touchcancel", function(e) {
    //   e.preventDefault();
    //   thiz.mouseDown = false;
    //   thiz.clickFired = false;
    //   thiz.touchEvent.reset();
    // }, false);
    //
    // this.container.addEventListener("touchleave", function(e) {
    //   e.preventDefault();
    //   thiz.mouseDown = false;
    //   thiz.clickFired = false;
    //   thiz.touchEvent.reset();
    // }, false);
    //

    // OTHER events
    window.onresize = function(e) {
      thiz.viewBox.resize();
    }

    window.onerror = function(msg, source, noligne, nocolonne, erreur) {
      let str = "";
      str += msg;
      str += " * ";
      str += source;
      str += " * ";
      str += noligne;
      str += " * ";
      str += nocolonne;
      str += " * ";
      // str += erreur;
      thiz.console(str);
    }
  }

  update() {
    this.spaceship.update();
    this.controlEdges(this.spaceship);

    // rockets OoB ?
    let i = 0;
    while (i < this.rockets.length) {
      let rocket = this.rockets[i];
      rocket.update();
      if (rocket.outOfBounds(this.viewBox)) {
        this.dom.removeChild(rocket.dom);
        this.rockets.splice(i, 1);
      } else {
        i++;
      }
    }

    // asteroids OoB ?
    for (let asteroid of this.asteroids) {
      asteroid.update();
      this.controlEdges(asteroid);
    }

    // rockets & asteroids ?
    let j = 0;
    i = 0;
    while (i < this.rockets.length) {
      j = 0;
      while (j < this.asteroids.length) {
        if (this.asteroids[j].checkRocket(this.rockets[i])) {
          // console.log("touch");
          // raise Points

          // explodes asteroid
          let children = this.asteroids[j].explodes();
          this.dom.removeChild(this.asteroids[j].dom);
          this.asteroids.splice(j, 1);
          for (let child of children) {
            this.addAsteroid(child);
          }

          // removes rocket:
          this.dom.removeChild(this.rockets[i].dom);
          this.rockets.splice(i, 1);

          i--;
          j += this.asteroids.length;
        } else {
          // console.log("miss");
          j++;
        }
      }
      i++;
    }

    // asteroid & Spaceship
    let touched = false;
    i = 0
    while (!touched && i < this.asteroids.length) {
      touched = this.spaceship.touched(this.asteroids[i]);
      i++
    }
    if (touched) {
      alert("perdu");
      this.resetGame();
    }

    if (this.asteroids.length == 0) {
      alert("niveau suivant !");
      this.nextLevel();
    }
  }

  show() {
    this.spaceship.show();

    for (let rocket of this.rockets) {
      rocket.show();
    }

    for (let asteroid of this.asteroids) {
      asteroid.show();
    }

  }

  refresh() {
    let now = Date.now();
    if (now - this.lastUpdate > 20) {
      this.lastUpdate = now;
      this.update();
      this.show();

    }
  }

  controlEdges(obj) {
    let tol = 15;
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

class TouchEvent {
  constructor() {
    this.init();
  }

  init() {
    this.x = null;
    this.y = null;
    this.size = null;
    this.hasMoved = null;
  }

  saveEvent(e, hasMoved_ = false) {
    // position
    let x = 0;
    let y = 0;
    let n = e.touches.length;
    for (let i = 0; i < n; i++) {
      x += e.touches[i].clientX / n;
      y += e.touches[i].clientY / n;
    }
    this.x = x;
    this.y = y;

    // size
    let lMax = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let l = Math.pow(e.touches[i].clientX - e.touches[j].clientX, 2);
        l += Math.pow(e.touches[i].clientY - e.touches[j].clientY, 2);
        lMax = Math.max(lMax, l);
      }
    }
    this.size = Math.pow(lMax, 0.5);

    // has hasMoved
    this.hasMoved = hasMoved_;
  }

  reset() {
    // this.init();
  }
}

class TextBlock {
  constructor() {
    this.container = document.getElementById("container");
    this.dom = this.dom = document.createElementNS(SVGNS, "svg");
    this.dom.setAttributeNS(null, "class", "legend");
    this.container.appendChild(this.dom);

    this.text = document.createElementNS(SVGNS, "text");
    this.dom.appendChild(this.text);
    this.text.setAttributeNS(null, "x", 0);
    this.text.setAttributeNS(null, "y", 30);
    this.text.setAttributeNS(null, "fill", "rgba(0,0,0,0.7)");

    this.title = document.createElementNS(SVGNS, "tspan");
    this.text.appendChild(this.title);
    this.title.setAttributeNS(null, "font-size", "30px");

    // this.description = document.createElementNS(SVGNS, "tspan");
    // this.text.appendChild(this.description);
    // this.description.setAttributeNS(null, "font-size", "12px");
    // this.description.setAttributeNS(null, "x", 0);
    // this.description.setAttributeNS(null, "dy", 20);

    this.btn1 = document.createElementNS(SVGNS, "text");
    this.btn1.setAttributeNS(null, "fill", "rgba(0,0,0,0.7)");
    this.dom.appendChild(this.btn1);
    this.btn1.setAttributeNS(null, "class", "button");
    this.btn1.setAttributeNS(null, "font-size", "12px");
    this.btn1.setAttributeNS(null, "x", 0);
    this.btn1.setAttributeNS(null, "y", 60);

    this.title.textContent = "Asteroids 2";
    this.btn1_status = true;
    this.btn1_set();

    this.log = document.createElementNS(SVGNS, "text");
    this.log.setAttributeNS(null, "fill", "rgba(0,0,0,0.7)");
    this.dom.appendChild(this.log);
    this.log.setAttributeNS(null, "class", "button");
    this.log.setAttributeNS(null, "font-size", "12px");
    this.log.setAttributeNS(null, "x", 0);
    this.log.setAttributeNS(null, "y", 80);


  }

  btn1_toggle(newvalue) {
    this.btn1_status = newvalue;
    this.btn1_set();
  }

  btn1_set() {
    // this.btn1.textContent = this.btn1_status ? "Create Boids or Obstacles: BOIDS" : "Create Boids or Obstacles: OBSTACLES";
    this.btn1.textContent = "CTRL to shoot, arrows to move. Try to stay alive ";
  }

}