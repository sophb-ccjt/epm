#!/usr/bin/env node

const { parseEPM } = require('./parser.js');

// default flag values
const DEFAULTS = {
    file: '',
    outputType: 'json',
    flushByDefault: false,
    minify: false,
    outputFile: '',
    allowMd: false,
    allowBb: false,
    errorInvalid: false,
    tabSize: 4,
};

// simple argument parser
function parseArgs(argv) {
    const args = { ...DEFAULTS };
    for (let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        switch (arg) {
            case '--input':
            case '-i':
                args.file = argv[++i];
                break;
            case '--output-type':
            case '-O':
                args.outputType = argv[++i];
                break;
            case '--tab-size':
            case '-t':
                args.tabSize = parseInt(argv[++i]);
                break;
            case '--flush-by-default':
            case '-f':
                args.flushByDefault = true;
                break;
            case '--minify':
            case '-m':
                args.minify = true;
                break;
            case '--output-file':
            case '-o':
                args.outputFile = argv[++i];
                break;
            case '--allow-md':
            case '-M':
                args.allowMd = true;
                break;
            case '--allow-bb':
            case '-B':
                args.allowBb = true;
                break;
            case '--error-invalid':
            case '-e':
                args.errorInvalid = true;
                break;
            default:
                console.warn(`Unknown argument: ${arg}`);
        }
    }
    return args;
}

// main function
function main() {
    const parsedArgs = parseArgs(process.argv);

    // enforce required input file
    if (!parsedArgs.file) {
        console.error('Error: You must provide an input file with --input or -i');
        process.exit(1);
    }

    parseEPM({
        file: parsedArgs.file,
        flushByDefault: parsedArgs.flushByDefault,
        minify: parsedArgs.minify,
        outputType: parsedArgs.outputType,
        outputFile: parsedArgs.outputFile,
        allowMd: parsedArgs.allowMd,
        allowBb: parsedArgs.allowBb,
        errorInvalid: parsedArgs.errorInvalid,
        tabSize: parsedArgs.tabSize,
    });
}

main();
