let u_ = new Universe();

var updateCB = function(timestamp) {
  u_.refresh(timestamp);
  window.requestAnimationFrame(updateCB);
};
updateCB(0);