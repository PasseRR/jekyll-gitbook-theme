$(document).ready(function () {
    function generateUniqueIdentifier() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 10);
    }

    $('pre').each(function (index, codeBlock) {
        var text,
            codes = $(codeBlock).find('code').first(),
            code = codes.length ? codes : undefined,
            uuid = generateUniqueIdentifier();
        var copyBtn = $('<button class="fa fa-clipboard" style="z-index: 10; position: relative; border: none; float: right; background: none"></button>'),
            fullBtn = $('<button class="fa fa-expand" style="z-index: 10; position: relative; border: none; float: right; background: none"></button>');
        // 不存在code节点或者是mermaid图
        if (!code || !code.hasClass('language-mermaid')) {
            text = code ? code.text() : codeBlock.innerText;
            // 添加复制按钮
            $(codeBlock).prepend(copyBtn);
        } else {
            // 添加svg模态框
            var modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
                '<div class="modal-dialog modal-lg" role="document">' +
                '<div class="modal-content">' +
                '</div></div>').attr('id', uuid);
            var content = modal.find('.modal-dialog').find('.modal-content');
            var btns = $('<div style="z-index: 10; float: right; position: relative; display: flex; justify-content: flex-end;align-items: flex-start; opacity: .8" aria-label="SVG Controls">' +
                '      <button id="zoom-in' + uuid + '" class="btn btn-default"><i class="fa fa-search-plus"></i></button>' +
                '      <button id="reset' + uuid + '" class="btn btn-default"><i class="fa fa-refresh"></i></button>' +
                '      <button id="zoom-out' + uuid + '" class="btn btn-default"><i class="fa fa-search-minus"></i></button>' +
                '    </div>' +
                '<div id="svg' + uuid + '" style="cursor: grab; position: relative;justify-content: center; align-items: center; display: flex; width: 100%; height: 100%; overflow: hidden">' +
                '</div>');
            btns.appendTo(content);
            var s = code.find('svg').first().clone();
            s.attr('name', 'svg' + uuid);
            s.appendTo(modal.find('#svg' + uuid));
            $(codeBlock).append(modal);
            // 添加全屏按钮
            $(codeBlock).prepend(fullBtn);
        }

        copyBtn.click(function () {
            window.navigator.clipboard.writeText(text);

            copyBtn.attr('class', 'fa fa-check').css('color', 'green').text('Copied');
            setTimeout(function () {
                copyBtn.attr('class', 'fa fa-clipboard').css('color', '').text('');
            }, 2000);
        });

        // 全屏开关
        fullBtn.click(function () {
            $('#' + uuid).modal();
        });

        var scaleStep = 0.07;
        var scale = 1, svg = $('[name="svg' + uuid + '"]');

        svg.draggable();

        $('#zoom-in' + uuid).click(function () {
            zoom('in');
        });

        $('#zoom-out' + uuid).click(function () {
            zoom('out');
        });

        $('#reset' + uuid).click(function () {
            reset();
        });

        svg.on('mousewheel', function (event) {
            // 根据 event.originalEvent.deltaY 的值判断滚轮的方向
            if (event.originalEvent.deltaY > 0) {
                zoom('in');
            } else {
                zoom('out');
            }
        });

        $('#' + uuid).on('hidden.bs.modal', function () {
            // 在模态框关闭时执行的操作
            reset();
        });

        function updateTransform() {
            svg.css('transform', 'scale(' + scale + ')')
                .css('left', '0px')
                .css('top', '0px');
        }

        function zoom(zoom) {
            switch (zoom) {
                case 'in':
                    scale += scaleStep;
                    break;
                case 'out':
                    scale -= scaleStep;
                    scale = scale < 0 ? 0 : scale;
                    break;
            }
            updateTransform();
        }

        function reset() {
            scale = 1;
            updateTransform();
        }
    });
});
