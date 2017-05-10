jQuery封装组件


/**
 * Created by ThinkPad on 2016/7/9.
 */

(function ($) {
    var defaultOpt = {
        name: "",
        value: "",
        text: "",
        state: "normal",
        callback: function (data) {
            console.log(data);
        }
    };

    window.wtSwitch = {
        init: function ($dom, type, callback) {
            var obj = new switchFn($dom, type, callback);
            wtSwitch.create(obj);
            return obj;
        },
        create: function (obj) {
            obj.$dom.each(function () {
                var $this = $(this);
                var option = $.extend({}, defaultOpt, {
                    name: $this.attr("name"),
                    value: $this.attr("value"),
                    text: $this.html() || $this.attr("text"),
                    state: $this.attr("state")
                });
                var html = obj.createDom(option);
                var $dom = obj.render($this, html);
                obj.beautify($dom, option);
                wtSwitch.bindClick($dom, obj, option);
            });
        },
        bindClick: function ($dom, obj, option) {
            $dom.on("click", function (e) {
                var result;
                /*if (e && e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    window.event.cancelBubble = true;
                }*/
                if (option.state.indexOf("disabled") > -1) {
                    return false;
                }
                config[obj.type]["click"]($(this));

                result = config[obj.type]["getCheck"](option.name);

                if (typeof obj.callback == "function") {
                    obj.callback.call(obj, result, this);
                }
            });
        },
        destory: function (obj, $dom) {
            obj.destory($dom);
        },
        check: function ($dom) {
            var $switch;
            $dom.each(function () {
                $switch = $(this).find(">div");
                if (!$switch.hasClass("on")) {
                    $switch.addClass("on");
                    $switch.find("input").prop("checked", true);
                }
            });
        },
        unCheck: function ($dom) {
            var $switch;
            $dom.each(function () {
                $switch = $(this).find(">div");
                if ($switch.hasClass("on")) {
                    $switch.removeClass("on");
                    $switch.find("input").prop("checked", false);
                }
            });
        },
        getResult: function (name, type) {
            var result = config[type]["getCheck"](name);
            return result;
        }
    };


    function switchFn($dom, type, callback) {
        this.$dom = $dom;
        this.type = type || "checkbox";
        this.callback = callback || null;
    }

    switchFn.prototype.createDom = function () {
        return dom(this.type);
    };

    switchFn.prototype.render = function ($this, dom) {
        $this.html(dom);
        return $this.find(".wt-switch");
    };

    switchFn.prototype.beautify = function ($dom, option) {
        $dom.addClass(config[this.type]["style"]);
        addState($dom, option.state);
        $dom.find("span").html(option.text);
        $dom.find("input").attr("type", config[this.type]["type"]);
        $dom.find("input").attr("name", option.name);
        $dom.find("input").val(option.value);
    };

    switchFn.prototype.destory = function ($dom) {
        $dom.remove();
    };


    switchFn.prototype.getCheck = function ($dom) {
        var result = {
            "checked": false
        };
        if ($dom.find(">div").hasClass("on")) {
            result["checked"] = true;
        }
        return result;
    };


    var dom = function (type) {
        switch (type) {
            case "checkbox":
            case "radio":
                return '<div class="wt-switch"><i></i><input /><span></span></div>';
                break;
            case "special":
                return '<div class="wt-switch"><span></span><i></i><input /></div>';
                break;
            default :
                break;
        }
    };

    var addState = function (obj, type) {
        var states = type.split(",");
        $.map(states, function (i) {
            obj.addClass(state[i]);
            if (state[i] == "on") {
                obj.find("input").prop("checked", true);
            }
        });
    };


    var state = {
        normal: "",
        disabled: "wt-disable",
        on: "on"
    };

    var config = {
        checkbox: {
            type: "checkbox",
            style: "wt-switch-checkbox",
            click: function ($dom) {
                if ($dom.hasClass("on")) {
                    $dom.removeClass("on");
                    $dom.find("input").prop("checked", false);
                } else {
                    $dom.addClass("on");
                    $dom.find("input").prop("checked", true);
                }
            },
            getCheck: function (name) {
                var result = {};
                var values = [];
                var $dom = $("input[name='" + name + "']:checked");
                if ($dom.length) {
                    result["check"] = true;
                    $dom.each(function () {
                        values.push($(this).val());
                    });
                }
                result[name] = values;
                return result;
            }
        },
        radio: {
            type: "radio",
            style: "wt-switch-radio",
            click: function ($dom) {
                var name = $dom.find("input").attr("name");
                if ($dom.hasClass("on")) {
                    return false;
                } else {
                    $("input[name='" + name + "']").closest(".wt-switch").removeClass("on");
                    $dom.addClass("on");
                    $("input[name='" + name + "']").closest(".wt-switch").prop("checked", false);
                    $dom.find("input").prop("checked", true);
                }
            },
            getCheck: function (name) {
                var result = {};
                var $dom = $("input[name='" + name + "']:checked");
                if ($dom.length) {
                    result[name] = $dom.val();
                }
                return result;
            }
        },
        special: {
            type: "checkbox",
            style: "wt-switch-special",
            click: function ($dom) {
                return config["checkbox"]["click"]($dom);
            },
            getCheck: function (name) {
                return config["checkbox"]["getCheck"](name);
            }
        }
    };

})(jQuery);





checkbox
wtSwitch.init($(".checkbox1"),"checkbox",function(data){console.log(data);})初始化checkbox
radio
wtSwitch.init($(".radio1"),"radio",function(data){console.log(data);})初始化radio
special-特殊开关
wtSwitch.init($(".switch1"),"special",function(data){console.log(data);})
