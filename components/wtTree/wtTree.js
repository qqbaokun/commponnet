/**
 * Created by ThinkPad on 2016/7/11.
 */
(function ($) {
    window.wtTree = function (options) {
        this.config = $.extend({
            container: "",
            datas: [],
            pattern: "simple",
            onClick: function (node) {

            }
        }, options || {});

        this.init();
    };

    wtTree.prototype.init = function () {
        this.dom = this.createDom();
        this.render();
        this.bindEvents();
    };

    wtTree.prototype.createDom = function () {
        var pattern = this.config.pattern;
        var html = "<div class='wt-tree'>";
        if (pattern == "simple") {
            html += simple(this.config.datas);
        }
        html += "</div>";
        return html;


        function simple(datas) {
            var html_ = "<ul>";
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                html_ += "<li data-id='" + data.id + "' data-name='" + data.name + "'><div>";
                if (data.children.length) {
                    if(data.isOpen){
                        html_ += "<span class='arrow-b'></span>";
                    }else{
                        html_ += "<span class='arrow-r'></span>";
                    }
                }
                html_ += "<span>" + data.name + "</span>";
                if (data.isNew) {
                    html_ += "<span class=''></span>";
                }
                if (data.num) {
                    html_ += "<span>（" + data.num + "）</span>";
                }
                html_ += "</div>";
                if (data.children.length) {
                    html_ += arguments.callee(data.children);
                }
                html += "</div></li>";
            }
            html_ += "</ul>";
            return html_;
        }
    };

    wtTree.prototype.render = function () {
        $(this.config.container).html(this.dom);
    };

    wtTree.prototype.bindEvents = function () {
        var this_ = this;
        $(".wt-tree").on("click", "div", function () {
            var $this = $(this);
            var $li = $this.parent();
            var node = {};
            node.id = $li.data("id");
            node.name = $li.data("name");
            this_.config.onClick.apply(node);
            if ($li.hasClass("active")) {
                $li.removeClass("active");
                $li.find("ul").hide();
            } else {
                $li.addClass("active");
                $li.find("ul").show();
            }
            if($this.find("span").hasClass("arrow-b")){
                $this.find("span.arrow-b").removeClass("arrow-b").addClass("arrow-r");
            }else{
                $this.find("span.arrow-r").removeClass("arrow-r").addClass("arrow-b");
            }
            $this.parent().siblings("li").find("ul").hide();
            $this.parent().siblings("li").removeClass("active");
            $this.parent().siblings("li").find("span.arrow-b").removeClass("arrow-b").addClass("arrow-r");
            $(".wt-tree").find("div").not(this).removeClass("current");
            $this.addClass("current");

        });
    };

    wtTree.prototype.refresh = function (datas) {
        if (datas) {
            this.config.datas = datas;
        }
        this.init();
    };

})(jQuery);