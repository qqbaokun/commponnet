/*
    穿梭框插件
*/

;(function ( $, window, document, undefined ) {

    var defaultOption = {
        text: {
            leftTitle: '未选择',
            rightTitle: '已选择'
        },
        simpleKey:{
            id: 'id',
            name: 'name',
            parentId: 'pId'
        },
        oper:[
            { html:{}, click: null }
        ],
        leftData: null,
        rightData: null
    }

    var transferTpl = {
        layout:
            '<div class="wt-drag-box">'+
                '<div class="drag-item">'+
                    '<div class="drag-item-header">'+
                        '<span>{{text.leftTitle}}</span>'+
           /*             '<div class="fr">'+
                            '<a class="wt-icon240-40 verm"></a>'+
                            '<a class="wt-icon20-40 verm"></a>'+
                        '</div>'+*/
                    '</div>'+
                    '<div class="drag-item-content">'+
                        '{{each leftData as list index}}'+
                            '<div>'+
                            	'{{ if list.length }}'+
                            		'<div id="LD{{list[0].id}}"  uuid="{{list[0].id}}" class="drag-leftItem-header">{{list[0].name}}</div>'+
                            		'<div class="drag-leftItem-wrapper im-hide">'+
		                                '{{ each list as object i }}'+
		                                    '{{ if i > 0 }}'+
		                                        '<div id="LD{{object.id}}"  uuid="{{object.id}}" class="drag-leftItem-content">{{object.name}}</div>'+
		                                    '{{/if}}'+
		                                '{{/each}}'+
	                                '</div>'+
                                '{{/if}}'+
                            '</div>'+
                        '{{/each}}'+
                    '</div>'+
                '</div>'+
                '<div class="drag-oper-item">'+
                    '<div class="drag-button">'+
                        '<span class="wt-icon440-20 verm mt10"></span>'+
                    '</div>'+
                '</div>'+
                '<div class="drag-item">'+
                    '<div class="drag-item-header">'+
                        '<span>{{text.rightTitle}}</span>'+
                    '</div>'+
                    '<div class="drag-item-content drag-item-right-container">' +
                        '{{each rightData as object index}}'+
                            '<div id="RD{{object.id}}"  uuid="{{object.id}}" class="drag-rightItem-content" ><span>{{name}}</span><span class="im-delete wt-icon0-540 verm ml20"></span></div>'+
                        '{{/each}}'+
                    '</div>'+
                '</div>'+
            '</div>',

        rightItem:  '<div id="RD{{id}}"  uuid="{{id}}" class="drag-rightItem-content" ><span>{{name}}</span><span class="im-delete wt-icon0-540 verm ml20"></span></div>'

    }

    window.RCTransfer = {

        create: function( id, options ) {

            var __elem = $( '#' + id ),
            
            	options = $.extend( {}, defaultOption, options );

            if( !__elem.length ){
                return ;
            };

            __elem.RCTransfer = {
                dom: __elem,
                options: options,
                leftData: null,
                rightData: null 
            };
            
            RCTransfer.render( __elem );

            RCTransfer.triggerUpdate( __elem );

            RCTransfer.addListener( __elem );

            return __elem.RCTransfer ;

        },

        init: function( __elem ){

        },
        
        render: function ( __box ) {
        	
        	__box.empty();

            var render = template.compile( transferTpl.layout );

            var leftData = __box.RCTransfer.options.leftData || {},
                rightData = __box.RCTransfer.options.rightData || {};
 
            leftData = RCTransfer.groupData( __box, leftData ) ;

            var html = render( {
                leftData: leftData,
                rightData: rightData,
                text: __box.RCTransfer.options.text
            } );


            __box.RCTransfer.leftData = leftData ;
            __box.RCTransfer.rightData = rightData ;

            __box.append( html );


        },

        groupData : function ( __elem, data ) {

            var result = {},
                data = data,
                simplePId = __elem.RCTransfer.options.simpleKey.parentId,
                simpleId = __elem.RCTransfer.options.simpleKey.id,
                simpleName = __elem.RCTransfer.options.simpleKey.name ;

            if( data.length ){

                $.each(  data, function ( index, object ) {

                    var pId  =  object[ simplePId ],
                        id = object[ simpleId ],
                        name = object[ simpleName ] ;
                    
                    object[ 'id' ] = id ;
                    object[ 'pId' ] = pId ;
                    object[ 'name' ] = name ;
                    
                    // 父级
                    if( !pId ){
                        if( result[ id ] ){
                            result[ id ].splice( 0,0,object );
                        }else{
                            result[ id ] = [ object ] ;
                        }

                    }else{ //子元素就直接加入父元素

                        if( result[ pId ] ){
                            result[ pId ].push( object );
                        }else{
                            result[ pId ] = [ object ] ;
                        }

                    }

                } );

            }

            return result;

        },


        // 同步左侧选中元素
        triggerUpdate: function ( __elem ) {

            var __rightItems = __elem.find( '.drag-rightItem-content' ),
                __leftItems = __elem.find( '.drag-leftItem-content' );

            // 选中的class
            __leftItems.removeClass( 'im-checked' );

            $.map( __rightItems, function ( object, index ) {

                var __item = $( object ),
                    uuid = __item.attr( 'uuid'),
                    __target = __leftItems.filter( '#LD' + uuid );

                if( __target.length ){
                    __target.addClass( 'im-checked' );
                }

            });
            
        },
        
        addListener: function ( __elem ) {

            var cId = __elem.prop( 'id' );
            
            $( document ).on( 'click', '#' + cId + ' .drag-leftItem-header', function () {
            	
            	
            	var __wrapper = $( this ).siblings( '.drag-leftItem-wrapper' );
            	
            	if( __wrapper.hasClass( 'im-show' ) ){
            		
            		__wrapper.removeClass( 'im-show' ).addClass( 'im-hide' );
            		
            	}else{
            		
            		__wrapper.removeClass( 'im-hide' ).addClass( 'im-show' );
            		
            	}
            		

            });

            $( document ).on( 'click', '#' + cId + ' .drag-leftItem-content', function () {
            	
                var __this = $( this ) ;
                
            	if( __this.hasClass( 'im-checked' ) ){
            		return ;
            	}

                __this.addClass( 'im-checked' );

                var uuid = __this.attr( 'uuid' );

                var object = RCTransfer.getDataById( __elem, uuid ) ;
                
                var render = template.compile( transferTpl.rightItem );

                var html = render( object );

                __elem.find( '.drag-item-right-container' ).append( html );

            });
            
            $( document ).on( 'click', '#' + cId + ' .drag-rightItem-content .im-delete', function () {
            	
                var __this = $( this ),
                
                	__parent = __this.closest( '.drag-rightItem-content' ),
                	
                	id = __parent.attr( 'uuid' );
                
                __parent.remove();
                
                __elem.find( '#LD' + id ).removeClass( 'im-checked' );
                

            });
            
        },
        
        getDataById: function ( __elem, uuid ) {

            var data = __elem.RCTransfer.leftData ;

            if( data ){
                
                for( var name in data ){
                	
                	var list = data[ name ] ;
                	
                	for(  var i = 0 ; i <  list.length; i++ ){
                		
                		var object = list[ i ] ;
                		
                        if( object[ 'id' ] == uuid ){
                        	
                            return object ;
                                                        
                        }
                		
                	}
                	
                }

            }

            return null;

        },
        
        // 获取数据
        get: function( instance ){
        	
        	var __elem = instance.dom,
        	
        		result = [] ;
        	
        	if( __elem && __elem.length ){
        		
        		var __items = __elem.find( '.drag-rightItem-content' ) ;
        		
        		if( __items.length ){
        			
        			$.map( __items, function( __item, index ){
        				
        				result.push( $(__item).attr( 'uuid' ) );
        				
        			} );
        			
        			return result ;
        			
        		}else{
        			
        			return null;
        		}
        		
        		
        	}
        	
        	
        },
                
        // 新增
        add: function( instance, data ){
        	
        	var newData = RCTransfer.groupData( data );
        	
        	var __elem = instance.dom ;
        	
        	$.extend( true, instance.leftData, newData );
        	
            RCTransfer.render( __elem );

            RCTransfer.triggerUpdate( __elem );
        	
        	
        }
        
        

    }

})( jQuery, window, document );