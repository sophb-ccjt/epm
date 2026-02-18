const path = require('path');

// placeholder parser
function parseEPM({
    file,
    flushByDefault,
    minify,
    outputType,
    outputFile,
    allowMd,
    allowBb,
    errorInvalid
}) {
    if (!file) {
        console.error('Error: No input file specified.');
        process.exit(1);
    }

    console.log('parseEPM called with:');
    console.log({ file, flushByDefault, minify, outputType, outputFile, allowMd, allowBb, errorInvalid });

    const types = {
        xml: { extension: 'xml', label: "XML" },
        html: { extension: 'html', label: "HTML" },
        json: { extension: 'json', label: "JSON" }
    };

    if (!Object.keys(types).includes(outputType)) {
        console.error(`Error: output type "${outputType}" is invalid or unsupported.`);
        process.exit(1);
    }

    if (!outputFile) {
        console.log('Parsed content would be outputted to stdout (console.log).');
    } else {
        console.log(`Output file would be "${outputFile}.${types[outputType].extension}".`);
    }
}

module.exports = { parseEPM };
