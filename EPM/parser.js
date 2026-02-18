const fs = require('fs');
const path = require('path');

const tokens = [
    {
        pattern: /^#([1-6]) (.+)/,
        groups: ["size", "content"],
        label: "heading",
        output: {
            type: 'heading',
            size: '<group1>',
            content: '<group2>'
        }
    },
    {
        pattern: /^\\(.+)/,
        groups: [],
        label: "markdown-disable",
        output: {
            type: 'paragraph',
            content: '<group1>'
        }
    },
    {
        pattern: /^<collapse>$/,
        groups: [],
        label: "collapse",
        output: { type: 'collapse' }
    },
    {
        pattern: /^<separate>$/,
        groups: [],
        label: "separate",
        output: { type: 'separate' }
    }
];

function parseEPM({
    file,
    flushByDefault = false,
    minify = false,
    outputType = 'json',
    outputFile = '',
    allowMd = false,
    allowBb = false,
    errorInvalid = false,
    tabSize = 4
}) {
    if (!file) {
        console.error('Error: No input file specified.');
        process.exit(1);
    }

    const types = {
        json: { extension: 'json', label: "JSON" },
        html: { extension: 'html', label: "HTML" },
        xml: { extension: 'xml', label: "XML" }
    };

    if (!types[outputType.toLowerCase()]) {
        console.error(`Error: output type "${outputType}" is invalid or unsupported.`);
        process.exit(1);
    }

    const ext = types[outputType.toLowerCase()].extension;
    if (outputFile) outputFile = `${outputFile}.${ext}`;

    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const parsedLines = [];

    // First, parse tokens into a structured array
    let skipNextLineBreak = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let matched = false;
        for (const token of tokens) {
            if (token.pattern.test(line)) {
                const regexOut = token.pattern.exec(line) || [];
                const groups = regexOut.slice(1);
                const output = JSON.parse(JSON.stringify(token.output));
                for (const key in output) {
                    output[key] = output[key].replace(/<group(\d+)>/g, (_, n) => groups[parseInt(n) - 1] || '');
                }

                if (output.type === 'collapse') {
                    if (!flushByDefault) skipNextLineBreak = true;
                } else if (output.type === 'separate') {
                    if (flushByDefault) parsedLines.push({ type: 'br' });
                } else {
                    parsedLines.push(output);
                    if (skipNextLineBreak) {
                        skipNextLineBreak = false; // skip one line break after collapsed element
                        parsedLines.push({ type: 'skip-br' });
                    }
                }

                matched = true;
                break;
            }
        }
        if (!matched) {
            parsedLines.push({ type: 'paragraph', content: line });
        }
    }

    function renderJSON() {
        if (minify) return JSON.stringify(parsedLines);
        return JSON.stringify(parsedLines, null, tabSize);
    }

    function renderHTML() {
        const indent = minify ? '' : ' '.repeat(tabSize);
        let html = '';
        parsedLines.forEach((el, idx) => {
            if (el.type === 'heading') html += `<h${el.size}>${el.content}</h${el.size}>` + (minify ? '' : '\n');
            else if (el.type === 'paragraph') html += `<p>${el.content}</p>` + (minify ? '' : '\n');
            else if (el.type === 'br') html += '<br>' + (minify ? '' : '\n');
            else if (el.type === 'skip-br') html += ''; // collapse removes visible break
        });
        return html;
    }

    function renderXML() {
        const indent = minify ? '' : ' '.repeat(tabSize);
        let xml = minify ? '' : '<?xml version="1.0"?>\n<epm>\n';
        parsedLines.forEach(el => {
            if (el.type === 'heading') xml += `<heading level="${el.size}">${el.content}</heading>` + (minify ? '' : '\n');
            else if (el.type === 'paragraph') xml += `<paragraph>${el.content}</paragraph>` + (minify ? '' : '\n');
            else if (el.type === 'br') xml += '<br/>' + (minify ? '' : '\n');
        });
        if (!minify) xml += '</epm>\n';
        return xml;
    }

    let outputContent = '';
    switch (outputType.toLowerCase()) {
        case 'json': outputContent = renderJSON(); break;
        case 'html': outputContent = renderHTML(); break;
        case 'xml': outputContent = renderXML(); break;
    }

    if (outputFile) {
        fs.writeFileSync(outputFile, outputContent, 'utf8');
        console.log(`Output written to ${outputFile}`);
    } else {
        console.log(outputContent);
    }
}

module.exports = { parseEPM };
