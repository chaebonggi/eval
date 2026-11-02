$(document).ready(function() {
  // 상단 사용자 메뉴 토글
  $('.usr_menu').click(function() {
    $('.usr_menu_list').toggleClass('show');
    $('.usr_menu > .material-symbols-outlined').toggleClass('rotate');
  });

  // 서브메뉴 아코디언 토글 (하위 메뉴가 있는 경우만 토글, 단독 링크는 정상 이동)
  $('a.d1').click(function(e) {
    const $targetCnt = $(this).closest('div').next('.ring_cnt, .sub_cnt');

    if ($targetCnt.length > 0) {
      e.preventDefault();
      if ($targetCnt.hasClass('on')) {
        $targetCnt.removeClass('on');
      } else {
        $('.ring_cnt, .sub_cnt').removeClass('on');
        $targetCnt.addClass('on');
      }
    }
  });

  // 좌측 탭/리스트 선택 활성화
  $('.list_wrap li').click(function() {
    $('.list_wrap li').removeClass('current');
    $(this).addClass('current');
  });
});