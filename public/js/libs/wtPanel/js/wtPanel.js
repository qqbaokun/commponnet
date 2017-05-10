/**
 * Created by ThinkPad on 2016/10/17.
 */
;(function ($) {
    var defaultOpts = {
        container: null,
        title: "请选择",
        data: null,
        change: function (obj, $container, fullDatas) {

        }
    };
    window.wtPanel = {
        init: function (options) {
            var config = $.extend({}, defaultOpts, options);
            var instance = this.create(config);
            this.bindEvents(config);
            return instance;
        },
        create: function (config) {
            var this_ = this;
            var $container = $(config.container);
            if ($container.find(".dropdown-menu").length) {

            } else {
                this_.createDom(config);
            }
            return $container;
        },
        createDom: function (config) {
            var data, html_ = "";
            var html = '<div class="dropdown">';
            html += '<div class="dropdown-toggle" data-toggle="dropdown">';
            html += '<span>' + config.title + '</span>';
            html += '<i class="wt-icon10-100 ml10"></i>';
            html += '</div>';
            html += '<ul class="dropdown-menu"></ul>';
            html += '</div>';
            $(config.container).append(html);
            if (config.datas) {
                for (var i = 0, len = config.datas.length; i < len; i++) {
                    data = config.datas[i];
                    html_ += '<li data-data=' + JSON.stringify(data) + '><a href="javascript:void(0);">' + data.text + '</a></li>';
                }
                $(config.container).find(".dropdown-menu").html(html_);
            }
        },
        bindEvents: function (config) {
            var $container = $(config.container).find(".dropdown-menu");
            $container.on("click", "li", function () {
                var $this = $(this);
                var data = $this.attr("data-data");
                typeof config.change == "function" && config.change.call(null, JSON.parse(data), $(config.container), config.datas);
                $this.addClass("active").siblings().removeClass("active");
            });
        },
        val: function (instance, value) {
            var data = null;
            var $container = instance.find(".dropdown-menu");
            if (typeof value == "number" || typeof value == "string") {
                $container.find("li").each(function (i, elem) {
                    data = $(elem).attr("data-data");
                    data = JSON.parse(data);
                    if (data.value == value) {
                        $(elem).addClass("active").siblings().removeClass("active");
                        return false;
                    }
                });
            } else {
                var $selected = $container.find("li.active");
                if ($selected.length) {
                    data = JSON.parse($selected.attr("data-data"));
                }
            }
            return data;
        }
    };
})(jQuery);