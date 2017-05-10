/**
 * 依赖 DataTable 方法
 */
;(function ( $, window, document, undefined ) {

    var defaultOptions = {
        tool: {
            enable: true,
            button: true,
            buttonData: null,
            control: true,
            controlData: { order: 1, switch: 1, fullScreen: 1, setting: 1, page: 1 }
        },
        table: {
            enable: true,
            ajax:null,
            data: null,
            ordering: false,
            info: false,
            columns: null,
            preDrawCallback: null,
            drawCallback: null,
            rowCallback: null
        }
    }

    var table_source = {
        html_container: '<div class="fullscreen-container"></div>',
        html_tool: '<div class="wt-table-tools"></div>',
        html_tool_button: '<div class="leftpart"></div>',
        html_tool_button_icon: '<span class="wt-button-3 mr10"></span>',
        html_tool_control: '<div class="rightpart"></div>',
        html_tool_control_order: '<i class="icon-sort"></i>',
        html_tool_control_switch: ' <i class="icon-switch"></i>',
        html_tool_control_fullScreen: '<i class="icon-fullscreen"></i>',
        html_tool_control_setting: '<i class="icon-set"></i>',
        html_tool_control_page: ' <i class="icon-prev"></i><i class="icon-next"></i>',
        html_table: '<table class="display"></table>'
    }

    /*表格构造函数*/
    var superTable = function () {
        this.__container;
        this.__tool;
        this.__tool_button;
        this.__tool_control;
        this.__table;
    }

    // 容器
    superTable.prototype.layout_container = function ( __dom ) {
        this.__container = $( table_source.html_container );
        __dom.append( this.__container );
    }

    // 工具盒子
    superTable.prototype.layout_toolsBox = function () {
        this.__tool = $( table_source.html_tool ) ;
        this.__container.prepend(this.__tool);
    }
    // 工具狂按钮
    superTable.prototype.layout_toolsButton = function () {
        this.__tool_button = $( table_source.html_tool_button );
        this.__tool.append( this.__tool_button );
    }
    //工具框控制
    superTable.prototype.layout_toolsControl = function () {
        this.__tool_control = $( table_source.html_tool_control );
        this.__tool.append( this.__tool_control );
    }

    // 表格盒子
    superTable.prototype.layout_tableBox = function () {
        this.__table = $( table_source.html_table );
        this.__container.append(this.__table);
    }

    // 创建表格
    superTable.prototype.createTable = function ( options ) {

        // 创建表格框
        options.enable && this.layout_tableBox();

        return this.__table ? this.__table.DataTable( options ) : null ;

    }

    // 创建工具栏  getSelectedTableData 表格提供获取选中复选框的方法
    superTable.prototype.createTool = function ( options, getSelectedTableData ) {
        options.enable && this.layout_toolsBox();
        options.enable && options.button && this.layout_toolsButton();
        options.enable && options.control && this.layout_toolsControl();
        options.enable && options.button && options.buttonData && this.createToolsButtonIcon( options.buttonData, getSelectedTableData );
        options.enable && options.button && options.controlData && this.createToolsControlIcon( options.controlData );
    }

    // 工具栏 按钮创建
    superTable.prototype.createToolsButtonIcon = function ( data, getSelectedTableData ) {
        var _this = this ,
            buttonList = [] ;

        var button_html = table_source.html_tool_button_icon ;
        // 创建小标签
        $.each( data, function ( index, button ) {
            // 按钮创建
            if( button.type == 'button' ){
                var __icon = $( button_html );
                __icon.text( button.text );

                typeof button.callback === 'function'
                && __icon.on( 'click', function () {
                    button.callback( getSelectedTableData( _this.__table) );
                } );

                buttonList.push( __icon );
            }
        } );

        this.__tool_button.append( buttonList );

    }

    // 工具栏 操作创建
    superTable.prototype.createToolsControlIcon = function (data) {
        //       { order: 1, switch: 1, fullScreen: 1, setting: 1, page: 1 }
        data[ 'order' ] && this.__tool_control.append( table_source.html_tool_control_order );
        data[ 'switch' ] && this.__tool_control.append( table_source.html_tool_control_switch );
        data[ 'fullScreen' ] && this.__tool_control.append( table_source.html_tool_control_fullScreen );
        data[ 'setting' ] && this.__tool_control.append( table_source.html_tool_control_setting );
        data[ 'page' ] && this.__tool_control.append( table_source.html_tool_control_page );
    }

    window.wtTable = {

        create: function ( __dom, options ) {

            var options = $.extend( true, {}, defaultOptions, options );
            // 存放业务额外方法, 组件创建都是基于options， 所以存放在options里 ，
            // 在_callbackWrapper里执行, 只是小片段方法， 并不是 rowCallback 本身
            // functionArray
            options.table.extraCallbackList = { rowCallback: [], drawCallback:[],preDrawCallback: [] };
            // 新建表格
            var table = new superTable( options );
            // 创建容器结构
            table.layout_container( __dom );
            // 处理表格参数
            var tableOptions = wtTable._tableOptionsTransform( options.table );
            // 创建表格组件
            table.createTable( tableOptions );
            // 创建表格工具栏
            table.createTool( options.tool, wtTable._columnsPerproty.checkbox.getSelectedCheckbox);

        },

        // 初始化
        _init: function ( __dom, options ) {


        },

        // 表格参数转化
        _tableOptionsTransform: function ( tableOptions ) {

            var options = tableOptions ;

            options.columns = wtTable._columnsTransform( options );

            wtTable._callbackWrapper( options );

            return options ;

        },
        // 包裹回调方法， 用于封装组件内部处理方法.
        _callbackWrapper: function ( options ) {

            var callbackMap = [
                // 页面渲染前回调
                { name: 'preDrawCallback', argsLength: 0 },
                // 渲染页面回调
                { name: 'drawCallback', argsLength: 0  },
                // 渲染页面回调
                { name: 'rowCallback', argsLength: 3  }
            ]

            for( var i = 0 ; i < callbackMap.length; i++ ){
                var child = callbackMap[i],
                    name = child.name ;

                if( options[ name ] ){
                    var _func =  options[ name ];

                    options[ name ] = function ( arg1, arg2, arg3, arg4, arg5 ) {
                        var argList = [] ;
                        for( var v = 0 ; v < child.argsLength; v++ ){
                            argList.push( arguments[v] );
                        }
                        argList.push( options );
                        wtTable._extraCallback( name, options, argList )

                        _func.apply( this. argList );
                    }

                }

            }


        },
        // 执行的额外方法
        _extraCallback: function ( key, options , args ) {
            var _extra = options.extraCallbackList[ key ] ;
            if( _extra.length ){
                for( var i = 0 ; i < _extra.length; i++ ){
                    _extra[ i ].apply( this, args );
                }
            }

        },

        // 列参数转化
        _columnsTransform: function ( options ) {
            //           var publicProperty = { defaultContent: '暂无' }
            var columns = options.columns ;

            $.each( columns, function (index, column) {

                if( typeof column.render === 'string' ){

                    var _column = wtTable._columnsPerproty[column.render];

                    if( _column.callback ){
                        for( var key in _column.callback  ){
                            options.extraCallbackList[ key ].push( _column.callback[key]  );
                        }
                    }

                    column = $.extend( column, _column );


                }
                column.defaultContent = '暂无'
            } );

            return columns;

        },

        // 提供的列渲染方法
        _columnsPerproty:{
            // 复选框渲染
            checkbox:{
                _renderName: 'checkbox',
                title: '<i class="wt-icon360-20"></i>',
                width: '40px',
                render: function (data, type, row, meta) {
                    return '<div name="A" value="'+ data +'" class="wt-table-checkbox"></div>';
                },
                callback: {
                    rowCallback: function ( row, data, index, options) {

                        //                      var cols_index = wtTable._columnsPerproty._getSqueueByRenderName( options.columns, 'checkbox' );

                        wtSwitch.init( $( 'td .wt-table-checkbox' , row ), "checkbox" );
                    }
                },
                // 获取选中的下拉框
                getSelectedCheckbox: function ( __table_body ) {

                    var valuesList = [] ;

                    var __checkboxs = __table_body.find( '.wt-table-checkbox' );

                    $.map( __checkboxs, function ( __checkbox, index ) {

                        var __input = $( __checkbox ).find( 'input' );

                        if( __input.prop( 'checked' ) ){

                            valuesList.push( __input.val() );

                        }

                    } );


                    return valuesList ;

                }
            } ,
            // 是否已读渲染
            isRead: {
                title: '<i class="wt-icon360-20"></i>',
                width: '40px',
                render: function (data, type, row, meta) {
                    if( data ){
                        return '<i class="wt-icon360-20"></i>' ;
                    }else{
                        return '<i class="wt-icon380-20"></i>' ;
                    }
                }
            },
            //按钮渲染
            button:{
                _renderName: 'button',
                render: function(data, type, row, meta) {
                    return '<span>'+data+'</span><i class="wt-table-name-oper"></i>';
                },
                callback:{
                    rowCallback:function ( row, data, index, options ) {

                        var cols_index = wtTable._columnsPerproty._getSqueueByRenderName( options.columns, 'button' );

                        var buttons = options.columns[cols_index].buttonChild,
                            buttonList = [];

                        if( !buttons )  { return ; }

                        var __ul = $( '<ul></ul>' );

                        for( var i = 0 ; i < buttons.length; i++ ){
                            (function ( i ) {

                                var button = buttons[ i ];
                                var __li =  $( '<li>'+button.text+'</li> ');
                                __li.on( 'click', function () {
                                    button.click( data );
                                } );
                                buttonList.push(__li);

                            })( i )

                        }

                        __ul.append( buttonList );

                        $( 'td:eq('+cols_index+') i', row ).off( 'click' );

                        $( 'td:eq('+cols_index+') i', row ).on( 'click', function () {
                            var d = wtDialog.popover( { content: __ul[0], selector: $( this ),align:"right" } );
                            d.show();
                        } );


                    }
                }


            },

            // 标签渲染
            labels: {

                render: function (data, type, row, meta) {
                    var html = '';
                    var labelList = data.split(',');
                    for( var i = 0 ; i < labelList.length ; i++ ){
                        var text = labelList[i] ;
                        if( i == 2 ){
                            html += '<span class="badge badge-warning">更多</span> <span class="triangle"></span>';
                            break;
                        }else{
                            html += '<span class="badge badge-success">'+text+'</span>';
                        }
                    }
                    return html ;
                }

            },
            // 渠道渲染
            channels: {
                render: function (data, type, row, meta) {
                    var html = '';
                    var labelList = data.split(',');
                    for( var i = 0 ; i < labelList.length ; i++ ){
                        var text = labelList[i] ;
                        if( i == 1 ){
                            html += '<span class="triangle"></span>';
                            break ;
                        }else{
                            html += '<span class="badge badge-success">'+text+'</span>';
                        }
                    }
                    return html ;
                }
            },
            // 寻找列数
            _getSqueueByRenderName: function (columns, RenderName) {

                for( var i = 0; i < columns.length ; i++ ){
                    if( columns[i]._renderName == RenderName ){
                        return i ;
                    }
                }
                return null ;

            }

        }

    }

})( jQuery, window, document );