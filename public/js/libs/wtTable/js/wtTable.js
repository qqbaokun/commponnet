;(function ( $, window, document, undefined ) {

    window.tableRequest = {

        defaultOptions: {
            // 必须 container_id
            container_id: null,
            // 必须, url
            url: null,
            // 额外参数
            otherParam: null,
            //搜索条件
            searcherParam: null,
            // 必须
            currentField: null,
            // 必须,每页显示的数据数
            pageNumField: null,
            // 绑定翻页之前的回调
            beforePageCallback:null,
            // 翻页请求的回调
            pageRequestCallback: null,
            // 请求参数处理
            paramCallback: null
        },

        create: function ( options ) {

            var options = $.extend( true, {}, tableRequest.defaultOptions, options );

            var __table__box = $( '#' + options.container_id ) ;

            if( !__table__box.length ) return ;

            tableRequest.beforePageCallback( __table__box, options );

        },

        beforePageCallback: function ( __table__box, options ) {

           if( typeof options.beforePageCallback === 'function' ){
                tableRequest.request( __table__box, options.url, $.extend( {}, options.otherParam, options.initParam, options.searcherParam ), options.beforePageCallback, options );
            }

        },

        // paramCallback 对外提供用来处理param
        request: function ( __table, url, param , callback, options) {

            var param = typeof options.paramCallback === 'function' ? options.paramCallback( param, options ) : param ;

           $.ajax( {
                url: url,
                type: 'post',
                data: param,
                success: function ( data ) {

                    if( typeof callback == 'function' ){

                        callback( __table, data, options );

                    }

                }

            } );

        },


        refresh: function ( options ) {

            tableRequest.create( options );

        },

        tablesInfo: function ( __table__box ) {

        },

        bindPages: function ( __table__box, options ) {

            var isFirstPage = function(){
                    var _tableData = __table__box.find( '#table_info_list' );
                    return _tableData.attr( 'isFirstPage' );
                },

                isLastPage = function() {
                    var _tableData = __table__box.find( '#table_info_list' );
                    return _tableData.attr('isLastPage');
                },

                currentPage =  function() {
                    var _tableData = __table__box.find( '#table_info_list' );

                    return _tableData.attr('currentPage');
                },

                pageSize = function () {
                    var _tableData = __table__box.find( '#table_info_list' );
                    return _tableData.attr('pageSize');
                },

                pageNum = function() {
                    var _tableData = __table__box.find( '#table_info_list' );

                    return _tableData.attr( 'pageNum' ) ;
                }

            var url =  options.url ,

                callback= options.pageRequestCallback,

                condition = $.extend( true, {}, options.otherParam, options.searcherParam );

            var __pageBar = __table__box.find( '.table_page_bar' );

            __pageBar.find( '.first' ).on( 'click', function () {

                if( isFirstPage() === '1' ) {
                    return ;
                }
                condition[ options.pageNumField ] = pageNum();

                condition[ options.currentField ] = 1;
                
                condition = initPageCondition(condition);

                tableRequest.request( __table__box, url, condition, callback, options );

            } );
            __pageBar.find( '.prev' ).on( 'click', function () {

                if( isFirstPage() === '1' ) return ;

                condition[ options.pageNumField ] = pageNum();

                condition[ options.currentField ] = parseInt( currentPage() ) - 1;
                
                condition = initPageCondition(condition);

                tableRequest.request( __table__box, url, condition, callback, options  )

            } );
            __pageBar.find( '.next' ).on( 'click', function () {

                if( isLastPage() === '1') return ;

                condition[ options.pageNumField ] = pageNum();

                condition[ options.currentField ] = parseInt( currentPage() ) + 1;
                
                condition = initPageCondition(condition);

                tableRequest.request( __table__box, url,condition, callback, options  )

            } );

            __pageBar.find( '.last' ).on( 'click', function () {

                if( isLastPage() === '1') return ;

                condition[ options.pageNumField ] = pageNum();

                condition[ options.currentField ] = parseInt( pageSize() );
                
                condition = initPageCondition(condition);

                tableRequest.request( __table__box, url,condition, callback, options  );

            } );

            var numOptions = {
                defaultSelected: pageNum(),
                skin: 'search-select',
                data: [
                    {text: '10条' , value: '10'},
                    {text: '15条' , value: '15'},
                    {text: '20条' , value: '20'},
                    {text: '30条' , value: '30'}
                ],
                changedListener: function ( data, option, fullData ) {

                    condition[ options.pageNumField ] = data.value;

                    condition[ options.currentField ] = 1;
                    
                    condition = initPageCondition(condition);
                    
                    tableRequest.request( __table__box, url,condition, callback, options  );
                }

            }

            var instance = wtSelect.create( __pageBar.find( '.num' ), numOptions );


            var pageData = [];
            var page_size = pageSize();
            for( var i = 0; i < page_size; i++ ){
                pageData.push( { text: i + 1 + '/' + page_size, value:  i + 1 } );
            }

            var pageOptions = {
                defaultSelected: currentPage(),
                skin: 'search-select',
                data: pageData,
                changedListener: function ( data, option, fullData ) {

                    condition[ options.pageNumField ] = pageNum();

                    condition[ options.currentField ] = data.value;
                    
                    condition = initPageCondition(condition);
                    
                    tableRequest.request( __table__box, url,condition, callback, options  );
                }

            }

            var instance = wtSelect.create( __pageBar.find( '.page' ), pageOptions );

        }


    }

            /*表格初始化方法*/
    window.tableRender = {

        defaultOptions:{
            table_id: null,
            rowsDbClick: {
                beforeDblClickCallback: null
            },
            elemHover: {
                show: null,
                hide: null
            }
        },

        draw: function ( __template, options ) {

            var options = $.extend( true, {}, tableRender.defaultOptions, options )

            var __table__box = $( '#' + options.table_id ) ;

            __table__box.empty().append(  __template );

            if( !__table__box.length ) return ;

            tableRender.rowsDbClick( __table__box, options.rowsDbClick.beforeDblClickCallback );

            tableRender.operation( __table__box  );

            tableRender.mouseOver( __table__box, options );

        },

        checkbox: function ( __table__box ) {


        },

        /*操作按钮效果*/
        operation : function ( __table__box ) {

            var __table = __table__box;

            __table.find( 'td .wt-table-name-oper' ).on( 'click', function () {

                var __popMenu = $( this ).siblings( '.popTdOper' );

                var __popMenu__ =  __popMenu.html();

                // 创建弹窗插件
                var pop = wtDialog.popover( { content: __popMenu__, selector: $( this ),align:"right"} );

                pop.show();

            } );

        },

        /*鼠标悬浮效果*/
        mouseOver: function ( __table_box, options  ) {

            var hoverShowCallback = options.elemHover.show,
                hoverHideCallback = options.elemHover.hide;

            var __hover = __table_box.find( '.table_hover_selector' ) ;

            __hover.hover( function () {
                if( typeof hoverShowCallback  === 'function'){
                    hoverShowCallback( this );
                }
            }, function () {
                if( typeof hoverHideCallback  === 'function') {
                    hoverHideCallback(this);
                }
            } );

        },

        // 行双击效果
        rowsDbClick : function ( __table__box, beforeDblClickCallback ) {
            var __table = __table__box;

            __table.find( 'tr.showRow' ).on( 'dblclick', function () {

                var __hideRow = $( this ).next( '.hideRow' );

                // 只会执行一次
                // 由于数据都再模板中渲染， 导致表格数据无法直接传递， 需要通过渲染在节点上， 获取后再传递
                if( typeof beforeDblClickCallback == 'function' &&  !__hideRow.attr( 'isPast' ) ){
            	var rowNumIndex = $(this).attr('rowIndex');
                var applyId = $(this).find('td').find("input[name='applyId_"+rowNumIndex+"']").val();
            	var resumeId =  $(this).find('td').find("input[name='resumeId_"+rowNumIndex+"']").val();
                beforeDblClickCallback( __hideRow.find( 'td' ),applyId,resumeId);
                    __hideRow.attr( 'isPast', '1' );
                }

                if( __hideRow.is( ':hidden' ) ){
                    __hideRow.show();
                }else{
                    __hideRow.hide();
                }
            } );


        }

    }

    var tablesGroupOperationsOptions = {
        id: null,
        data: null,
        pages: [1,1,1,1,1,1],
        switchModeCallback: null,
        fullScreenCallback: null,
        prevPageCallback: null,
        nextPageCallback: null
    }

    window.tablesGroupOperations = {

        create: function ( options ) {

            var options = $.extend( true, {}, tablesGroupOperationsOptions, options );

            var __container = $( '#' + options.id ) ;

            if( !__container.length ){
                return ;
            }

            tablesGroupOperations.render( __container, options );

            tablesGroupOperations.afterRender( __container, options );

        },

        /*工具条模板信息*/
        template: {
            html:
                '<div class="wt-table-tools">'+
                    '{{ if left }}'+
                    '<div class="leftpart">'+
                        '<div class="inlblock">' +
                            '{{each left as value i}}'+
                                '{{if value.name == "下一阶段" }}'+
                                    '<div id="tableTools_next_oper" class="wt-button-4 mr10">'+
                                        '<a id="tableTools_next_oper_text" href="{{value.value}}">下一阶段</a><span id="tableTools_next_oper_up"><i></i></span>'+
                                    '</div>'+
                                    '{{if value.child}}'+
                                    '<div id="tableTools_next_oper_hide">'+
                                    '<ul>'+
                                    '{{each value.child as child j}}'+
                                    '<li><a href="{{child.value}}">{{child.name}}</a></li>'+
                                    '{{/each}}'+
                                    '</ul>'+
                                    '</div>'+
                                    '{{/if}}'+
                                '{{else}}'+
                                    '{{if i < 5 }}'+
                                    '<a class="wt-button-3 mr10" onclick="{{value.href}}">{{value.name}}</a>'+
                                    '{{/if}}'+
                                    '{{if i == 5 & left.length > 5}}'+
                                    '<select onchange="selectOnChange(this,"pageform");" id="tableTools_select_more_oper">'+
                                    '<option value="">更多</option>'+
                                    '{{/if}}'+
                                    '{{if i >= 5}}'+
                                    '<option value="{{value.href}}">{{value.name}}</option>'+
                                    '{{/if}}'+
                                    '{{if i >= 5 & left.length == (i + 1) }}'+
                                    '</select>'+
                                    '{{/if}}'+
                                '{{/if}}'+
                            '{{/each}}'+
                        '</div>'+
                    '</div>'+
                    '{{/if}}'+
                    '{{ if right }}'+
                    '<div class="rightpart">'+
                        '{{each right as value i}}'+
                        '{{if value == "1" & i == 0}}<i class="icon-sort"></i>{{/if}}'+
                        '{{if value == "1" & i == 1}}<i class="icon-switch" id="switch"></i>{{/if}}'+
                        '{{if value == "1" & i == 2}}<i class="icon-fullscreen" id="fullscreen" title="全屏"></i>{{/if}}'+
                        '{{if value == "1" & i == 3}}<i class="icon-set"></i>{{/if}}'+
                        '{{if value == "1" & i == 4}}<i class="icon-prev"></i>{{/if}}'+
                        '{{if value == "1" & i == 5}}<i class="icon-next"></i>{{/if}}'+
                        '{{/each}}'+
                    '</div>'+
                    '{{/if}}'+
                '</div>'
        },

        /*渲染批量工具条*/
        render: function ( __container, options ) {

            var templateHtml = tablesGroupOperations.template.html ;

            var render = template.compile( templateHtml );

            var data = {
                left: options.data,
                right: options.pages
            }

            var html = render( data );

            __container.empty();

            __container.append( html );

        },

        refresh: function ( options ) {

            tablesGroupOperations.create( options );
            
        },

        // 渲染后的回调
        afterRender: function ( __container, options ) {

            var __switch = __container.find( '.icon-switch' ),
                __size = __container.find( '.icon-fullscreen' ),
                __prevPage = __container.find( '.icon-prev' ),
                __nextPage = __container.find( '.icon-next' ),
                __nextStep = __container.find( '#tableTools_next_oper' ),
                __nextStep_up = __container.find( '#tableTools_next_oper_up' ),
                __nextStep_hide = __container.find( '#tableTools_next_oper_hide' ),
                __more = __container.find( '#tableTools_select_more_oper' );


            __switch.on( 'click', function () {

                if( typeof options.switchModeCallback === 'function' ){
                    options.switchModeCallback();
                }

            } );

            __size.on( 'click', function () {

                var __target = $( '.display-full-screen-target' );

                if( __target.hasClass( 'wt-display-full-screen' ) ){
                    __target.removeClass( 'wt-display-full-screen' );
                }else{
                    __target.addClass( 'wt-display-full-screen' );
                }

            } )

            __prevPage.on( 'click', function () {

                $( '.wt-table-page .prev' ).trigger( 'click' );

            } );

            __nextPage.on( 'click', function () {

                $( '.wt-table-page .next' ).trigger( 'click' );

            } );

            __nextStep_up.on( 'click', function () {

                if( __nextStep_hide.length ){

                    var d = wtDialog.popover({content: __nextStep_hide.html() ,selector:__nextStep, align:"bottom" });

                    d.show();
                }

            } );

            if( __more.length ){

                wtSelect.create( __more, {
                    changedListener:function ( data, option, fullData ) {
                        window.location.href = data.value ;
                    } 
                } )

            }
            
        }

    }

})( jQuery, window, document );
(function($){  
    $.fn.serializeJson=function(){  
        var serializeObj={};  
        var array=this.serializeArray();  
        var str=this.serialize();  
        $(array).each(function(){  
            if(serializeObj[this.name]){  
                if($.isArray(serializeObj[this.name])){  
                    serializeObj[this.name].push(this.value);  
                }else{  
                    serializeObj[this.name]=[serializeObj[this.name],this.value];  
                }  
            }else{  
                serializeObj[this.name]=this.value;   
            }  
        });  
        return serializeObj;  
    };  
})(jQuery);  