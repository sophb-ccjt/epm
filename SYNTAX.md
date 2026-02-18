# EPM Syntax Reference

EPM (Easily Parse-able Markdown) is a line-based markup language inspired by Markdown but designed to be extremely easy to parse. This document describes the official syntax rules.

---

## 1. Headings

- Lines that start with a `#` followed by a heading level `[1-6]`.
- Have exactly one space before the content.

**Syntax:**
```epm
#1 Heading level 1
#3 Heading level 3
```

**Rules:**
- Must start with `#` and a valid heading level `1-6`.
- Exactly **1 space** separates the level and content.
- No trailing spaces before the `#`.
- Invalid headings are treated as paragraphs.

**Examples:**
```epm
#1 Main Title
#2 Subsection
#6 Smallest Heading
```

**Invalid examples:**
```epm
#0 Invalid level
#7 Invalid level
#1  Too many spaces
# Incorrect start
```

## 2. Paragraphs (Plain Text)

- Any line that is not recognized as a valid markdown line, like headings, escapes, etc.
- Paragraphs are the same as plain text.

**Example:**
```epm
This is a normal paragraph.
It can contain any text.
```

## 3. Escaping

- Any line starting with `\` is treated as plain text.
- The escape character disables EPM parsing for **that line only**.

**Examples:**
```epm
\#1 This is not a heading, just text
\This line starts with a backslash
```

## 4. Collapse / Separate (Line Merging)

EPM supports joining or separating lines for output purposes.

- `<collapse>` merges the current line with the next when flushing by default is **off**.
- `<separate>` forces a line break between lines when flushing by default is **on**.


**Example (not flushing by default):**
```epm
This is the first line.
<collapse>
This is still the first line logically.

This is the second line.
This is not the second line, this is the third line, since the parser is currently not flushing by default.
```

**Example (flushing by default):**
```epm
This is the first line.
<separate>
This is the second line, not the first line.

This is the third line.
This collapses to the third line, since the parser is currently flushing by default.
```

**Rules:**

- Only affects the next line.
- Can be combined with any line type (paragraph, heading, etc.).

## 5. Links



## 6. Optional Syntax

- Future versions may include features like bold, italic, code blocks, notes (like Discord's `-#`), or syntax-highlighted code blocks.
- The official parser will also optionally support Markdown (`--allow-md`) and BBCode (`--allow-bb`).

---

### Notes

- EPM is line-based, meaning parsing is done line by line.
- Parsing mode affects `<collapse>` / `<separate>` behavior.

- EPM is designed for technical users, so the syntax is concise and unambiguous.
- It's recommended to implement EPM editors as GUI-based applications rather than relying solely on typed input.
