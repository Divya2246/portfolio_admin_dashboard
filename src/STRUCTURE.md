# Source Folder Structure

Production-ready modular layout for the portfolio admin dashboard.

**Overview:** The project root holds config files (`package.json`, `tsconfig.json`, `tailwind.config.js`, `.env.example`), the `public/` folder for static assets and `index.html`, and a `docs/` folder for API, Firebase, and portfolio guides. All application code lives under `src/`: the **app/** folder contains the root `App.tsx` (router, auth wiring, and providers) and global styles; **common/** holds shared UI—**components/** (Button, Card, and the **DynamicForm** system with field types under `DynamicForm/fields/`) and **layouts/** (e.g. MainLayout); **pages/** groups route-level screens (Home, Login, Dashboard with form and header, and Preview); **firebase/** has `config.ts` for initialization and **services/** for Auth, Firestore, portfolio, and Storage; **redux/** holds the store, typed hooks, and **slices/** (portfolio and app state); **portfolio-display/** is a self-contained, reusable module (types and `PortfolioDisplay` component) used by Preview and intended for reuse on the live portfolio site; **hooks/**, **constants/**, **types/**, and **utils/** round out shared logic and configuration, with **assets/** for images and fonts.

```
src/
├── app/                    # App shell & entry UI
│   ├── App.tsx             # Root component, router, providers
│   └── App.css
├── common/                 # Shared building blocks
│   ├── components/         # Reusable UI (Button, Card, DynamicForm)
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── DynamicForm/    # Form + FieldRenderer + fields/* (Input, TextArea, skillArray, etc.)
│   │   └── index.ts
│   └── layouts/
│       ├── MainLayout/
│       └── index.ts
├── pages/                  # Route-level page components
│   ├── Home/
│   ├── Login/
│   ├── Dashboard/          # Form, header, portfolioFields.ts
│   ├── Preview/
│   └── index.ts
├── firebase/               # Firebase config & services
│   ├── config.ts           # Init, getAuth, getFirestore, getStorage
│   ├── services/           # auth, firestore, portfolio, storage, analytics
│   └── index.ts
├── redux/
│   ├── store.ts
│   ├── hooks.ts
│   ├── slices/             # portfolioSlice, appSlice
│   └── index.ts
├── portfolio-display/      # Reusable portfolio view (types + PortfolioDisplay.tsx)
├── hooks/
├── constants/              # routes, etc.
├── types/
├── utils/
├── assets/
├── index.tsx
├── index.css
└── react-app-env.d.ts
```

## Conventions

- **Barrel exports**: Use `index.ts` in each folder for clean imports.
- **Features**: Add new slices under `redux/slices/`, new pages under `pages/<PageName>/`.
- **Firebase**: Use `firebase/config` and `firebase/services`; keep env vars in `.env`.
