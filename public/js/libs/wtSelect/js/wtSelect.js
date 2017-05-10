/**
 * delay jQuery & bootstrap-selectpiacker
 * 引用 selectpicker 的方法
 * @type {{}}
 */
;(function ( $, window, document, undefined ) {

    var defaultOptions = {
        // string mode 是根据常用类型 默认配置的类型
        mode: null,
        // string
        skin:null,
        // string
        width: 'auto',
        // string
        title: null,
        // string
        defaultSelected: null,
        // { text: '', value:'', group:[] }   group 未开放
        data: null,
        // fn
        beforeShowListener: null,
        // fn   clickedIndex, newValue, oldValue.
        changedListener: null,
        // fn
        beforeHideListener: null
    }

    window.wtSelect =  {
        // 创建组件
        create: function( __elem, options ) {

            var options = $.extend( true, {}, defaultOptions, options );

            var selectpicker = wtSelect._init( __elem, options );

            selectpicker.wtSelectOptions = options ;

            wtSelect._defaultSelected( selectpicker, options.defaultSelected );

            return selectpicker ;
        },
        // 销毁组件
        destroy: function ( instance ) {
            if( instance ){
                instance.selectpicker( 'destroy' );

                if( instance.wtSelectOptions.data ){
                    instance.wtSelectOptions.__elem.empty();
                }

            }
        },

        // 刷新组件
        refresh: function ( instance ) {
            if( instance ) {
                instance.selectpicker('refresh');
            }
        },

        // 更新组件 instance, options
        update:function ( instance, options ) {
            if( instance ){
                wtSelect.destroy( instance );
                var options = $.extend( {}, instance.wtSelectOptions, options );
                return wtSelect.create( options.__elem, options );
            }
        },

        show: function ( instance ) {

            instance.selectpicker( 'show');

        },
        
        // 当前选中对象的值
        val: function ( instance, values ){
            if( instance ){

                if( values || values === '0' || values === 0 ){

                    instance.selectpicker( 'val', values );

                    var data = wtSelect.getSelectData( instance );

                    var index = __select[0].selectedIndex ;

                    instance.wtSelectOptions.changedListener( data, instance.wtSelectOptions.__select[0].getElementsByTagName('option')[index] , instance.wtSelectOptions.data );

                }else{
                    return instance.selectpicker( 'val' ) ;
                }
            }
        },
        //  提供当前选中对象的数据对象
        getSelectData: function ( instance ) {

            if( instance && instance.wtSelectOptions.data ){
                return instance.wtSelectOptions.data[ instance[0].selectedIndex ] ;
            }
            return null;

        },

        // 初始化
        _init: function (  __elem, options ) {

            var __elem = __elem ;
            // 容器节点不存在
            if( !__elem.length ) return null;
            // 获得下拉框对象
            __select = wtSelect._createSelectDom( __elem, options ) || __elem ;
            // 转化为 select 组件参数 只提供给 selectpicker
            var _options = wtSelect._transformOptions( options );
            // 生成组件
            var selectpicker = __select.selectpicker( _options );

  //          selectpicker.wtSelectOptions =
            // 记录__select 和 __elem
            options.__elem = __elem ;
            options.__select = __select ;
            // 给下拉选择框添加交互事件
            wtSelect._addSelectListener( __select, options );

            return selectpicker ;

        },

        /*给组件添加监听事件*/
        _addSelectListener: function ( __select, options ) {

            typeof options.beforeShowListener === 'function'  && __select.on( 'show.bs.select',  options.beforeShowListener );
            typeof options.changedListener === 'function' && __select.on( 'changed.bs.select',  function( event, index ){

                var data,
                    option = event.target[index];

                if( options.data ){
                    data = options.data[ index ] ;
                    data.index = index ;
                }else{
                    data = { text: option.innerHTML, value: option.value, index: index }
                }
                options.changedListener( data, option, options.data );
            } );
            typeof options.beforeHideListener === 'function' && __select.on( 'hide.bs.select',  options.beforeHideListener );


        },

        /*将wtSelect的参数结构，转化为 selectPicker的参数结构*/
        _transformOptions: function ( options ) {

            var _options = {
                style: options.skin,
                width: options.width,
                title: options.title
            }

            return _options;

        },
        // 根据数据创建select
        _createSelectDom: function ( __elem, options ) {

            var data = options.data ;

            if( !data ) return null ;

            var selectChildList = [];

            var __select = $( '<select></select>' );

            $.each( data, function ( index, object ) {
                if( object.group ){
                    // group 未开放 以后再扩展
                }else{
                    var __option = $( '<option>'+object.text+'</option>' ).attr( object );
                    selectChildList.push( __option );
                }
            } );

            __select.append( selectChildList );

            __elem.append( __select );

            return __select ;
        },

        // 默认参数选项
        _defaultSelected: function ( instance, defaultSelected  ) {

            if( typeof defaultSelected == 'number' || typeof defaultSelected == 'string'  );

            instance.selectpicker( 'val', defaultSelected );

        }



    }

})( jQuery, window, document );

