/**
 * Created by ThinkPad on 2016/7/12.
 */
(function ($) {
    window.wtKeyword = {
        create: function (container, options) {

            var obj = new keyword(container, options);

            obj.layout(options);

            wtKeyword.render(obj, options);

            return obj;

        },
        render: function (obj, options) {

            obj.select(options);

            obj.bindEvents();

        }
    };

    var keyword = function (container, options) {
        this.container = container;
        this.options = options;
        this.dom = null;
        this.keyword = {};
        this.select_component = null;
    };


    keyword.prototype.layout = function (options) {
        var keywordType = options.data.keywordType;
        var dom = diffDom[keywordType]["dom"]();
        this.dom = dom;
        this.container.html(dom);
        return dom;
    };


    keyword.prototype.bindEvents = function (obj) {
        var this_ = this;
        var container = this.container;
        container.on("input propertychange", "input", function () {
            var object = {};
            var value = $(this).val().trim();
            object["field"] = this_.keyword.value;
            object["text"] = value;
            object["value"] = value;
            this_.changedListen(object);
        });
    };


    keyword.prototype.changedListen = function (object) {
        if (typeof this.options.changedListen == "function") {
            this.options.changedListen.call(this, object);
        }
    };

    keyword.prototype.select = function (options) {
        var this_ = this;
        var $box = $(this.container).find(".type");
        this.select_component = wtSelect.create($box, {
            data: options.data.data,
            skin:"search-select",
            changedListener: function (data, option, fullData) {
                this_.keyword = data;
            }
        });
        this.keyword = options.data.data[0];
    };

    keyword.prototype.empty = function () {
        $(this.container).find("input").val("");
    };

    //匹配不同dom结构
    var diffDom = {
        1: {
            dom: function () {
                var html = "";
                html += '<div class="type"></div>';
                html += '<div class="separate">|</div>';
                html += '<div class="keyword"><i></i><input type="text" placeholder="关键字"><em></em></div>';
                return html;
            }
        },
        2: {
            dom: function () {
                var html = "";
                html += '<span class="s_select"></span>';
                html += '<span class="s_input"><input type="text" placeholder="姓名、手机号、邮箱、ID"/><i></i></span>';
                return html;
            }
        }
    };

})(jQuery);
