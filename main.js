const degreesToRadians = degrees => degrees * Math.PI / 180;


const drawCircle = (ctx, x, y, radius, color, stroke = true) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  if (stroke) {
    ctx.stroke();
  }
  if (color) {
    ctx.fillStyle = color;
    ctx.fill();
  }
};


const drawLine = (ctx, fromX, fromY, toX, toY) => {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
};


const initialState = {
  isPaused: false,
  showAxes: false,
  showOuterCircle: false,
  showMidpoint: false,
  showMidpointTrace: false,
  showXProjection: false,
  showYProjection: false,
  showRadius: false,
  showSinWave: false,
  showCosWave: false,
  showLegend: false,
};


const state = { ...initialState };


const createGraph = (width = 500) => {
  const canvas = document.createElement('canvas');
  Object.assign(canvas, { width, height: width });
  const ctx = canvas.getContext('2d');
  const radius = width / 2;
  const center = { x: radius, y: radius }; // Circumference center x, y

  ctx.font = `${width / 40}px monospace`;
  ctx.textBaseline = 'top';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';

  const update = (angle = 0, midpoints = [], sin = [], cos = []) => {
    if (state.isPaused) {
      return window.requestAnimationFrame(() => update(angle, midpoints, sin, cos));
    }

    ctx.clearRect(0, 0, width, width);

    const radians = degreesToRadians(angle);
    const pointOnCircle = {
      x: center.x + Math.cos(radians) * radius,
      y: center.y + Math.sin(radians) * radius,
    };

    if (state.showAxes) {
      drawLine(ctx, 0, radius, width, radius); // X axis
      drawLine(ctx, radius, 0, radius, width); // Y axis
    }

    if (state.showLegend) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';

      ctx.fillText(`θ = ${angle}°`, 0, 0);
      ctx.fillText(`θ = ${radians.toFixed(2)}rad`, 0, width / 30);

      ctx.fillText('0', radius, radius);
      ctx.fillText('1', width - (width / 40), radius);
      ctx.fillText('1', radius, width - (width / 40));
      ctx.fillText('-1', 0, radius);
      ctx.fillText('-1', radius, 0);
    }

    if (state.showOuterCircle) {
      drawCircle(ctx, radius, radius, radius);
      drawCircle(ctx, pointOnCircle.x, pointOnCircle.y, radius / 20, 'cyan');
    }

    drawCircle(ctx, pointOnCircle.x, center.y, radius / 25, 'magenta');
    drawCircle(ctx, center.x, pointOnCircle.y, radius / 25, 'magenta');

    if (state.showMidpoint) {
      // midpoint between x and y projections.
      // https://www.mathsisfun.com/algebra/line-midpoint.html
      const midpoint = {
        x: (pointOnCircle.x + center.y) / 2,
        y: (center.x + pointOnCircle.y) / 2,
      };
      drawLine(ctx, pointOnCircle.x, center.x, center.y, pointOnCircle.y);
      drawCircle(ctx, midpoint.x, midpoint.y, radius / 50, 'yellow');
      if (state.showMidpointTrace) {
        midpoints.forEach(({ x, y }, idx) => drawCircle(ctx, x, y, radius / 50, `rgba(255, 255, 0, ${(1 - (idx / 359)) / 4})`, false));
        midpoints.unshift(midpoint);
      } else if (midpoints.length) {
        midpoints.splice(0, midpoints.length);
      }
    }

    if (state.showXProjection) {
      drawLine(ctx, pointOnCircle.x, pointOnCircle.y, pointOnCircle.x, center.y);
    }

    if (state.showYProjection) {
      drawLine(ctx, pointOnCircle.x, pointOnCircle.y, center.x, pointOnCircle.y);
    }

    if (state.showRadius) {
      drawLine(ctx, pointOnCircle.x, pointOnCircle.y, center.x, center.y);
    }

    if (state.showSinWave) {
      const sinXOnXAxis = { x: (angle / 360) * width, y: pointOnCircle.y };
      drawCircle(ctx, sinXOnXAxis.x, sinXOnXAxis.y, radius / 50, 'rgb(0, 255, 0)');
      sin.forEach(({ x, y }, idx) => drawCircle(ctx, x, y, radius / 50, `rgba(0, 255, 0, ${(1 - (idx / 359)) / 4})`));
      sin.unshift(sinXOnXAxis);
    } else if (sin.length) {
      sin.splice(0, sin.length);
    }

    if (state.showCosWave) {
      const cosXOnXAxis = { x: (angle / 360) * width, y: pointOnCircle.x };
      drawCircle(ctx, cosXOnXAxis.x, cosXOnXAxis.y, radius / 50, 'rgb(255, 0, 0)');
      cos.forEach(({ x, y }, idx) => drawCircle(ctx, x, y, radius / 50, `rgba(255, 0, 0, ${(1 - (idx / 359)) / 4})`));
      cos.unshift(cosXOnXAxis);
    } else if (cos.length) {
      cos.splice(0, cos.length);
    }

    window.requestAnimationFrame(() => update(
      angle < 359 ? angle + 1 : 0,
      midpoints.slice(0, 359),
      sin.slice(0, 359),
      cos.slice(0, 359),
    ));
  };

  update();

  return canvas;
};


window.addEventListener('keypress', (e) => {
  switch (e.key) {
    case '1':
      Object.assign(state, initialState, { showAxes: true });
      break;
    case '2':
      Object.assign(state, initialState, { showAxes: true, showOuterCircle: true });
      break;
    case '3':
      Object.assign(state, initialState, { showAxes: true, showOuterCircle: true, showRadius: true, showXProjection: true });
      break;
    case '4':
      Object.assign(state, initialState, { showAxes: true, showOuterCircle: true, showRadius: true, showXProjection: true, showYProjection: true });
      break;
    case '5':
      Object.assign(state, initialState, { showAxes: true, showOuterCircle: true, showMidpoint: true });
      break;
    case '6':
      Object.assign(state, initialState, { showAxes: true, showOuterCircle: true, showMidpoint: true, showMidpointTrace: true });
      break;
    case '7':
      Object.assign(state, initialState, { showAxes: true, showOuterCircle: true, showSinWave: true });
      break;
    case '8':
      Object.assign(state, initialState, { showAxes: true, showOuterCircle: true, showCosWave: true });
      break;
    case '9':
      Object.assign(state, initialState, { showAxes: true, showOuterCircle: true, showRadius: true, showXProjection: true, showYProjection: true, showMidpoint: true, showMidpointTrace: true, showSinWave: true, showCosWave: true });
      break;
    case 'a':
      state.showAxes = !state.showAxes;
      break;
    case 'o':
      state.showOuterCircle = !state.showOuterCircle;
      break;
    case 'm':
      state.showMidpoint = !state.showMidpoint;
      break;
    case 'n':
      state.showMidpointTrace = !state.showMidpointTrace;
      break;
    case 'r':
      state.showRadius = !state.showRadius;
      break;
    case 'x':
      state.showXProjection = !state.showXProjection;
      break;
    case 'y':
      state.showYProjection = !state.showYProjection;
      break;
    case 's':
      state.showSinWave = !state.showSinWave;
      break;
    case 'c':
      state.showCosWave = !state.showCosWave;
      break;
    case 'l':
      state.showLegend = !state.showLegend;
      break;
    case 'p':
      state.isPaused = !state.isPaused;
      break;
    case ' ':
    case '0':
      Object.assign(state, initialState);
      break;
  }
});


document.getElementById('root').appendChild(createGraph(800));

setTimeout(() => {
  window.dispatchEvent(new window.KeyboardEvent('keypress', { key: '9' }));
});
