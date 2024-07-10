# 🎛️ Microcontroller Simulator Playground

[Live Demo 🚀](https://buzcarter.github.io/bounce-back-railway/)

## Why This Project?

When I started programming microcontrollers—specifically the Arduino Uno—I quickly realized how time-consuming it was to wire up sensors, write code, flash the controller, and run it. The process was slow and tedious, especially for someone just learning microcontrollers or who is impatient.

That's why I created this project: a simulator, a mock controller, and a web app that allows you to visualize and debug signals from mock sensors without needing to spend hours moving jumpers around breadboards. I chose TypeScript for this project because its type system makes it easier to transition your app from JavaScript to C++.

## Project Overview

This project is divided into four main components:

1. **App**: Your project code.
2. **Mock Microcontroller**: A familiar framework for I/O read/write operations.
3. **Web Simulator**: Handles HTML interactions and visualizes the microcontroller's behavior.
4. **Configuration**: Define your station/sensor locations and other settings.

## Features

- **Train Simulator**: Focus on triggering sensors and managing various states quickly through "visual prototyping" of a simple layout.
- **Control Parameters**: Supports auto-reversing at the ends of a straight track, speed control, pauses, and reverse, with any number of intermediate "station" stops.
- **Familiar Project Setup**: Mimics Arduino's programming style with `setup` & `loop` methods, making it easy to transition from the simulator to actual hardware.

## 🛠️ Installation

```sh
npm install
```

```sh
git clone https://github.com/buzcarter/bounce-back-railway.git
npm install
```

## 🎮 Usage

1. **Build**

    ```sh
    npm run build
    ```

    If you're using Visual Studio Code, the tasks.json includes a default build entry, so you can press Command + Shift + B to build.

2. **Open in Browser**

    Open `dist/index.html` in your browser:

    ```
    file:///PATH-TO-YOUR-CODE/dist/index.html
    ```

## 👨‍💻 Developing

### Auto-Build

Start webpack in watch mode: auto-runs the build whenever a file changes:

```sh
npm start
```

### Manual Linting

```sh
npm run lint
npm run lint:fix
```

Enjoy exploring the world of microcontrollers with ease and speed!
