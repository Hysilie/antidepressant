<h1 align="left">
  <img src="https://i.ibb.co/Fk3wsj8F/icon.png" alt="Antidepressant Icon" height="32" style="vertical-align: middle;"/> Antidepressant
</h1>

> A pocket app playground built with ❤️ to explore Electron, Firebase & frontend architecture.



## 🤔 Why I Built This

I wanted to build something small, fun, and useful — while **learning big things**.

**Antidepressant** started as a sandbox to explore:
- How to make a **real desktop app** with Electron
- Building a **clean frontend** with React & Tailwind
- Managing real-time data & auth with **Firebase**
- Handling **local files, images, offline mode, caching**, and more
- And mostly... just having fun with it 🌈

> It's not just a to-do app or a journal. It's my personal lab 🧪👩‍🔬.

---

## 🔧 Stack

| Tech         | Why I used it |
|--------------|---------------|
| 🧱 Electron  | To turn web code into a real desktop app |
| ⚛️ React     | Component-based UI, perfect for modular features |
| 🎨 Tailwind  | Fast, consistent styling with utility classes |
| 🔥 Firebase  | Auth, Firestore, and Storage for all backend needs |
| 📝 Tiptap    | Rich-text journaling with custom image handling |
| 🌍 i18next   | App is fully translatable (multi-language ready) |
| 💽 localStorage | For offline mode, syncing, and performance |
| 🧪 Playwright + Vitest | Because testing is part of the fun too |

---

## ✨ Features

🗂 **Todo List**  
> Smart filters, sorting, and persistence

📓 **Journal Editor**  
> Write notes with images, text styles, colors, and custom fonts

🎧 **Music Player**  
> Load local tracks, play/pause, repeat, shuffle, bottom sheet playlist

☁️ **Weather Widget**  
> Fetches and caches local weather with a single request

🎨 **Preferences**  
> Choose your theme — it’s your space

♦️ **Peak A View**   
> A tiny matching card game, just to have fun

🧪 **Full testing setup**  
> From unit tests to end-to-end scenarios 

---

## 🧩 App Architecture

- Modular, scalable structure
- Providers for global state (Player, Preferences, Auth)
- Offline-first logic with sync-on-focus
- Smart image system using `data-image-id` placeholders and Firestore
- Super compact UI: 350x500px — like a mobile app on desktop

---

## 🎬 Screenshots

<p align="center">
  <img src="https://i.ibb.co/TMwdwVyD/Peak-AView.png" alt="Peak-AView" height="150" style="margin-right: 24px;">
  <img src="https://i.ibb.co/7dD7J44j/Preferences-Screen.png" alt="Preferences Screen" height="150" style="margin-right: 24px;">
  <img src="https://i.ibb.co/FL6XNzXY/Journal-Editor.png" alt="Journal Editor" height="150" style="margin-right: 24px;">
  <img src="https://i.ibb.co/PvmWZWv2/Journal-Screen.png" alt="Journal Screen" height="150" style="margin-right: 24px;">
  <img src="https://i.ibb.co/r2cTYJCX/Playlist-Screen.png" alt="Playlist Screen" height="150" style="margin-right: 24px;">
  <img src="https://i.ibb.co/35vdDwvM/Home-Screen.png" alt="Home Screen" height="150">
</p>

## 🧠 What I Learned

- How to actually **ship an Electron app**
- Real-world Firebase strategies (caching, cost, structure)
- UI/UX design in super tight space
- Smart ways to handle **images in rich text**
- **Playwright E2E tests** with Electron (which was… fun and painful 😅)
- How to mix code with creativity 💡

---

## 🧳 What’s Next?

- More polish (animations, transitions, etc.)
- A **Tamagotchi** companion


## 🪪 License

MIT 
