# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm start                       # ng serve — dev server at http://localhost:4200 (esbuild + Vite)
npm run build                   # production build with budgets enforced
npm run watch                   # development build, watch mode
npm test                        # vitest

# Scaffolding
npx ng generate component features/<name> --skip-tests

# Major upgrade (when bumping Angular)
npx ng update @angular/cli @angular/core
npx ng update @angular/material @angular/cdk
```

Run a single test: `npx vitest run path/to/file.spec.ts` (or with `--reporter=verbose` for details).

## Architecture

The app is a **data-driven feature catalog**. There is no per-feature route definition or per-feature page component. Three files are the entire dispatch system:

1. **`src/app/core/features/feature-registry.ts`** — the **single source of truth**. An array of `Feature` objects, each with `slug`, `section`, `title`, `tagline`, `summary`, `keyPoints[]`, `snippets[]`, `pointers[]`, optional `demoKey`, `references[]`, `redFlags[]`, `version?`. Adding a feature is just adding an entry here.

2. **`src/app/shared/feature-page/feature-page.ts`** — the **generic renderer**. The single `/feature/:slug` route binds the slug as a signal input (via `withComponentInputBinding()`), looks up the feature in `FeatureService`, and renders all of it. The interactive demo (if any) is rendered through `NgComponentOutlet` with a `Type<unknown>` signal.

3. **`src/app/core/features/demo-loaders.ts`** — a `Record<DemoKey, () => Promise<Type<unknown>>>` that maps each `demoKey` to a **dynamic `import()`**. This is how each demo becomes its own lazy chunk. To add an interactive demo:
   - Add the `DemoKey` literal type in `feature.model.ts`.
   - Write the component under `src/app/features/<demo>/`.
   - Add the dynamic-import entry in `demo-loaders.ts`.
   - Reference the `demoKey` on the feature registry entry.

Routing is exactly three routes (`app.routes.ts`): `''` → Home, `feature/:slug` → FeaturePage, `**` → NotFound. The sidenav, home grid and breadcrumbs all derive from `FeatureService.grouped()` (a computed signal grouping the registry by section). The 6 section definitions live in `core/features/sections.ts`.

`FeatureService` is signal-based — `features`, `sections`, `grouped` are all readonly signals; lookups via `bySlug`, `sectionByKey`, `neighbors`.

## Modern Angular conventions used throughout

This codebase is **Angular v21** with **zoneless change detection enabled by default** (`provideZonelessChangeDetection()` in `app.config.ts`). Follow these conventions:

- **Standalone everything.** No NgModules. Components declare their own `imports: []`.
- **Signal-based state.** `signal()`, `computed()`, `effect()`, `input()`, `input.required()`, `model()`, `output()`. Use `toSignal()` / `toObservable()` to bridge RxJS when needed.
- **`ChangeDetectionStrategy.OnPush`** on every component. With zoneless this is effectively mandatory — bare `setTimeout` / `setInterval` callbacks will *not* refresh the view; they must write into a signal.
- **`inject()`** over constructor injection in most places.
- **Modern control flow** in templates: `@if`, `@for` (with mandatory `track`), `@switch`, `@defer`. Do not introduce `*ngIf` / `*ngFor` / `CommonModule` directives in new code.
- **Class names without `Component` suffix** — e.g. `App`, `Home`, `FeaturePage`, `SignalsDemo`. Match the file name.
- **Subscription hygiene**: prefer the `async` pipe; in class bodies use `takeUntilDestroyed()` (no `destroy$` Subjects).

## Non-obvious v21 / Material 3 gotchas

These bit during the initial build — keep them in mind:

- **Helper components used in another component's `imports: []` array must be `export`ed** even if they're co-located in the same file. The Angular v21 compiler's template type-checker imports them by name and fails with `NG3004: Unable to import symbol …`. Mark every `@Component`-decorated helper class `export class`, not bare `class`.

- **Literal `@` characters in template strings** are parsed as control-flow blocks. Writing `the @defer block` in a `template: …` string throws `NG5002: Incomplete block`. Escape with `&#64;` (e.g. `the &#64;defer block`) when you mean the literal character.

- **`data-theme` is set on `<html>`**, not on `app-root`. `App` uses `inject(DOCUMENT)` and `effect()` to set the attribute. Material's `mat.theme()` mixin is invoked under `html[data-theme='light']` and `html[data-theme='dark']` selectors in `src/styles.scss` so its CSS variables scope to the document root. Theme switching also flips `color-scheme`.

- **Material 3 theming** uses `@use '@angular/material' as mat;` + `@include mat.theme(...)` (not the older `mat.define-theme`). Palettes are `mat.$azure-palette` + `mat.$violet-palette`.

- **Bundle budgets are deliberately raised** to 1.2MB/2.5MB (`angular.json`). Material 3 ships a lot of CSS and that's expected; if the production build fails on budgets, that's likely real bloat — investigate, don't just raise further.

## Code-highlighting registration

`src/app/shared/code-block/code-block.ts` registers only the languages we use with `hljs.registerLanguage(...)` (typescript, html/xml, scss, bash, json). To highlight a new language, register it there. Both light and dark `.hljs-*` color rules live in `styles.scss`.

## Where the docs come from

The feature content (summaries, snippets, key points, red flags) is derived from two source documents in `C:\Users\darko\OneDrive\Radna površina\A4 interview\`:

- `Angular_Interview_Guide.docx` — the 30-question L4 interview guide. The app's 6-section split mirrors it.
- `Angular_Reference_Guide.docx` — technical reference current as of Angular v21. The zoneless, signals, `@defer`, hydration, signal-forms content reflects this doc.
