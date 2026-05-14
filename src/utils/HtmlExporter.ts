const startComment = '/*** Slideshow Start ***/';
const endComment = '/*** Slideshow End ***/';

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
