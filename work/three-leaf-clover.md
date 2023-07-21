## Leaflet + three.js

<span style="color:#0000dd;">Can you give me an example of implementing leaflet.js in a three.js application?</span>

Certainly! Combining Leaflet.js with Three.js can be a powerful way to create interactive 3D maps with overlays and additional features. In this example, I'll show you how to set up a basic Three.js application with a Leaflet map overlay. We'll assume you have basic knowledge of both Three.js and Leaflet.js.

### Set up your HTML file with the necessary scripts and elements

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js with Leaflet Overlay</title>
  <style>
    body {
      overflow: hidden;
      margin: 0;
    }

    #map {
      position: absolute;
      z-index: 0;
      top: 0;
      bottom: 0;
      width: 100%;
    }

    #webgl-container {
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      width: 100%;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="webgl-container"></div>

  <!-- Add Three.js and Leaflet.js libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
</body>
</html>
```

### Create your Three.js scene and render loop

```javascript
// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('webgl-container').appendChild(renderer.domElement);

// Sample cube in the scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();
```

### Set up your Leaflet map and overlay

```javascript
// Leaflet map setup
const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Overlay a Three.js scene on the Leaflet map
const overlay = L.canvasOverlay()
  .drawing(drawWebGL)
  .addTo(map);

function drawWebGL(canvasOverlay, params) {
  // Get the Leaflet map overlay canvas and create a Three.js scene on it
  const canvas = canvasOverlay.canvas();
  const context = canvas.getContext('webgl');
  const gl = context || canvas.getContext('experimental-webgl');

  // Your Three.js scene setup using the same canvas for rendering
  // You can use Three.js to render any 3D content, like points, lines, or meshes.
  // For simplicity, we'll just render a cube on the map.
  // Make sure to update the cube position accordingly to the map coordinates.

  // This function will be called every time the map is panned or zoomed.
}

// Call the drawWebGL function to initialize the Three.js scene on the Leaflet map
drawWebGL(overlay);
```

<br>

Please note that the above code is a simplified example. You can create more complex scenes in Three.js and overlay them on the Leaflet map as needed. Remember to **adjust the `drawWebGL` function** to include your actual Three.js scene setup, rendering, and update logic.

Also, keep in mind that integrating Leaflet.js and Three.js can have **performance implications**, especially on mobile devices. Consider **optimizing** your code and using lower-poly models or point clouds if you encounter performance issues with complex 3D scenes.

## Error

<span style="color:#0000dd;">In the example implementation you provided above, the program errors on "const overlay = L.canvasOverlay();" saying "L.canvasOverlay is not a function".</span>

I apologize for the confusion. **You are right**; there is no built-in `L.canvasOverlay()` function in Leaflet.js.

The correct way to overlay Three.js content on a Leaflet map is to use a custom layer with `L.DomUtil.create()` to create a container for the Three.js scene.

Here's an updated version of the example, using a custom layer to overlay Three.js content on the Leaflet map:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js with Leaflet Overlay</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
    }

    #map {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      z-index: 0;
    }

    #webgl-container {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="webgl-container"></div>

  <!-- Add Three.js and Leaflet.js libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <script>
    // Your Three.js setup and content creation code here
    // (Same as before)

    // Leaflet map setup
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Create a custom layer for Three.js content overlay
    const customLayer = L.Layer.extend({
      onAdd: function (map) {
        this._map = map;

        // Create a container div for Three.js content
        this._container = L.DomUtil.create('div', 'leaflet-zoom-animated');
        this._container.id = 'webgl-container';
        this._container.style.pointerEvents = 'none'; // Allow interactions with the map under the overlay

        // Append the container to the map pane
        map.getPanes().overlayPane.appendChild(this._container);

        // Call the function to set up your Three.js content here
        drawWebGL(this._container, map.getSize());
      },

      onRemove: function (map) {
        // Clean up and remove the container from the map pane
        map.getPanes().overlayPane.removeChild(this._container);
      }
    });

    // Add the custom layer to the map
    map.addLayer(new customLayer());
  </script>
</body>
</html>
```

<br>

The key difference is that we are now using a custom layer that extends `L.Layer`. This custom layer allows us to control how the Three.js content is added and removed from the map. We create a container div for Three.js content and append it to the `overlayPane` of the map. Additionally, we call the `drawWebGL()` function to set up your Three.js content within the custom layer.

With this updated implementation, your Three.js content should be correctly overlaid on the Leaflet map. Make sure to customize the `drawWebGL()` function to set up your Three.js scene, render your 3D content, and handle any interactions as needed.

## Err0r

<span style="color:#0000dd;">So then the "drawWebGL" function also has to change, right?  Because there's no "canvasOverlay.canvas".  Can you please write the complete drawWebGL() function, also including whatever three.js code needs to go there?</span>

Apologies for the oversight. You are correct; the `drawWebGL` function needs to be updated to work within the custom layer context. Below is the complete `drawWebGL` function, including the necessary Three.js code to render a cube on the map:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js with Leaflet Overlay</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
    }

    #map {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      z-index: 0;
    }

    #webgl-container {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="webgl-container"></div>

  <!-- Add Three.js and Leaflet.js libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <script>
    // Leaflet map setup
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Create a custom layer for Three.js content overlay
    const customLayer = L.Layer.extend({
      onAdd: function (map) {
        this._map = map;

        // Create a container div for Three.js content
        this._container = L.DomUtil.create('div', 'leaflet-zoom-animated');
        this._container.id = 'webgl-container';
        this._container.style.pointerEvents = 'none'; // Allow interactions with the map under the overlay

        // Append the container to the map pane
        map.getPanes().overlayPane.appendChild(this._container);

        // Call the function to set up your Three.js content here
        this.drawWebGL(this._container, map.getSize());
      },

      onRemove: function (map) {
        // Clean up and remove the container from the map pane
        map.getPanes().overlayPane.removeChild(this._container);
      },

      // Updated drawWebGL function with Three.js code
      drawWebGL: function (container, size) {
        // Three.js setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, size.x / size.y, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(size.x, size.y);
        container.appendChild(renderer.domElement);

        // Sample cube in the scene
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        function animate() {
          requestAnimationFrame(animate);

          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;

          renderer.render(scene, camera);
        }

        animate();

        // Function to update the Three.js scene when the map is panned or zoomed
        function update() {
          const { x, y } = map.containerPointToLatLng([0, 0]);
          const z = map.getZoom();
          const s = map.getSize();
          const alt = 1 + ((s.y * 180) / (512 * 2 ** z)) / 400000;

          // Position the cube based on the map's center and zoom level
          cube.position.set(-y, x, alt);

          renderer.setSize(s.x, s.y);
          camera.aspect = s.x / s.y;
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        }

        // Listen for map move events and update the Three.js scene accordingly
        map.on('move', update);
        update();
      }
    });

    // Add the custom layer to the map
    map.addLayer(new customLayer());
  </script>
</body>
</html>
```

<br>

This updated version of the `drawWebGL` function creates a Three.js scene, sets up a simple rotating cube, and then adds the scene to the container div within the custom layer. The cube's position is updated based on the map's center, zoom level, and size, allowing it to stay correctly positioned as the map is panned or zoomed.

Remember that this is a basic example, and you can further customize the Three.js scene and content to suit your specific needs and 3D models. Additionally, consider optimizing the rendering and performance based on the complexity of your scene and the targeted devices.

### Ugh.

OK, I'm actually fxcked now because the code is completely different.

# FYI

https://stackoverflow.com/questions/17682551/three-js-leaflet-3d-maps

**krb686**

https://i306.photobucket.com/albums/nn255/Krb686/cest_3d_1.png

**fuzhenn**

https://github.com/maptalks/maptalks.js

**TheXappy**

https://mocainfo.thm.de/building-3d/

https://gist.github.com/Sumbera/c6fed35c377a46ff74c3

**Jose Gómez**

[OSM Buildings is 3D](https://github.com/OSMBuildings/OSMBuildings)

**Cool**

https://mappa.js.org/docs/examples-three-js.html

**What is better than three JS?**

WebGL, BabylonJS, Unity, D3. js, and PlayCanvas are the most popular alternatives and competitors to three.

<br>

<span style="color:#0000dd;font-weight:bold;font-size:larger;">What is a "lower-poly model"?  What is a "point cloud"?</span>

A "lower-poly model" and a "point cloud" are both **representations of 3D data** used in computer graphics and visualization.

### Lower-poly model

A "lower-poly model" refers to a 3D model that is constructed using a relatively small number of polygons (also known as faces or triangles) compared to a high-poly model. **Polygons are the building blocks** of 3D models and are used to represent the surfaces of objects in computer graphics. Each polygon is defined by its vertices (corner points) and can represent a flat or curved surface.

The level of detail in a 3D model is determined by the number of polygons it contains. **High-poly models** have a large number of polygons, providing a more detailed and smooth appearance but requiring greater computational resources to render. On the other hand, **lower-poly models** have fewer polygons, resulting in a simpler representation with less detail but being more computationally efficient to render.

Lower-poly models are commonly used in real-time applications, such as video games, virtual reality environments, and interactive 3D web applications, where performance and responsiveness are crucial.

### Point cloud

A "point cloud" is a **set of data points in 3D space**, typically representing the surface of an object or a scene. Each point in the point cloud represents a specific position in 3D space and may also include additional attributes, such as color or intensity. Point clouds can be obtained from various sources, including 3D scanners, Lidar (Light Detection and Ranging) systems, photogrammetry, and other 3D sensing technologies.

Unlike polygonal models, point clouds do not have defined surfaces or connectivity between points. They represent the shape and structure of objects by capturing a large number of individual points that **collectively** form a cloud-like representation.

Point clouds are used in applications such as 3D reconstruction, environmental modeling, autonomous vehicles, and virtual reality. They can be further processed to create 3D models, extract features, or analyze the geometry of objects in the captured scene.

In some cases, point clouds can be used as an **alternative** to lower-poly models in certain visualization scenarios. They offer a different approach to representing 3D data, particularly when dealing with large-scale environments or detailed real-world scenes. However, rendering and processing point clouds can be **computationally intensive**, so optimizations and simplifications are often applied to improve performance.

<br>
