# JSDoc – Komplet guide

## 1. Opret projekt

```bash
mkdir jsdoc-demo
cd jsdoc-demo
npm init -y
npm install --save-dev jsdoc
```

---

## 2. Opret koden der skal dokumenteres

Opret filen `src/calculator.js`:

```javascript
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
}

function calculateWithDiscount(value1, value2, operationType, hasDiscount) {
    let result;

    if (operationType === "add") {
        result = add(value1, value2);
    } else if (operationType === "multiply") {
        result = multiply(value1, value2);
    } else {
        throw new Error("Unknown operation type");
    }

    if (hasDiscount) {
        result = result > 100 ? result * 0.9 : result * 0.95;
    }

    return result;
}

module.exports = { add, subtract, multiply, divide, calculateWithDiscount };
```

---

## 3. Tilføj JSDoc-kommentarer
Det første eksempel er tilføjet.

Kig derefterr på [https://jsdoc.app](https://jsdoc.app) og se de forskellige tags man kan bruge. Tilføj selv relevante tags til resten af koden.

```javascript
/**
 * Adds two numbers together.
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 */
function add(a, b) {
    return a + b;
}


function subtract(a, b) {
    return a - b;
}


function multiply(a, b) {
    return a * b;
}


function divide(a, b) {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
}


function calculateWithDiscount(value1, value2, operationType, hasDiscount) {
    let result;

    if (operationType === "add") {
        result = add(value1, value2);
    } else if (operationType === "multiply") {
        result = multiply(value1, value2);
    } else {
        throw new Error("Unknown operation type");
    }

    if (hasDiscount) {
        result = result > 100 ? result * 0.9 : result * 0.95;
    }

    return result;
}

module.exports = { add, subtract, multiply, divide, calculateWithDiscount };
```

---

## 4. Opret JSDoc-konfiguration

Opret `jsdoc.json` i roden:

```json
{
    "source": {
        "include": ["src"],
        "includePattern": ".js$"
    },
    "opts": {
        "destination": "./docs",
        "recurse": true
    }
}
```

---

## 5. Tilføj npm-script

I `package.json`:

```json
"scripts": {
    "docs": "jsdoc -c jsdoc.json"
}
```

---

## 6. Generér dokumentationen

```bash
npm run docs
```

Åbn `docs/index.html` i din browser.

---

## 7. Tilføj Markdown-dokumenter

Opret en `tutorials` mappe:

```bash
mkdir tutorials
```

Opret dine Markdown-filer, fx `tutorials/architecture.md`:

```markdown
# Architecture

Beskriv din arkitektur her...
```

Opret `tutorials/tutorials.json` til at styre titler og rækkefølge:

```json
{
    "architecture": {
        "title": "Architecture"
    },
    "database": {
        "title": "Database"
    }
}
```

Opdater `jsdoc.json` til at inkludere tutorials:

```json
{
    "source": {
        "include": ["src"],
        "includePattern": ".js$"
    },
    "opts": {
        "destination": "./docs",
        "recurse": true,
        "tutorials": "./tutorials"
    }
}
```

Du kan også linke til et dokument direkte fra koden:

```javascript
/**
 * Connects to the database.
 * @see {@tutorial database}
 */
function connect() { ... }
```

---

## 8. Installer docdash theme

```bash
npm install --save-dev docdash
```

Opdater `jsdoc.json`:

```json
{
    "source": {
        "include": ["src"],
        "includePattern": ".js$"
    },
    "opts": {
        "destination": "./docs",
        "recurse": true,
        "tutorials": "./tutorials",
        "template": "./node_modules/docdash"
    }
}
```

---

## 9. Tilpas docdash – omdøb "Tutorials"

Da docdash er under Apache 2.0 licens må du frit kopiere og modificere det. Kopiér docdash ud af node_modules:

```bash
cp -r node_modules/docdash ./themes/docdash
```
(Eller copy/paste mappen)

Opdater `jsdoc.json` til at pege på din lokale kopi:

Brug min `publish.js` og `details.tmpl` og erstat jsdoc´s filer med mine. 

Nu kan du styre navnet via `jsdoc.json`:

```json
{
    "source": {
        "include": ["src"],
        "includePattern": ".js$"
    },
    "opts": {
        "destination": "./docs",
        "recurse": true,
        "tutorials": "./tutorials",
        "template": "./themes/docdash"
    },
    "docdash": {
        "tutorialsLabel": "Documents"
    }
}
```

---

## 10. Publicer til GitHub Pages via GitHub Actions

Opret filen `.github/workflows/docs.yml`:

```yaml
name: Publish Docs

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - run: npm run docs

      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

Aktiver GitHub Actions skriveadgang i dit repository:

**Settings** → **Actions** → **General** → **Workflow permissions** → **Read and write permissions**

Aktiver GitHub Pages:

**Settings** → **Pages** → **Source** → vælg **gh-pages** branch og **/ (root)**

Din dokumentation publiceres automatisk på:
```
https://<dit-brugernavn>.github.io/<dit-repo-navn>/
```

---

## Filstruktur

```
jsdoc-demo/
├── .github/
│   └── workflows/
│       └── docs.yml
├── src/
│   └── calculator.js
├── themes/
│   └── docdash/        ← din modificerede kopi
├── tutorials/
│   ├── tutorials.json
│   ├── architecture.md
│   └── database.md
├── docs/               ← genereret, må ikke committes
├── .gitignore
├── jsdoc.json
└── package.json
```

Tilføj til `.gitignore`:

```
node_modules/
docs/
```