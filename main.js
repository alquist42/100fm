(function () {
    'use strict';
    
    
    var menu, slider, player, stations, current_station, songField, artistField;
    
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
//                    var id = slider.slick('slickCurrentSlide');
                    //log(id);
//                    changeStation(id);
                    menu.set();
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
//                    slider.slick('slickPrev');
                    menu.prev();
                    break;
                case 39:   // ArrowRight
//                    slider.slick('slickNext');
                    menu.next();
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
    
    function render(template, data) {
        var i = 0,
            len = data.length,
            html = '';
        // Replace the {{XXX}} with the corresponding property
        function replaceWithData(data_bit) {
            var html_snippet, prop, regex;
            for (prop in data_bit) {
                regex = new RegExp('{{' + prop + '}}', 'ig');
                html_snippet = (html_snippet || template).replace(regex, data_bit[prop]);
            }
            return html_snippet;
        }
        // Go through each element in the array and add the properties to the template
        for (; i < len; i++) {
            html += replaceWithData(data[i]);
        }
        // Give back the HTML to be added to the DOM
        return html;
    };

    /**
     * Display application version
     */
    function displayVersion() {
        var el = document.createElement('div');
        el.id = 'version';
        el.innerHTML = 'ver: ' + tizen.application.getAppInfo().version;
        document.body.appendChild(el);
    }
    
    function Menu(tab) {
    	var items = ['music', 'talks', 'live', 'list', 'fav'],
    	    item  = tab || items[0],
    	    index = (tab) ? items.indexOf(tab) : 0,
    		itlen = items.length,
    		links = $('.menu').children('div'),
    		tabs  = $('.tab');
    	
    	return {
    		prev: function() {
    			index = items.indexOf(item);
    			if (index == -1) return;
    			if (++index == itlen) index = 0;
    			item = items[index];
    			
    			links.removeClass('active');
    			links.eq(index).addClass('active');
    			
    			return this;
    		},
    		next: function() {
    			index = items.indexOf(item);
    			if (index == -1) return;
    			if (--index < 0) index = (itlen - 1);
    			item = items[index];
    			
    			links.removeClass('active');
    			links.eq(index).addClass('active');
    			
    			return this;
    		},
    		set: function(tab) {
    			item = tab || item;
    			if (!items.includes(item)) return;
    			index = items.indexOf(item);
    			
    			tabs.removeClass('active');
    			tabs.eq(index).addClass('active');
    			log(item);
    			return this;
    		}
    	}
    }
    
    function changeStation(id) {
    	current_station = stations[id];
    	now_playing();
		
		player.src = current_station.audioA;
		player.load();
		player.play();
		
		slider.find('.slick-slide').removeClass('chosen');
		slider.find('.slick-slide.slick-current').addClass('chosen');
    } 
    
    function now_playing() {
    	$.get(current_station.info, function(data) {
			songField.html($(data).find('name').text());
			artistField.html($(data).find('artist').text());
		}, 'xml');
    } 
    
	/**
	 * Function initialising application.
	 */
	
	window.onload = function () {
		
		if (window.tizen === undefined) {
            log('This application needs to be run on Tizen device');
            return;
        }
		
		menu = Menu().set();
		songField   = $('.song'),
		artistField = $('.artist');
		player = $('#audio')[0];
		slider = $('.slider');
		
		$.get('http://digital.100fm.co.il/app/', function(data){
			
			stations = data.stations;
			
			slider.html(render('<div><img src="{{cover}}" alt="{{name}}"/></div>', stations));
	
			registerKeys();
			registerKeyHandler();
		        
	        slider.on('click', '.slick-slide.slick-active', function() {
	        	var id = $(this).data('slick-index');
	        	changeStation(id);
	        	slider.slick('slickGoTo', id);
	        	slider.find('.slick-slide').removeClass('chosen');
	    		$(this).addClass('chosen');
	        });
		   		        
	        slider.on('init', function(slick){
	        	changeStation(0);
				setInterval(now_playing, 30000);
	        });
	        
	        slider.slick({
				 centerMode: true,
				 centerPadding: '0',
				 slidesToShow: 5
	        });
	        
		}, 'json');
		
		player.stop = function() {
        	this.pause();
        	this.currentTime = 0;
        };
        
        player.playPause = function () {
        	var bt = $('.playpause');
        	if (this.paused) {
        		this.play();
//	        		bt.addClass('spin');
        		bt[0].style.webkitAnimationPlayState = "running";
        	}
        	else {
        		this.pause();
//	        		bt.removeClass('spin');
        		bt[0].style.webkitAnimationPlayState = "paused";
        	}
        }
	};
}());