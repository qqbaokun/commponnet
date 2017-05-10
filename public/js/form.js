/**
 * Created by ThinkPad on 2016/8/23.
 */
window.wtForm = {
    initUeditor: function (id,options) {
        var ue = UE.getEditor(id, {
            toolbars: [
                ['fullscreen', 'source', 'undo', 'redo'],
                ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall','simpleupload','insertimage', 'cleardoc']
            ],
            allowDivTransToP: false,
            // imageUrl:""
        });
        return ue;
    }
};
