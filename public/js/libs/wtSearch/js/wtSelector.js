/**
 * Created by ThinkPad on 2016/7/12.
 */
(function ($) {
    //container:整个搜索区"#wt-search-container",tplId:"tpl_search_detail"
    window.wtSelector = {
        //初始化
        init: function (container, tplId, datas) {
            this.container = container;
            this.datas = datas;
            this.render(container, tplId, datas);
        },
        //调用渲染，绑定事件
        render: function (container, tplId, datas) {
            var $container = $(container);
            this.createDom($container, tplId, datas);
            this.initPlugins(container);
            this.showOrHide($container, datas);
            this.bindEvents();
        },
        //渲染模板
        createDom: function ($container, tplId, datas) {
            var html = template(tplId, {datas: datas});
            $container.addClass("wt-search-container").html(html);
            return html;
        },
        //各类别选择器初始化
        initPlugins: function (container) {
            var data, $this, this_ = this;
            $(container).find(".widget_container").each(function () {
                $this = $(this);
                data = JSON.parse($this.attr("created"));
                var params = [$this, data, container];
                switch (data.type) {
                    case 0:
                        this_.keyword.apply(this_, params);
                        break;
                    case 1:
                        this_.input.apply(this_, params);
                        break;
                    case 2:
                        this_.dialog.apply(this_, params);
                        break;
                    case 3:
                        this_.select.apply(this_, params);
                        break;
                    case 5:
                        this_.selectConnect.apply(this_, params);
                        break;
                    case 6:
                        this_.selectInput.apply(this_, params);
                        break;
                    case 7 :
                        this_.inputBetween.apply(this_, params);
                        break;
                    case 8 :
                        this_.dateTimeBetween.apply(this_, params);
                        break;
                    case 9:
                        this_.dateTimePicker.apply(this_, params);
                        break;
                    case 10:
                        this_.selectBetween.apply(this_, params);
                        break;
                    case 11:
                        this_.autoInput.apply(this_, params);
                        break;
                    case 12:
                        this_.autoInput1.apply(this_, params);
                        break;
                    case 13:
                        this_.keyword1.apply(this_, params);
                        break;
                    default:
                        break;
                }
            });
        },
        //创建相应选择项
        addLabel: function (object, container, callback) {
            var $dom;
            var text = object["text"];
            var queryId = object["queryId"];
            var value = object["value"];
            var secondQueryId = object["secondQueryId"];
            var secondQueryValue = object["secondQueryValue"];
            var $selected_box = $(container).find(".selected_box");
            var $currentLabel = $selected_box.find("[data-queryid='" + queryId + "']");
            if ($currentLabel.length) {
                if (value == "null_") {
                    $currentLabel.remove();
                } else {
                    $currentLabel.attr("data-value", value).attr("data-secondqueryvalue", secondQueryValue).attr("title", text);
                    $currentLabel.find("span").html(text);
                }
            } else {
                $dom = $('<div class="selected-condition" data-queryid="' + queryId + '" data-value="' + value + '" data-secondqueryid="' + secondQueryId + '" data-secondqueryvalue="' + secondQueryValue + '"  title="' + text + '"><span>' + text + '</span><i></i></div>');
                $selected_box.find(".btns_box").before($dom);
            }
            if ($selected_box.is(":hidden")) {
                $selected_box.show();
                $(container).find("#wt-empty").show();
            }
            typeof callback == "function" && callback();
        },
        //销毁相应选择项
        removeLabel: function (queryId, container) {
            var $selected_box = $(container).find(".selected_box");
            var $currentLabel = $selected_box.find("[data-queryid='" + queryId + "']");
            $currentLabel.remove();
        },
        //绑定按钮事件
        bindEvents: function () {
            var this_ = this;
            var $container = $(this.container);
            //搜索按钮点击事件
            $container.find("#wt-search").on("click", function () {
                var params1 = this_.getValue();
                console.log(params1);
            });
            //清空按钮点击事件
            $container.find("#wt-empty").on("click", function () {
                $container.find(".selected_box").find(".selected-condition").remove();
            });
            //已选条件删除事件
            $container.find(".selected_box").on("click", ">div i", function () {
                $(this).closest("div").remove();
            });

            //最近搜索按钮
            $container.find("#wt-recent-search").hover(function (e) {
                $(this).addClass("hover");
                $container.find(".recent-search-panel").addClass("open");
            }, function (e) {
                var event = window.event || e;
                var target = event.relatedTarget || event.toElement;
                if (!$(target).parent().hasClass("open")) {
                    $(this).removeClass("hover");
                    $container.find(".recent-search-panel").removeClass("open");
                }
            });
            //最近搜索面板
            $container.find(".recent-search-panel").on("mouseleave", function (e) {
                var event = window.event || e;
                var target = event.relatedTarget || event.toElement;
                if (!$(target).hasClass("wt-recent-search")) {
                    $(this).removeClass("open");
                    $container.find("#wt-recent-search").removeClass("hover");
                }
            });

            $container.find(".recent-search-panel").on("click", "li", function () {
                $container.find(".selected_box").find(".selected-condition").remove();
                $container.find(".recent-search-panel").removeClass("open");
            });

            if ($container.find(".condition-container").height() > 50) {
                $container.find(".btn-area").on("click", ".collapse-btn", function () {
                    var $this = $(this);
                    var $conditions = conditionCollapse();
                    if ($this.hasClass("active")) {
                        $this.removeClass("active").find("span").html("收起条件");
                        $this.find("i").css({"background-position": "0 -100px"});
                        $conditions.show();
                    } else {
                        $this.addClass("active").find("span").html("展开条件");
                        $this.find("i").css({"background-position": "-10px -100px"});
                        $conditions.hide();
                    }
                });
            }

            function conditionCollapse() {
                var widgets = [];
                var $conditionContainer = $container.find(".condition-container");
                var $conditions = $conditionContainer.find(".widget");
                var top_ = $conditions.eq(0).position().top;
                $conditions.each(function (i, elem) {
                    if ($(elem).position().top > top_) {
                        widgets.push(elem);
                    }
                });
                return $(widgets);
            }
        },
        // 是否显示已选择区域
        showOrHide: function ($container, datas) {
            var flag;
            var datas = datas || [];
            for (var i = 0, len = datas.length; i < len; i++) {
                if (datas[i].title) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                $container.find(".selected_box").show();
                $container.find("#wt-empty").show();
            } else {
                $container.find(".selected_box").hide();
                $container.find("#wt-empty").hide();
            }
        },
        //刷新整个选择区
        refresh: function (datas) {
            this.init(this.container, datas);
        },
        //获取已选择值 key：value
        getValue: function () {
            var $this, queryId, value, secondQueryId, secondQueryValue, params = {};
            $(this.container).find(".selected_box").find(">div").each(function () {
                $this = $(this);
                queryId = $this.attr("data-queryid");
                value = $this.attr("data-value");
                secondQueryId = $this.attr("data-secondqueryid");
                secondQueryValue = $this.attr("data-secondqueryvalue");
                (queryId != "undefined") && (params[queryId] = value);
                (secondQueryId != "undefined") && (params[secondQueryId] = secondQueryValue);
            });
            return params;
        },
        //单个下拉框
        select: function (self, data, container) {
            var instance;
            var this_ = this;
            var configData = data;
            var url = configData.url;
            var width_ = self.width() + "px";

            self.on("click", function (e) {
                if (!instance) {
                    $.ajax({
                        url: url,
                        type: "get"
                    }).done(function (data) {
                        var data = {
                            data: [{text: "男", value: 0}, {
                                text: "女",
                                value: 1
                            }]
                        };
                        var datas = [{text: "请选择", value: "null_"}].concat(data.data);

                        instance = wtSelect.create(self, {
                            data: datas,
                            width: width_,
                            skin: "transparent-select",
                            changedListener: function (obj, option, fullData) {
                                var newObj = $.extend({}, obj);
                                newObj.queryId = configData.queryId;
                                newObj.text = configData.name + "：" + obj.text;
                                this_.addLabel(newObj, container);
                            },
                            beforeShowListener: function () {
                                self.css({"z-index": 2});
                            },
                            beforeHideListener: function () {
                                self.css({"z-index": 1});
                            }
                        });

                        if (configData.value || configData.value == 0) {
                            wtSelect.val(instance, configData.value);
                        }

                        self.find("button").click();
                    });
                }
            });
        },
        //多级联动下拉框
        selectConnect: function (self, data, container) {
            var this_ = this;
            var configData = data;
            var url = configData.url || "";
            var html = '<div class="wt-popover"><span class="wt-select-connect"><span class="wt-select1"></span><span class="wt-select2"></span></span><span class="wt-ok">确定</span></div>';
            var instance1, instance2;
            var instance = wtDialog.popover({
                content: html,
                selector: self,
                quickHide: true
            });

            var $dialog = instance.getDialog();
            var $select1 = $dialog.find(".wt-select1");
            var $select2 = $dialog.find(".wt-select2");
            var newNodes1 = [];
            var newNodes2 = [];
            var rootId = 0;


            $dialog.find(".wt-ok").on("click", function () {
                var data1 = wtSelect.getSelectData(instance1);
                var data2 = wtSelect.getSelectData(instance2);
                var text = data1.text + "-" + data2.text;
                var obj = {
                    queryId: configData.queryId,
                    secondQueryId: configData.secondQueryId,
                    text: configData.name + "：" + text,
                    value: data1.id,
                    secondQueryValue: data2.id
                };

                this_.addLabel(obj, container, function () {
                    instance.hide();
                });
            });

            self.on("click", function () {
                if (!instance1) {
                    $.ajax({
                        url: url,
                        type: "get"
                    }).done(function (data) {
                        var datas = [{pId: 0, id: 1, value: 1, text: "福建"}, {pId: 0, id: 2, value: 2, text: "上海"}, {
                            pId: 1,
                            id: 11,
                            value: 11,
                            text: "福州"
                        }, {
                            pId: 2,
                            id: 21,
                            value: 21,
                            text: "徐汇"
                        }];
                        for (var i = 0, len = datas.length; i < len; i++) {
                            if (datas[i].pId == rootId) {
                                newNodes1.push(datas[i]);
                            }
                        }
                        instance1 = wtSelect.create($select1, {
                            data: newNodes1,
                            skin: "search-select",
                            changedListener: function (obj, option, fullData) {
                                var newNodes = [];
                                for (var i = 0, len = datas.length; i < len; i++) {
                                    if (datas[i].pId == obj.id) {
                                        newNodes.push(datas[i]);
                                    }
                                }
                                instance2 = wtSelect.update(instance2, {
                                    data: newNodes
                                });
                            }
                        });

                        for (var i = 0, len = datas.length; i < len; i++) {
                            if (datas[i].pId == newNodes1[0].id) {
                                newNodes2.push(datas[i]);
                            }
                        }
                        instance2 = wtSelect.create($select2, {
                            data: newNodes2,
                            skin: "search-select"
                        });

                        if (configData.value || configData.value == 0) {
                            wtSelect.val(instance1, configData.value);
                        }
                    });
                }
                instance.show();
            });
        },
        //数据字典下拉框
        selectBetween: function (self, data, container) {
            var this_ = this;
            var configData = data;
            var url = configData.url || "";
            var url1 = configData.url1 || "";
            var html = '<div class="wt-popover"><span class="wt-select-connect"><span class="wt-select1"></span><span class="wt-select2"></span></span><span class="wt-ok">确定</span></div>';
            var instance1, instance2;
            var instance = wtDialog.popover({
                content: html,
                selector: self,
                quickHide: true
            });

            var $dialog = instance.getDialog();
            var $select1 = $dialog.find(".wt-select1");
            var $select2 = $dialog.find(".wt-select2");

            instance.getDialog().find(".wt-ok").on("click", function () {
                if (!instance1 && !instance2) {
                    return false;
                }
                var data1 = wtSelect.getSelectData(instance1);
                var data2 = wtSelect.getSelectData(instance2);
                var text = data1.text + "-" + data2.text;
                var obj = {
                    queryId: configData.queryId,
                    secondQueryId: configData.secondQueryId,
                    text: configData.name + "：" + text,
                    value: data1.id,
                    secondQueryValue: data2.id
                };
                if (!value) {
                    instance.hide();
                    return false;
                }
                this_.addLabel(obj, container, function () {
                    instance.hide();
                });
            });

            self.on("click", function () {
                if (!instance1) {
                    $.ajax({
                        url: url,
                        type: "get"
                    }).done(function (data) {
                        var datas = [{text: "最低学历", value: "null_"}, {id: 1, text: "初中及以下", value: 1}, {
                            id: 2,
                            text: "高中",
                            value: 2
                        }, {id: 3, text: "大学", value: 3}];
                        instance1 = wtSelect.create($select1, {
                            data: datas,
                            skin: "search-select",
                            changedListener: function (obj, option, fullData) {
                                $.ajax({
                                    url: url1,
                                    type: "get",
                                    data: {
                                        id: obj.id
                                    }
                                }).done(function (data) {
                                    var newNodes = [];
                                    instance2 = wtSelect.update(instance2, {
                                        data: newNodes
                                    });
                                })
                            }
                        });

                        if (configData.value || configData.value == 0) {
                            wtSelect.val(instance1, configData.value);
                        }
                    });

                    $.ajax({
                        url: url1,
                        type: "get"
                    }).done(function (data) {
                        var datas = [{text: "最高学历", value: "null_"}, {id: 1, text: "初中及以下", value: 1}, {
                            id: 2,
                            text: "高中",
                            value: 2
                        }, {id: 3, text: "大学", value: 3}];
                        instance2 = wtSelect.create($select2, {
                            data: datas,
                            skin: "search-select"
                        });

                        if (configData.secondQueryValue || configData.secondQueryValue == 0) {
                            wtSelect.val(instance2, configData.secondQueryValue);
                        }
                    });
                }
                instance.show();
            });
        },
        //关键字搜索区
        keyword: function (self, data, container) {
            var instance;
            var this_ = this;
            var configData = data;
            var url = configData.url || "";
            self.attr("data-queryid", data.queryId);
            $.ajax({
                url: url,
                type: "get"
            }).done(function (data) {
                var data = {
                    data: [{
                        'text': '公司', 'value': '0'
                    }, {
                        'text': '学校', 'value': '1'
                    }]
                };
                instance = wtSelect.create(self, {
                    data: data.data,
                    width:"100%",
                    skin: "transparent-select",
                    changedListener: function (data, obj, fullDatas) {
                        var text = data.text;
                        self.closest(".widget").find(">span").html(text);
                    }
                });

                if (typeof configData.value == "number" || typeof configData.value == "string") {
                    wtSelect.val(instance,configData.value);
                    self.closest(".keyword_box").find("input").val(configData.secondQueryValue);
                }

                self.closest(".keyword_box").on("input propertychange", "input", function () {
                    var $this = $(this);
                    var selectData = wtSelect.val(instance);
                    var secondQueryValue = $this.val().trim();
                    var obj = {
                        queryId: configData.queryId,
                        value: selectData.value,
                        secondQueryId: configData.secondQueryId,
                        secondQueryValue: secondQueryValue,
                        text: configData.name + "：" + selectData.text + "-" + secondQueryValue
                    };
                    if (!secondQueryValue) {
                        this_.removeLabel(configData.queryId, container);
                        return false;
                    }
                    this_.addLabel(obj, container);
                });
            });
        },
        //关键字搜索
        keyword1: function (self, data, container) {
            var instance;
            var this_ = this;
            var configData = data;

            if (configData.value || configData.value === 0 || configData.value === "0") {
                self.closest(".keyword_box").find("input").val(configData.queryValue);
            }

            self.closest(".keyword_box").on("input propertychange", "input", function () {
                var $this = $(this);
                var queryValue = $this.val().trim();
                var obj = {
                    queryId: configData.queryId,
                    value: queryValue,
                    text: configData.name + "：" + queryValue
                };
                if (!queryValue) {
                    this_.removeLabel(configData.queryId, container);
                    return false;
                }
                this_.addLabel(obj, container);
            });
        },
        //日期选择器
        dateTimePicker: function (self, data, container) {
            var this_ = this;
            var configData = data;
            var input_ = "<input />";
            self.html(input_);
            self.find("input").css({width: "100%", height: "100%", "opacity": 0});
            var instance = wtDate.init(self.find("input"), {
                changeDate: function (ev) {
                    var time = ev.date.valueOf();
                    time = new Date(time);
                    time = commonJS.DateFormat("yyyy-MM-dd", time);
                    var obj = {
                        queryId: configData.queryId,
                        value: time,
                        text: configData.name + "：" + time
                    };
                    this_.addLabel(obj, container);
                }
            });

            if (configData.value) {
                instance.val(configData.value);
                instance.datetimepicker('update');
            }
        },
        //双日期选择
        dateTimeBetween: function (self, data, container) {
            var obj = {};
            var this_ = this;
            var configData = data;
            var html = "<div class='wt-popover'><input class='custom-input wt-time1' />-<input class='custom-input wt-time2' /><span class='wt-ok'>确定</span></div>";
            var instance1, instance2;
            var instance = wtDialog.popover({
                content: html,
                selector: self,
                quickHide: true,
                onshow: function () {
                    if (!instance1) {
                        instance1 = wtDate.init(instance.getDialog().find(".wt-time1"));
                        instance2 = wtDate.init(instance.getDialog().find(".wt-time2"));
                        if (configData.value) {
                            instance1.val(configData.value);
                            instance1.datetimepicker('update');
                        }

                        if (configData.secondQueryValue) {
                            instance2.val(configData.secondQueryValue);
                            instance2.datetimepicker('update');
                        }

                    }
                }
            });

            instance.getDialog().find(".wt-ok").on("click", function () {
                var time1 = instance1.val();
                var time2 = instance2.val();
                var text = time1 + "-" + time2;
                if (!time1 && !time2) {
                    instance.hide();
                    return false;
                }
                obj = {
                    queryId: configData.queryId,
                    value: time1,
                    secondQueryId: configData.secondQueryId,
                    secondQueryValue: time2,
                    text: configData.name + "：" + text
                };
                this_.addLabel(obj, container, function () {
                    instance.hide();
                });
            });

            self.on("click", function () {
                instance.show();
            });
        },
        //文本输入框
        input: function (self, data, container) {
            var obj = {};
            var this_ = this;
            var configData = data;
            var html = "<div class='wt-popover'><input type='text' class='custom-input' /><span class='wt-ok'>确定</span></div>";

            var instance = wtDialog.popover({
                content: html,
                selector: self,
                quickHide: true
            });

            var $dialog = instance.getDialog();

            if (configData.value || configData.value == 0) {
                $dialog.find("input").val(configData.value);
            }

            instance.getDialog().find(".wt-ok").on("click", function () {
                var value = $dialog.find("input").val().trim();
                if (!value) {
                    instance.hide();
                    return false;
                }
                obj = {
                    queryId: configData.queryId,
                    value: value,
                    text: configData.name + "：" + value
                };
                this_.addLabel(obj, container, function () {
                    instance.hide();
                });
            });

            self.on("click", function () {
                instance.show();
            });
        },
        //下拉自动匹配
        selectInput: function (self, data, container) {
            var obj = {};
            var this_ = this;
            var configData = data;
            var url = configData.url || "";
            var url1 = configData.url1 || "";
            var html = "<div class='wt-popover ui-widget'><div class='select-container'></div><input class='custom-input tags' /><span class='wt-ok'>确定</span></div>";
            var instance1, instance2;
            var instance = wtDialog.popover({
                content: html,
                selector: self,
                quickHide: true
            });

            var $dialog = instance.getDialog();

            self.on("click", function () {
                if (!instance1) {
                    $.ajax({
                        url: url,
                        type: "get"
                    }).done(function (data) {
                        var availableTags, zIndex;
                        var data = {
                            data: [
                                {text: "简历来源", value: "null_"},
                                {text: '拉勾网', value: '0'},
                                {text: '智联招聘', value: '1'}
                            ]
                        };
                        instance1 = wtSelect.create($dialog.find(".select-container"), {
                            data: data.data,
                            skin: "search-select",
                            changedListener: function (obj, option, fullData) {
                                if (obj.value == "null_") {
                                    availableTags = [];
                                } else {
                                    availableTags = [
                                        {label: "ActionScript", id: "0"},
                                        {label: "AppleScript", id: "1"},
                                        {label: "Asp", id: "2"},
                                        {label: "BASIC", id: "3"},
                                        {label: "C", id: "4"},
                                        {label: "C++", id: "5"},
                                        {label: "Clojure", id: "6"},
                                        {label: "COBOL", id: "7"},
                                        {label: "ColdFusion", id: "8"},
                                        {label: "Erlang", id: "9"},
                                        {label: "Fortran", id: "10"},
                                        {label: "Groovy", id: "11"},
                                        {label: "Haskell", id: "11"},
                                        {label: "Java", id: "12"},
                                        {label: "JavaScript", id: "13"},
                                        {label: "Lisp", id: "14"},
                                        {label: "JavaScript", id: "15"},
                                        {label: "Perl", id: "16"},
                                        {label: "PHP", id: "17"},
                                        {label: "Python", id: "18"},
                                        {label: "Ruby", id: "19"},
                                        {label: "Scala", id: "20"}
                                    ];
                                }

                                if (instance2) {
                                    instance2.autocomplete("option", "source", availableTags);
                                } else {
                                    instance2 = $dialog.find(".tags").autocomplete({
                                        source: availableTags,
                                        minLength: 0,
                                        /*select: function (event, ui) {
                                         item = ui.item;
                                         },*/
                                        change: function (event, ui) {
                                            item = ui.item || {};
                                        }
                                    });
                                    $dialog.on("focus", ".tags", function () {
                                        var value = $(this).val() || "";
                                        instance2.autocomplete("search", value);
                                        var zIndex = $dialog.css("zIndex");
                                        instance2.autocomplete("widget").css({
                                            "max-height": "300px",
                                            "overflow-y": "auto",
                                            "overflow-x": "hidden",
                                            "zIndex": zIndex
                                        });
                                    });
                                }
                            }
                        });
                        if (configData.value || configData.value == 0) {
                            wtSelect.val(instance1, configData.value);
                        }
                        if (configData.secondQueryValue) {
                            $dialog.find(".tags").val(configData.secondQueryTitle);
                            item = {id: configData.secondQueryValue, label: configData.secondQueryTitle};
                        }

                        $dialog.on("click", ".wt-ok", function () {
                            var selectData = wtSelect.getSelectData(instance1);
                            if (selectData.value != "null_") {
                                var obj = {
                                    queryId: configData.queryId,
                                    value: selectData.value,
                                    secondQueryId: configData.secondQueryId,
                                    secondQueryValue: item.id || "",
                                    text: configData.name + "：" + selectData.text + "-" + (item.label || "")
                                };
                                this_.addLabel(obj, container, function () {
                                    instance.hide();
                                });
                            } else {
                                instance.hide();
                            }
                        });
                    });
                }
                instance.show();
            });
        },
        //自动匹配
        autoInput: function (self, data, container) {
            var this_ = this;
            var configData = data;
            var url = data.url || "";
            var html = "<div class='wt-popover ui-widget'><input class='custom-input tags' placeholder='自动匹配'  /></div>";
            var instance1, zIndex;

            var instance = wtDialog.popover({
                content: html,
                selector: self,
                quickHide: true
            });

            var $dialog = instance.getDialog();

            if (configData.value) {
                $dialog.find(".tags").val(configData.value);
            }


            $dialog.on("focus", ".tags", function () {
                var value = $(this).val() || "";
                instance1.autocomplete("search", value);
                zIndex = $dialog.css("zIndex");
                instance1.autocomplete("widget").css({
                    "max-height": "300px",
                    "overflow-y": "auto",
                    "overflow-x": "hidden",
                    "zIndex": zIndex
                });
            });

            self.on("click", function () {
                if (!instance1) {
                    $.ajax({
                        url: url,
                        type: "get"
                    }).done(function (data) {
                        var availableTags = [
                            {label: "ActionScript", id: "0"},
                            {label: "AppleScript", id: "1"},
                            {label: "Asp", id: "2"},
                            {label: "BASIC", id: "3"},
                            {label: "C", id: "4"},
                            {label: "C++", id: "5"},
                            {label: "Clojure", id: "6"},
                            {label: "COBOL", id: "7"},
                            {label: "ColdFusion", id: "8"},
                            {label: "Erlang", id: "9"},
                            {label: "Fortran", id: "10"},
                            {label: "Groovy", id: "11"},
                            {label: "Haskell", id: "11"},
                            {label: "Java", id: "12"},
                            {label: "JavaScript", id: "13"},
                            {label: "Lisp", id: "14"},
                            {label: "JavaScript", id: "15"},
                            {label: "Perl", id: "16"},
                            {label: "PHP", id: "17"},
                            {label: "Python", id: "18"},
                            {label: "Ruby", id: "19"},
                            {label: "Scala", id: "20"}
                        ];
                        instance1 = $dialog.find(".tags").autocomplete({
                            source: availableTags,
                            minLength: 0,
                            select: function (event, ui) {
                                var item = ui.item;
                                var obj = {
                                    queryId: configData.queryId,
                                    value: item.id,
                                    text: configData.name + "：" + item.label
                                };
                                this_.addLabel(obj, container, function () {
                                    instance.hide();
                                });
                            }
                        });
                    });
                }
                instance.show();
            });
        },
        //模糊匹配
        autoInput1: function (self, data, container) {
            var this_ = this;
            var configData = data;
            var url = data.url || "";
            var html = "<div class='wt-popover ui-widget'><input class='custom-input tags' placeholder='自动匹配'  /><span class='wt-ok'>确定</span></div>";
            var instance1, zIndex, timer;

            var instance = wtDialog.popover({
                content: html,
                selector: self,
                quickHide: true
            });

            var $dialog = instance.getDialog();

            if (configData.value) {
                $dialog.find(".tags").val(configData.title);
            }

            $dialog.on("input propertychange", ".tags", function () {
                var value = $(this).val();
                if (!timer) {
                    timer = setTimeout(function () {
                        $.ajax({
                            url: url,
                            type: "post",
                            data: {
                                text: value
                            }
                        }).done(function (data) {
                            var availableTags = [
                                {label: "ActionScript", id: "0"},
                                {label: "AppleScript", id: "1"},
                                {label: "Asp", id: "2"},
                                {label: "BASIC", id: "3"},
                                {label: "C", id: "4"},
                                {label: "C++", id: "5"},
                                {label: "Clojure", id: "6"},
                                {label: "COBOL", id: "7"},
                                {label: "ColdFusion", id: "8"},
                                {label: "Erlang", id: "9"},
                                {label: "Fortran", id: "10"},
                                {label: "Groovy", id: "11"},
                                {label: "Haskell", id: "11"},
                                {label: "Java", id: "12"},
                                {label: "JavaScript", id: "13"},
                                {label: "Lisp", id: "14"},
                                {label: "JavaScript", id: "15"},
                                {label: "Perl", id: "16"},
                                {label: "PHP", id: "17"},
                                {label: "Python", id: "18"},
                                {label: "Ruby", id: "19"},
                                {label: "Scala", id: "20"}
                            ];
                            if (instance1) {
                                instance1.autocomplete("option", "source", availableTags);
                            } else {
                                instance1 = $dialog.find(".tags").autocomplete({
                                    source: availableTags
                                });
                            }
                            zIndex = $dialog.css("zIndex");
                            instance1.autocomplete("widget").css({
                                "max-height": "300px",
                                "overflow-y": "auto",
                                "overflow-x": "hidden",
                                "zIndex": zIndex
                            });
                            clearTimeout(timer);
                            timer = null;
                        });
                    }, 2000);
                }
            });

            /*$dialog.on("focus", ".tags", function () {
             var value = $(this).val() || "";
             instance1.autocomplete("search", value);
             zIndex = $dialog.css("zIndex");
             instance1.autocomplete("widget").css({
             "max-height": "300px",
             "overflow-y": "auto",
             "overflow-x": "hidden",
             "zIndex": zIndex
             });
             });*/

            $dialog.on("click", ".wt-ok", function () {
                var value = $dialog.find(".tags").val();
                if (value || value == "0") {
                    var obj = {
                        queryId: configData.queryId,
                        value: value,
                        text: configData.name + "：" + value
                    };
                    this_.addLabel(obj, container, function () {
                        instance.hide();
                    });
                } else {
                    instance.hide();
                }
            });

            self.on("click", function () {
                instance.show();
            });
        },
        //双文本输入框
        inputBetween: function (self, data, container) {
            var obj = {};
            var this_ = this;
            var configData = data;
            var html = "<div class='wt-popover'><input class='custom-input wt-input1' placeholder='" + configData.placeholder1 + "' />--<input class='custom-input wt-input2' placeholder='" + configData.placeholder2 + "'/><span class='wt-ok'>确定</span></div>";
            var instance = wtDialog.popover({
                content: html,
                selector: self,
                quickHide: true
            });

            var $dialog = instance.getDialog();
            var $input1 = $dialog.find(".wt-input1");
            var $input2 = $dialog.find(".wt-input2");

            if (configData.value || configData.value == 0) {
                $input1.val(configData.value);
            }
            if (configData.secondQueryValue || configData.secondQueryValue == 0) {
                $input2.val(configData.secondQueryValue);
            }

            $dialog.find(".wt-ok").on("click", function () {
                var input1 = $input1.val().trim();
                var input2 = $input2.val().trim();
                var title = input1 + "-" + input2;
                if (!input1 && !input2) {
                    instance.hide();
                    return false;
                }
                obj = {
                    queryId: configData.queryId,
                    secondQueryId: configData.secondQueryId,
                    value: input1,
                    secondQueryValue: input2,
                    text: configData.name + "：" + title
                };
                this_.addLabel(obj, container, function () {
                    instance.hide();
                });
            });

            self.on("click", function () {
                instance.show();
            });

        },
        //弹出框
        dialog: function (self, data, container) {
            var instance;
            var this_ = this;
            var configData = data;
            self.on("click", function () {
                if (!instance) {
                    instance = wtDialog.dialog({
                        title: false,
                        url: data.url,
                        data: configData.queryId,
                        cancel: false,
                        oniframeload: function () {
                            instance.showModal();
                        },
                        onclose: function () {
                            instance.remove();
                            instance = null;
                        }
                    });
                }
            });
        }
    };

    template.helper("JsonToStr", function (data) {
        return JSON.stringify(data);
    });
})(jQuery);

