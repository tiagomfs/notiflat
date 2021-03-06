/*
 * notiflat 
 * version: 0.1
 * homepage: code.tiagomfs.net/notiflat/
 *
 * Licensed under the MIT license
 *      http://www.opensource.org/licenses/mit-license.php
 *
 * Simple (& Flat) Notification for jQuery
 *
*/

;(function ( $, window, document, undefined ) {
    
    $.notiflat = function(message, options)
    {
        /* defaults */

        var types = ['success','warning','loading','info','error'],
            
            settings = $.extend({
                type: (typeof options === 'string' && $.inArray(options, types) != '-1' ? options : 'success'),
                position: 'top left',
                timeout: 4000,
                animation: 'fade',
                animationSpeed: 'slow',
                animateIn: null,
                animateOut: null,
                close: 'button',
                classes: null,
                onClose: function() {},
                onStart: function() {}
            }, options);

            if(settings.type == 'loading'){
                message = (message.length > 0 ? message : 'Loading...');
                var $loading = true;
            }

            var $animation = {};
            
            if(!settings.animateIn){
                if(settings.animation == 'fade'){
                    $animation['opacity'] = "toggle";
                } else if(settings.animation == 'slide' || settings.animation){
                    $animation['height'] = "toggle";
                }
            }

        /* end */

        settings.onStart.call(this);

        if($('[class="notiflat ' + settings.position + '"]').length == 0){

            $aside = '<aside class="notiflat ' + settings.position + '"></aside>';
            $('body').append($aside);

        }

        _makeid = function()
        {
            var text = "";
            var possible = "0123456789";

            for( var i=0; i < 16; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };

        var notification_id = 'go-' + _makeid();

        $holder = $('[class="notiflat ' + settings.position + '"]');
        $template = '<article id="' + notification_id + '" class="notification ' + settings.type + ' ' + (settings.close == 'self' ? 'close' : '') + ' ' + (settings.classes ? settings.classes : '') + '"><section>' + message + ' ' + (settings.close == 'button' && !$loading ? '<i class="fa fa-times-circle"></i>' : '' ) + '</section></article>';
        $holder.append($template);

        $notification = $("#" + notification_id);
        if(settings.animateIn){ 
            $notification.show().addClass('animated ' + settings.animateIn);
        } else {
            $notification.animate($animation, settings.animationSpeed); 
        }

        /* functions */

        var $close = $('#' + notification_id + ' section i, #' + notification_id + '.close'),
            
            _timer = function(time, update, complete){
                var start = new Date().getTime();
                var interval = setInterval(function() {
                    var now = time-(new Date().getTime()-start);
                    if( now <= 0) {
                        clearInterval(interval);
                        complete();
                    }
                    else update(Math.floor(now/1000));
                }, 100);
            },
            
            _close = function()
            {
                settings.onClose.call(this);

                if(settings.animateOut)
                {
                    $("#" + notification_id).addClass(settings.animateOut);

                    setTimeout(function(){
                        $("#" + notification_id).remove();
                        if($holder.find('article').length == 0){
                            $holder.remove();
                        }
                    }, 1000);
                    
                }
                else
                {
                    $("#" + notification_id).animate($animation, settings.animationSpeed, function(){
                        $(this).remove();
                        if($holder.find('article').length == 0){
                            $holder.remove();
                        }
                    });
                }
            };

        /* binds */

        $close.on("click", function(){ 
            _close(); 
        });

        if(!$loading){
            
            if(settings.timeout){
                _timer( settings.timeout, function(sec){ 
                    /* sec returns the seconds remaining */ 
                }, function(){ 
                    _close()
                });
            }   

        };
        
        return {
            close: _close
        }; 
    };

})( jQuery, window, document );