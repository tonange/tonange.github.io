/**
 * JQuery 유틸
 * 
 * @type {Object}
 */
maple.utils.jquery = {

  /**
   * 로딩 바 표시 여부
   * 
   * @type {boolean}
   */
  count: 0,

  /**
   * jquery 설정
   */
  config: function() {
    var that = this;
    that.configAjax();
  },

  /**
   * ajax 호출 설정
   */
  configAjax: function() {
    var that = this;

    // 전통적인 방식으로 ajax 호출 { id[] : 1, id[] : 2...}
    $.ajaxSettings.traditional = true;

    // ajax 호출 시 로딩 바 생성하고 호출 완료 시 로딩 바 삭제
    $(document).ajaxStart(function() {
      that.count++;
      $("#div_loading").show();
    }).ajaxComplete(function() {
    }).ajaxError(function() {
    }).ajaxStop(function() {
      that.count--;
      if (that.count === 0) {
        $("#div_loading").hide();
      }
    }).ajaxSuccess(function() {
    });
  }

};

/**
 * 숫자 유틸
 * 
 * @type {Object}
 */
maple.utils.number = {
        
  /**
   * number type 의 값에 currency separator 추가
   * 
   * @param {number} value 값
   * @return {string} 1000 단위 comma(,) 로 구분된 문자열
   */
  formatCurrency : function(value) {
    var result = '';
    if(value) {
      // 타입 체크
      if(typeof value == "number") {
        result = value.toString();
      }
      else {
        result = value;
      }
      // 정수부 3자리마다 ',' 표시
      result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else {
      result = value;
    }
    return result; 
  }
        
}

/**
 * 문자열 유틸
 * 
 * @type {Object}
 */
maple.utils.string = {

  /**
   * 첫 문자 대문자로 변환
   * 
   * @param {string} string 문자열
   * @return {string} 문자열
   */
  capitalizeFirstLetter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

};

/**
 * Form 유틸
 * 
 * @type {Object}
 */
maple.utils.form = {

  /**
   * Form 내부 input, select, textarea 초기화
   * 
   * @param {string} selector 선택자
   */
  clear: function(selector) {
    $(selector).find("input").each(function() {
      var node = $(this);
      node.val("");
    });

    $(selector).find("select").each(function() {
      var node = $(this);
      if (node.find("option").length > 0) {
        node.val(node.find("option:first").val());
      }
      if(node.siblings('span[role=combobox]').length > 0) {
        node.selectmenu("refresh");
        node.trigger("change");
      }
      node.siblings('label').text(node.find("option:first").text());
    });

    $(selector).find("textarea").each(function() {
      var node = $(this);
      node.val("");
    });
  }

};

/**
 * 날짜 유틸
 * 
 * @type {Object}
 */
maple.utils.date = {

  /**
   * 날짜 문자열 변환
   * 
   * @param {number} second 초
   * @return {string} 시분초 문자열
   */
  toStringBySecond: function(second) {
    var result = '';
    
    if(second / 60 > 1) {
      var minute = Math.floor(second / 60);
      if(minute / 60 > 1) {
        var hour = Math.floor(minute / 60);
        var minute = minute - (hour * 60);
        result = hour + "시간 ";
        result += minute?minute+"분":"";
      }
      else {
        result = minute + "분";
      }
    }
    else {
      result = '1분';
    }
    return result;
  }

};

/**
 * 지도 유틸
 * 
 * @type {Object}
 */
maple.utils.map = {

  /**
   * 도형 목록 이동
   * 
   * @param {Array.<ol.Feature>} features 도형 목록
   */
  moveFeatures: function(features) {
    var that = this;

    var map = maple.map.getMap();
    var view = map.getView();

    var max = [];

    for (var i = 0, len = features.length; i < len; i++) {
      var feature = features[i];
      var extent = feature.getGeometry().getExtent();
      if (i == 0) {
        max[0] = extent[0];
        max[1] = extent[1];
        max[2] = extent[2];
        max[3] = extent[3];
      } else {
        if (max[0] > extent[0]) max[0] = extent[0];
        if (max[1] > extent[1]) max[1] = extent[1];
        if (max[2] < extent[2]) max[2] = extent[2];
        if (max[3] < extent[3]) max[3] = extent[3];
      }
    }
    if (max.length == 4) {
      var center = null;
      var resolution = null;
      if (max[0] == max[2] && max[1] == max[3]) {
        resolution = view.getResolutionForZoom(18);
        center = [max[0], max[1]];
      } else {
        resolution = view.constrainResolution(view.getResolutionForExtent(max,
                map.getSize()), -1);
        center = ol.extent.getCenter(max);
      }

      view.setCenter([center[0], center[1]]);
      view.setResolution(view.constrainResolution(resolution));
    }
  }

}

/**
 * 공간 유틸
 * 
 * @type {Object}
 */
maple.utils.spatial = {

  /**
   * 길이 단위 포맷
   * 
   * @param {number} length 길이
   * @return 길이 문자열
   */
  formatLength: function(length) {
    var output = '';
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) + '' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) + '' + 'm';
    }
    return output;
  }
  
};

/**
 * 페이지 유틸
 * 
 * @type {Object}
 */
maple.utils.paging = {

  /**
   * 첫 번째 인덱스 반환
   * 
   * @param {number} pageIndex 현재 페이지 인덱스
   * @param {number} pageSize 한 페이지에 나타낼 목록 수
   * @return 첫 번째 인덱스
   */
  getFirstIndex: function(pageIndex, pageSize) {
    var firstIndex = (pageIndex - 1) * pageSize;
    return firstIndex;
  },

  /**
   * 두 번째 인덱스 반환
   * 
   * @param {number} pageIndex 현재 페이지 인덱스
   * @param {number} pageSize 한 페이지에 나타낼 목록 수
   * @return 마지막 인덱스
   */
  getLastIndex: function(pageIndex, pageSize) {
    var lastIndex = pageIndex * pageSize;
    return lastIndex;
  },

  /**
   * 페이징 생성
   * 
   * @param {number} pageIndex 현재 페이지 인덱스
   * @param {number} totalCount 총 수
   * @param {number} pageSize 한 페이지에 나타낼 목록 수
   * @param {number} listSize 한 번에 보일 페이지 수
   * @return 페이지 태그 문자열
   */
  createPagination: function(pageIndex, totalCount, pageSize, listSize) {
    var tagStr = '';
    tagStr += '<ul>';

    var firstPageNo = (listSize * Math.floor(pageIndex / listSize));
    var totalPageCount = Math.ceil(totalCount / pageSize);

    var lastPageNo = firstPageNo + listSize;
    if (lastPageNo > totalPageCount) {
      lastPageNo = totalPageCount;
    }

    if (firstPageNo != 0) {
      tagStr += '<li><a href="#" class="paging_prev" data-page-index="'
              + (firstPageNo - listSize) + '">이전</a></li>';
    }

    for (var i = firstPageNo; i < lastPageNo; i++) {
      if (i === pageIndex) {
        tagStr += '<li class="active"><strong>' + (i + 1) + '</strong></li>';

      } else {
        tagStr += '<li><a href="#" data-page-index="' + i + '">' + (i + 1)
                + '</a></li>';
      }
    }

    if (lastPageNo != totalPageCount) {
      tagStr += '<li><a href="#" class="paging_next" data-page-index="'
              + (firstPageNo + listSize) + '">다음</a></li>';
    }

    tagStr += '</ul>';
    return tagStr;
  }

};