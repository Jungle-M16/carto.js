var carto = require('../../../../src/api/v4');
var LeafletLayerGroup = require('../../../../src/api/v4/leaflet/layer-group');

describe('api/v4/client', function () {
  var client;

  beforeEach(function () {
    client = new carto.Client({
      apiKey: '84fdbd587e4a942510270a48e843b4c1baa11e18',
      serverUrl: 'https://{user}.carto.com:443',
      username: 'cartojs-test'
    });
  });

  describe('constructor', function () {
    it('should build a new client', function () {
      expect(client).toBeDefined();
      expect(client.getLayers()).toEqual([]);
    });
  });

  describe('.addLayer', function () {
    var source;
    var style;
    var layer;

    beforeEach(function () {
      source = new carto.source.Dataset('ne_10m_populated_places_simple', { id: 'a0' });
      style = new carto.style.CartoCSS('#layer {  marker-fill: red; }');
      layer = new carto.layer.Layer(source, style, {});
    });

    it('should add a new layer', function () {
      client.addLayer(layer);

      expect(client.getLayers()[0]).toEqual(layer);
    });

    it('should add a new layer triggering a reload cycle by default', function (done) {
      spyOn(client._engine, 'reload').and.callThrough();

      client.addLayer(layer).then(function () {
        expect(client._engine.reload).toHaveBeenCalled();
        expect(client._engine.reload.calls.count()).toEqual(1);
        done();
      });
    });

    it('should add a new layer without triggering a reload cycle when opts.reload is false', function (done) {
      spyOn(client._engine, 'reload').and.callThrough();

      client.addLayer(layer, { reload: false }).then(function () {
        expect(client._engine.reload).not.toHaveBeenCalled();
        done();
      });
    });

    it('should return a rejected promise when some error happened', function (done) {
      var errorMock = new Error('Error-Mock');
      spyOn(client._engine, 'reload').and.returnValue(Promise.reject(errorMock));

      client.addLayer(layer).catch(function (error) {
        expect(error).toEqual(errorMock);
        done();
      });
    });

    it('should return a significative error when layer parameter is not a valid layer', function () {
      expect(function () {
        client.addLayer([]);
      }).toThrowError('The given object is not a layer');
    });
  });

  describe('.addLayers', function () {
    it('should add a layers array', function () { });
    it('should add a layer array triggering ONE reload cycle by default', function () { });
    it('should add a layers array without triggering a reload cycle when opts.reload is false', function () { });
    it('should return a rejected promise when some error happened', function () { });
  });

  describe('.getLayers', function () {
    it('should return an empty array when there are no layers', function () {
      expect(client.getLayers()).toEqual([]);
    });
    it('should return the layers stored in the client', function (done) {
      var source = new carto.source.Dataset('ne_10m_populated_places_simple');
      var style = new carto.style.CartoCSS('#layer {  marker-fill: red; }');
      var layer = new carto.layer.Layer(source, style, {});
      client.addLayer(layer).then(function () {
        expect(client.getLayers()[0]).toEqual(layer);
        done();
      });
    });
  });

  describe('.removeLayer', function () {
    it('should throw a descriptive error when the parameter is invalid', function () {
      expect(function () {
        client.removeLayer({});
      }).toThrowError('The given object is not a layer');
    });

    it('¿should throw a descriptive error when layer is not in the client?', function () {
      pending('We should decide if this makes sense.');
      var source = new carto.source.Dataset('ne_10m_populated_places_simple');
      var style = new carto.style.CartoCSS('#layer {  marker-fill: red; }');
      var layer = new carto.layer.Layer(source, style, {});

      expect(function () {
        client.removeLayer(layer);
      }).toThrowError('The layer is not in the client');
    });

    it('should remove the layer when is in the client', function () {
      var source = new carto.source.Dataset('ne_10m_populated_places_simple');
      var style = new carto.style.CartoCSS('#layer {  marker-fill: red; }');
      var layer = new carto.layer.Layer(source, style, {});
      client.addLayer(layer);

      expect(client.getLayers().length).toEqual(1);
    });
  });

  describe('.getLeafletLayer', function () {
    var leafletLayer;

    beforeEach(function () {
      leafletLayer = client.getLeafletLayer();
    });

    it('should return an object', function () {
      expect(leafletLayer instanceof LeafletLayerGroup).toBe(true);
    });

    it('should return the same object', function () {
      expect(leafletLayer === client.getLeafletLayer()).toBe(true);
    });
  });
});