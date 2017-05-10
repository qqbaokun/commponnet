/**
 * Created by ThinkPad on 2016/7/28.
 */
window.wtZtree = {
    init: function ($dom, setting, nodes) {
        return $.fn.zTree.init($dom, setting, nodes);
    },
    getCheckNodes: function (instance, flag) {
        var boolean = (flag === false) ? false : true;
        return instance.getCheckedNodes(boolean);
    },
    getCheckNodesStr: function (nodes, name, id) {
        var obj = {};
        var names = [];
        var ids = [];
        for (var i = 0, len = nodes.length; i < len; i++) {
            names.push(nodes[i][name]);
            ids.push(nodes[i][id]);
        }
        obj.names = names.join(",");
        obj.ids = ids.join(",");
        return obj;
    }
}