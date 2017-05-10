$.each($('.menu-right li'), function (i, v) {
    $(v).on('click', function () {
        $(this).addClass('hover');
        $(this).siblings('li').removeClass('hover');
    });
});

$.each($('.menu-list li'), function (i, v) {
    if( ($(v).hasClass('current')) && ($(v).parents().css('display')=='none') ){
        $(v).parents().css('display','block');
        $(v).parents().siblings('div').find('span').removeClass('arrow-b').addClass('arrow-r')
    }
    $(v).on('click', function () {
        if ($(this).find('span').hasClass('arrow-b')) {
            $(this).find('span').removeClass('arrow-b').addClass('arrow-r');
            $(this).find('ul').css('display', 'block');
            $(this).siblings('li').find('ul').css('display', 'none');
            $(this).siblings('li').find('span').removeClass('arrow-r').addClass('arrow-b');
        } else if ($(this).find('span').hasClass('arrow-r')) {
            $(this).find('span').removeClass('arrow-r').addClass('arrow-b');
            $(this).find('ul').css('display', 'none');
        }else if (!$(this).find('span').hasClass('arrow-')) {
            $(this).siblings('li').find('ul').css('display', 'none');
            $(this).siblings('li').find('span').removeClass('arrow-r').addClass('arrow-b');
        }

        var n = $('.menu-list li');
        for (var i = 0; i < n.length; i++) {
            $(n[i]).removeClass('current');
        }
        $(this).addClass('current');
        return false;
    });
});

var rightScreenPull = function () {

    if( $( '.wt-fg-content' ).length ){

        $( '.wt-fg-content' ).append( '<div class="pull_back" style="display: none;"></div> <div class="pull_on"  style="display: none;"></div>' );

        $( '.pull_back').show();

        $( '.pull_back' ).on( 'click', function () {
            $( '.fg-ct-right' ).css( 'margin-left', '0px' );
            $( '.pull_back').hide();
            $( '.pull_on' ).show();
        } );

        $( '.pull_on' ).on( 'click', function () {
            $( '.fg-ct-right' ).css( 'margin-left', '200px' );
            $( '.pull_back').show();
            $( '.pull_on' ).hide();
        } );

    }

}();

/*表格渲染方法*/
var renderTableLabels = function () {
    
}
var renderTableOper = function () {
    
}
