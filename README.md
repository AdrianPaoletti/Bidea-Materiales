# RESOURCES MANAGEMENT - MATERIALES

Herramienta para gestionar la destribución y demanda de materiales

## Stack

React, Next, MUI, SCSS, Jest and React testing library

## Set up

```
git clone {{ repository.url }}
cd {{ repository.name }}
npm install
```

## Folder structure

```
src/
├─ components/
|   ├─ Component/
|   |   ├─ ComponentName.tsx
|   |   ├─ ComponentName.module.scss
|   |   ├─ ComponentName.spec.tsx
|   |   └─ component-name.model.ts
|   ├─ shared/
|   |   └─ Component/
|   |       ├─ ComponentName.tsx
|   |       ├─ ComponentName.module.scss
|   |       ├─ ComponentName.spec.tsx
|   |       └─ component-name.model.ts
|   ├─ ComponentName.tsx
|   ├─ ComponentName.module.scss
|   ├─ ComponentName.spec.tsx
|   └─ component-name.model.ts
├─ core/
|   ├─ constants/
|   |   └─ constants.ts
|   ├─ hooks/
|   |   └─ use-hook-name.ts
|   ├─ models/
|   |   └─ model-name.model.ts
|   ├─ services/
|   |   └─ service-name/
|   |       ├─ service-name.service.ts
|   |       └─ service-name.service.spec.ts
|   └─ store/
|       ├─ context/
|       |   ├─ NameContext.ts
|       |   ├─ NameContextProvider.tsx
|       |   └─ NameContextProvider.spec.tsx
|       └─ redux/
|           ├─ module-name/
|           |   ├─ module-name.action.ts
|           |   ├─ module-name.action.spec.ts
|           |   ├─ module-name.reducer.ts
|           |   ├─ module-name.reducer.spec.ts
|           |   └─ module-name.types.ts
|           └─ index.ts
├─ mocks/
|   ├─ components/
|   |   └─ name-component.mock.ts
|   ├─ context/
|   |   └─ name-context.mock.ts
|   ├─ services/
|   |   └─ name-service.service.mock.ts
|   └─ setup-files.ts
├─ statics/
|   └─ locales/
|       ├─ locale/
|       |   ├─ common.json
|       |   ├─ cta.json
|       |   ├─ errors.json
|       |   └─ imports.ts
|       └─ i18n.ts
├─ pages/
|   └─ name-page.tsx
├─ styles/
|   ├─ abstracts/
|   |   └─ _abstract-name.scss
|   ├─ base/
|   |   └─ _base-name.scss
|   ├─ page/
|   |   └─ _page-name.scss
|   ├─ themes/
|   |   └─ index.tsx
|   └─ main.scss
└─ utils/
    └─ name-util/
        ├─ name-util.utils.ts
        └─ name-util.utils.spec.ts
```

## Available scripts

### `npm run dev`

Runs the app in development mode pointing to development server in aws.<br>
Open [http://localhost/materials](http://localhost/materials) to view it in the browser.

### `npm run build`

Builds the app for development environment in the `out` folder.

### `npm run start`

Runs the app with the compiled build environment from the `out` folder.

### `npm run lint`

Runs eslint and collects reports in `reports/lintern`.

### `npm test`

Runs all unit tests.

### `npm test:coverage`

Runs all unit tests and collects coverage in `reports/coverage`.
