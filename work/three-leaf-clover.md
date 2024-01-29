## Leaflet + three.js

<span style="color:blue;font-size:larger;">Can you show me how to combine three.js with leaflet.js?</span>

Combining Three.js with Leaflet.js can create a powerful tool for 3D mapping applications. Here's a basic guide on how to integrate these two libraries:

### Step 1: Setting Up Your Project
First, ensure you have both Leaflet.js and Three.js included in your project. You can either download these libraries and include them in your project or use a CDN. 

Include the following in your HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Three.js and Leaflet.js Integration</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://threejs.org/build/three.js"></script>
</head>
<body>
    <div id="map" style="width: 100%; height: 600px;"></div>
    <script src="your_script.js"></script>
</body>
</html>
```

### Step 2: Initialize Leaflet Map
In your JavaScript file (e.g., `your_script.js`), start by initializing a Leaflet map:

```javascript
var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);
```

### Step 3: Integrating Three.js
Now, integrate Three.js within the Leaflet map:

1. **Create a Three.js Scene**: Set up a basic Three.js scene with a camera and a renderer.

```javascript
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

2. **Sync Three.js with Leaflet**: You need to synchronize the Three.js scene with the Leaflet map. This involves updating the Three.js camera and renderer whenever the map moves.

```javascript
map.on('move', updateThreeScene);
map.on('resize', updateThreeScene);

function updateThreeScene() {
    // Code to update Three.js scene based on Leaflet map's current view
}
```

3. **Add Objects to Three.js Scene**: Add any Three.js objects to the scene as you normally would. You need to convert Leaflet's latitude and longitude to Three.js x, y, z coordinates.

```javascript
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

4. **Animate the Scene**: Create an animation loop to render the scene.

```javascript
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
```

### Step 4: Coordinate Conversion
The challenging part is converting Leaflet's geographic coordinates to the Three.js 3D space. You need to write a function that translates latitude and longitude into x, y, z coordinates that Three.js can use.

### Step 5: Handling Events
Handle user interactions and events, such as mouse movements, clicks, or zoom changes, to create a dynamic and responsive 3D map experience.

### Additional Notes
- **Performance Considerations**: 3D rendering can be resource-intensive. Optimize your application for better performance.
- **Advanced Features**: You can add more advanced features like 3D terrain, custom shaders, or interactive 3D objects based on map data.

Remember, this is a high-level overview. You will need to adjust the code to fit the specific requirements of your application, and dealing with 3D coordinate conversion can be complex. Experimenting and adapting the code to suit your needs is key.

## Give me the function

<span style="color:blue;font-size:larger;">All it did was make the cube tiny.</span>

Certainly! The `updateThreeScene` function is crucial for ensuring that the Three.js scene is updated in response to Leaflet map movements. This function will synchronize the camera and scene in Three.js with the current view of the Leaflet map. Here's an example of how this function can be implemented:

### `updateThreeScene` Function

```javascript
function updateThreeScene() {
    // Calculate the size of the map view in pixels
    var mapSize = map.getSize();
    renderer.setSize(mapSize.x, mapSize.y);

    // Get map bounds and calculate the scale factor and offset
    var bounds = map.getBounds();
    var mapWidth = bounds.getEast() - bounds.getWest();
    var mapHeight = bounds.getNorth() - bounds.getSouth();

    // Set the camera aspect to match the map's aspect ratio
    camera.aspect = mapSize.x / mapSize.y;
    camera.updateProjectionMatrix();

    // Calculate the Three.js camera position based on the map center
    var center = map.getCenter();
    var scale = calculateScale(map.getZoom());

    // Position the Three.js camera (you may need to adjust these values)
    camera.position.x = (center.lng - bounds.getWest()) / mapWidth - 0.5;
    camera.position.y = -((center.lat - bounds.getSouth()) / mapHeight - 0.5);
    camera.position.z = scale; // The Z position controls the zoom in Three.js

    // Set the camera to look at the center of the scene
    camera.lookAt(scene.position);

    // Render the scene
    renderer.render(scene, camera);
}

function calculateScale(zoom) {
    // This function calculates a scale factor based on the Leaflet map's zoom level
    // You might need to adjust the scale calculation to suit your specific use case
    return 100 / Math.pow(2, zoom - 13);
}
```

### Explanation

- **Updating Renderer Size**: The renderer size is updated to match the current size of the Leaflet map view.
- **Map Bounds and Scale**: The bounds of the map are used to calculate the width and height of the current view, which is important for positioning objects in the Three.js scene.
- **Camera Aspect Ratio**: The camera's aspect ratio is updated to match that of the map view to ensure correct perspective.
- **Camera Position**: The camera's position is set based on the current center of the Leaflet map. The `calculateScale` function, which needs to be tailored to your specific use case, determines the zoom level in the Three.js scene.
- **Look At Center**: The camera is set to look at the center of the scene.
- **Render**: The scene is rendered with the updated camera settings.

### Customization
This code is a starting point and may need adjustments based on your specific use case, especially in how you map Leaflet's 2D coordinates to Three.js's 3D space and handle the camera's zoom level. The key is to ensure that the Three.js camera correctly corresponds to the Leaflet map's view and zoom level.

## The cube is underneath the map

<span style="color:blue;font-size:larger;">You have to scroll down to see it.</span>

Some things you can try:

```js
var geometry = new THREE.BoxGeometry(1, 1, 1); // Increase these values if needed

camera.position.z = 5; // Increase if necessary to 'move the camera back'

renderer.setClearColor(0x000000, 0); // You can adjust the alpha for transparency

camera.lookAt(scene.position); // Adjust as necessary

// Debugging (to better understand the positioning of objects)
var axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
```

Normally, you shouldn't need to adjust the render order for a basic setup. However, if you have multiple objects and some are not appearing, you might need to look into render order or object transparency settings.

## Fix my CSS

<span style="color:blue;font-size:larger;">I got this to work by adding css and attaching the renderer to a div with id `webgl-container`.  The problem is, I can no longer move the map.</span>

The issue you're facing with the map not being movable is likely due to the `#webgl-container` overlapping the Leaflet map and capturing all the mouse events. Since `#webgl-container` has a higher `z-index`, it's essentially sitting on top of your map, preventing any interaction with the map underneath.

To fix this, you can make the `#webgl-container` div ignore pointer events, allowing the events to pass through to the map layer below. You can achieve this by adding `pointer-events: none;` to the CSS of `#webgl-container`. This way, it will render the Three.js scene but won't interfere with the interaction on the Leaflet map.

<span style="color:blue;font-size:larger;">All he did was add pointer-events:none to webgl-container.</span>

Update your CSS as follows:

```css
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
    pointer-events: none; /* Add this line */
}
```

By setting `pointer-events: none`, you're allowing pointer events like clicking, dragging, etc., to "pass through" the `#webgl-container` and interact with elements behind it, which in this case is your Leaflet map.

After making this change, you should be able to interact with the Leaflet map as usual, while still displaying the Three.js content in the `#webgl-container` div.

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

## What is better than three JS?

WebGL, BabylonJS, Unity, D3. js, and PlayCanvas are the most popular alternatives and competitors to three.

<br>

<span style="color:#0000dd;font-weight:bold;font-size:larger;">What is a "lower-poly model"?  What is a "point cloud"?</span>

A "lower-poly model" and a "point cloud" are both **representations of 3D data** used in computer graphics and visualization.

## Lower-poly model

A "lower-poly model" refers to a 3D model that is constructed using a relatively small number of polygons (also known as faces or triangles) compared to a high-poly model. **Polygons are the building blocks** of 3D models and are used to represent the surfaces of objects in computer graphics. Each polygon is defined by its vertices (corner points) and can represent a flat or curved surface.

The level of detail in a 3D model is determined by the number of polygons it contains. **High-poly models** have a large number of polygons, providing a more detailed and smooth appearance but requiring greater computational resources to render. On the other hand, **lower-poly models** have fewer polygons, resulting in a simpler representation with less detail but being more computationally efficient to render.

Lower-poly models are commonly used in real-time applications, such as video games, virtual reality environments, and interactive 3D web applications, where performance and responsiveness are crucial.

## Point cloud

A "point cloud" is a **set of data points in 3D space**, typically representing the surface of an object or a scene. Each point in the point cloud represents a specific position in 3D space and may also include additional attributes, such as color or intensity. Point clouds can be obtained from various sources, including 3D scanners, Lidar (Light Detection and Ranging) systems, photogrammetry, and other 3D sensing technologies.

Unlike polygonal models, point clouds do not have defined surfaces or connectivity between points. They represent the shape and structure of objects by capturing a large number of individual points that **collectively** form a cloud-like representation.

Point clouds are used in applications such as 3D reconstruction, environmental modeling, autonomous vehicles, and virtual reality. They can be further processed to create 3D models, extract features, or analyze the geometry of objects in the captured scene.

In some cases, point clouds can be used as an **alternative** to lower-poly models in certain visualization scenarios. They offer a different approach to representing 3D data, particularly when dealing with large-scale environments or detailed real-world scenes. However, rendering and processing point clouds can be **computationally intensive**, so optimizations and simplifications are often applied to improve performance.

<br>
