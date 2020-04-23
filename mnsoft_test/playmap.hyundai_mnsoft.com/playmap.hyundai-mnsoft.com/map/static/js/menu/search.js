/**
 * POI 검색
 * 
 * @type {Object}
 */
maple.menu.search = {

  init: function() {
    var that = this;
    that.poi.init();
  },

  clear: function() {
    var that = this;
    that.poi.clear();
  }

};

maple.menu.search.poi = {

  /**
   * 클래스명
   * 
   * @type {string}
   */
  CLASS_NAME: "SearchPoi",

  /**
   * 선택자
   * 
   * @type {string}
   */
  selector: "#div_search_poi",

  /**
   * 창 목록 - 하위POI (전역에서 재활용하는 창)
   */
  windows: {},

  /**
   * 창 - 상세정보 (poi 에서만 사용)
   */
  window: {},

  /**
   * 기본 파라미터 목록
   * 
   * @type {Object}
   */
  defaultParams: {

    /**
     * 페이지 인덱스
     * 
     * @type {number}
     */
    pageIndex: 0,

    /**
     * 한 페이지에 표시할 목록 수
     * 
     * @type {number}
     */
    pageSize: 10,

    /**
     * 한 페이지에 표시할 페이지 수
     * 
     * @type {number}
     */
    listSize: 5
  },

  /**
   * 타입 - MAPPY, POI, NAVER, DAUM
   * 
   * @type {string}
   */
  type: null,

  /**
   * 파라미터 목록
   * 
   * @type {Object}
   */
  params: {},

  /**
   * 지도
   * 
   * @type {hmns.maps.Map}
   */
  map: null,

  /**
   * 초기화
   */
  init: function() {
    var that = this;
    that.map = maple.map.getMap();

    that.bindEvent();
  },

  /**
   * 이벤트 연결
   */
  bindEvent: function() {
    var that = this;

    // POI 검색
    $(".btn_search", that.selector).click(function() {
      if (that.validate()) {
        that.setParameters();
        that.search();
      }
    });
    $(".txt_searchword", that.selector).keyup(function(event) {
      if (event.keyCode == 13) {
        $(".btn_search", that.selector).trigger("click");
      }
    });

    // 위치 이동
    $(".search_list", that.selector).on("click", ".title a", function() {
      var node = $(this);
      var lon = parseFloat(node.attr("data-lon"));
      var lat = parseFloat(node.attr("data-lat"));
      that.map.setCenter([lon, lat], 18);
    });

    // 출발, 도착
    $(".search_list", that.selector).on("click", ".btn_go, .btn_arrive",
            function() {
              var node = $(this);
              var title = node.attr("data-title");
              var lon = parseFloat(node.attr("data-lon"));
              var lat = parseFloat(node.attr("data-lat"));
              var mode = node.attr("data-mode");
              $(".hmn_course").trigger("click");
              maple.menu.course.course.setLocation(title, lon, lat, mode);
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

    // 초기화
    $(".btn_clear", that.selector).click(function() {
      that.clear();
    });

  },

  /**
   * 유효성 검사
   * 
   * @return {boolean} 검사 통과 여부
   */
  validate: function() {
    var that = this;
    var searchword = $(".txt_searchword", that.selector).val();
    if (searchword) {
      return true;
    } else {
      alert("검색어를 입력하여 주십시오.");
      return false;
    }
  },

  /**
   * 파라미터 설정
   */
  setParameters: function() {
    var that = this;
    var center = that.map.getCenter();
    var searchword = $(".txt_searchword", that.selector).val();
    that.params = {
      keyword: searchword,
      lon: center[0],
      lat: center[1],
      pageIndex: 0,
      pageSize: 10,
      listSize: 5
    };
  },

  /**
   * 정리
   */
  clear: function() {
    var that = this;
    maple.utils.form.clear(that.selector);
    $('.span_total_count', that.selector).text(0);
    $('.search_list', that.selector).html("");
    $('.pagination', that.selector).html("");
    that.map.clearMarker();
    that.clearWindow();
  },

  /**
   * 창 초기화
   */
  clearWindow: function() {
    var that = this;
    for ( var i in that.window) {
      var obj = that.window[i];
      if (obj && obj.close) {
        obj.close();
      }
    }

    for ( var i in that.windows) {
      var window = that.windows[i];
      if (window && window.close) {
        window.close();
      }
    }
    that.windows = {};
  },

  /**
   * 검색
   */
  search: function() {
    var that = this;
    that.map.clearMarker();    
    that.clearWindow();
    
    // 경로탐색 결과를 삭제
    maple.menu.course.course.clear();

    maple.rest.search(that.params, function(response) {
      var data = {
        totalCount: response.total,
        items: []
      };      

      $.each(response.result, function(index, item) {
        var title = item.cname ? item.title + "(" + item.cname + ")" : item.title;
        var obj = {
          title: title ,
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
                item.address, lonlat, item.poiId, item.child, item.product);

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
  createLiTag: function(index, title, roadAddress, address, point, poiId,
          child, product) {
    var tagStr = '';
    tagStr += '<li class="wrap_cont">';
    tagStr += '<div class="addr_view">';
    tagStr += '<span class="title">';
    tagStr += '<i>' + (index + 1) + '</i>';
    tagStr += '<a href="javascript:maple.menu.search.poi.closeSearchPanel();" data-lon="' + point[0] + '" data-lat="' + point[1]
            + '" >' + title + '</a>';
    tagStr += '</span>';

    if (roadAddress) {
      tagStr += '<span class="address">';
      tagStr += roadAddress;
      tagStr += '</span>';
    }

    if (address) {
      tagStr += '<span class="address">';
      tagStr += address;
      tagStr += '</span>';
    }

    tagStr += '</div>';

    tagStr += '<div class="btn_wrap">';
    tagStr += '<span class="btn_double">';
    tagStr += '<button role="button" class="btn_go" data-lon="' + point[0]
            + '" data-lat="' + point[1] + '" data-title="' + title
            + '" data-mode="start">출발</button>';
    tagStr += '<button role="button" class="btn_arrive" data-lon="' + point[0]
            + '" data-lat="' + point[1] + '" data-title="' + title
            + '" data-mode="goal">도착</button>';
    tagStr += '</span>';
    if (child) {
      tagStr += '<span class="tag_name">';
      tagStr += '<a class="btn-default btn_child_poi" data-poi-id="' + poiId
              + '" data-product="' + product + '" >POI+</a>';
      tagStr += '</span>';
    }
    tagStr += '</div>';
    tagStr += '</li>';
    return tagStr;
  },
  closeSearchPanel: function(){
    $('.toggle_map').trigger('click');
  }

};

/**
 * 상세 정보 창
 */
maple.menu.search.poi.window.detail = {

  /**
   * 오버레이
   * 
   * @type {ol.Overlay}
   */
  overlay: null,

  /**
   * 열기
   * 
   * @param {ol.Feature} feature 객체
   */
  open: function(feature) {
    var that = this;
    var position = feature.getGeometry().getCoordinates();
    var properties = feature.getProperties();

    if (!that.overlay) {
      that.createOverlay(position, properties);
    } else {
      that.overlay.setPosition(position);
      that.setProperties(properties);
    }
  },

  /**
   * 닫기
   */
  close: function() {
    var that = this;
    if (that.overlay) {
      var map = maple.map.getMap();
      map.removeOverlay(that.overlay);
      that.overlay = null;
    }
  },

  /**
   * 오버레이 생성
   * 
   * @param {Array<number>} position 좌표 정보
   * @param {Object} 속성 정보
   */
  createOverlay: function(position, properties) {
    var that = this;
    var map = maple.map.getMap();
    var tagStr = '<section class="ol-popup overlay_container" style="width: 450px;">';
    tagStr += '<div class="container">';
    tagStr += '<header class="oyerlay_header">';
    //marker 클릭 상세화면에서 즐겨찾기 버튼 삭제
    //tagStr += '<button role="button" class="btn_favorite active">';
    //tagStr += '<span class="blind">즐겨찾기추가</span>';
    //tagStr += '</button>';
    //tagStr += '<h2 class="load_name">';
    tagStr += '<h2 class="load_name" style="padding-left:0px">';
    tagStr += '<a href="#" target="_blank" class="a_title"></a>';
    tagStr += '</h2>';
    tagStr += '<button role="button" class="btn__overlay--close"></button>';
    tagStr += '</header>';
    tagStr += '<div class="overlay_content">';
    tagStr += '<div class="overlay_roadAddress"></div>';
    tagStr += '<div class="overlay_address">';
    tagStr += '<span class="mark">지번</span>';
    tagStr += '</div>';
    tagStr += '<ul class="add_info">';
    tagStr += '<li class="phone_number"></li>';
    tagStr += '</ul>';
    tagStr += '</div>';
    tagStr += '</section>';

    var node = $(tagStr);
    var element = node[0];
    that.overlay = new ol.Overlay({
      element: element,
      offset: [0, -45],
      autoPan: true,
      position: position,
      autoPanAnimation: {
        duration: 250
      }
    });
    map.addOverlay(that.overlay);

    $(".btn__overlay--close", node).click(function() {
      that.close();
    });

    that.setProperties(properties);
  },

  /**
   * 속성 설정
   * 
   * @params {Object} properties 속성
   */
  setProperties: function(properties) {
    var that = this;

    var node = $(that.overlay.getElement());
    if (properties.detailUrl) {
      $(".load_name", node).html(
              '<a href="' + properties.detailUrl + '" target="_blank">'
                      + properties.title + '</a>');
    } else {
      $(".load_name", node).html(properties.title);
    }
    $(".a_title", node).text(properties.title);

    if (properties.roadAddress) {
      $(".overlay_roadAddress", node).show();
      $(".overlay_roadAddress", node).text(properties.roadAddress);
    } else {
      $(".overlay_roadAddress", node).hide();
    }

    if (properties.address) {
      $(".overlay_address", node).show();
      $(".overlay_address", node).html(
              '<span class="mark">지번</span>' + properties.address);
    } else {
      $(".overlay_roadAddress", node).hide();
    }

    if (properties.phoneNumber) {
      $(".add_info .phone_number", node).text(properties.phoneNumber);
    }

    $(".add_info .poi_class", node).addClass("blind");
    $(".add_info .poi_addnames", node).addClass("blind");
  }

};