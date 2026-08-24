# Local Sewa V10 — React Frontend

This is the frontend-only React/Vite source for Local Sewa V10.

- The PHP API, MySQL database and Hostinger configuration are not included.
- Local development connects to the existing live API at `https://localsewa.com/api` through the Vite development proxy.
- Production builds use the same live API URL.
- The Vite build uses relative asset paths so the generated `dist` folder is suitable for an Android wrapper.

## Run on a Windows computer

### Easy method

1. Install the current Node.js LTS version from <https://nodejs.org/>.
2. Extract this ZIP.
3. Double-click `START_LOCAL_WINDOWS.bat`.
4. On the first run it installs the required frontend packages.
5. Open `http://localhost:5173` if the browser does not open automatically.

### Terminal method

```bash
npm install
npm run dev
```

Do not open `index.html` directly. The local development server is required for React routing and the live API proxy.

## Create the production frontend

Double-click `BUILD_FRONTEND_WINDOWS.bat`, or run:

```bash
npm install
npm run build
```

The finished frontend files are generated inside `dist`.

## Android app preparation

The recommended later step is to wrap this React build with Capacitor or an Android WebView project.

Typical Capacitor commands are:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Local Sewa" "com.localsewa.app" --web-dir=dist
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Important: a bundled Android WebView has a different origin from `localsewa.com`. Before publishing a bundled app, configure either native HTTP networking in the Android wrapper or allow the Android app origin in the live API CORS settings. This does not require changing API routes or database data. A WebView that directly opens `https://localsewa.com` does not require this extra CORS step.

## Configuration files

- `.env.development`: local frontend + live API proxy.
- `.env.production`: production/Android build + live API URL.
- `.env.example`: safe template with no passwords or database credentials.

Never place the Hostinger database password in this React project.
