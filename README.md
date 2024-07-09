# 🪃 Bounce Back Railway 🚃 

[Live Demo 🚀](https://buzcarter.github.io/bounce-back-railway/)

A JavaScript visual prototype implementation for a mini-train microcontroller that auto-reverses at the ends of a straight track, with any number of intermediate "station" stops. Perfect for model railroaders looking for a simple and fun automation solution.

This simplified prototype railway is for debugging logic before completeing the micro-conroller (C++) coding and circuit schematics.

This mimic Arduino's abilities and programming style, your main.ts file should export `setup` & `loop` methods. We'll eschew JS niceties such as callbacks outside the simulator.

* "simulator" -- handles HTML interactions
* "microproccessor" -- familiar framework for I/O read/write
* main & all the rest is your app

## 💾 Installation

```sh
npm install
```

## 🎚️ Usage

1. 🔨 Build

Command + Shift + B or via terminal:

```sh
npm run build
```

2. 🕹️ Open "src\views\index.html" in your browser

### Developing

Start webpack in watch mode to autorun build whenever a file changes:

```sh
npm start
```

#### Manually Lint

```sh
npm run lint
npm run lint:fix
```

## 🎁 Resources

* [Icons](https://www.iconbolt.com/)
* [Jittery Trolley, "Getting Jittery On Hover Using Only CSS"](https://www.kirupa.com/snippets/getting_jittery_on_hover_using_only_css.htm)

## ✔️ TODO List

* 
