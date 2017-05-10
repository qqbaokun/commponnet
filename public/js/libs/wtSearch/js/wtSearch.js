/**
 * Created by ThinkPad on 2016/7/12.
 */
(function ($) {

    window.wtSearch = {

        init: function (container, options, btns) {

            var obj = new search(container, options, btns);

            obj.layout(options);

            obj.hideSelected_box();

            wtSearch._createWidget(obj, options.widgets);

        },

        _createWidget: function (obj, widgetData) {

            for (var i = 0, len = widgetData.length; i < len; i++) {

                obj[widgetData[i]["type"]](widgetData[i]);

            }
        }
    };

    var search = function (container, options, btns) {
        this.container = container;
        this.options = options;
        this.btns = btns;
        this.keyword_component = null;
        this.addLabel = function (object) {
            var field = object["field"];
            var text = object["text"];
            var value = object["value"];
            var $selected_box = $(container).find(".selected_box");
            var $currentLabel = $selected_box.find("[data-field='" + field + "']");
            if ($currentLabel.length) {
                $currentLabel.data("value", value).attr("title", value);
                $currentLabel.find("span").html(text);
            } else {
                $selected_box.append('<div class="wt-button-7" data-field="' + field + '" data-value="' + value + '"  onclick="this.parentNode.removeChild(this);" title="' + value + '"><span>' + text + '</span><i></i></div>');
            }
            this.showSelected_box();
        };
        this.removeLabel = function (field) {
            var $selected_box = $(container).find(".selected_box");
            var $currentLabel = $selected_box.find("[data-field='" + field + "']");
            $currentLabel.remove();
        }
    };

    search.prototype.layout = function (options) {

        var $dom = $('<div class="wt-search-container"></div>');

        $dom.append([
            this.keyword_box(options.isKeywordBar),
            this.widget_box(options.isWidgetBar),
            this.selected_box(options.isSelectedBar),
            this.btns_box(options.isBtnsBar)
        ]);

        $(this.container).html($dom);

    };

    search.prototype.keyword_box = function (flag) {
        var $keyword_box = "";
        if (flag) {
            $keyword_box = $('<div class="keyword_box"></div>');
        }
        return $keyword_box;
    };

    search.prototype.widget_box = function (flag) {
        var $widget_box = "";
        if (flag) {
            $widget_box = $('<div class="widget_box"><span>条件：</span></div>');
        }
        return $widget_box;
    };

    search.prototype.selected_box = function (flag) {
        var $selected_box = "";
        if (flag) {
            $selected_box = $('<div class="selected_box"><span>已选条件：</span></div>');
        }
        return $selected_box;
    };

    search.prototype.btns_box = function (flag) {
        var this_ = this;
        var btns = this.btns;
        var resultList = [];

        for (var i = 0; i < btns.length; i++) {
            var name = btns[i]['name'];
            if (btnList[name]) {
                btnList[name]['name'] = name;
                if (typeof btns[i]["callback"] == "function") {
                    btnList[name]["callback"] = btns[i].callback;
                }
                resultList.push(btnList[name]);
            } else {
                resultList.push(btns[i]);
            }
        }

        var $btns_box = $('<div class="btns_box"></div>');
        if (flag) {
            for (var i = 0, len = resultList.length; i < len; i++) {
                var $btn, btn = resultList[i];
                if (btn.type == "btn") {
                    $btn = $('<div class="wt-button-5">' + btn.text + '</div>');
                } else if (btn.type == "link") {
                    $btn = $('<div class="wt-button-link">' + btn.text + '</div>');
                }
                $btns_box.append($btn);
                (function (btn_) {
                    $btn.on("click", function () {
                        var value = this_.getValue();
                        btnList[btn_.name].callback.call(this_, value);
                    });
                })(btn);
            }
        }
        return $btns_box;
    };

    search.prototype.select = function (options) {
        var this_ = this;
        var $box = $(this.container).find(".widget_box");
        var __dom = $('<div></div>');
        $box.append(__dom);

        for (var i = 0, len = options.data.length; i < len; i++) {
            options.data[i].field = options.field;
        }
        wtSelect.create(__dom, {
            data: options.data,
            skin:"search-select",
            changedListener: function (data, option, fullData) {
                this_.addLabel(data);
            }
        });
    };

    search.prototype.keyword = function (options) {
        var this_ = this;
        var $box = $(this.container).find(".keyword_box");
        var component = wtKeyword.create($box, {
            data: options,
            changedListen: function (data, option, fullData) {
                if (!data["value"]) {
                    this_.removeLabel(data["field"]);
                    return false;
                }
                this_.addLabel(data);
            }
        });

        this.keyword_component = component;
    };

    search.prototype.hideSelected_box = function () {
        $(this.container).find(".selected_box").hide();
    };

    search.prototype.showSelected_box = function () {
        $(this.container).find(".selected_box").show();
    };

    //获取所有已选选择器参数{key:value}
    search.prototype.getValue = function () {
        var $this, key, value, params = {};
        $(this.container).find(".selected_box").find(">div").each(function () {
            $this = $(this);
            key = $this.data("field");
            value = $this.data("value");
            params[key] = value;
        });
        return params;
    };


    var btnList = {
        search: {
            type: 'btn', text: '搜索', callback: function () {

            }
        },
        senior: {
            type: 'link', text: '高级查询', callback: function () {

            }
        },
        save: {
            type: 'link', text: '保存为搜索器', callback: function () {

            }
        },
        empty: {
            type: 'link', text: '清空已选条件', callback: function () {
                $(this.container).find(".selected_box").find(">div").remove();
                this.keyword_component.empty();
            }
        }
    };

})(jQuery);
