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
  showHelp: false,
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
  isPaused: false,
};


const state = { ...initialState };


const createGraph = (width = 500) => {
  const canvas = Object.assign(
    document.createElement('canvas'),
    { width, height: width },
  );
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


const shortcuts = {
  h: {
    description: 'Show/hide help (keyboard shortcuts)',
    fn: () => {
      Object.assign(state, { showHelp: !state.showHelp });
      if (!state.showHelp) {
        return document.body.removeChild(document.querySelector('.help'));
      }
      const container = Object.assign(document.createElement('div'), {
        className: 'help',
        innerHTML: '<h2>Keyboard shortcuts</h2>',
      });
      Object.keys(shortcuts).forEach((key) => {
        const el = document.createElement('div');
        el.textContent = `${key}: ${shortcuts[key].description}`;
        container.appendChild(el);
      });
      document.body.appendChild(container);
    },
  },
  a: {
    description: 'Show/hide X and Y axes',
    fn: () => Object.assign(state, { showAxes: !state.showAxes }),
  },
  o: {
    description: 'Show/hide outer circle',
    fn: () => Object.assign(state, { showOuterCircle: !state.showOuterCircle }),
  },
  m: {
    description: 'Show/hide mid point between X and Y projections',
    fn: () => Object.assign(state, { showMidpoint: !state.showMidpoint }),
  },
  n: {
    description: 'Show/hide mid point trace between X and Y projections (mid point - shortcut m - should be visible)',
    fn: () => Object.assign(state, { showMidpointTrace: !state.showMidpointTrace }),
  },
  r: {
    description: 'Show/hide radius',
    fn: () => Object.assign(state, { showRadius: !state.showRadius }),
  },
  x: {
    description: 'Show/hide line from point on circle to X projection',
    fn: () => Object.assign(state, { showXProjection: !state.showXProjection }),
  },
  y: {
    description: 'Show/hide line from point on circle to Y projection',
    fn: () => Object.assign(state, { showYProjection: !state.showYProjection }),
  },
  s: {
    description: 'Show/hide sine wave plot',
    fn: () => Object.assign(state, { showSinWave: !state.showSinWave }),
  },
  c: {
    description: 'Show/hide cosine wave plot',
    fn: () => Object.assign(state, { showCosWave: !state.showCosWave }),
  },
  l: {
    description: 'Show/hide legend',
    fn: () => Object.assign(state, { showLegend: !state.showLegend }),
  },
  p: {
    description: 'Pause/play animation',
    fn: () => Object.assign(state, { isPaused: !state.isPaused }),
  },
  0: {
    description: 'Reset animation',
    fn: () => Object.assign(state, initialState),
  },
  9: {
    description: 'Show All',
    fn: () => Object.assign(state, {
      showAxes: true,
      showOuterCircle: true,
      showRadius: true,
      showXProjection: true,
      showYProjection: true,
      showMidpoint: true,
      showMidpointTrace: true,
      showSinWave: true,
      showCosWave: true,
      showLegend: true,
    }),
  },
};


window.addEventListener('keypress', (e) => {
  if (!shortcuts[e.key]) {
    return;
  }

  shortcuts[e.key].fn();
});


document.getElementById('root').appendChild(createGraph(800));


setTimeout(() => {
  window.dispatchEvent(new window.KeyboardEvent('keypress', { key: 'h' }));
});