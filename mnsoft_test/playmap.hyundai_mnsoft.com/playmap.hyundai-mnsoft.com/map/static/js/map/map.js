/**
 * 지도
 * 
 * @type {Object}
 */
maple.map = {

  /**
   * 클래스명
   */
  CLASS_NAME: "map",

  /**
   * HMNS 지도
   * 
   * @type {hmns.maps.Map}
   */
  map: null,

  /**
   * 모듈 목록
   * 
   * @type {Object}
   */
  modules: {},

  /**
   * 기능 목록
   * 
   * @type {Object.<string, hmns.control.Control>}
   */
  controls: {},

  /**
   * 초기화
   */
  init: function() {
    var that = this;
    that.bindEvents();

    that.createMap();
    that.addControls();
    that.addInteractions();

    // 모듈 초기화 (select, highlight)
    for ( var moduleName in that.modules) {
      if (that.modules[moduleName].init) {
        that.modules[moduleName].init(that.map);
      }
    }

  },

  /**
   * 이벤트 연결
   */
  bindEvents: function() {
    var that = this;

    // 지도 툴 열기/닫기
    $("#map_control").on("mouseover", ".item_control", function() {
      var node = $(this);
      node.addClass('active');
    });
    $("#map_control").on("mouseout", ".item_control", function() {
      var node = $(this);
      node.removeClass('active');
    });

    // 확대
    $(".hmn_widget .btn_zoom_in").click(function() {
      that.map.getView().animate({
        zoom: that.map.getView().getZoom() + 1,
        duration: 250
      });
    });

    // 축소
    $(".hmn_widget .btn_zoom_out").click(function() {
      that.map.getView().animate({
        zoom: that.map.getView().getZoom() - 1,
        duration: 250
      })
    });

    // 측정
    var measureMouseOut = function() {
      return false;
    };
    $(".hmn_widget .li_measure .btn_measure").click(function(evt, isDrawEnd) {
      var node = $(this);
      if (node.is('.active')) {
        if (!isDrawEnd) {
          $(".hmn_widget .li_measure .btn_clear").trigger("click");
        } else {
          that.clearInteractions();
        }
      } else {
        $(".hmn_widget .li_measure .btn_clear").addClass("active");
        $(".hmn_widget .li_measure").on("mouseout", measureMouseOut);
        $(".hmn_widget .li_measure").trigger("mouseover");

        var interaction = node.attr("data-interaction");
        that.clearInteractions();
        that.controls.measure.setInteraction(interaction);
        node.addClass('active');
      }
    });
    // 측정 지우기
    $(".hmn_widget .li_measure .btn_clear").click(function() {
      $(".hmn_widget .li_measure .rbtn_item").removeClass("active");
      $("#map_control .li_measure").off("mouseout", measureMouseOut);
      $("#map_control .li_measure").trigger("mouseout");
      that.clearInteractions();
      that.controls.measure.clear();
    });

    // 초기화
    $(".li_reset .btn_reset").click(function() {
      maple.clear();
    });

    // hd 범례
    $(".li_hd .btn_hd").click(function() {
      if(maple.isMobile){
        
        var panel = $("#div_hd");
        panel.siblings().removeClass("active");
        panel.addClass("active");
        
        $("#search_panel").addClass("panel");
        maple.menu.searchWrapResize();
      }
      
    });
  },

  /**
   * HMNS 지도 생성
   */
  createMap: function() {
    var that = this;
    that.map = new hmns.maps.Map('map', {
      center: [126.951886, 37.532283],
      zoom: 18,
      maxZoom: 19,
      minZoom: 7,
      blockRotation: false,
      keyboardEventTarget: document,
      markerZIndex: 504,
      constrainResolution: true,      
      restrictExtent: [124.60, 33.114, 131.875, 38.59]
    });
       
    that.map.marker.set("onSelect", function(feature) {
      maple.menu.search.poi.window.detail.open(feature);
    });

  },

  /**
   * 기능 목록 추가
   */
  addControls: function() {
    var that = this;

    // 측정
    that.controls.measure = new hmns.maps.MeasureControl(
            {
              onDrawend: function() {
                $(".hmn_widget .li_measure .btn_measure.active").trigger(
                        "click", true);
              }
            });
    that.map.addControl(that.controls.measure);

    // 축척
    that.controls.scaleLineControl = new hmns.maps.ScaleLineControl( {
      className: "ccs-scale-line"
    });
    that.map.addControl(that.controls.scaleLineControl);

  },

  /**
   * 상호 기능 목록 추가
   */
  addInteractions: function() {
    var that = this;
    that.interactions = {};

    that.interactions.select = new ol.interaction.Select({
      layers: function(layer) {
        var layers = that.interactions.select.get("layers");
        return layers.includes(layer);
      }
    });
    that.interactions.select.set("layers", [that.map.marker]);
    that.interactions.select.set("always", true);
    that.map.addInteraction(that.interactions.select);

    that.interactions.select.on("select", function(event) {
      var selected = event.selected;
      if (selected && selected.length > 0) {
        var feature = selected[0];
        var layer = that.interactions.select.getLayer(feature);
        var onSelect = layer.get("onSelect");
        if (onSelect) {
          onSelect(feature);

          var features = that.interactions.select.getFeatures();
          for (var i = features.getLength() - 1; i >= 0; i--) {
            if (features.item(i) === feature) {
              features.removeAt(i);
            }
          }
        }
      }
    });

  },

  /**
   * HMNS 지도 반환
   * 
   * @returns {hmns.maps.Map} HMNS 지도
   */
  getMap: function() {
    var that = this;
    return that.map;
  },

  /**
   * 인터렉션 초기화
   */
  clearInteractions: function() {
    var that = this;
    $(".btn_interaction").removeClass("active");

    that.controls.measure.setInteraction();

    for ( var interactionName in that.interactions) {
      var interaction = that.interactions[interactionName];
      if (interaction.getActive() && !interaction.get("always")) {
        interaction.setActive(false);
      }
    }

    for ( var moduleName in that.modules) {
      var module = that.modules[moduleName];
      if (module.interactions) {
        for ( var interactionName in module.interactions) {
          var interaction = module.interactions[interactionName];
          if (interaction.getActive()) {
            interaction.setActive(false);
          }
        }
      }
    }

  },

  /**
   * 인터렉션 활성화
   * 
   * @param {Array.<ol.Interaction>} 인터렉션 목록
   */
  activeInteractions: function(interactions) {
    var that = this;
    that.clearInteractions();

    $(interactions).each(function(index, interaction) {
      interaction.setActive(true);
    });

  }

};

/**
 * 선택 모듈
 */
maple.map.modules.select = {

  /**
   * 지도 객체
   */
  map: null,

  /**
   * 벡터 소스
   * 
   * @type {ol.source.Vector}
   */
  source: null,

  /**
   * 이 기능을 호출한 클래스 명
   * 
   * @type {string}
   */
  className: null,

  /**
   * 인터렉션 목록
   * 
   * @type {Object}
   */
  interactions: {
    /**
     * 점 그리기 인터렉션
     * 
     * @type {ol.interaction.Draw}
     */
    point: null,

    /**
     * 선 그리기 인터렉션
     * 
     * @type {ol.interaction.Draw}
     */
    lineString: null,

    /**
     * 사각형 그리기 인터렉션
     * 
     * @type {ol.interaction.Draw}
     */
    rect: null,

    /**
     * 다각형 그리기 인터렉션
     * 
     * @type {ol.interaction.Draw}
     */
    polygon: null,

    /**
     * 원 그리기 인터렉션
     * 
     * @type {ol.interaction.Draw}
     */
    circle: null
  },

  onceKey: null,

  /**
   * 소스 핸들러
   */
  sourceHandler: null,

  /**
   * 등록 핸들러 목록
   * 
   * @type {Array.<Object>}
   */
  handlers: [],

  /**
   * 초기화
   */
  init: function(map) {
    var that = this;
    that.map = map;
    that.initGis();
  },

  /**
   * GIS 초기화
   */
  initGis: function() {
    var that = this;
    that.source = new ol.source.Vector();
    var layer = new ol.layer.Vector({
      source: that.source,
      zIndex: 500
    });
    that.map.addLayer(layer);
    that.source.on("addfeature", function(evt) {
      that.sourceHandler(evt);
    });

    for ( var type in that.interactions) {
      var options = {};
      if (type == "rect") {
        options.type = "Circle";
        options.geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
      } else {
        options.type = maple.utils.string.capitalizeFirstLetter(type);
      }
      options.source = that.source;

      that.interactions[type] = new ol.interaction.Draw(options);
      that.map.addInteraction(that.interactions[type]);
      that.interactions[type].setActive(false);
    }
  },

  /**
   * 벡터 소스 반환
   * 
   * @returns {ol.source.Vector} 벡터 소스
   */
  getSource: function() {
    var that = this;
    return that.source;
  },

  /**
   * 한번 실행
   * 
   * @param {string} className 클래스명
   * @param {string} type 기능 타입 (point, lineString, rect, polygon, circle)
   * @param {string} eventType 이벤트 타입 (drawstart, drawadd, drawend)
   * @param {Function} handler 콜백 함수
   * @param {Boolean} isVisible 그린 도형 표시 여부
   */
  once: function(className, type, eventType, handler, isVisible) {
    var that = this;
    that.className = className;
    that.clear();
    if (that.onceKey) {
      ol.Observable.unByKey(that.onceKey);
      that.onceKey = null;
    }
    maple.map.activeInteractions(that.interactions[type]);

    if (eventType && handler) {
      that.onceKey = that.interactions[type].once(eventType, function(evt) {
        handler(evt);
        maple.map.clearInteractions();
        that.clear();
      });
    }
    if (isVisible) {
      that.sourceHandler = function(evt) {
        that.visibleSingle(evt);
      };
    } else {
      that.sourceHandler = function(evt) {
        that.visibleNone(evt);
      };
    }
  },

  /**
   * 기능 활성
   * 
   * @param {string} className 클래스 명
   * @param {string} type 기능 타입 (Point, LineString, Rect, Polygon, Circle)
   * @param {string} eventType 이벤트 타입 (drawstart, drawadd, drawend)
   * @param {Function} handler 이벤트 발생 시 실행될 함수
   * @param {Boolean} isVisible 그린 도형 표시 여부
   */
  active: function(className, type, eventType, handler, isVisible) {
    var that = this;
    that.className = className;
    that.clear();

    if (eventType && handler) {
      that.handlers.push({
        type: type,
        eventType: eventType,
        handler: handler
      });
      that.interactions[type].on(eventType, handler);
    }
    if (isVisible) {
      that.sourceHandler = function(evt) {
        that.visibleSingle(evt);
      };
    } else {
      that.sourceHandler = function(evt) {
        that.visibleNone(evt);
      };
    }
    maple.map.activeInteractions(that.interactions[type]);
  },

  /**
   * 화면에 표시 안함
   * 
   * @params {Object} evt 이벤트 객체
   */
  visibleNone: function(evt) {
    var that = this;
    var feature = evt.feature;
    feature.type = that.className;
    that.clearFeatures();
  },

  /**
   * 한 개만 표시
   * 
   * @param {Object} evt 이벤트 객체
   */
  visibleSingle: function(evt) {
    var that = this;
    var feature = evt.feature;
    that.clearFeatures();
    feature.type = that.className;
  },

  /**
   * 정리
   * 
   * @param {string} className 클래스명
   */
  clear: function(className) {
    var that = this;
    that.clearFeatures(className);
    for ( var i in that.handlers) {
      that.interactions[that.handlers[i].type].un(that.handlers[i].eventType,
              that.handlers[i].handler);
    }
    that.handlers = [];

    maple.map.clearInteractions();
  },

  /**
   * 도형 목록 반환
   * 
   * @type {string} className 클래스명
   * @return {Array.<ol.Featuer>} 도형 목록
   */
  getFeatures: function(className) {
    var that = this;
    var result = [];
    var features = that.source.getFeatures();
    for (var i = features.length - 1; i >= 0; i--) {
      if (features[i].type == that.className) {
        result.push(features[i]);
      }
    }
    return result;
  },

  /**
   * 도형 목록 지우기
   * 
   * @param {string} className 클래스명
   */
  clearFeatures: function(className) {
    var that = this;
    if (!className) className = that.className;

    var features = that.source.getFeatures();
    for (var i = features.length - 1; i >= 0; i--) {
      if (features[i].type == className) {
        that.source.removeFeature(features[i]);
      }
    }
  }

};

/**
 * highlight
 * 
 * @type {Object}
 */
maple.map.modules.highlight = {

  /**
   * 소스 목록
   * 
   * @type {Object}
   */
  sources: {

    /**
     * 하늘색 소스
     * 
     * @type {ol.source.Vector}
     */
    sky: null,

    /**
     * 주황색 소스
     * 
     * @type {ol.source.Vector}
     */
    orange: null,

    /**
     * 빨간색 소스
     * 
     * @type {ol.source.Vector}
     */
    red: null

  },

  /**
   * 초기화
   * 
   * @param {hmns.maps.map} map 지도
   */
  init: function(map) {
    var that = this;
    that.map = map;

    // 벡터 소스 (노란색)
    that.sources.yellow = new ol.source.Vector();
    var yellowLayer = new ol.layer.Vector({
      id: "yellowLayer",
      source: that.sources.yellow,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 0, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 255, 0, 0.6)',
          width: 4
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 0, 1)'
          })
        })
      }),
      zIndex: 501
    });
    that.map.addLayer(yellowLayer);

    // 벡터 소스 (하늘색)
    that.sources.sky = new ol.source.Vector();
    var skyLayer = new ol.layer.Vector({
      id: "skyLayer",
      source: that.sources.sky,
      zIndex: 502
    });
    that.map.addLayer(skyLayer);

    // 벡터 소스 (주황색)
    that.sources.orange = new ol.source.Vector();
    var orangeLayer = new ol.layer.Vector({
      id: "orangeLayer",
      updateWhileAnimating: true,
      source: that.sources.orange,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 94, 0, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 94, 0, 0.6)',
          width: 4
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: 'rgba(255, 94, 0, 1)'
          })
        })
      }),
      zIndex: 503
    });
    that.map.addLayer(orangeLayer);

    // 벡터 소스 (빨간색)
    that.sources.red = new ol.source.Vector();
    var redLayer = new ol.layer.Vector({
      id: "redLayer",
      updateWhileAnimating: true,
      source: that.sources.red,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 0, 0, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 0, 0, 0.6)',
          width: 5
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 1)'
          })
        })
      }),
      zIndex: 504
    });
    that.map.addLayer(redLayer);
  },

  /**
   * 도형 표시
   * 
   * @param {string} className 실행한 클래스 명
   * @param {string} sourceName 소스명
   * @param {Array.<ol.Feature>} features 도형 목록
   * @param {Boolean} isMove 이동 여부
   */
  showFeatures: function(className, sourceName, features, isMove) {
    var that = this;

    var source = that.sources[sourceName];
    that.clear(className, sourceName);

    for (var i = 0, len = features.length; i < len; i++) {
      var feature = features[i];
      feature.type = className;
    }

    source.addFeatures(features);
    if (isMove) {
      maple.utils.map.moveFeatures(features);
    }
  },

  /**
   * 도형 목록 반환
   * 
   * @param {string} className 클래스명
   * @param {string} sourceId 소스 아이디
   */
  getFeaturesBySourceId: function(className, sourceId) {
    var that = this;
    var source = that.sources[sourceId];
    var features = $(source.getFeatures()).each(function(index, feature) {
      if (className) {
        if (feature.type == className) { return feature; }
      }
    });
    return features;
  },

  /**
   * 도형 삭제
   * 
   * @param {string} className 클래스명
   */
  clear: function(className, sourceName) {
    var that = this;
    for ( var id in that.sources) {
      if (sourceName && id != sourceName) {
        continue;
      }
      var source = that.sources[id];
      var features = source.getFeatures();
      for (var i = features.length - 1; i >= 0; i--) {
        var feature = features[i];
        if (className) {
          if (feature.type == className) {
            source.removeFeature(feature);
          }
        } else {
          source.removeFeature(feature);
        }

      }
    }
  }

};

/**
 * 클립보드 모듈
 * 
 * @type {Object}
 */
maple.map.modules.clipboard = {

  /**
   * Ctrl 여부
   */
  isCtrl: false,

  /**
   * HMNS 지도
   * 
   * @type {hmns.maps.Map}
   */
  map: null,

  /**
   * 마우스 위치 컨트롤
   */
  mousePositionControl: null,

  /**
   * 초기화
   */
  init: function() {
    var that = this;

    that.map = maple.map.getMap();
    that.mousePositionControl = maple.map.controls.mousePositionControl;
    that.bindEvents();
  },

  /**
   * 이벤트 연결
   */
  bindEvents: function() {
    var that = this;

    // IE 의 경우 cut, copy, paste 이벤트가 제대로 동작하지 않아 keydown, keyup 이벤트 사용
    if (window.clipboardData) {
      $(document).bind('keydown', function(e) {
        if (e.keyCode === 17) {
          that.isCtrl = true;
        } else if (that.isCtrl) {
          if (e.keyCode === 86) {
            that.paste(window.clipboardData);
          } else if (e.keyCode === 67 || e.keyCode === 88) {
            that.copy(window.clipboardData);
          }
        }
      });
      $(document).bind('keyup', function(e) {
        if (e.keyCode === 17) {
          that.isCtrl = true;
        }
      });
    } else {
      $(document).bind('cut', function(e) {
        that.copy(e.originalEvent.clipboardData);
      });
      $(document).bind('copy', function(e) {
        that.copy(e.originalEvent.clipboardData);
      });
      $(document).bind('paste', function(e) {
        that.paste(e.originalEvent.clipboardData);
      });
    }
  },

  /**
   * 좌표 복사
   */
  copy: function() {
    var that = this;
    var focus = $(":focus");
    if (focus.length === 0 || $("#map").find(focus).length > 0) {
      var pixel = that.mousePositionControl.lastMouseMovePixel_;
      if (pixel) {
        var coordinate = ol.proj.toLonLat(that.map
                .getCoordinateFromPixel(pixel));
        var text = "(" + parseInt(coordinate[0] * 360000) + ","
                + parseInt(coordinate[1] * 360000) + ")";

        var node = $("<input type='text' />");
        node.val(text);
        $("body").append(node);
        node.select();

        document.execCommand('copy');
        node.remove();

        alert("좌표가 복사되었습니다. " + text);
      }
    }
  },

  /**
   * 좌표 붙여넣기
   * 
   * @type {String} clipboardData 클립보드 데이터
   */
  paste: function(clipboardData) {
    var that = this;

    var focus = $(":focus");
    if (focus.length === 0 || $("#map").find(focus).length > 0) {
      var data = clipboardData.getData('Text');
      data = data.trim();

      var index = data.indexOf("(");
      if (index === -1) {
        var split = data.split(",");
        if (split.length === 2) {
          var lat = parseFloat(split[0]);
          var lon = parseFloat(split[1]);
          that.map.setCenter([lon, lat]);
        }
      } else if (index === 0) {
        data = data.replace("(", "").replace(")", "");
        var split = data.split(",");
        if (split.length === 2) {
          var lon = parseFloat(split[0]) / 360000;
          var lat = parseFloat(split[1]) / 360000;
          that.map.setCenter([lon, lat]);
        }
      } else {
        var match = data.match(/\([^(]*\/.*\)/);
        if (match.length == 1) {
          data = match[0];
          data = data.replace("(", "").replace(")", "");
          var split = data.split("/");
          if (split.length === 2) {
            var lon = that.parseCoconut(split[0]);
            var lat = that.parseCoconut(split[1]);
            that.map.setCenter([lon, lat]);
          }
        }
      }
    }
  },

  /**
   * 코코넛 좌표 해석
   * 
   * @type {string} str 문자열
   */
  parseCoconut: function(str) {
    var data = null;
    var split = str.split(".");
    if (split.length > 0) {
      data = split[0] + ".";
      for (var i = 1, len = split.length; i < len; i++) {
        data += maple.utils.string.lpad(split[i], 2);
      }
    }
    return parseFloat(data);
  }

};