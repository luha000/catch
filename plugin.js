var oldEle = document.getElementById('sizePane');

console.log(oldEle);

if(!oldEle) {
   var selectDom = null;
   var domData = {

   };
   var enableSizeSign = true;

   $('body').append('<div id="sizePropsPane" mouseoverType="back">' +
      '<div class="prop-title" mouseoverType="back"></div>' +
      '<div class="prop-content-1" mouseoverType="back">' +
      '<div class="prop-item" mouseoverType="back">' +
      '<div class="prop-label" mouseoverType="back">标签</div>' +
      '<div class="prop-value" mouseoverType="back">' +
      '<span mouseoverType="back" class="tag selected" key="title">标题</span>' +
      '<span mouseoverType="back" class="tag" key="content">正文</span>' +
      '<span mouseoverType="back" class="tag" key="previous">上一页</span>' +
      '<span mouseoverType="back" class="tag" key="next">下一页</span>' +
      '<span mouseoverType="back" class="tag" key="contentList">列表</span>' +
      '<span mouseoverType="back" class="tag" key="contentItem">列表项</span>' +
      '<span mouseoverType="back" class="tag" key="other">其他</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="prop-content" mouseoverType="back">' +
      '</div>' +
      '<div class="prop-footer" mouseoverType="back"><div class="prop-save" mouseoverType="back">保存</div></div>' +
      '</div>');

   $('body').append('<div id="sizePane"><div id="sizeTag"></div><div id="sizeBtn"></div></div>');
   $('body').append('<div id="sizeToast">保存成功！</div>');
   window.focus();

   $(document).keydown(function (event) {
      if (event.keyCode == 13) {
         console.log('----click===');

         $('#sizePropsPane').css({
            display: 'none'
         });

         $('#sizePane').css({
            display: 'none'
         });

         enableSizeSign = !enableSizeSign;

         $('#sizeToast').html(enableSizeSign ? '开启标注' : '关闭标注');
         $('#sizeToast').animate({
            opacity: 1,
            top: 10
         });

         setTimeout(function () {
            $('#sizeToast').animate({
               opacity: 0,
               top: -50
            });
         }, 2000)
      }
   });

   $("body").mouseover(function (e) {
      if (!enableSizeSign) {
         return;
      }
      e.stopPropagation();

      if ($(e.target).attr('mouseoverType') == 'back') {
         return;
      }

      var box = e.target.getBoundingClientRect();
      var domValue = '标识:' + $(e.target)[0].localName + '#' + $(e.target)[0].id + '.' + $(e.target)[0].className
         + '<br/> 尺寸:' + (box.width).toFixed(0) + 'px X' + (box.height).toFixed(0)
         + 'px' + '<br/> 位置:左_' + (box.x + $(document).scrollLeft()).toFixed(0) + 'px 上_' + (box.y + $(document).scrollTop()).toFixed(0) + 'px' + '<br/>点击左键标记';
      $('#sizeTag').html(domValue);

      $('#sizePane').css({
         left: box.x + $(document).scrollLeft(),
         top: box.y + $(document).scrollTop(),
         width: box.width,
         height: box.height,
      });

      if ($('#sizePane').css('display') == 'none') {
         $('#sizePane').css({
            display: 'block'
         });
      }

      var boxTag = $('#sizeTag')[0].getBoundingClientRect();

      if (box.top < 80) {
         $('#sizeTag').css({
            bottom: -80,
            top: box.height
         });
      }
      else {
         $('#sizeTag').css({
            top: -80,
            bottom: box.height
         });
      }

      if (200 > box.width) {
         $('#sizeTag').css({
            right: 0,
            left: box.width - 200
         });
      }
      else {
         $('#sizeTag').css({
            left: 0,
            right: box.width - 200
         });
      }

      selectDom = e.target;
   });

   $("body").click(function (e) {
      if (!enableSizeSign) {
         return;
      }

      if ($(e.target).attr('mouseoverType') == 'back') {
         return;
      }

      e.stopPropagation();
      e.preventDefault();
      console.log(e.target);

      var box = selectDom.getBoundingClientRect();

      $('#sizePropsPane').css({
         display: 'block'
      });

      var titleValue = '标识:' + selectDom.localName + ' ID:' + selectDom.id + ' CLASS:' + selectDom.className

      $('#sizePropsPane .prop-title').html(titleValue);
      var oStyle = selectDom.currentStyle ? selectDom.currentStyle : window.getComputedStyle(selectDom);

      var oStyle =

         $('#sizePropsPane .prop-content').empty();

      $('#sizePropsPane .prop-content').append('<div class="prop-item" mouseoverType="back">' +
         '<div class="prop-label" mouseoverType="back">宽度</div>' +
         '<div class="prop-value" mouseoverType="back">' + (box.width).toFixed(0) + 'px </div>' +
         '</div>');

      $('#sizePropsPane .prop-content').append('<div class="prop-item" mouseoverType="back">' +
         '<div class="prop-label" mouseoverType="back">高度</div>' +
         '<div class="prop-value" mouseoverType="back">' + (box.height).toFixed(0) + 'px </div>' +
         '</div>');

      $('#sizePropsPane .prop-content').append('<div class="prop-item" mouseoverType="back">' +
         '<div class="prop-label" mouseoverType="back">左边距离</div>' +
         '<div class="prop-value" mouseoverType="back">' + (box.x + $(document).scrollLeft()).toFixed(0) + 'px </div>' +
         '</div>');

      $('#sizePropsPane .prop-content').append('<div class="prop-item" mouseoverType="back">' +
         '<div class="prop-label" mouseoverType="back">上边距离</div>' +
         '<div class="prop-value" mouseoverType="back">' + (box.y + $(document).scrollTop()).toFixed(0) + 'px </div>' +
         '</div>');

      domData = {
         key: titleValue + '-' + new Date().getMilliseconds(),
         width: (box.width).toFixed(0),
         height: (box.height).toFixed(0),
         left: (box.x + $(document).scrollLeft()).toFixed(0),
         top: (box.y + $(document).scrollTop()).toFixed(0),
         tag: 'title'
      }
      // for(let styleKey in oStyle) {
      //    if(oStyle[styleKey] && isNaN(styleKey) && styleKey.indexOf('webkit') < 0 && oStyle[styleKey].indexOf('normal') < 0 && oStyle[styleKey].indexOf('none') < 0 && oStyle[styleKey].indexOf('auto') < 0) {
      //       $('#sizePropsPane .prop-content').append('<div class="prop-item" mouseoverType="back">' +
      //          '<div class="prop-label" mouseoverType="back">' + styleKey + '</div>' +
      //          '<div class="prop-value" mouseoverType="back">'+ oStyle[styleKey] + ' </div>' +
      //       '</div>');
      //    }
      // }
   });

   $(document).scroll(function (e) {
      if (!enableSizeSign) {
         return;
      }

      if ($(e.target).attr('mouseoverType') == 'back') {
         return;
      }

      $('#sizePane').css({
         display: 'none'
      });

      selectDom = null;

      $('#sizePropsPane').css({
         display: 'none'
      });
   });

   $("#sizePropsPane .prop-save").click(function (e) {
      console.log('====save====');

      $('#sizePropsPane').css({
         display: 'none'
      });

      selectDom = null;

      $.ajax({
         url: 'http://localhost:8000/data',
         data: JSON.stringify(domData),
         type: 'post',
         dataType: 'json',
         contentType: 'text/json,charset=utf-8',
         complete: function (res) {
            console.log(res);
            if (res.status == 200) {
               $('#sizeToast').animate({
                  opacity: 1,
                  top: 10
               });

               setTimeout(function () {
                  $('#sizeToast').animate({
                     opacity: 0,
                     top: -50
                  });
               }, 2000)
            }
         }
      });
   });

   $("#sizePropsPane .tag").click(function (e) {
      console.log(e.target);

      $('#sizePropsPane .tag.selected').removeClass('selected');
      $(this).addClass('selected');
      domData.tag = $(this).attr('key');
   });
}