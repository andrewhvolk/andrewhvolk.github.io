# Prayer Tracker

A simple, privacy-focused app to manage prayer requests, notes, and answered prayers. Features include dark mode, local storage, and easy import/export for backup and sharing.

---

## Features

- **Prayer Requests**: Add, edit, and track prayer requests.
- **Notes**: Attach notes to each request for context or updates.
- **Mark as Answered**: Mark prayers as answered and keep a record.
- **Dark Mode**: Switch between light and dark themes for comfort.
- **Local Storage**: All data is stored locally in your browser/device.
- **Import/Export**: Backup or transfer your data via JSON files.

---

## Setup & Installation

### 1. Clone the Repository

```sh
git clone https://github.com/andrewhvolk/PrayerTracker.git
cd PrayerTracker
```

### 2. Install Dependencies

If using Node.js (for web or Electron):

```sh
npm install
```

### 3. Run the App

- **Web**:  
  ```sh
  npm start
  ```
  Then open [http://localhost:3000](http://localhost:3000) in your browser.

- **Electron/Desktop**:  
  ```sh
  npm run electron
  ```

> _No server or database required. All data is local._

---

## Usage Guide

### Adding a Prayer Request

1. Click **Add Prayer**.
2. Enter a title and optional details.
3. Save to add it to your list.

### Editing or Deleting

- Click the **Edit** or **Delete** icon next to a request.

### Marking as Answered

- Click **Mark as Answered** to move a request to the answered list.

### Adding Notes

- Open a prayer request and use the **Notes** section to add or update notes.

### Import/Export

- **Export**: Go to Settings > Export, and download your data as a `.json` file.
- **Import**: Go to Settings > Import, and upload a previously exported `.json` file.

---

## File & Folder Structure

```
PrayerTracker/
├── public/           # Static assets (index.html, icons)
├── src/
│   ├── components/   # UI components (PrayerList, PrayerForm, Notes, etc.)
│   ├── hooks/        # Custom React hooks (useLocalStorage, useTheme)
│   ├── utils/        # Utility functions (import/export, data validation)
│   ├── App.js        # Main app logic
│   └── index.js      # Entry point
├── package.json      # Project metadata and scripts
└── README.md         # Documentation
```

**Architecture Summary:**
- Modular React components for UI.
- State managed via React hooks and local storage.
- Utility functions for import/export and data handling.
- Theming handled via context or CSS variables.

---

## Environment Safety & Modularity

- **Privacy**: No data leaves your device. No external API calls.
- **Local Storage**: All requests, notes, and settings are saved in your browser or desktop app storage.
- **Modularity**: Components and utilities are decoupled for easy maintenance and extension.
- **No dependencies on environment variables**: Safe for offline and portable use.

---

## Extending the App

### Adding Features

- Create new components in `src/components/`.
- Add new state or logic in `src/hooks/` or `src/utils/`.
- Update the UI by modifying or adding to existing components.

### Customizing the UI

- Edit styles in `src/styles/` or use CSS-in-JS within components.
- Modify theme variables for colors, fonts, and spacing.
- Add new themes by extending the theme context/provider.

### Example: Adding a "Categories" Feature

1. Create a `CategorySelector` component.
2. Update the prayer request form to include category selection.
3. Store category data in local storage.
4. Update list views to filter/group by category.

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Submit a pull request with a clear description.

---

## License

[MIT](LICENSE)

---

## Support

For questions or suggestions, open an issue on GitHub.