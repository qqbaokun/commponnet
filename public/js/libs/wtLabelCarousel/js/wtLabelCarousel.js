/*
 * 容器方法， 需要用wtlabelCarousel的固定容器格式编写
 *  viewWidth
 *  viewHeight
 *
 * */
;(function ( $, window, document, undefined ) {

    var labelCarouselDefaultOptions = {
        // 必填项，容器id
        id: null,
        viewWidth: 600,
        viewHeight: null,
        amTime: 500
    }

    window.wtLabelCarousel = {

        create: function ( options ) {

            var options = $.extend( true, {}, labelCarouselDefaultOptions, options );

            var __elem = $( '#' + options.id );

            if( !__elem.length ){
                return ;
            }

            // 存放各种信息
            __elem.wtlcv = {
                options: options,
                __container: null,
                __wrapper: null,
                amTime: options.amTime,
                css: {
                    margin: __elem.css( 'margin' ),
                    marginLeft:  __elem.css( 'marginLeft' ),
                    marginRight:  __elem.css( 'marginRight' ),
                    marginTop:  __elem.css( 'marginTop' ),
                    marginBottom:  __elem.css( 'marginBottom' )
                },
                containerWidth: options.viewWidth,
                containerHeight: options.viewHeight || __elem.outerHeight()
            }

            wtLabelCarousel._init( __elem, options );

            return __elem ;

        },

        _init:function ( __elem, options ) {

            wtLabelCarousel._wrapper( __elem );

        },
        
        _wrapper: function ( __elem ) {

            var wrapper_html = '<div class="wt-carousel-container" style="overflow: hidden;">'+
                                    '<div class="wt-carousel-wrapper"></div>'+
                                '</div>';
            __elem.wrap( wrapper_html );

            __elem.wtlcv.__container = __elem.closest( '.wt-carousel-container' );
            __elem.wtlcv.__wrapper = __elem.closest( '.wt-carousel-wrapper' );

            wtLabelCarousel.afterWrapper( __elem );

        },
        
        afterWrapper: function ( __elem, options ) {

            var sl = __elem.wtlcv ;

            var __container = sl.__container,
                css = sl.css,
                containerWidth = sl.containerWidth,
                containerHeight = sl.containerHeight;

            __container.outerHeight( containerHeight ).outerWidth( containerWidth ).css( css );

            __elem.show();

        },

        move: function ( __elem, distance, isCover ) {
            var __elem = __elem ,
                sl = __elem.wtlcv,
                __container = sl.__container,
                __wrapper = sl.__wrapper,
                amTime = sl.amTime ;

            var lmt =  -__wrapper.outerWidth() + __container.outerWidth(),
                dis, ft, st ;

            if( isCover ){
                dis = distance ;
            }else{
                dis = __wrapper.position().left + distance
            }

            if( dis >= 0 ){
                ft = 30 ; st = 0;
            }

            if( dis < lmt ){
                if(lmt < 0){
                    ft = lmt - 30 ; st = lmt ;
                }else{
                    ft = -30 ; st = 0 ;
                }
            }

            if( dis < 0 && dis > lmt ){
                ft = dis ;
            }

            console.log( ft, amTime );

           __wrapper.animate( { left: ft }, amTime,'swing',function(){
                if( typeof st != 'undefined'){
                    __wrapper.animate( { left: st }, 200,'swing');
                }
            });

        }

    }


})( jQuery, window, document );