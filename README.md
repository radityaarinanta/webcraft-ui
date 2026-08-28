# WebCraft UI

A modular, lightweight UI component library built with vanilla HTML5, CSS3, and JavaScript. Designed for high performance, accessibility, and seamless integration without external dependencies or heavy frontend frameworks.

## Features

- Zero framework dependencies (Pure Vanilla JS and CSS)
- Fully responsive and accessible component architecture
- Consistent design token system with dark and light mode support
- Modular file structure for selective component usage
- Interactive live showcase and documentation catalog

## Project Structure

```
webcraft-ui/
├── src/
│   ├── components/
│   │   ├── button/
│   │   ├── modal/
│   │   ├── navbar/
│   │   └── toast/
│   ├── styles/
│   │   ├── tokens.css
│   │   └── reset.css
│   └── index.js
├── docs/
│   ├── index.html
│   ├── docs.css
│   └── docs.js
├── tools/
│   ├── scaffold.js
│   └── catalog.json
└── package.json
```

## Getting Started

### Local Development

To start the local documentation and component preview server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### Scaffolding Components

To inspect available components or scaffold a new component into the library:

```bash
# List available components in registry
npm run scaffold:list

# Dry run component generation
npm run scaffold:dry

# Scaffold component locally
npm run scaffold:local

# Scaffold component with GitHub workflow integration
npm run scaffold
```

## License

MIT License. Open source for personal and commercial use.
