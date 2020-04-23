/**
 * 경로 탐색
 * 
 * @type {Object}
 */
maple.menu.course = {

  init: function() {
    var that = this;
    that.course.init();
  },

  clear: function() {
    var that = this;
    that.course.clear();
  }

};
maple.menu.course.course = {

  /**
   * 선택자
   * 
   * @type {string}
   */
  selector: "#div_course_course",

  /**
   * 벡터 소스
   * 
   * @type {ol.source.Vector}
   */
  source: null,

  /**
   * 지점 벡터 소스
   * 
   * @type {ol.source.Vector}
   */
  vertexSource: null,

  /**
   * 선택 벡터 소스
   * 
   * @type {ol.source.Vector}
   */
  highlightSource: null,

  /**
   * 파라미터 목록
   * 
   * @type {Object}
   */
  params: {},

  /**
   * 창 목록 - 하위POI (전역에서 재활용하는 창)
   */
  windows: {},

  /**
   * 검색 노드
   * 
   * @type {string}
   */
  searchNode: null,

  /**
   * 경유지 인덱스
   */
  waypointIndex: 0,

  /**
   * 도형 목록 (경로 검색 목록)
   */
  features: null,

  /**
   * 도형
   */
  feature: null,

  /**
   * 마우스 오버 시 표출할 도형
   */
  overFeature: null,

  /**
   * 경로 안내 코드 목록
   */
  rgCodes: {
    "1": {
      descript: "직진 방향입니다.",
      image: true
    },
    "2": {
      descript: "좌회전 입니다.",
      image: true
    },
    "3": {
      descript: "우회전 입니다.",
      image: true
    },
    "4": {
      descript: "좌측 방향 입니다.",
      image: true
    },
    "5": {
      descript: "우측 방향 입니다.",
      image: true
    },
    "6": {
      descript: "U턴 입니다.",
      image: true
    },
    "7": {
      descript: "P턴 입니다.",
      image: true
    },
    "8": {
      descript: "오른쪽 1시 방향입니다.",
      image: true
    },
    "9": {
      descript: "오른쪽 3시 방향 입니다.",
      image: true
    },
    "10": {
      descript: "오른쪽 4시 뱡향입니다.",
      image: true
    },
    "11": {
      descript: "왼쪽 8시 방향입니다.",
      image: true
    },
    "12": {
      descript: "왼쪽 9시 방향입니다.",
      image: true
    },
    "13": {
      descript: "왼쪽 11시 방향입니다.",
      image: true
    },
    "14": {
      descript: "왼쪽 도로로 진입하십시오.",
      image: true
    },
    "15": {
      descript: "오른쪽 도로로 진입하십시오.",
      image: true
    },
    "50": {
      descript: "비보호 좌회전 입니다.",
      image: true
    },
    "257": {
      descript: "로터리에서 직진 방향 입니다.",
      image: true
    },
    "258": {
      descript: "로터리에서 좌회전입니다.",
      image: true
    },
    "259": {
      descript: "로터리에서 우회전입니다.",
      image: true
    },
    "260": {
      descript: "로터리에서 좌측 방향입니다.",
      image: true
    },
    "261": {
      descript: "로터리에서 우측 방향입니다.",
      image: true
    },
    "262": {
      descript: "로터리에서 U턴입니다.",
      image: true
    },
    "263": {
      descript: "로터리에서 P턴입니다.",
      image: false
    },
    "264": {
      descript: "로터리에서 오른쪽 1시 방향입니다.",
      image: true
    },
    "265": {
      descript: "로터리에서 오론쪽 3시 방향입니다.",
      image: true
    },
    "266": {
      descript: "로터리에서 오론쪽 4시 방향입니다.",
      image: true
    },
    "267": {
      descript: "로터리에서 왼쪽 8시 방향입니다.",
      image: true
    },
    "268": {
      descript: "로터리에서 왼쪽 9시 방향입니다.",
      image: true
    },
    "269": {
      descript: "로터리에서 왼쪽 11시 방향입니다.",
      image: true
    },
    "4102": {
      descript: "고가차도 진입입니다.",
      image: true
    },
    "4103": {
      descript: "고가차도 옆길입니다.",
      image: true
    },
    "4104": {
      descript: "지하차도 진입입니다.",
      image: true
    },
    "4105": {
      descript: "지하차도 옆길입니다.",
      image: true
    },
    "4106": {
      descript: "본선으로 합류합니다.",
      image: false
    },
    "4107": {
      descript: "터널 진입입니다.(고속도로)",
      image: true
    },
    "4108": {
      descript: "터널 진입입니다.(일반도로)",
      image: true
    },
    "4109": {
      descript: "교량 진입입니다.(고속도로)",
      image: false
    },
    "4110": {
      descript: "교량 진입입니다.(일반도로)",
      image: false
    },
    "4111": {
      descript: "휴게소가 있습니다.",
      image: true
    },
    "4112": {
      descript: "휴게소로 진입하십시오.",
      image: true
    },
    "4113": {
      descript: "요금소입니다.",
      image: true
    },
    "4114": {
      descript: "차선이 줄어드는 구간입니다.",
      image: false
    },
    "4115": {
      descript: "페리항로 진입입니다.",
      image: true
    },
    "4116": {
      descript: "페리항로 진입입니다.",
      image: true
    },
    "4353": {
      descript: "전방에 고속도로 진입입니다.",
      image: true
    },
    "4354": {
      descript: "전방에 고속도로 진출입니다.",
      image: true
    },
    "4355": {
      descript: "전방에 도시고속도로 진입입니다.",
      image: true
    },
    "4356": {
      descript: "전방에 도시고속도로 진출입니다.",
      image: true
    },
    "4357": {
      descript: "전방에 분기도로 진입입니다.",
      image: true
    },
    "4358": {
      descript: "전방에 고가차도 진입입니다.",
      image: true
    },
    "4359": {
      descript: "전방에 고가차도 옆길입니다.",
      image: true
    },
    "4360": {
      descript: "전방에 지하차도 진입입니다.",
      image: true
    },
    "4361": {
      descript: "전방에 지하차도 옆길입니다.",
      image: true
    },
    "4609": {
      descript: "좌측에 고속도로 진입입니다.",
      image: true
    },
    "4610": {
      descript: "좌측에 고속도로 진출입니다.",
      image: true
    },
    "4611": {
      descript: "좌측에 도시고속도로 진입입니다.",
      image: true
    },
    "4612": {
      descript: "좌측에 도시고속도로 진출입니다.",
      image: true
    },
    "4613": {
      descript: "좌측에 분기도로 진입입니다.",
      image: true
    },
    "4614": {
      descript: "좌측에 고가차도 진입입니다.",
      image: true
    },
    "4615": {
      descript: "좌측에 고가차도 옆길입니다.",
      image: true
    },
    "4616": {
      descript: "좌측에 지하차도 진입입니다.",
      image: true
    },
    "4617": {
      descript: "좌측에 지하차도 옆길입니다.",
      image: true
    },
    "4618": {
      descript: "좌측에 본선으로 합류합니다.",
      image: false
    },
    "4865": {
      descript: "우측에 고속도로 진입입니다.",
      image: true
    },
    "4866": {
      descript: "우측에 고속도로 진출입니다.",
      image: true
    },
    "4867": {
      descript: "우측에 도시고속도로 진입입니다.",
      image: true
    },
    "4868": {
      descript: "우측에 도시고속도로 진출입니다.",
      image: true
    },
    "4869": {
      descript: "우측에 분기도로 진입입니다.",
      image: true
    },
    "4870": {
      descript: "우측에 고가차도 진입입니다.",
      image: true
    },
    "4871": {
      descript: "우측에 고가차도 옆길입니다.",
      image: true
    },
    "4872": {
      descript: "우측에 지하차도 진입입니다.",
      image: true
    },
    "4873": {
      descript: "우측에 지하차도 옆길입니다.",
      image: true
    },
    "4874": {
      descript: "우측에 본선으로 합류합니다.",
      image: false
    }
  },

  /**
   * 초기화
   */
  init: function() {
    var that = this;
    that.map = maple.map.getMap();

    that.initLayer();
    that.bindEvents();

  },

  /**
   * 레이어 초기화
   */
  initLayer: function() {
    var that = this;

    that.source = new ol.source.Vector();
    var layer = new ol.layer.Vector({
      source: that.source,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(63, 160, 253, 0.6)',
          width: 6
        })
      }),
      zIndex: 700
    });
    that.map.addLayer(layer);

    that.vertexSource = new ol.source.Vector();
    var vertexLayer = new ol.layer.Vector({
      source: that.vertexSource,
      style: function(feature, resolution) {
        var index = feature.get("index")
        var isActive = feature.get("active");
        if (resolution < 5) {
          return that.getRoutePointStyle(index, false);
        } else {
          return null;
        }
      },
      declutter: true,
      zIndex: 701
    });
    that.map.addLayer(vertexLayer);

    that.highlightSource = new ol.source.Vector();
    var highlighLayer = new ol.layer.Vector({
      source: that.highlightSource,
      style: function(feature, resolution) {
        var index = feature.get("index")
        if (resolution < 5) {
          return that.getRoutePointStyle(index, true);
        } else {
          return null;
        }
      },
      zIndex: 702
    });
    that.map.addLayer(highlighLayer);
  },

  /**
   * 이벤트 연결
   */
  bindEvents: function() {
    var that = this;

    // 출발지 검색
    $(".txt_start_point", that.selector).keyup(function(event) {
      var node = $(this);
      if (event.keyCode == 13) {
        if (node.val()) {
          var center = that.map.getCenter();
          that.params = {
            keyword: node.val(),
            lon: center[0],
            lat: center[1],
            pageIndex: 0,
            pageSize: 10,
            listSize: 5
          };
          that.searchNode = $(".li_start", that.selector);
          that.search();
        } else {
          alert("출발지를 입력하여 주십시오.");
        }
      }
    });

    // 경유지 검색
    $(that.selector).on(
            "keyup",
            ".txt_way_point",
            function(event) {
              var node = $(this);
              if (event.keyCode == 13) {
                if (node.val()) {
                  var center = that.map.getCenter();
                  that.params = {
                    keyword: node.val(),
                    lon: center[0],
                    lat: center[1],
                    pageIndex: 0,
                    pageSize: 10,
                    listSize: 5
                  };

                  var dataIndex = node.attr("data-index");
                  that.searchNode = $(".li_waypoint[data-index=" + dataIndex
                          + "]", that.selector);
                  that.search();
                } else {
                  alert("경유지를 입력하여 주십시오.");
                }
              }
            });

    // 도착지 검색
    $(".txt_goal_point", that.selector).keyup(function(event) {
      var node = $(this);
      if (event.keyCode == 13) {
        if (node.val()) {
          var center = that.map.getCenter();
          that.params = {
            keyword: node.val(),
            lon: center[0],
            lat: center[1],
            pageIndex: 0,
            pageSize: 10,
            listSize: 5
          };
          that.searchNode = $(".li_goal", that.selector);
          that.search();
        } else {
          alert("도착지를 입력하여 주십시오.");
        }
      }
    });

    // 경유지 추가
    $(".btn_add_waypoint", that.selector)
            .click(
                    function() {
                      if ($(this).is(".active")) {
                        var tagStr = '';
                        tagStr += '<li class="li_waypoint" data-index="'
                                + (that.waypointIndex) + '">';
                        tagStr += '<dl>';
                        tagStr += '<dd>';
                        tagStr += '<input class="tf_text tf_text_large txt_way_point" data-index="'
                                + (that.waypointIndex)
                                + '" placeholder="Add destination" />';
                        tagStr += '<button class="btn btn_remove_waypoint" data-index="'
                                + (that.waypointIndex++) + '" >X</button>';
                        tagStr += '<input type="hidden" class="hid_x" value="" />';
                        tagStr += '<input type="hidden" class="hid_y" value="" />';
                        tagStr += '</dd>';
                        tagStr += '</dl>';
                        tagStr += '</li>';

                        var node = $(tagStr);
                        $(".input_wrap li:last", that.selector).before(node);
                        node.find("input").focus();

                        that.toggleSwitchButton();
                      }
                    });

    // 경유지 삭제
    $(".input_wrap", that.selector).on(
            "click",
            ".btn_remove_waypoint",
            function() {
              var node = $(this);
              var dataIndex = node.attr("data-index");
              var liNode = $(".li_waypoint[data-index=" + dataIndex + "]",
                      that.selector);

              if (that.searchNode && that.searchNode.length > 0 && liNode
                      && liNode.length > 0) {
                if (that.searchNode[0] === liNode[0]) {
                  that.clearSearchResult();
                }
              }
              liNode.remove();

              that.toggleSwitchButton();
              that.showFeatures();
            });

    // 페이징 이동
    $('.pagination', that.selector).on("click", "li", function() {
      var node = $(this);
      var aNode = node.find("a");
      if (aNode.attr("data-page-index")) {
        that.params.pageIndex = parseInt(aNode.attr("data-page-index"));
        that.search();
      }
    });

    // 출발지, 목적지 선택 및 위치 이동
    $(".search_list", that.selector).on("click", ".title a", function() {
      var node = $(this);
      var lon = parseFloat(node.attr("data-lon"));
      var lat = parseFloat(node.attr("data-lat"));
      that.setLocation(node.text(), lon, lat);
      that.map.setCenter([lon, lat], 18);
      that.showFeatures();
    });

    // 출발지 / 도착지 변경
    $(".div_switch", that.selector).click(
            function() {
              var startName = $(".txt_start_point", that.selector).val();
              var goalName = $(".txt_goal_point", that.selector).val();

              $(".txt_start_point", that.selector).val(goalName);
              $(".txt_goal_point", that.selector).val(startName);

              var tempX = $(".li_start .hid_x", that.selector).val();
              var tempY = $(".li_start .hid_y", that.selector).val();

              $(".li_start .hid_x", that.selector).val(
                      $(".li_goal .hid_x", that.selector).val());
              $(".li_start .hid_y", that.selector).val(
                      $(".li_goal .hid_y", that.selector).val());

              $(".li_goal .hid_x", that.selector).val(tempX);
              $(".li_goal .hid_y", that.selector).val(tempY);
              that.showFeatures();
            });

    // 길찾기
    $(".btn_route", that.selector).click(function() {
      that.route();
    });

    // 상세 경로 표시
    $(".search_list", that.selector).on(
            "click",
            ".li_route .addr_view",
            function() {
              var node = $(this).parent();
              if (node.hasClass("active")) {
                return;
              } else {
                $(".search_list .li_route", that.selector)
                        .removeClass("active");
                node.addClass("active");
                // 이전 결과 삭제
                that.vertexSource.clear();
                var features = that.source.getFeatures();
                for (var i = features.length - 1; i >= 0; i--) {
                  var feature = features[i];
                  var type = feature.get("type");
                  if (type && type === "route") {
                    that.source.removeFeature(feature);
                  }
                }

                var index = node.attr("data-index");
                that.feature = that.features[index];
                that.feature.set("type", "route");
                that.source.addFeature(that.feature);
                maple.utils.map.moveFeatures([that.feature]);

                var coordinates = that.feature.getGeometry().getCoordinates();
                var properties = that.feature.getProperties();
                var data = properties.summary.data;
                var addFeatures = [];
                $(data).each(
                        function(index, item) {
                          if (item.vertextIndex < coordinates.length) {
                            var point = new ol.geom.Point(
                                    coordinates[item.vertextIndex]);
                            var feature = new ol.Feature(point);
                            feature.set("index", index);
                            addFeatures.push(feature);
                          }
                        });
                if (addFeatures.length > 0) {
                  that.vertexSource.addFeatures(addFeatures);
                }
                $(".btn_poi", that.selector).addClass("active");
              }
            });

    // 지점 선택
    $(".search_list", that.selector).on(
            "mouseover",
            ".div_route_detail ul li",
            function() {
              var node = $(this);
              var index = parseInt(node.attr("data-index"));
              if (index < that.vertexSource.getFeatures().length) {
                var features = that.vertexSource.getFeatures();
                var feature = features[index];
                var feature = null;
                $(features).each(function(idx, item) {
                  var properties = item.getProperties();
                  if (properties["index"] === index) {
                    feature = item;
                  }
                })

                if (feature) {
                  var point = feature.getGeometry().clone();
                  that.overFeature = new ol.Feature(point);
                  that.overFeature.set("index",
                          feature.getProperties()["index"]);
                  that.highlightSource.addFeature(that.overFeature);
                }

              }
            });
    $(".search_list", that.selector).on("mouseout", ".div_route_detail ul li",
            function() {
              if (that.overFeature) {
                that.highlightSource.removeFeature(that.overFeature);
                that.overFeature = null;
              }
            });
    $(".search_list", that.selector).on("click", ".div_route_detail ul li",
            function() {
              var node = $(this);
              var index = node.attr("data-index");
              if (that.overFeature) {
                maple.utils.map.moveFeatures([that.overFeature]);
              }
            });

    // 초기화
    $(".btn_clear", that.selector).click(function() {
      //경로메뉴의 검색결과가 있을 때만 삭제되도록 수정
      if($('.span_total_count', that.selector).text() != 0){
        that.clear();
      }
      
    });

  },

  /**
   * 초기화
   */
  clear: function() {
    var that = this;
    maple.utils.form.clear(that.selector);
    that.searchNode = null;
    that.waypointIndex = 0;
    that.features = null;
    that.feature = null;
    that.overFeature = null;
    that.source.clear();
    that.vertexSource.clear();
    that.highlightSource.clear();
    that.clearSearchResult();

    $(".btn_poi", that.selector).removeClass("active");
  },

  /**
   * 검색 결과 초기화
   */
  clearSearchResult: function() {
    var that = this;
    $('.span_total_count', that.selector).text(0);
    $('.search_list', that.selector).html("");
    $('.pagination', that.selector).html("");
    that.map.clearMarker();
  },

  /**
   * 출발지/도착지 변경
   */
  toggleSwitchButton: function() {
    var that = this;
    var len = $(".btn_remove_waypoint", that.selector).length;
    if (len > 3) {
      $(".btn_add_waypoint").removeClass("active");
    } else {
      $(".btn_add_waypoint").addClass("active");
    }

    if (len > 0) {
      $(".div_switch", that.selector).hide();
    } else {
      $(".div_switch", that.selector).show();
    }
  },

  /**
   * 출발지/경유지/도착지 선택
   */
  setLocation: function(text, lon, lat, mode) {
    var that = this;

    if (mode) {
      if (mode === "start") {
        $(".li_start", that.selector).find(".hid_x").val(lon);
        $(".li_start", that.selector).find(".hid_y").val(lat);
        $(".li_start", that.selector).find(".tf_text").val(text);
      } else if (mode === "goal") {
        $(".li_goal", that.selector).find(".hid_x").val(lon);
        $(".li_goal", that.selector).find(".hid_y").val(lat);
        $(".li_goal", that.selector).find(".tf_text").val(text);
      } else {
        alert("지원되지 않는 모드 입니다.");
      }
    } else {
      that.searchNode.find(".hid_x").val(lon);
      that.searchNode.find(".hid_y").val(lat);
      that.searchNode.find(".tf_text").val(text);
    }
    that.showFeatures();
  },

  /**
   * 경로 탐색
   */
  route: function() {
    var that = this;

    var startX = $(".li_start .hid_x", that.selector).val();
    var startY = $(".li_start .hid_y", that.selector).val();

    var goalX = $(".li_goal .hid_x", that.selector).val();
    var goalY = $(".li_goal .hid_y", that.selector).val();

    if (!startX || !startY) {
      alert("출발지를 선택하여 주십시오.");
      $(".txt_start_point", that.selector).focus();
      return;
    } else if (!goalX || !goalY) {
      alert("도착지를 선택하여 주십시오.");
      $(".txt_goal_point", that.selector).focus();
      return;
    }

    var params = {
      start: {
        x: parseFloat(startX),
        y: parseFloat(startY)
      },
      goal: {
        x: parseFloat(goalX),
        y: parseFloat(goalY)
      }
    };

    var waypoints = [];
    var removeNodes = [];
    $(".li_waypoint", that.selector).each(function(index, item) {
      var wayNode = $(item);
      var x = wayNode.find(".hid_x").val();
      var y = wayNode.find(".hid_y").val();
      if (x && y) {
        waypoints.push({
          x: x,
          y: y
        });
      } else {
        removeNodes.push(wayNode)
      }
    });

    if (waypoints.length > 0) {
      params.waypoints = waypoints;
    }
    //입력안한 경유지가 1개 이상 있을 경우 경유지 추가버튼 활성화
    if(removeNodes.length > 0){
      $(".btn_add_waypoint").addClass("active");
    }
    $(removeNodes).each(function(index, item) {
      $(item).remove();
    });

    that.clearSearchResult();
    var url = hmns.maps.server + "/webgis/route";

    $.getJSON(url, {
      data: JSON.stringify(params)
    }).done(
            function(response) {
              if (response && response.errorCode) {
                alert(response.errorMessage);
              } else {
                var format = new ol.format.GeoJSON();
                var features = format.readFeatures(response);
                that.features = features;

                $(features).each(function(index, feature) {
                  feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
                });
                that.createRouteResult(features);

                $(".search_list .li_route:first .addr_view", that.selector)
                        .trigger("click");
              }
            });

  },

  /**
   * 경로 결과 생성
   * 
   * @param {Array.<ol.Feature>} features 도형 목록
   */
  createRouteResult: function(features) {
    var that = this;
    var totalLength = features.length;

    if (features.length === 0) {
      $('.search_list', that.selector).html(
              '<li><p class="name">검색 결과가 없습니다.</p></li>');
    } else {
      var firstFeature = null;
      var tagStr = '';
      $.each(features, function(index, feature) {
        if (index == 0) {
          firstFeature = feature;
        } else {
          // 동일 경로 제거
          if (JSON.stringify(firstFeature.getProperties()["summary"]) === JSON
                  .stringify(feature.getProperties()["summary"])) {
            totalLength--;
            return true;
          }
        }
        var properties = feature.getProperties();
        var summary = properties.summary;
        tagStr += that.createRouteLiTag(index, summary);
      });
      $('.search_list', that.selector).html(tagStr);
    }
    $('.pagination', that.selector).html("");
    $('.span_total_count', that.selector).text(totalLength);
  },

  /**
   * 경로 LI 태그 생성
   * 
   * @param {number} index 인덱스
   * @param {Object} summary 요약
   * @return {string} 경로 LI 태그 문자열
   */
  createRouteLiTag: function(index, summary) {
    var that = this;
    var tagStr = '';
    tagStr += '<li class="wrap_cont li_route" data-index="' + index + '" >';
    tagStr += '<div class="addr_view">';
    tagStr += '<span class="title">';
    tagStr += '<font class="font_time">'
            + maple.utils.date.toStringBySecond(summary.totalTime) + '</font>';
    tagStr += '<font class="font_distance">'
            + maple.utils.spatial.formatLength(summary.totalDistance)
            + '</font>';
    tagStr += '<span class="address"> 통행료: '
            + maple.utils.number.formatCurrency(summary.totalFee) + '원 </span>';
    tagStr += '</div>';
    tagStr += '<div class="div_route_detail">';
    tagStr += '<ul>';

    var wayIdx = 1;
    $(summary.data).each(function(idx, item) {
      var src = "";
      var descript = "";
      if (item.description.indexOf("목적지") >= 0) {
        src = "../static/images/menu/course/goal.png";
        descript = "목적지";
      } else if (item.description.indexOf("경유지") >= 0) {
        src = "../static/images/menu/course/waypoint" + (wayIdx++) + ".png";
        descript = "경유지";
      } else if (that.rgCodes[item.rgCode] != null) {
        if (that.rgCodes[item.rgCode].image) {
          src = "../static/images/menu/course/" + item.rgCode + ".png";
          descript = that.rgCodes[item.rgCode].descript;
        } else {
          src = "../static/images/menu/course/blank.png";
        }
      } else {
        src = "../static/images/menu/course/blank.png";
      }

      tagStr += that.createRouteDetailLiTag(idx, item, src, descript);
    });
    tagStr += '</ul>';
    tagStr += '</div>';
    tagStr += '</li>';
    return tagStr;
  },

  /**
   * 경로 상세 LI 태그 생성
   * 
   * @param {number} index 인덱스
   * @param {Object} item 경로 상세
   * @param {string} src 안내 이미지 경로
   * @param {string} descript 안내 코드 설명
   * @return {string} 경로 상세 LI 태그 문자열
   */
  createRouteDetailLiTag: function(index, item, src, descript) {
    var tagStr = '';
    tagStr += '<li data-index="' + index + '">';
    tagStr += '<div class="div_direction">';
    tagStr += '<div class="div_image">';
    tagStr += '<img src="' + src + '" alt="' + descript + '" title="'
            + descript + '" />';
    tagStr += '</div>';
    tagStr += '<div class="div_speed">';
    tagStr += item.speed + 'km/h';
    tagStr += '</div>';
    tagStr += '</div>';
    tagStr += '<div class="div_seq">';
    tagStr += '<span class="dot">' + (index + 1) + '</span>';
    tagStr += '</div>';
    tagStr += '<div class="div_description">';
    tagStr += item.description;
    tagStr += '</div>';
    tagStr += '</li>';
    return tagStr;
  },

  /**
   * 검색
   */
  search: function() {
    var that = this;
    //기존에 표시한 marker 삭제
    that.map.clearMarker();
    //검색탭에서 검색한 내용 삭제
    maple.menu.search.clear();
    
    maple.rest.search(that.params, function(response) {
      var data = {
        totalCount: response.total,
        items: []
      };
      
      $.each(response.result, function(index, item) {
        var title = item.cname ? item.title + "(" + item.cname + ")" : item.title;
        var obj = {
          title: title,
          lon: item.center.lon,
          lat: item.center.lat,
          roadAddress: item.addrRoad,
          address: item.addr,
          phoneNumber: item.tele
        };
        data.items.push(obj);
      });
	  
	  if (data) {
        that.createResult(data);
      }

      $(".search_list li:first .title a", that.selector).trigger("click");
    });
  },

  /**
   * 결과 생성
   * 
   * @param {Array.<Object>} data 데이터
   */
  createResult: function(data) {
    var that = this;
    $('.span_total_count', that.selector).text(data.totalCount);

    if (data.totalCount === 0) {
      $('.search_list', that.selector).html(
              '<li><p class="name">검색 결과가 없습니다.</p></li>');
      $('.pagination', that.selector).html("");
    } else {
      var tagStr = '';
      $.each(data.items, function(index, item) {
        var lonlat = [item.lon, item.lat];
        tagStr += that.createLiTag(index, item.title, item.roadAddress,
                item.address, lonlat, item.poiId, item.child);

        var options = {
          lonlat: lonlat,
          num: (index + 1)
        };
        var properties = item;
        that.map.addMarker(options, properties);
      });
      $('.search_list', that.selector).html(tagStr);

      that.map.getView().fit(that.map.getMarkerExtent());

      var paging = maple.utils.paging.createPagination(that.params.pageIndex,
              data.totalCount, that.params.pageSize, that.params.listSize);
      $('.pagination', that.selector).html(paging);
    }
  },

  /**
   * li 태크 생성
   * 
   * @params {number} index 인덱스
   * @params {string} title 제목
   * @params {string} roadAddress 도로명주소
   * @params {string} address 주소
   * @params {ol.geom.Point} point 점
   * @params {string} poiId POI 아이디
   * @params {child} child 하위 POI 존재 여부
   * @return {string} li 태그
   */
  createLiTag: function(index, title, roadAddress, address, point) {
    var tagStr = '';
    tagStr += '<li class="wrap_cont">';
    tagStr += '<div class="addr_view">';
    tagStr += '<span class="title">';
    tagStr += '<i>' + (index + 1) + '</i>';
    tagStr += '<a href="#" data-lon="' + point[0] + '" data-lat="' + point[1]
            + '" >' + title + '</a>';
    tagStr += '</span>';

    var isBookmark = true;
    if (roadAddress) {
      tagStr += '<span class="address">';
      if (!isBookmark) {
        tagStr += '<button role="button" class="btn_bookmark">즐겨찾기</button>';
        isBookmark = true;
      }
      tagStr += roadAddress;
      tagStr += '</span>';
    }

    if (address) {
      tagStr += '<span class="address">';
      if (!isBookmark) {
        tagStr += '<button role="button" class="btn_bookmark">즐겨찾기</button>';
        isBookmark = true;
      }
      tagStr += address;
      tagStr += '</span>';
    }

    tagStr += '</div>';
    tagStr += '</li>';
    return tagStr;
  },

  /**
   * 도형 목록 표시
   */
  showFeatures: function() {
    var that = this;
    that.source.clear();

    that.showFeature($(".li_start", that.selector), "출발", "start");

    $(".li_waypoint", that.selector).each(function(index, item) {
      //that.showFeature($(item), "경유" + (index + 1), "waypoint");
      that.showFeature($(item), "경유" + (index + 1), "waypoint_" + (index + 1));
    });

    that.showFeature($(".li_goal", that.selector), "도착", "goal");
  },

  /**
   * 도형 표시
   * 
   * @param {Element} node 노드
   * @param {string} text 문자열
   * @param {string} icon 아이콘
   */
  showFeature: function(node, text, icon) {
    var that = this;
    var lon = node.find(".hid_x").val();
    var lat = node.find(".hid_y").val();

    if (lon && lat && text) {
      var feature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([
          parseFloat(lon), parseFloat(lat)])));
      feature.setStyle(that.getStyle(text, icon));
      that.source.addFeature(feature);
    }

  },

  /**
   * 스타일 반환
   * 
   * @param {string} text 문자열
   * @return {ol.style.Style} 스타일
   * @param {string} icon 아이콘
   */
  getStyle: function(text, icon) {
    var that = this;

    var imageOption = {
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: '../static/images/menu/course/icon/' +  icon + '.png',
      opacity: 1
    };

    var style = new ol.style.Style({
      image: new ol.style.Icon(imageOption)
    });
    /*
    var style = new ol.style.Style({
      image: new ol.style.Icon(imageOption),
      text: new ol.style.Text({
        font: '12px HDharmonyL',
        overflow: true,
        fill: new ol.style.Fill({
          color: '#fff'
        }),
        offsetY: -25,
        textAlign: 'center',
        textBaseline: 'bottom',
        text: text
      })
    });
    */
    return style;
  },

  /**
   * 경로 지점 스타일
   * 
   * @param {string} index 인덱스
   * @param {boolean} isActive 활성 여부
   */
  getRoutePointStyle: function(index, isActive) {
    var that = this;

    var fillColor = "rgba(255, 255, 255, 1)";
    var textColor = "#2397bc";
    if (isActive) {
      fillColor = "#2397bc";
      textColor = "rgba(255, 255, 255, 1)";
    }

    var style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10,
        stroke: new ol.style.Stroke({
          color: "rgba(64, 64, 64, 1)"
        }),
        fill: new ol.style.Fill({
          color: fillColor
        })
      }),
      text: new ol.style.Text({
        font: '12px HDharmonyL bold',
        fill: new ol.style.Fill({
          color: textColor
        }),
        overflow: true,
        textAlign: 'center',
        textBaseline: 'middle',
        text: (index + 1) + ''
      })
    });
    return style;
  }

};