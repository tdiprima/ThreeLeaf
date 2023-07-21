//import L from 'leaflet';
import turf from './myTurf.js';
import './PaintPolygon.css';

"use strict";


const PaintPolygon = L.Control.extend({
  options: {
    position: 'topright',
    radius: 30,
    minRadius: 10,
    maxRadius: 50,
    layerOptions: {},
    drawOptions: {
      weight: 1
    },
    eraseOptions: {
      color: '#ff324a',
      weight: 1
    },
    menu: {
      drawErase: true,
      size: true,
      eraseAll: true
    },
  },

  _latlng: [0, 0],
  _metersPerPixel: {},

  onAdd: function (map) {
    console.log("%conAdd", "color: #ff00cc");
    this._map = map;
    this.setRadius(this.options.radius);

    if (this.options.menu === false) {
      return L.DomUtil.create('div');
    }

    this._container = L.DomUtil.create('div', 'leaflet-control-paintpolygon leaflet-bar leaflet-control');
    this._createMenu();

    return this._container;
  },

  onRemove: function () {
    console.log("%conRemove", "color: #ccff00");
    this._map.off('mousemove', this._onMouseMove, this);
  },

  setRadius: function (radius) {
    console.log("%csetRadius", "color: #ff00cc");
    if (radius !== undefined) {
      if (radius < this.options.minRadius) {
        this._radius = this.options.minRadius;
      } else if (radius > this.options.maxRadius) {
        this._radius = this.options.maxRadius;
      } else {
        this._radius = radius;
      }
    }
    if (this._circle) {
      this._circle.setRadius(this._radius);
    }
  },
  startDraw: function () {
    console.log("%cstartDraw", "color: orange");
    this.stop();
    this._action = 'draw';
    this._addMouseListener();
    this._circle = L.circleMarker(this._latlng, this.options.drawOptions).setRadius(this._radius).addTo(this._map);
  },
  startErase: function () {
    console.log("%cstartErase", "color: deeppink");
    this.stop();
    this._action = 'erase';
    this._addMouseListener();
    this._circle = L.circleMarker(this._latlng, this.options.eraseOptions).setRadius(this._radius).addTo(this._map);
  },
  stop: function () {
    console.log("%cstop", "color: deeppink");
    this._action = null;
    if (this._circle) {
      this._circle.remove();
    }
    this._removeMouseListener();
  },
  getLayer: function () {
    console.log("%cgetLayer", "color: cyan");
    return this._layer;
  },
  setData: function (data) {
    console.log("%csetData", "color: #ff00cc");
    this._data = data;
    if (this._layer !== undefined) {
      this._layer.remove();
    }
    this._layer = L.geoJSON(this._data, this.options.layerOptions).addTo(this._map);
  },
  getData: function () {
    console.log("%cgetData", "color: deeppink");
    return this._data;
  },
  eraseAll: function () {
    console.log("%ceraseAll", "color: lime");
    this.setData();
  },

/////////////////////////
// Menu creation and click callback
  _createMenu: function () {
    console.log("%c_createMenu", "color: orange");
    if (this.options.menu.drawErase !== false) {
      this._iconDraw = L.DomUtil.create('a', 'leaflet-control-paintpolygon-icon leaflet-control-paintpolygon-icon-brush', this._container);
      this._iconErase = L.DomUtil.create('a', 'leaflet-control-paintpolygon-icon leaflet-control-paintpolygon-icon-eraser', this._container);
      L.DomEvent.on(this._iconDraw, 'click mousedown', this._clickDraw, this);
      L.DomEvent.on(this._iconErase, 'click mousedown', this._clickErase, this);
    }

    if (this.options.menu.size !== false) {
      this._iconSize = L.DomUtil.create('a', 'leaflet-control-paintpolygon-icon leaflet-control-paintpolygon-icon-size', this._container);

      this._menu = L.DomUtil.create('div', 'leaflet-bar leaflet-control-paintpolygon-menu', this._container);
      L.DomEvent.disableClickPropagation(this._menu);

      var menuContent = L.DomUtil.create('div', 'leaflet-control-paintpolygon-menu-content', this._menu);
      var cursor = L.DomUtil.create('input', '', menuContent);
      cursor.type = "range";
      cursor.value = this._radius;
      cursor.min = this.options.minRadius;
      cursor.max = this.options.maxRadius;

      L.DomEvent.on(cursor, 'input change', this._cursorMove, this);
      L.DomEvent.on(this._iconSize, 'click mousedown', this._clickSize, this);
    }

    if (this.options.menu.eraseAll !== false) {
      this._iconEraseAll = L.DomUtil.create('a', 'leaflet-control-paintpolygon-icon leaflet-control-paintpolygon-icon-trash', this._container);
      L.DomEvent.on(this._iconEraseAll, 'click mousedown', this._clickEraseAll, this);
    }
  },

  _clickDraw: function (evt) {
    console.log("%c_clickDraw", "color: orange");
    if (evt.type == 'mousedown') {
      L.DomEvent.stop(evt);
      return;
    }
    this._resetMenu();
    if (this._action == 'draw') {
      this.stop();
    } else {
      this.startDraw();
      this._activeIconStyle(this._iconDraw);
    }
  },
  _clickErase: function (evt) {
    console.log("%c_clickErase", "color: #ff00cc");
    if (evt.type == 'mousedown') {
      L.DomEvent.stop(evt);
      return;
    }
    this._resetMenu();
    if (this._action == 'erase') {
      this.stop();
    } else {
      this.startErase();
      this._activeIconStyle(this._iconErase);
    }
  },
  _clickSize: function (evt) {
    console.log("%c_clickSize", "color: orange");
    if (evt.type == 'mousedown') {
      L.DomEvent.stop(evt);
      return;
    }
    if (L.DomUtil.hasClass(this._menu, 'leaflet-control-paintpolygon-menu-open')) {
      this._closeMenu();
    } else {
      this._openMenu();
    }
  },
  _clickEraseAll: function (evt) {
    console.log("%c_clickEraseAll", "color: lime");
    this.eraseAll();
  },
  _resetMenu: function () {
    console.log("%c_resetMenu", "color: cyan");
    L.DomUtil.removeClass(this._iconDraw, "leaflet-control-paintpolygon-icon-active");
    L.DomUtil.removeClass(this._iconErase, "leaflet-control-paintpolygon-icon-active");
  },
  _activeIconStyle: function (icon) {
    console.log("%c_activeIconStyle", "color: cyan");
    L.DomUtil.addClass(icon, "leaflet-control-paintpolygon-icon-active");
  },
  _openMenu: function () {
    console.log("%c_openMenu", "color: lime");
    L.DomUtil.addClass(this._menu, "leaflet-control-paintpolygon-menu-open");
  },
  _closeMenu: function () {
    console.log("%c_closeMenu", "color: lime");
    L.DomUtil.removeClass(this._menu, "leaflet-control-paintpolygon-menu-open");
  },
  _cursorMove: function (evt) {
    console.log("%c_cursorMove", "color: #ff00cc");
    this.setRadius(evt.target.valueAsNumber);
  },
/////////////////


////////////////
// Map events
  _addMouseListener: function () {
    console.log("%c_addMouseListener", "color: cyan");
    this._map.on('mousemove', this._onMouseMove, this);
    this._map.on('mousedown', this._onMouseDown, this);
    this._map.on('mouseup', this._onMouseUp, this);
  },
  _removeMouseListener: function () {
    console.log("%c_removeMouseListener", "color: #ccff00");
    this._map.off('mousemove', this._onMouseMove, this);
    this._map.off('mousedown', this._onMouseDown, this);
    this._map.off('mouseup', this._onMouseUp, this);
  },
  _onMouseDown: function (evt) {
    console.log("%c_onMouseDown", "color: cyan");
    this._map.dragging.disable();
    this._mousedown = true;
    this._onMouseMove(evt);
  },
  _onMouseUp: function (evt) {
    console.log("%c_onMouseUp", "color: #ccff00");
    this._map.dragging.enable();
    this._mousedown = false;
  },
  _onMouseMove: function (evt) {
    // console.log("%c_onMouseMove", "color: cyan");
    this._setLatLng(evt.latlng);
    if (this._mousedown === true) {
      this._stackEvt(evt.latlng, this._map.getZoom(), this._radius, this._action);
    }
  },
////////////////

  _setLatLng: function (latlng) {
    // console.log("%c_setLatLng", "color: lime");
    if (latlng !== undefined) {
      this._latlng = latlng;
    }
    if (this._circle) {
      this._circle.setLatLng(this._latlng);
    }
  },

  _latLngAsGeoJSON: function (latlng) {
    console.log("%c_latLngAsGeoJSON", "color: #ccff00");
    return {
      type: "Point",
      coordinates: [
        latlng.lng,
        latlng.lat
      ]
    };
  },

  _getCircleAsPolygon: function (latlng, zoom, radius) {
    console.log("%c_getCircleAsPolygon", "color: #ccff00");
    var lat = latlng.lat;

    if (this._metersPerPixel[zoom] === undefined) {
      this._metersPerPixel[zoom] = 40075016.686 * Math.abs(Math.cos(lat * Math.PI / 180)) / Math.pow(2, zoom + 8);
    }
    return turf.circle(this._latLngAsGeoJSON(latlng), this._metersPerPixel[zoom] * radius / 1000, {
//steps: 128
    });
  },

  _draw: function (latlng, zoom, radius) {
    console.log("%c_draw", "color: #ff00cc");
    if (this._data === undefined || this._data === null) {
      this.setData(this._getCircleAsPolygon(latlng, zoom, radius));
    } else {
      let fc = {
        type: "FeatureCollection",
        features: [this._data, this._getCircleAsPolygon(latlng, zoom, radius)]
      };
      this.setData(turf.union(fc));
    }
  },
  _erase: function (latlng, zoom, radius) {
    console.log("%c_erase", "color: #ff00cc");
    if (this._data === undefined || this._data === null) {
      return;
    } else {
      this.setData(turf.difference(this._data, this._getCircleAsPolygon(latlng, zoom, radius)));
    }
  },

  _stackEvt: function (latlng, zoom, radius, action) {
    console.log("%c_stackEvt", "color: #ff00cc");
    if (this._stack === undefined) {
      this._stack = new Array();
    }

    this._stack.push({latlng: latlng, zoom: zoom, radius: radius, action: action});
    this._processStack();
  },

  _processStack: function () {
    console.log("%c_processStack", "color: cyan");
    if (this._processingStack === true || this._stack.length == 0) {
      return;
    }
    this._processingStack = true;

    var evt = this._stack.shift();
    if (evt.action == "draw") {
      this._draw(evt.latlng, evt.zoom, evt.radius);
    } else if (evt.action == "erase") {
      this._erase(evt.latlng, evt.zoom, evt.radius);
    }

    this._processingStack = false;
    this._processStack();
  }

});


L.Control.PaintPolygon = PaintPolygon;
L.control.paintPolygon = options => new L.Control.PaintPolygon(options);


export default PaintPolygon;
