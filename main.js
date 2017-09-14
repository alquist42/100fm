(function () {
    'use strict';
    
    
    var slider, player, stations;
    
    /**
     * Displays logging information on the screen and in the console.
     * @param {string} msg - Message to log.
     */
    function log(msg) {
        var logsEl = document.getElementById('logs');

        if (msg) {
            // Update logs
            console.log('[Radius]: ' + msg);
//            logsEl.innerHTML += msg + '<br />';
        } else {
            // Clear logs
//            logsEl.innerHTML = '';
        }

//        logsEl.scrollTop = logsEl.scrollHeight;
    }
    
    /**
     * Register keys used in this application
     */
    function registerKeys() {
        var usedKeys = [
            'MediaPause',
            'MediaPlay',
            'MediaPlayPause',
            'MediaFastForward',
            'MediaRewind',
            'MediaStop',
            //'ArrowLeft',
            //'ArrowRight',
//            'Enter',
            '0',
            '1',
            '2',
            '3'
        ];

//        console.log(tizen.tvinputdevice.getSupportedKeys());

        usedKeys.forEach(
            function (keyName) {
                tizen.tvinputdevice.registerKey(keyName);
            }
        );
    }


    /**
     * Handle input from remote
     */
    function registerKeyHandler() {
        document.addEventListener('keydown', function (e) {
        	log(e.keyCode);
            switch (e.keyCode) {
                case 13:    // Enter
//                    player.toggleFullscreen();
                    break;
                case 10252: // MediaPlayPause
                case 415:   // MediaPlay
                case 19:    // MediaPause
                    player.playPause();
                    break;
                case 413:   // MediaStop
                    player.stop();
                    break;
                case 417:   // MediaFastForward
                    player.ff();
                    break;
                case 412:   // MediaRewind
                    player.rew();
                    break;
                case 37:   // ArrowLeft
                    slider.goToPrevSlide();
                    break;
                case 39:   // ArrowRight
                    slider.goToNextSlide();
                    break;
                case 38:   // ArrowUp
//                    $('.menu').removeClass('chosen');
//                    $('.bx-wrapper').addClass('chosen');
                    break;
                case 40:   // ArrowDown
//                	$('.bx-wrapper').removeClass('chosen');
//                	$('.menu').addClass('chosen');
                    break;
                case 412:   // MediaRewind
                   // player.rew();
                    break;
                case 48: //Key 0
                    log();
                    break;
                case 49: //Key 1
                    setUhd();
                    break;
                case 50: //Key 2
                    player.getTracks();
                    break;
                case 51: //Key 3
                    player.getProperties();
                    break;
                case 10009: // Return
                    if (webapis.avplay.getState() !== 'IDLE' && webapis.avplay.getState() !== 'NONE') {
                        player.stop();
                    } else {
                        tizen.application.getCurrentApplication().hide();
                    }
                    break;
                default:
                    log("Unhandled key");
            }
        });
    }

    function registerMouseEvents() {
        document.querySelector('.video-controls .play').addEventListener(
            'click',
            function () {
                player.playPause();
                document.getElementById('streamParams').style.visibility = 'visible';
            }
        );
        document.querySelector('.video-controls .stop').addEventListener(
            'click',
            function () {
                player.stop();
                document.getElementById('streamParams').style.visibility = 'hidden';
            }
        );
        document.querySelector('.video-controls .pause').addEventListener(
            'click',
            player.playPause
        );
        document.querySelector('.video-controls .ff').addEventListener(
            'click',
            player.ff
        );
        document.querySelector('.video-controls .rew').addEventListener(
            'click',
            player.rew
        );
        document.querySelector('.video-controls .fullscreen').addEventListener(
            'click',
            player.toggleFullscreen
        );
    }

    /**
     * Display application version
     */
    function displayVersion() {
        var el = document.createElement('div');
        el.id = 'version';
        el.innerHTML = 'ver: ' + tizen.application.getAppInfo().version;
        document.body.appendChild(el);
    }
    
    function createSlider() {
    	$.each(stations, function(index, station){
    		var img = $('<img />', { 
    			src: station.cover,
    			alt: station.name
    		});
    		var div = $('<div class="station"></div>').data('id', index);
    		img.appendTo(div);
//    		log(div.html());
    		div.appendTo($('#slider'));
    	});
    	
    }
    
    function getStation (id) {
    	var res = false;
    	$.each(stations, function(index, station){
//    		log('id: ' + id + ', index: ' + index);
    		if (index == id) {
    			res = station;
    			return false;
    		}
    	});
    	return res;
    }
    
	/**
	 * Function initialising application.
	 */
	
	window.onload = function () {
		
		if (window.tizen === undefined) {
            log('This application needs to be run on Tizen device');
            return;
        }
		
		$.get('http://digital.100fm.co.il/app/', function(data){
			 stations = data.stations;
			 player = $('#audio')[0];
				
				var songField = $('.song'),
					artistField = $('.artist');
				
				displayVersion();
		        registerKeys();
		        registerKeyHandler();
		        createSlider();
		        
		        $('.station').on('click', function() {
		        	var id = $(this).data('id');
		        	var station = getStation(id);
		        	log(id + '::' + station.name);
//		        	player.stop();
		        	player.src = station.audioA;
		        	player.load();
		        	player.play();
		        });
		        
//		        slider = $('#slider').bxSlider({
//		            slideWidth: 315,
//		            minSlides: 5,
//		            maxSlides: 5,
//		            slideMargin: 15,
//		            infiniteLoop: true,
//		            easing: 'ease,',
//		            pager: false,
//		            moveSlides: 1,
//		            onSlideBefore: function($slideElement, oldIndex, newIndex){
//		            	var station = getStation(newIndex);
////		            	log();
////		            	log(station.name);
//		            	var info = $.get(station.info, function(data) {
//		            		songField.html($(data).find('name').text());
//		            		artistField.html($(data).find('artist').text());
//		                }, 'xml');
////		            	player.stop();
//		            	player.src = station.audioA;
//		            	player.load();
//		            	player.play();
//		            	
//		            	log(player.src + ', ispaused: ' + JSON.stringify(player.paused));
//		            },
//		            onSlideAfter: function ($slideElement, oldIndex, newIndex) {
////		            	log($slideElement.attr('class'));
//		                $('.active-slide').removeClass('active-slide');
//		                $slideElement.addClass('active-slide');
//		            },
//		            onSliderLoad: function () {
//		                $('.station').eq(0).addClass('active-slide');
//		            },
//		        });    
		        
		        slider = $('#slider').slick({
		        	  centerMode: true,
		        	  centerPadding: '60px',
		        	  slidesToShow: 5
	        	});
			    
		        player.stop = function() {
		        	this.pause();
		        	this.currentTime = 0;
		        };
		        player.playPause = function () {
		        	var bt = $('.playpause');
		        	if (this.paused) {
		        		this.play();
//		        		bt.addClass('spin');
		        		bt[0].style.webkitAnimationPlayState = "running";
		        	}
		        	else {
		        		this.pause();
//		        		bt.removeClass('spin');
		        		bt[0].style.webkitAnimationPlayState = "paused";
		        	}
		        }
			    player.src = stations[0].audioA;
			    player.loop = true;
			    player.controls = false;
			    player.load();
			    player.play();
			    
//			    log('Current slide: ' + slider.getCurrentSlide());
//		        log('All slides: ' + slider.getSlideCount());
		}, 'json');
		
        
	};

}());