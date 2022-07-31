import { minify } from 'html-minifier-terser';


export const minifyHtml = async (content: string) => {
    

    content = await minify(content, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
    });

    

    return content
}