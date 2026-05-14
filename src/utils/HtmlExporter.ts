const startComment = '/*** Slideshow Start ***/';
const endComment = '/*** Slideshow End ***/';

export function openCurrentDocument(): string {
    const xml = new XMLSerializer();
    return `
        <!doctype html>
        <html lang="en" data-bs-theme="dark">
            ${xml.serializeToString(document.head)
                .replaceAll('&gt;', '>')
                .replaceAll('&lt;', '<')
                .replaceAll('&amp;', '&')}
            <body>
                <div id="root"></div>
            </body>
        </html>
    `;
}

export function alterHtml(html: string, newContent: string): string {
    const startIndex = html.indexOf(startComment);
    const endIndex = html.indexOf(endComment);
    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
        return html;
    }
    const before = html.substring(0, startIndex + startComment.length);
    const after = html.substring(endIndex);
    return before + '\nwindow.SLIDESHOW=`\n' + newContent + '\n`;\n' + after;
}
