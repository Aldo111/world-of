var grown = false;
var exploreOn = false;
var relateOn = false;
var createOn = false;

$(document).ready(function() {
	
	$(document).one('click', function() {
		$('.tags1').fadeOut(1500, function() {
			$('.tags2').fadeIn(1500);
			$('.start-triangle').fadeIn(1500);
			grown = true;
		});
	});
	
	$('#explore2Wrapper').on('click', function() {
		if (grown && !exploreOn) {
			$('#explore-up').hide();
			$('.move').animate({'top': '+=83vh'}, 1500, 'swing');
			$('#defaultCanvas0').animate({'top': '+=50vh'}, 1500, 'swing', function() {
				$('#explore-down').show();
			});
			exploreOn = true;
		}
		else if (grown && exploreOn) {
			$('#explore-down').hide();
			$('.move').animate({'top': '-=83vh'}, 1500, 'swing');
			$('#defaultCanvas0').animate({'top': '-=50vh'}, 1500, 'swing', function() {
				$('#explore-up').show();
			});
			exploreOn = false;
		}
	});
	
	$('#relate2Wrapper').on('click', function() {
		if (grown && !relateOn) {
			$('#relate-left').hide();
			$('.move').animate({'left': '+=83vw'}, 1500, 'swing');
			$('#defaultCanvas0').animate({'left': '+=50vw'}, 1500, 'swing', function() {
				$('#relate-right').show();
			});
			relateOn = true;
		}
		else if (grown && relateOn) {
			$('#relate-right').hide();
			$('.move').animate({'left': '-=83vw'}, 1500, 'swing');
			$('#defaultCanvas0').animate({'left': '-=50vw'}, 1500, 'swing', function() {
				$('#relate-left').show();
			});
			relateOn = false;
		}
	});
	
	$('#create2Wrapper').on('click', function() {
		if (grown && !createOn) {
			$('#create-right').hide();
			$('.move').animate({'left': '-=83vw'}, 1500, 'swing');
			$('#defaultCanvas0').animate({'left': '-=50vw'}, 1500, 'swing', function() {
				$('#create-left').show();
			});
			createOn = true;
		}
		else if (grown && createOn) {
			$('#create-left').hide();
			$('.move').animate({'left': '+=83vw'}, 1500, 'swing');
			$('#defaultCanvas0').animate({'left': '+=50vw'}, 1500, 'swing', function() {
				$('#create-right').show();
			});
			createOn = false;
		}
	});
	
	$('#explore2Wrapper').hover( function() {
		$('.explore-triangle').css('opacity', '1'); }, 
		function(){ $('.explore-triangle').css('opacity', '0.2'); 
	});
	
	$('#create2Wrapper').hover( function() {
		$('.create-triangle').css('opacity', '1'); }, 
		function(){ $('.create-triangle').css('opacity', '0.2'); 
	});
	
	$('#relate2Wrapper').hover( function() {
		$('.relate-triangle').css('opacity', '1'); }, 
		function(){ $('.relate-triangle').css('opacity', '0.2'); 
	});
	
});