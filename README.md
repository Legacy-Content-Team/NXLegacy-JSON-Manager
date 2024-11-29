# NXLegacy JSON Manager

A modern web application for managing game data in JSON format, built with React, TypeScript, and Tailwind CSS.

## Features

- 🎮 Manage base game, DLC, and update information
- 🔗 Organize and store game-related links
- 🌓 Dark/Light theme with system preference detection
- 🌍 Internationalization support (English/French)
- 🔍 Search functionality for DLCs
- 📝 JSON preview and validation
- 💾 Import/Export JSON data

## Technical Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Lucide React
- **Internationalization**: i18next
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Legacy-Content-Team/NXLegacy-JSON-Manager.git
cd nxlegacy-json-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Base Game Management
- Enter the base game TID (must be 16 hexadecimal characters ending with '000')
- Set the base version
- Add links with custom names or auto-inferred from domains

### DLC Management
- Add multiple DLCs with their respective TIDs and versions
- Search DLCs by TID
- Manage links for each DLC

### Update Management
- Add game updates with versions (multiples of 65536)
- Update IDs are automatically generated based on the base game ID
- Organize update links

### DLC Pack
- Optionally include a DLC pack
- Manage DLC pack-specific links

### JSON Operations
- Load existing JSON data
- View current JSON structure
- Export data to JSON file

## Project Structure

```
src/
├── components/         # React components
├── context/           # React context providers
├── i18n/              # Internationalization files
│   └── locales/       # Language translations
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)
- [i18next](https://www.i18next.com/)