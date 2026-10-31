$(document).ready(function() {
  $('.usr_menu').click(function() {
    $('.usr_menu_list').toggleClass('show');
    $('.usr_menu > .material-symbols-outlined').toggleClass('rotate');
  });

  $('.ring_cnt').first().show();
   
  $('a.d1').click(function(e) {
    //e.preventDefault();
    const $targetCnt = $(this).closest('.ring').parent().next('.ring_cnt');
    $('.ring_cnt').slideUp(200);
    $targetCnt.stop().slideDown(200);
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

$(function () {
  // .marking 내부의 라디오 버튼 선택 변경 시
  $(document).on('change', '.marking input[type="radio"]', function () {
    const $this = $(this);
    const radioName = $this.attr('name');
    const selectedVal = $this.val(); // 체크된 값 (예: "4", "3" ...)

    // 1. 같은 name 그룹의 label active 클래스 갱신
    // $(`.marking input[type="radio"][name="${radioName}"]`)
    //   .next('label')
    //   .removeClass('active');
    // $this.next('label').addClass('active');

    // 2. 상위 .mark_wrap 내의 .marking_amount 텍스트 업데이트
    const $amount = $this.closest('.mark_wrap').find('.marking_amount');

    if ($amount.length > 0 && selectedVal !== undefined) {
      // 소수점 1자리(4.0) 형식으로 표시할 경우:
      const formattedScore = parseFloat(selectedVal).toFixed(1);
      $amount.text(formattedScore);

      // (정수 그대로 표시하려면 아래 코드 사용)
      // $amount.text(selectedVal);
    }
});

  // 페이지 로드 시 이미 체크된 항목이 있을 경우 초기 반영
  $('.marking input[type="radio"]:checked').each(function () {
    const $this = $(this);
    $this.next('label').addClass('active');

    const selectedVal = $this.val();
    if (selectedVal !== undefined) {
      $this.closest('.mark_wrap').find('.marking_amount').text(parseFloat(selectedVal).toFixed(1));
    }
  });
});


// 각 스텝별 입력 진행상태 표기 도넛(링) 인디케이터
function renderProgressRing($container) {
  // jQuery 객체가 아닌 일반 엘리먼트가 넘어왔을 경우를 대비해 래핑
  const $el = $($container);

  // jQuery의 .data()는 dataset 속성을 자동으로 숫자로 변환해 읽어옵니다.
  const total = parseInt($el.data('total'), 10);
  const current = parseInt($el.data('current'), 10) || 0;
  const stepNum = $el.data('step');

  const radius = 15.5;
  const circumference = 2 * Math.PI * radius; // 약 97.38
  const gap = 3; // 조각 사이 간격 (px 단위 길이)

  // 한 조각당 실제 선 길이 = (전체둘레 / 전체조각) - 간격
  const segmentLength = (circumference / total) - gap;

  // 1. 전체 조각(회색 배경) dasharray
  const baseDashArray = `${segmentLength} ${gap}`;

  // 2. 완료된 조각(초록색) dasharray 구성
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

  // SVG 및 숫자 텍스트 삽입 (.html())
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

  // 컨테이너 스타일 지정 (.css())
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
  // 재배유형의 면적 계산
  const $areaInputs = $('.area-input');
  const $ratioElements = $('.ratio-val');
  const $totalArea = $('#total-area');
  const $totalRatio = $('#total-ratio');

  function calculateTotalsAndRatios() {
    let totalArea = 0;

    // 1. 전체 합계 계산
    $areaInputs.each(function() {
      const val = parseFloat($(this).val()) || 0;
      totalArea += val;
    });

    // 합계 표시 (천 단위 쉼표 포함)
    $totalArea.text(totalArea.toLocaleString());

    // 2. 항목별 비율 계산 및 반영
    $areaInputs.each(function(index) {
      const val = parseFloat($(this).val()) || 0;
      const $ratioSpan = $ratioElements.eq(index);

      if (totalArea > 0 && val > 0) {
        // 소수점 첫째 자리까지 표기
        const percentage = ((val / totalArea) * 100).toFixed(1);
        $ratioSpan.text(percentage);
      } else {
        $ratioSpan.text('0.0');
      }
    });

    // 3. tfoot 합계 비율 업데이트
    if ($totalRatio.length) {
      $totalRatio.text(totalArea > 0 ? '100.0%' : '0.0%');
    }
  }

  // 실시간 입력(typing, 화살표 클릭) 이벤트 연결
  $(document).on('input', '.area-input', calculateTotalsAndRatios);


  // textarea 글자 수 계산
  function handleTextarea() {
    const $this = $(this);
    const textLength = $this.val().length;

    // 1. 같은 부모(.textarea-box) 내의 글자 수 카운터 업데이트
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
  const $wrapper =$('#splitWrapper');
  const $leftPanel =$('#leftPanel');
  const $resizer =$('#resizer');

  let isDragging = false;

  // 마우스 누름
  $resizer.on('mousedown', function(e) {
    isDragging = true;
    $resizer.addClass('is-dragging');$('body').addClass('resizing');
  });

  // 마우스 이동 (전체 document 대상)
  $(document).on('mousemove', function(e) {
    if (!isDragging) return;

    const containerOffsetLeft = $wrapper.offset().left;
    const containerWidth = $wrapper.outerWidth();
    const pointerX = e.clientX - containerOffsetLeft;

    // 백분율(%) 계산
    let percentage = (pointerX / containerWidth) * 100;

    // 최소 15%, 최대 85% 범위 제한
    percentage = Math.max(15, Math.min(percentage, 85));

    $leftPanel.css('flex', `0 0 ${percentage}%`);
  });

  // 마우스 뗌
  $(document).on('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      $resizer.removeClass('is-dragging');$('body').removeClass('resizing');
    }
  });
});

// 평가항목 선택 시 해당 위치 이동 및 하이라이트
$(function () {
  // data-score-target 속성을 가진 요소 클릭 이벤트 위임
  $(document).on('click', '[data-score-target]', function () {
    const targetKey = $(this).data('score-target');
    if (!targetKey) return;

    // data-score 값이 일치하는 좌측 요소 탐색
    const $target = $(`[data-score="${targetKey}"]`);

    if ($target.length > 0) {
      // 1. 해당 요소 위치로 부드럽게 스크롤 이동
      $target[0].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // 2. 애니메이션 클래스 초기화 후 재적용
      $target.removeClass('highlight-target');

      // 리플로우(Reflow) 강제 발생으로 연속 클릭 시 애니메이션 재실행 보장
      void $target[0].offsetWidth;

      $target.addClass('highlight-target');

      // 3. 3초 후 강조 클래스 제거
      setTimeout(function () {
        $target.removeClass('highlight-target');
      }, 3000);
    } else {
      console.warn(`[data-score="${targetKey}"] 요소를 찾을 수 없습니다.`);
    }
  });
});