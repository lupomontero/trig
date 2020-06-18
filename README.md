# Trig

* [Beautiful Trigonometry - Numberphile](https://www.youtube.com/watch?v=snHKEpCv0Hk)
* https://www.geogebra.org/m/S2W46Thv
* https://en.wikipedia.org/wiki/Trammel_of_Archimedes
* https://upload.wikimedia.org/wikipedia/commons/8/84/Archimedes_trammel_loci.svg
* https://ee.stanford.edu/~hellman/playground/hyperspheres/radians.html

```
sin θ = co / h
cos θ = ca / h
tan θ = co / ca
```

```js
const degreesToRadians = degrees => degrees * Math.PI / 180;
```

```js
const drawCircle = (ctx, x, y, radius, color, stroke = true) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  if (color) {
    ctx.fillStyle = color;
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
};
```

```js
const drawLine = (ctx, fromX, fromY, toX, toY) => {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
};
```

```js
const createGraph = (width = 500) => {
  const radius = width / 2;
  const center = { x: radius, y: radius }; // Circumference center x, y
  const canvas = document.createElement('canvas');
  Object.assign(canvas, { width, height: width });
  const ctx = canvas.getContext('2d');

  const update = (angle = 0) => {
    const radians = degreesToRadians(angle);
    const pointOnCircle = {
      x: center.x + Math.cos(radians) * radius,
      y: center.y + Math.sin(radians) * radius,
    };

    // Draw stuff!!

    window.requestAnimationFrame(() => update(angle < 359 ? angle + 1 : 0));
  };

  update();

  return canvas;
};
```
