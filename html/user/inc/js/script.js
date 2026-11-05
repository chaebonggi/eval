$(document).ready(function() {
  $('.usr_menu').click(function() {
    $('.usr_menu_list').toggleClass('show');
    $('.usr_menu > .material-symbols-outlined').toggleClass('rotate');
  });

  // 서브메뉴 아코디언 토글 (서브메뉴가 있는 스텝 메뉴만 토글하고, 단독 메뉴는 정상 이동)
  $('a.d1').click(function(e) {
    const $targetCnt = $(this).closest('.ring').parent().next('.ring_cnt');

    if ($targetCnt.length > 0) {
      e.preventDefault();
      if ($targetCnt.hasClass('on')) {
        $targetCnt.removeClass('on');
      } else {
        $('.ring_cnt').removeClass('on');
        $targetCnt.addClass('on');
      }
    }
  });

  $('.list_wrap li').click(function(){
    $('.list_wrap li').removeClass('current');
    $(this).addClass('current');
  });

  $('.modal_close').click(function(){
    $('.modal_wrap').hide();
  });

  $('.btn.score_guide').click(function(){
    $('#score_guide').show();
  });

  $('.score_check').click(function(){
    const $guide = $(this).next('.score_check_guide');
    $guide.stop().slideToggle(200);
  });

  // .marking 내부의 라디오 버튼 선택 변경 시
  $(document).on('change', '.marking input[type="radio"]', function () {
    const $this = $(this);
    const radioName = $this.attr('name');
    const selectedVal = $this.val();

    const $amount = $this.closest('.mark_wrap').find('.marking_amount');

    if ($amount.length > 0 && selectedVal !== undefined) {
      const formattedScore = parseFloat(selectedVal).toFixed(1);
      $amount.text(formattedScore);
    }
  });

  // 페이지 로드 시 이미 체크된 항목이 있을 경우 초기 반영
  $('.marking input[type="radio"]:checked').each(function () {
    const $this = $(this);
    $this.next('label').addClass('active');

    const selectedVal = $this.val();
    if ($selectedVal !== undefined) {
      $this.closest('.mark_wrap').find('.marking_amount').text(parseFloat(selectedVal).toFixed(1));
    }
  });

  // 각 스텝별 입력 진행상태 표기 도넛(링) 인디케이터
  function renderProgressRing($container) {
    const $el = $($container);

    const total = parseInt($el.data('total'), 10);
    const current = parseInt($el.data('current'), 10) || 0;
    const stepNum = $el.data('step');

    const radius = 15.5;
    const circumference = 2 * Math.PI * radius;
    const gap = 3;

    const segmentLength = (circumference / total) - gap;
    const baseDashArray = `${segmentLength} ${gap}`;

    let activeDashes = [];
    for (let i = 0; i < current; i++) {
      activeDashes.push(segmentLength);
      if (i < current - 1) {
        activeDashes.push(gap);
      }
    }

    const activeLength = (segmentLength * current) + (gap * (current - 1));
    const remainingCircumference = circumference - activeLength;
    const activeDashArray = current === 0 ? "0 999" : `${activeDashes.join(' ')} ${remainingCircumference}`;

    $el.html(`
      <svg viewBox="0 0 36 36" style="width: 24px; height: 24px; transform: rotate(-90deg);">
        <!-- 미완료 배경 -->
        <circle cx="18" cy="18" r="${radius}" fill="none" stroke="#4e8be6" stroke-width="3.5" 
                stroke-dasharray="${baseDashArray}" />
        <!-- 완료 트랙 -->
        <circle cx="18" cy="18" r="${radius}" fill="none" stroke="#fae100" stroke-width="3.5" 
                stroke-dasharray="${activeDashArray}" />
      </svg>
      <span style="position: absolute; color: #fff; font-weight: 500; font-size: 1.2rem;">${stepNum}</span>
    `);

    $el.css({
      'position': 'relative',
      'display': 'inline-flex',
      'align-items': 'center',
      'justify-content': 'center'
    });
  }

  $('.svg-ring-container').each(function() {
    renderProgressRing($(this));
  });   
});

$(function() {
  // ==========================================
  // [공통] 테이블 실시간 합계 및 비율 자동 계산
  // ==========================================
  function calculateTableArea() {
    const $table = $(this).closest('table');
    let totalArea = 0;

    // 1. 해당 테이블 내부의 .area-input만 합산
    $table.find('.area-input').each(function() {
      const val = parseFloat($(this).val()) || 0;
      totalArea += val;
    });

    // 2. 해당 테이블 tfoot의 합계 영역 갱신 (ID 유무 상관없이 자동 타겟팅)
    $table.find('#total-area, #total-land-area, tfoot .taright span').first().text(totalArea.toLocaleString());

    // 3. 비율 요소(.ratio-val)가 테이블 안에 존재하는 경우(스텝1 등)에만 비율 연산 실행
    const $ratioSpans = $table.find('.ratio-val');
    if ($ratioSpans.length > 0) {
      $table.find('.area-input').each(function(index) {
        const val = parseFloat($(this).val()) || 0;
        const percentage = (totalArea > 0 && val > 0) ? ((val / totalArea) * 100).toFixed(1) : '0.0';
        $ratioSpans.eq(index).text(percentage);
      });

      // tfoot 전체 합계 비율 갱신
      const $totalRatio = $table.find('#total-ratio');
      if ($totalRatio.length) {
        $totalRatio.text(totalArea > 0 ? '100.0%' : '0.0%');
      }
    }
  }

  // 실시간 입력(typing, 화살표 클릭) 이벤트 연결
  $(document).on('input', '.area-input', calculateTableArea);

  // textarea 글자 수 계산 및 높이 자동 조절
  function handleTextarea() {
    const $this = $(this);
    const textLength = $this.val().length;

    // 1. 같은 부모(.tbl_wrap) 내의 글자 수 카운터 업데이트
    const $countEl = $this.closest('.tbl_wrap').find('.word_cnt span');
    $countEl.text(textLength.toLocaleString());

    // 2. 높이 자동 조절 (텍스트 삭제 시 높이가 줄어들 수 있도록 auto로 리셋 후 계산)
    $this.css('height', 'auto');
    $this.css('height', this.scrollHeight + 'px');
  }

  // 실시간 타이핑, 붙여넣기, 잘라내기 이벤트 감지
  $(document).on('input propertychange', '.auto-textarea', handleTextarea);

  // 페이지 로드 시 기존 내용이 채워져 있을 경우 초기 실행
  $('.auto-textarea').each(function() {
    handleTextarea.call(this);
  });
});

// 화면 분할
$(function() {
  const $wrapper = $('#splitWrapper');
  const $leftPanel = $('#leftPanel');
  const $resizer = $('#resizer');

  let isDragging = false;

  // 마우스 누름
  $resizer.on('mousedown', function(e) {
    isDragging = true;
    $resizer.addClass('is-dragging');
    $('body').addClass('resizing');
  });

  // 마우스 이동 (전체 document 대상)
  $(document).on('mousemove', function(e) {
    if (!isDragging) return;

    const containerOffsetLeft = $wrapper.offset().left;
    const containerWidth = $wrapper.outerWidth();
    const pointerX = e.clientX - containerOffsetLeft;

    let percentage = (pointerX / containerWidth) * 100;
    percentage = Math.max(15, Math.min(percentage, 85));

    $leftPanel.css('flex', `0 0 ${percentage}%`);
  });

  // 마우스 뗌
  $(document).on('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      $resizer.removeClass('is-dragging');
      $('body').removeClass('resizing');
    }
  });
});

// 평가항목 선택 시 해당 위치 이동 및 하이라이트
$(function () {
  $(document).on('click', '[data-score-target]', function () {
    const targetKey = $(this).data('score-target');
    if (!targetKey) return;

    const $target = $(`[data-score="${targetKey}"]`);

    if ($target.length > 0) {
      $target[0].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      $target.removeClass('highlight-target');
      void $target[0].offsetWidth;
      $target.addClass('highlight-target');

      setTimeout(function () {
        $target.removeClass('highlight-target');
      }, 3000);
    } else {
      console.warn(`[data-score="${targetKey}"] 요소를 찾을 수 없습니다.`);
    }
  });

  // 글로벌 툴팁 이벤트
    $(document).on('mouseenter', '[data-tooltips]', function() {
        var tipText = $(this).attr('data-tooltips');
        if (!tipText) return;

        if ($('#globalTooltip').length === 0) {
            $('body').append('<div id="globalTooltip"></div>');
        }

        var rect = this.getBoundingClientRect();

        // 텍스트 줄바꿈 유지 및 뷰포트 좌표 기준 fixed 배치
        $('#globalTooltip')
            .text(tipText)
            .css({
                top: rect.top + 'px',
                left: (rect.left + (rect.width / 2)) + 'px',
                display: 'block'
            });
    }).on('mouseleave', '[data-tooltips]', function() {
        $('#globalTooltip').hide();
    });
});