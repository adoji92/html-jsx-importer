# html-jsx-importer
Parse html and make it compatible with react JSX. Powered by Node.js

---

## Installation

`npm install`

## Run

`node .`

---

This is NOT a loader, or a plugin for webpack. Sorry.

But i made up this script for co-operating with designer. (some sort of web publisher)

The script handles below functions.

- `<br>` => `<br />`
- `<hr>` => `<hr />`
- `class="` => `className="`
- `for="` => `htmlFor="`
- `style="background-color: white; padding: 10px;"` => `style={{ backgroundColor: 'white', padding: '10px' }}`
- `<img src="flags/flag_vietnam.png"> => `<img src="flags/flag_vietnam.png" />`

