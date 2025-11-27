# TDZK-Reborn

**Taenaria Derivia Zallus Kitara (TDZK-Reborn)** is a modern, web-based reimplementation of a classic space strategy game interface. This project aims to capture the nostalgic feel of retro sci-fi interfaces while leveraging the power and performance of modern web technologies.

Built with **React 19**, **Vite**, and **Tailwind CSS**, it features a responsive, immersive UI with dynamic starfield animations, retro-styled components, and a modular architecture.

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
src/
├── components/          # Shared UI components
│   ├── game/            # In-game specific interface components
│   │   ├── CenterPanel.tsx
│   │   ├── LeftPanel.tsx
│   │   ├── RightPanel.tsx
│   │   └── ...
│   ├── HallOfFameView.tsx
│   ├── NewsSection.tsx
│   ├── StatisticsView.tsx
│   └── ...
├── data/                # Static data and configuration
├── App.tsx              # Main application entry point
└── main.tsx             # React root rendering
```

## ✨ Key Features

### 🌌 Immersive Interface
- **Dynamic Starfield**: A multi-layered, parallax starfield background that creates depth and motion.
- **Retro Aesthetics**: Custom-styled scrollbars, borders, and typography (Verdana) to match the classic sci-fi look.
- **Responsive Design**: Adapts to different screen sizes while maintaining the fixed-width retro feel where appropriate.

### 🎮 Game Modules
- **Dashboard**: A central hub showing news, server time, and quick links.
- **Game Layout**: A dedicated 3-panel layout (Left, Center, Right) for the core gameplay experience.
- **Navigation**:
  - **NavBar**: Top-level navigation for Help, Stats, and Hall of Fame.
  - **Sidebar**: Quick access to game resources and external links.
  - **D-Pad**: On-screen directional controls for mobile/tablet users.

### 📊 Information Views
- **Hall of Fame**: View top players and alliances.
- **Statistics**: Detailed server and player statistics.
- **Help System**: Integrated documentation for ships, weapons, and game mechanics.
- **News Feed**: Real-time updates and announcements.

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/David2024patton/TDZK-Reborn.git
   cd TDZK-Reborn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with hot module replacement. |
| `npm run build` | Compiles the application for production deployment. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
