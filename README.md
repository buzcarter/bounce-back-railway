# 🪃 Bounce Back Railway 🚃 

[Live Demo 🚀](https://buzcarter.github.io/bounce-back-railway/)

A JavaScript train simulator to assist with "visual prototyping" a simple microcontroller implementation that supports auto-reversing at the ends of a straight track, with any number of intermediate "station" stops. Convenient for model railroaders looking for a simple way to experiment with microcontrollers and sensors.

This simplified prototype railway is for debugging logic before completeing the micro-conroller (C++) coding and circuit schematics.

This mimic Arduino's abilities and programming style, your main.ts file should export `setup` & `loop` methods. We'll eschew JS niceties such as callbacks outside the simulator.

* 🎛️ "app" -- your project code
* 🔧"config" -- define your station/sensor locations
* ⏲️ "microproccessor" -- familiar framework for I/O read/write
* 📺 "simulator" -- handles HTML interactions

## 💾 Installation

```sh
npm install
```

## 🎚️ Usage

1. 🔨 Build

```sh
npm run build
```

If you're using Visual Studio Code the `tasks.json` includes a default build entry so you press Command + Shift + B to build.

2. 🕹️ Open "src/simulator/assets/views/index.html" in your browser: `file:///PATH-TO-YOUR-CODE/src/simulator/assets/views/index.html

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
