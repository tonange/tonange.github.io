/**
 * 정밀지도
 * 
 * @type {Object}
 */
maple.menu.hd = {
        
  layer: null,

  init: function() {
    var that = this;
    var sourceOptions = {
      url: 'https://mlp.hyundai-mnsoft.com:8244/webgis/geoserver/gwc/rest/wmts/MNSOFT:HDTM/HIDPI:900913/EPSG:900913:{z}/{y}/{x}?format=image/png',
      //attributions: '© HYUNDAI MnSOFT',
      crossOrigin: 'anonymous',
      transition: 0,
      tileGrid: ol.tilegrid.createXYZ({
        minZoom: 15,
        maxZoom: 19,
        tileSize: [512, 512]
      })
    };
    that.layer = new ol.layer.Tile({
      useInterimTilesOnError: false,
      extent: [14141761.73, 4503658.21, 14142270.72, 4504181.21],
      source: new ol.source.XYZ(sourceOptions),
      maxResolution: 8
    });
    maple.map.getMap().addLayer(that.layer);
  },

  show: function() {
    var that = this;
    that.layer.setVisible(true);
    maple.map.getMap().getView().fit(that.layer.getExtent());
  },

  hide: function() {
    var that = this;
    that.layer.setVisible(false);
  }

}