$(document).ready(function () {
    function generateUniqueIdentifier() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 10);
    }

    $('pre').each(function (index, codeBlock) {
        var text,
            codes = $(codeBlock).find('code').first(),
            code = codes.length ? codes : undefined,
            copyBtn = $('<button class="fa fa-clipboard" style="z-index: 10; position: relative; border: none; float: right; background: none"></button>');
        // 不存在code节点或者是mermaid图
        if (!code || !code.hasClass('language-mermaid')) {
            text = code ? code.text() : codeBlock.innerText;
            // 添加复制按钮
            $(codeBlock).prepend(copyBtn);
        } else {
            // 若是mermaid忽略
            return;
        }

        copyBtn.click(function () {
            window.navigator.clipboard.writeText(text);

            copyBtn.attr('class', 'fa fa-check').css('color', 'green').text('Copied');
            setTimeout(function () {
                copyBtn.attr('class', 'fa fa-clipboard').css('color', '').text('');
            }, 2000);
        });
    });
});
