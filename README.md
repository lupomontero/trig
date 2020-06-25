# Trig

Este repo contiene el código usado durante la presentación "Trigonometría
bella", que explora una visualización de relaciones trigonométricas. En
particular, nos centramos en las funciones _circulares_ _seno_ (`sin`) y
_coseno_ (`cos`).

[Acá puedes ver la visualización](#).

Si te animas a leer el código fuente de una, adelante! Si no acá tienes una
intro a las decisiones de diseño e implementación.

La _visualización_ es una _animación_ donde vamos a ir _recorriendo_ una
circuneferencia (en pasos de 1°). Esto significa que nuestra animación tendrá
360 frames (de 0° a 359°), y en cada frame nos vamos a concentrar en un punto de
la circunferencia, que corresponda a la interseción del radio al formar el
ángulo correspondiente con el eje X.

## Preparando el escenario

En este ejemplo vamos a usar `canvas` para hacer la animación, así que partamos
por una función donde, a partir de un ancho en pixeles (`width`), vamos a crear
un elemento de tipo de canvas que nos sirva para _dibujar_.

```js
const createGraph = (width = 500) => {
  const canvas = Object.assign(
    document.createElement('canvas'),
    { width, height: width },
  );

  // ...

  return canvas;
};
```

En el _snippet_ de arriba, la función `createGraph` crea un canvas
(`HTMLCanvasElement`). A ese `canvas` le asignamos un ancho y alto usando el
valor recibido en el argumento `width`. Esto significa que nuestro canvas será
un cuadrado, con el mismo ancho que alto. Y fnalmente retornamos el `canvas`. Ya
tenemos un _escenario_!

## Definiendo un origen

Continuando con la función `createGraph`, ahora queremos _definir_ de alguna
forma la idea de un punto _origen_ (coordenadas `0,0`), que en este caso será el
mismo para los ejes cartesianos y la circunferencia.

:warning: El _origen_ de la animación no es lo mismo que el _origen_ del
`canvas`. En el canvas las coordenadas `0,0` corresponden a la esquina de arriba
a la izquierda, mientras que desde el punto de vista de nuestra animación el
_origen_ de los ejes cartesianos y la circunferencia están en el centro del
`canvas`.

```js
const createGraph = (width = 500) => {
  const canvas = Object.assign(
    document.createElement('canvas'),
    { width, height: width },
  );
  // El diámetro de la circunferencia será el mismo que el ancho del canvas.
  // Por lo tanto, las coordendas de origen de nuestra animación estarán a una
  // distancia igual al radio en ambos ejes de las coordenadas de origen del
  // canvas.
  const radius = width / 2;
  const center = { x: radius, y: radius };

  // ...

  return canvas;
};
```

## El _motor_ de la animación

Hasta ahora hemos creado un `canvas` y definido la idea de _origen_, ahora nos
toca ver cómo podemos hacer para _actualizar_ el canvas cada _frame_ de la
animación.

Para esto vamos a usar `window.requestAnimationFrame`, que nos
permite registrar un callback que se ejecutará cada vez que el navegador vaya a
_redibujar_ la interfaz. Los navegadores normalmente _refrescan_ la interfaz a
una velocidad de 60 frames x segundo (60fps), lo que significa que si
como resultado de invocar el callback que le pasamos a
`window.requestAnimationFrame` terminamos volviendo a invocar a
`window.requestAnimationFrame` otra vez, nuestros callbacks se estarán
ejecutando a un ritmo de 60 por segundo (asumiendo que nada bloquea el thread).
Esto nos da una _velocidad_ de un ciclo completo (`0..359`) tomará `6` segundos.

```js
const createGraph = (width = 500) => {
  const canvas = Object.assign(
    document.createElement('canvas'),
    { width, height: width },
  );
  const radius = width / 2;
  const center = { x: radius, y: radius };

  const update = (angle = 0) => {
    // Dibujar frame!!
    window.requestAnimationFrame(() => update(angle < 359 ? angle + 1 : 0));
  };

  update();

  return canvas;
};
```

En el _snippet_ de arriba hemos agregado la función `update` así como una
primera invocación a ella. Y si nos fijamos, en el cuerpo de la función `update`
estamos invocando `window.requestAnimationFrame` pasándole un callback que
invocará otra vez a `update`... hermosa recursión!

En cada invocación a `update` vamos a ir aumentando el valor de `angle` por `1`
hasta llegar a `359` y de ahí volvemos a empezar. Ya tenemos un _ciclo_ (usando
recursión) donde vamos a ir recorriendo de `0` a `359` y vuelta a empezar _ad
infinitum_.

## Finalmente, la trigonometría

Ya hemos definido un mecánica para poder ir haciendo ese recorrido de `0` a
`359`, frame a frame, y sabemos que nuestra función `update` se va a invocar una
vez para cada frame. Para poder calcular la posición del punto que corresponde
al ángulo (`angle`) nos toca usar trigonometría. En particular, vamos a usar
el _seno_ para calcular el componente `x` y el _coseno_ para el componente `y`.

```js
const update = (angle = 0) => {
  const radians = degreesToRadians(angle);
  const pointOnCircle = {
    x: center.x + Math.cos(radians) * radius,
    y: center.y + Math.sin(radians) * radius,
  };

  // Dibujar frame!!

  window.requestAnimationFrame(() => update(angle < 359 ? angle + 1 : 0));
};
```

El _seno_ y _coseno_ van a ser siempre valores entre `-1` y `1`, así que
multiplicando por el radio, obtenemos las posiciones relativas al tamaño de
nuestro `canvas`. Además nos toca también tener en cuenta el _offset_ del
punto de origen de nuestra animación (`center`) y el _origen_ (`0,0`) desde el
punto de vista del canvas.

***

Como referencia, dejemos acá las definiciones (en mis palabras :see_no_evil:) de
las funciones circulares fundamentales:

```
Si consideramos la hipotenusa como el radio de una circunferencia con origen en
cualquiera de sus extremos...

 origen
   x                              .
   |\                             |\
   | \                            | \
ca |  \ h                     co  |  \ h
   |   \                          |   \
   ------                         -----x origen
     co                             ca

co => cateto opuesto
ca => cateto adyacente
h => hipotenusa

Las funciones seno (sin), coseno (cos) y tangente (tan) para un ángulo θ:

sin θ = co / h
cos θ = ca / h
tan θ = co / ca
```

***

## Links

* [Beautiful Trigonometry - Numberphile](https://www.youtube.com/watch?v=snHKEpCv0Hk)
* https://www.geogebra.org/m/S2W46Thv
* https://en.wikipedia.org/wiki/Trammel_of_Archimedes
* https://upload.wikimedia.org/wikipedia/commons/8/84/Archimedes_trammel_loci.svg
* https://ee.stanford.edu/~hellman/playground/hyperspheres/radians.html