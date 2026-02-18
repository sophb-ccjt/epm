# EPM

Official GitHub repository for EPM (Easily Parseable Markdown)

# Setup

**Note:** EPM currently only works via CLI on Linux. More platform support is coming soon.

Run this on your terminal:
```bash
wget https://raw.githubusercontent.com/sophb-ccjt/epm/refs/heads/main/setup.sh
chmod +x setup.sh
# Run normally, or with sudo to allow missing packages to be installed
./setup.sh      # or sudo ./setup.sh
```

This should create an `epm.sh` file and `EPM` directory.

# CLI Parameters:

(`*`: parameter currently doesn't work!)

- `--input` (`-i`): input EPM file for parsing content. no default value

- `--output` (`-o`): output file for the parsed content. empty string makes it so the output is logged to the console. default value: `""`

- `--output-type` (`-O`): output type for the parsed content. can be `"json"`, `"html"`, or `"xml"`. default value: `"json"`

- `--tab-size` (`-t`): tab size for output files. default value: `4`

- `--minify` (`-m`)*: minify output files.

- `--flush-by-default` (`-f`)*: flush markdown lines by default.

- `--error-invalid` (`-e`)*: error on invalid syntax.

- `--allow-md` (`-M`)*: toggles parsing Markdown files as well.

- `--allow-bb` (`-B`)*: toggles parsing BBCode files as well.