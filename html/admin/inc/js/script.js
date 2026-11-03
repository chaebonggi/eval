$(document).ready(function() {
  // 상단 사용자 메뉴
  $('.usr_menu').click(function() {
    $('.usr_menu_list').toggleClass('show');
    $('.usr_menu > .material-symbols-outlined').toggleClass('rotate');
  });

  // 서브메뉴 아코디언
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

  // 좌측 탭/리스트 선택
  $('.list_wrap li').click(function() {
    $('.list_wrap li').removeClass('current');
    $(this).addClass('current');
  });

  // 파일 업로드 처리
  function setDropFile($box, file) {
    const $targetName = $box.find('.selected_file_name');
    if (file) {
      $targetName.text(file.name);
      $box.addClass('has_file');
    } else {
      $targetName.text('');
      $box.removeClass('has_file');
    }
  }

  $(document).on('change', '.file_drop_box input[type="file"]', function(e) {
    const file = e.target.files[0];
    const $box = $(this).closest('.file_drop_box');
    setDropFile($box, file);
  });

  $(document).on('dragenter dragover', '.file_drop_box', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass('drag_over');
  });

  $(document).on('dragleave drop', '.file_drop_box', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass('drag_over');
  });

  $(document).on('drop', '.file_drop_box', function(e) {
    e.preventDefault();
    e.stopPropagation();

    const files = e.originalEvent.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const $fileInput = $(this).find('input[type="file"]');
      $fileInput[0].files = files;
      setDropFile($(this), file);
    }
  });

  // 모달 닫기 시 파일 초기화
  $(document).on('click', '.krds-modal .close-modal, .krds-modal .modal-back', function() {
    const $modal = $(this).closest('.krds-modal');
    $modal.find('input[type="file"]').val('');
    $modal.find('.file_drop_box').removeClass('has_file');
    $modal.find('.selected_file_name').text('');
  });
});