/**
 * Created by lenovo on 2016/7/1.
 */

(function ($) {
    window.dialog = dialog;
    window.wtDialog = {
        modal: function (options) {
            var config = $.extend({
                title: "标题",
                content: "",
                auto: true,
                button: [
                    {
                        value: '确定',
                        callback: function () {

                        },
                        autofocus: true
                    },
                    {
                        value: '取消',
                        callback: function () {

                        }
                    }
                ]
            }, options || {});
            var d = dialog(config);
            if (config.auto) {
                d.showModal();
            }
            return d;
        },
        tip: function (content, timer) {
            var timer = timer ? timer : 2000;
            var d = dialog({
                content: content
            });
            d.show();
            setTimeout(function () {
                d.close().remove();
            }, timer);
            return d;
        },
        popover: function (options) {
            var config = $.extend({
                content: "",
                padding: 5,
                quickClose: true,
                quickHide: false
            }, options || {});
            var $selector;
            if (typeof config.selector == "object") {
                $selector = config.selector;
            } else if (typeof config.selector == "string") {
                $selector = $(config.selector);
            }
            var popover = {
                self: null,
                init: function () {
                    this.self = dialog(config);
                    this.quickHide(config);
                    return this.self;
                },
                show: function () {
                    this.self.show($selector.get(0));
                },
                hide: function () {
                    this.self.close();
                },
                remove: function () {
                    this.self.remove();
                },
                getInstance: function (id) {
                    var DialogId = id ? id : this.self.id;
                    return dialog.get(DialogId);
                },
                getDialog: function (id) {
                    return $(this.self.node);
                },
                quickHide: function (config) {
                    var this_ = this;
                    if (config.quickClose && config.quickHide) {
                        $(this_.self.backdrop).off().on("mousedown" in document ? "mousedown" : "click", function (e) {
                            this_.self.close();
                        });
                    }
                }
            };
            popover.init();
            return popover;

        },
        tplModal: function (options) {
            return new wtModal(options);
        },
        dialog: function (options) {
            var config = $.extend({
                title: "标题",
                content: ""
            }, options || {});
            var d = top.dialog(config);
            return d;
        }
    }
})(jQuery);

(function ($) {
    window.wtModal = function (options) {
        this.config = $.extend({
            tplId: "",
            id: "",
            data: null,
            mask: true,
            auto: true,
            openCallback: function (instance) {

            },
            closeCallback: function (instance) {

            }
        }, options || {});
        this.tplId = this.config.tplId;
        this.id = this.config.id || "wt_" + (+new Date());
        this.content = $("#" + this.config.tplId).html();
        this.$dom = null;
        this.init();
    };

    wtModal.prototype.init = function () {
        var this_ = this;
        this.createDom();
        this.render();
        this.showModal();
        if (this.config.auto) {
            this.show();
        }
        this.config.openCallback.apply(this);
        $(".pop-title").find("i").on("click", function () {
            this_.close();
        });
    };

    wtModal.prototype.createDom = function () {
        this.modal = "<div id='" + this.id + "' class='wt-modal-panel'><div class='wt-modal-mask'></div>" + this.content + "</div>";
    };

    wtModal.prototype.render = function () {
        $("body").append(this.modal);
        this.$dom = $("#" + this.id);
    };

    wtModal.prototype.showModal = function () {
        if (!this.config.mask) {
            this.$dom.find(".wt-modal-mask").css("opacity", 0);
        }
    };

    wtModal.prototype.show = function () {
        this.$dom.show();
        this.reset();
    };

    wtModal.prototype.reset = function () {
        var $window = this.$dom.find(".wt-pop-window");
        var _ml = -Math.floor($window.width() / 2) + "px";
        $window.css({
            top: "80px",
            left: "50%",
            marginLeft: _ml
        });
    };

    wtModal.prototype.close = function () {
        this.config.closeCallback.apply(this);
        this.$dom.remove();
    }
})(jQuery);