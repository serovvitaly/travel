$(document).ready(function(){

	$('.carousel').carousel({
	    interval: 12000
  	})

	/* задаем количество слайдов в слайдере */
	var win_width = $(window).width();
		$(".sliderkit").sliderkit({
	    shownavitems:4,
	    scroll:1,
	    auto:false,
	    circular:false
	  });

	if (win_width >= 1200) {
	  $('#carousel-main').sliderkit({
	      shownavitems:4,
	      auto:false
	  });
	} else if (979 < win_width && win_width < 1200) {
	  $('#carousel-main').sliderkit({
	      shownavitems:4,
	      auto:false
	  });
	} else  if (768 < win_width && win_width < 979) {
	  $('#carousel-main').sliderkit({
	      shownavitems:3,
	      auto:false
	  });
	} else if (480 < win_width && win_width < 768) {
	  $('#carousel-main').sliderkit({
	      shownavitems:2,
	      auto:false
	  });
	} else if (win_width < 480) {
	  $('#carousel-main').sliderkit({
	      shownavitems:1,
	      auto:false
	  });
	}

	function hexFromRGB(r, g, b) {
		var hex = [
			r.toString( 16 )
		];
		$.each( hex, function( nr, val ) {
			if ( val.length === 1 ) {
				hex[ nr ] = "0" + val;
			}
		});
		return hex.join( "" ).toUpperCase();
	}
	function refreshSwatch() {
		var red = $( ".slider" ).slider( "value" ),
			hex = hexFromRGB( red );
	}
	
	$( ".slider" ).slider({
		orientation: "horizontal",
		range: "min",
		max: 100,
		value: 50
	});
	
	$( ".slider.sliderType1" ).slider( "value", 60 );
	$( ".slider.sliderType2" ).slider( "value", 0 );

	//$.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );
	$( ".datepicker" ).datepicker({
        onSelect: function (date, inst) {
            if (date == 'NaN.NaN.NaN') {
                return;
            }
            var months = ['','янв','дек','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
            var tg = $(this).hasClass('dp2') ? '#tw-to' : '#tw-from';
            var btn = $(tg).next('button');
            btn.children('h3').html(date.split('.')[0]);
            btn.children('h4').html(months[date.split('.')[1] * 1]);
            
            $('.calendar').toggle();
        }
    });

	$('.datepicker .ui-state-default').append('<span class="grad"></span>');

	$('.calend .btn, .input-append .btn').click(function(){
		$(this).parent().parent().find('.calendar').toggle();
	});

	$('.dynDateGraph li').hover(function(){
		$('.dynDateGraph').find('div.price').remove();
		$('.dynDateGraph li.active').removeClass('active');
		$(this).addClass('active').prepend('<div class="price">230 $</div>');
	})

	$('#regOpen').click(function(){
		$('.regOn, unReg').toggle();
	});
})