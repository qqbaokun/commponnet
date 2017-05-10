(function ($) {
    var defaultOption = {
        language: "zh-CN",
        format: 'yyyy-mm-dd',
        autoclose: true,
        startView: 2,
        minView: 2,
        todayBtn: true,
        todayHighlight: true,
        changeDate: null,
        hide:null
    };
    window.wtDate = {
        init: function (container, options) {
            var config = $.extend({}, defaultOption, options);
            return this.create(container, config);
        },
        create: function (container, options) {
            var this_ = this;
            if (!container.length) return null;
            var obj = container.datetimepicker(options);
            this_.changeDate(options.changeDate, container);
            this_.onHide(options.hide, container);
            return obj;
        },
        changeDate: function (fn, container) {
            if (typeof fn == "function") {
                container.datetimepicker().on("changeDate", function (ev) {
                    fn(ev);
                });
            }
        },
        show: function (instance) {
            instance.datetimepicker("show");
        },
        hide: function (instance) {
            instance.datetimepicker("hide");
        },
        onHide:function (fn,container) {
            if (typeof fn == "function") {
                container.datetimepicker().on("hide", function (ev) {
                    fn(ev);
                });
            }
        },
        destory: function (instance) {
            if (instance) {
                instance.datetimepicker("remove");
            }
        },
        setStartDate: function (instance, time) {
            instance.datetimepicker("setStartDate", time);
        },
        setEndDate: function (instance, time) {
            instance.datetimepicker("setEndDate", time);
        },
        update: function (instance) {
            instance.datetimepicker("update");
        }
    };
})(jQuery);