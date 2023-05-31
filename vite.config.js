import fs from 'fs';
import yaml from 'js-yaml';
import Mustache from 'mustache';

const isProd = process.env.NODE_ENV === 'production'

function mustacheRenderer() {
    return {
        name: 'html-transform',
        transformIndexHtml(html) {
            try {
                const yamlData = fs.readFileSync('fixture.yml', 'utf-8');
                const data = yaml.load(yamlData);

                return Mustache.render(html, data);
            } catch (error) {
                console.error(error);
                return html;
            }
        },
    }
}

export default {
    root: './src',
    plugins: [
        !isProd && mustacheRenderer()
    ]
};
