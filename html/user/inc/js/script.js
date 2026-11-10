$(document).ready(function() {
  $('.usr_menu').click(function() {
    $('.usr_menu_list').toggleClass('show');
    $('.usr_menu > .material-symbols-outlined').toggleClass('rotate');
  });

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

  $('.marking input[type="radio"]:checked').each(function () {
    const $this = $(this);
    $this.next('label').addClass('active');

    const selectedVal = $this.val();
    if ($selectedVal !== undefined) {
      $this.closest('.mark_wrap').find('.marking_amount').text(parseFloat(selectedVal).toFixed(1));
    }
  });

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
        <circle cx="18" cy="18" r="${radius}" fill="none" stroke="#4e8be6" stroke-width="3.5" 
                stroke-dasharray="${baseDashArray}" />
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
  function formatNumber(val) {
    if (!val && val !== 0) return '';
    var num = val.toString().replace(/,/g, '');
    if (isNaN(num)) return val;
    return Number(num).toLocaleString('ko-KR');
  }

  function calculateTableArea() {
    const $table = $(this).closest('table');
    let totalArea = 0;

    $table.find('.area-input').each(function() {
      const rawVal = $(this).val().toString().replace(/,/g, '');
      const val = parseFloat(rawVal) || 0;
      totalArea += val;
    });

    $table.find('#total-area, #total-land-area, tfoot .taright span').first().text(totalArea.toLocaleString());

    const $ratioSpans = $table.find('.ratio-val');
    if ($ratioSpans.length > 0) {
      $table.find('.area-input').each(function(index) {
        const rawVal = $(this).val().toString().replace(/,/g, '');
        const val = parseFloat(rawVal) || 0;
        const percentage = (totalArea > 0 && val > 0) ? ((val / totalArea) * 100).toFixed(1) : '0.0';
        $ratioSpans.eq(index).text(percentage);
      });

      const $totalRatio = $table.find('#total-ratio');
      if ($totalRatio.length) {
        $totalRatio.text(totalArea > 0 ? '100.0' : '0.0');
      }
    }
  }

  $('table input[type="number"], .bg_load input, input.bg_load, .bg_load span').each(function() {
    var $this = $(this);
    if ($this.is('input')) {
      $this.attr('type', 'text');
      var val = $this.val();
      if (val && !isNaN(val.toString().replace(/,/g, '')) && val.toString().indexOf('%') === -1) {
        $this.val(formatNumber(val));
      }
    } else {
      var txt = $this.text().trim();
      if (txt && !isNaN(txt.replace(/,/g, '')) && txt.indexOf('%') === -1) {
        $this.text(formatNumber(txt));
      }
    }
  });

  $(document).on('focus', 'table tbody input, table tfoot input', function() {
    var $this = $(this);
    if ($this.attr('type') === 'number') {
      $this.attr('type', 'text');
    }
  });

  $(document).on('input', 'table tbody input, table tfoot input', function() {
    var $this = $(this);
    var placeholder = $this.attr('placeholder') || '';
    var colIdx = $this.closest('td').index();
    var $th = $this.closest('table').find('thead th').eq(colIdx);
    var thText = $th.text() || '';

    if (thText.indexOf('비중') > -1) {
      if ($this.hasClass('area-input')) {
        calculateTableArea.call(this);
      }
      return;
    }

    if (placeholder.indexOf('예:') > -1 || placeholder.indexOf('입력') > -1 || placeholder.indexOf('재배') > -1) {
      return;
    }

    var curVal = $this.val();
    if (!curVal) return;

    var cleanVal = curVal.replace(/[^0-9.]/g, '');
    if (cleanVal === '') {
      $this.val('');
    } else {
      var parts = cleanVal.split('.');
      parts[0] = Number(parts[0]).toLocaleString('ko-KR');
      $this.val(parts.join('.'));
    }

    if ($this.hasClass('area-input')) {
      calculateTableArea.call(this);
    }
  });

  function handleTextarea() {
    const $this = $(this);
    const textLength = $this.val().length;

    const $countEl = $this.closest('.tbl_wrap').find('.word_cnt span');
    $countEl.text(textLength.toLocaleString());

    $this.css('height', 'auto');
    $this.css('height', this.scrollHeight + 'px');
  }

  $(document).on('input propertychange', '.auto-textarea', handleTextarea);

  $('.auto-textarea').each(function() {
    handleTextarea.call(this);
  });
});

$(function() {
  const $wrapper = $('#splitWrapper');
  const $leftPanel = $('#leftPanel');
  const $resizer = $('#resizer');

  let isDragging = false;

  $resizer.on('mousedown', function(e) {
    isDragging = true;
    $resizer.addClass('is-dragging');
    $('body').addClass('resizing');
  });

  $(document).on('mousemove', function(e) {
    if (!isDragging) return;

    const containerOffsetLeft = $wrapper.offset().left;
    const containerWidth = $wrapper.outerWidth();
    const pointerX = e.clientX - containerOffsetLeft;

    let percentage = (pointerX / containerWidth) * 100;
    percentage = Math.max(15, Math.min(percentage, 85));

    $leftPanel.css('flex', `0 0 ${percentage}%`);
  });

  $(document).on('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      $resizer.removeClass('is-dragging');
      $('body').removeClass('resizing');
    }
  });
});

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

  $(document).on('mouseenter', '[data-tooltips]', function() {
    var tipText = $(this).attr('data-tooltips');
    if (!tipText) return;

    if ($('#globalTooltip').length === 0) {
      $('body').append('<div id="globalTooltip"></div>');
    }

    var rect = this.getBoundingClientRect();

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