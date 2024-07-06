# 🪃 Bounce Back Railway 🚃 

[Live Demo 🚀](https://buzcarter.github.io/bounce-back-railway/)

A JavaScript visual prototype implementation for a mini-train microcontroller that auto-reverses at the ends of a straight track, with any number of intermediate "station" stops. Perfect for model railroaders looking for a simple and fun automation solution.

This simplified prototype railway is for debugging logic before completeing the micro-conroller (C++) coding and circuit schematics.

Since this is meant to somewhat mimic the Arduino's abilities and programming style (`setup` & `loop`, for example) we'll eschew JS niceties like smooth animations be `requestAnimationFrame`, and no callbacks. 

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

## 🎁 Resources

* [Icons](https://www.iconbolt.com/)
* [Jittery Trolley, "Getting Jittery On Hover Using Only CSS"](https://www.kirupa.com/snippets/getting_jittery_on_hover_using_only_css.htm)

## ✔️ TODO List

* Power is a mess, should directly interact with microcontroller.
