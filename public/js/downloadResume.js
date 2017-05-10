/**
 * Created by ThinkPad on 2016/7/5.
 */
$(function () {
    var wtDownload = {
        init: function () {
            this.render();
            this.bindEvents();
        },
        render: function () {
            if($("#container").length){
                var ue = UE.getEditor('container', {
                    toolbars: [
                        ['fullscreen', 'source', 'undo', 'redo'],
                        ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
                    ],
                    allowDivTransToP: false
                });
            }
            if($("#container1").length){
                var ue = UE.getEditor('container1', {
                    toolbars: [
                        ['fullscreen', 'source', 'undo', 'redo'],
                        ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
                    ],
                    allowDivTransToP: false
                });
            }
        },
        bindEvents: function () {
            /*$(".block-line span").on("click", function () {
                var $this = $(this);
                var $i = $this.find("i");
                if ($i.hasClass("active")) {
                    $(".editor-area").hide();
                    $i.removeClass("active");
                    $this.find("font").text("展开");
                } else {
                    $(".editor-area").show();
                    $i.addClass("active");
                    $this.find("font").text("收起");
                }
            });


            $(".contact-container-hide").on("click",function () {
                $(".contact-container").hide();
            })*/
        }
    };

    wtDownload.init();
});