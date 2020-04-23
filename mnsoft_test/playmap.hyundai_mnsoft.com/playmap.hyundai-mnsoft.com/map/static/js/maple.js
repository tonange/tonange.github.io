/**
 * Collavoration Viewer Application
 * 
 * @type {Object}
 */
var maple = {

  /**
   * 유틸 - /js/common/utils.js
   * 
   * @namespace
   */
  utils: {},

  /**
   * 창 - /js/window
   */
  windows: {},

  /**
   * 지도 - /js/map/map.js
   * 
   * @type {Object}
   */
  map: null,

  /**
   * 메뉴 - /js/menu
   */
  menu: {

    /**
     * 초기화
     */
    init: function() {
      var that = this;
      
      // 이벤트 연결
      that.bindEvents();

      // 경로 초기화 - POI 검색에서 출발지 도착지로 선택하기 위해서 미리 생성
      that.course.init();

      // 메뉴 초기화
      that.search.init();

      // 정밀지도 초기화
      that.hd.init();

    },

    /**
     * 정리
     */
    clear: function() {
      var that = this;
      that.search.clear();
      that.course.clear();
    },

    /**
     * 이벤트 연결
     */
    bindEvents: function() {
      var that = this;

      // 패널 toggle
      $(".panel_control button").click(
              function() {
                var node = $(this);
                if (node.is(".btn__panel--open")) {
                  $("#search_panel").addClass("panel");
                  $(".panel_control button").removeClass("btn__panel--open")
                          .addClass("btn__panel--close");
                          maple.menu.searchWrapResize();
                } else {
                  $("#search_panel").removeClass("panel");
                  $(".panel_control button").removeClass("btn__panel--close")
                          .addClass("btn__panel--open");
                }
                return false;
              });

      // 메뉴 선택
      $("#aside .navlist li a.toggle").click(
              function() {
                var node = $(this);
                $("#aside .navlist li a.toggle").removeClass("active");
                node.addClass("active");

                var menuId = node.attr("data-menu-id");
                var panel = $("#div_" + menuId);
                panel.siblings().removeClass("active");
                panel.addClass("active");

                $("#search_panel").addClass("panel");
                $(".panel_control button").removeClass("btn__panel--open")
                        .addClass("btn__panel--close");

                // 정밀지도 on/off
                if ($("#div_hd").hasClass("active")) {					
                  that.hd.show();
                } else {
                  that.hd.hide();
                }
                
                return false;
              });
    },

    /**
     * Left 창 조절
     */
    searchWrapResize: function() {
      if($("#search_panel").hasClass("panel")){
        var searchWrapHeight = $(window).height();
              searchWrapHeight -= $(".search_header").outerHeight();
              searchWrapHeight -= $(".position_info").outerHeight();
              
              searchWrapHeight -= 105;
              $(".search_wrap", "#search_panel").height(searchWrapHeight);
      }
      
      
    }

  },

  /**
   * 초기화
   */
  init: function() {
    var that = this;
    that.utils.jquery.config();
    that.bindEvents();
    that.map.init();
    that.menu.init();
    $("#div_loading").hide();

    // 창 크기 조절
    that.menu.searchWrapResize();

    var urlParams = new URLSearchParams(window.location.search);

    if((urlParams.has('hdmap'))){
      $("a[data-menu-id='hd']").trigger("click");
    }
  },

  /**
   * 정리
   */
  clear: function() {
    var that = this;
    that.map.getMap().getView().animate({
      rotation: 0,
      duration: 250
    });
	$(".hmn_widget .li_measure .btn_clear").trigger("click");
    that.menu.clear();
  },

  /**
   * 이벤트 연결
   */
  bindEvents: function() {
    var that = this;

    // 전체  
    $(document).keydown(function(evt) {
      if (evt.keyCode === 27) {
        that.clear();
      }
    });

    // 선택 상자
    $("body").on("blur", ".selectbox select", function() {
      $(this).parent().removeClass('focus');
    });
    $("body").on("change", ".selectbox select", function() {
      var select_name = $(this).children('option:selected').text();
      $(this).siblings('label').text(select_name);
    });

     // 웹브라우저 크기 변경 시 지도 화면 크기 변경
     $(window).bind('resize', function() {
      that.resizeWindowHandler();
    });

  },
  /**
   * 윈도우 크기 변경 시 실행되는 함수
   */
  resizeWindowHandler: function() {
    var that = this;
    var width = $(window).width();
    var height = $(window).height();
    that.menu.searchWrapResize();
  }
};

/**
 * Maple Rest 
 * 
 * @type {Object}
 */
maple.rest = {

  /**
   * 인증 코드
   */
  authCode: null,

  /**
   * 로그인
   */
  login: function() {
    var that = this;
    //'Authorization': 'Basic Z2lzTWFwMDAxOndlYkdpczAwMQ=='
    $.ajax({
      url: "https://mlpams.hyundai-mnsoft.com:9044/auth/code",
      method: "POST",      
      headers: {        
        'Authorization': 'Basic VEVTVDAwMToyMA=='
      }
    }).done(function(response) {
      if(response && response.auth_code) {
        that.authCode = response.auth_code;
        that.search();
      }
      else {
        alert("MAPLE 인증에 실패하였습니다.");
      }
    }).fail(function(response) {
      if(response && response.headers && response.headers.ErrCode && response.headers.ErrCode.length > 0 && response.headers.ErrDesc > 0 && response.headers.ErrDesc.length > 0) {
        alert('[' + response.headers.ErrCode[0] + ']' + response.headers.ErrDesc[0]);
      }
      else {
        alert("MAPLE 인증에 실패하였습니다.");  
      }
      
    });
  },
  
  /**
   * 검색
   * 
   * @param {Object} params 요청 파라미터
   * @param {Function} callback 요청 완료 시 수행할 함수
   */
  search: function(params, callback) {
    var that = this;
    
    if(params) {
      that.params = params;  
    }
    if(callback) {
      that.callback = callback;
    }
    
    if(that.authCode) {
      var parameters = {
        keyword : that.params.keyword,
        lon : that.params.lon,
        lat : that.params.lat,
        sort : 1,
        from : that.params.pageIndex * that.params.pageSize,
        size : that.params.pageSize
      };
      
      $.ajax({
        url : "https://mlp.hyundai-mnsoft.com:9144/mlp/unifiedsrch",
        method: "POST",
        headers : {
          'AuthCode' : that.authCode,
          'UniqueId' : '01012345678',
          'Version' : '1.1.2',
          'ServiceId' : '2123',
          'MsgId' : '1000',
          'coordinate' : 'G',
          'ReqCompression' : 'A',
          'ReqEncription' : 'B',
          'ReqFormat' : 'J',
          'RespCompression' : '0',
          'RespEncription' : '0',
          'RespFormat' : 'J',
          'Country' : '1'
        },
        contentType:"application/json; charset=UTF-8",
        data : JSON.stringify(parameters)
      }).done(function(response) {
        if(response && response.status == "success") {
          
          if(that.callback) {
            that.callback(response);
          }
        }
        else {
          // 현재 Key 체크 안하는 것으로 보임. key 오류 에러 메세지 확인 후 수정 필요
          //that.login();
        }
      }).fail(function() {
        alert("통합검색에 실패하였습니다.");
      });
    }
    else {
      that.login();
    }
  }

};