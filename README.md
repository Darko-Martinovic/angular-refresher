# Angular Refresher

An internal **Angular v21** feature reference for Tech Lead / L4 interview preparation. Built from the **Angular Interview Guide** and **Angular Reference Guide** documents, it covers every topic the guides exercise — from CLI fundamentals through standalone components, the modern reactivity model, zoneless change detection, and SSR with incremental hydration — as a navigable web app with snippets, live demos, and pointers into the codebase.

## What's inside

- **32 features** organised into 6 sections (Fundamentals & Tooling, Dependency Injection, Reactivity & Change Detection, Directives/Forms/Routing, Modularity & State Management, Build/Rendering/Architecture).
- **20 interactive demos** lazy-loaded per feature route — signals, change detection (Default vs OnPush side-by-side), the four RxJS flattening operators racing on the same input, leaky vs leak-safe subscriptions, `@if`/`@for`/`@switch`, `@defer` with three triggers, reactive forms with `FormArray`, an HTTP interceptor pipeline diagram, and more.
- **Angular Material 3** with a custom azure/violet theme, dark mode toggle, responsive sidenav, and a polished hero layout.
- **highlight.js** code blocks with copy-to-clipboard.
- **Zoneless change detection** enabled by default (the v21 default) — every demo runs against `provideZonelessChangeDetection()`.

## Stack

- Angular `v21.2`, standalone, signals, esbuild + Vite application builder
- Angular Material `v21` (Material 3, `mat.theme()`)
- Angular CDK `v21`
- Vitest (default test runner in v21)
- highlight.js

## Running it

```bash
npm install
npm start            # ng serve — http://localhost:4200
npm run build        # production build (esbuild)
npm test             # vitest
```

## File map

```
src/app/
├── app.ts                          # shell — toolbar + Material sidenav + theme toggle
├── app.config.ts                   # provideZonelessChangeDetection + provideRouter + provideHttpClient
├── app.routes.ts                   # lazy-loaded home / feature/:slug / wildcard
│
├── core/features/
│   ├── feature.model.ts            # Feature, FeatureSection, Snippet, ExplorePointer types
│   ├── feature-registry.ts         # the 32 feature entries (single source of truth)
│   ├── sections.ts                 # the 6 section definitions
│   ├── feature.service.ts          # lookup + grouping (signals)
│   └── demo-loaders.ts             # DemoKey → dynamic import — one chunk per demo
│
├── shared/
│   ├── code-block/                 # highlight.js wrapper with copy button
│   └── feature-page/               # generic feature renderer (uses NgComponentOutlet for demos)
│
├── pages/
│   ├── home/                       # hero + searchable feature grid
│   └── not-found/                  # 404
│
└── features/                       # one folder per interactive demo
    ├── signals-demo/
    ├── change-detection-demo/
    ├── rxjs-operators-demo/
    ├── defer-demo/
    └── …
```

## Adding a new feature

1. Add an entry to `src/app/core/features/feature-registry.ts` — slug, section, title, snippets, pointers.
2. (Optional) If the feature needs a live demo, add a `demoKey` and:
   - Create `src/app/features/<demo>/<demo>.ts` exporting your demo component.
   - Register the dynamic import in `src/app/core/features/demo-loaders.ts`.
3. Done — the route `/feature/<slug>` and the sidenav entry appear automatically.

## Source documents

- `Angular_Interview_Guide.docx` — 30-question L4 interview guide (the 6-section organisation of this app follows it)
- `Angular_Reference_Guide.docx` — technical reference current as of Angular v21 (zoneless, signal forms, incremental hydration)
