import { Task } from './feature.model';

/**
 * Per-feature exercises. Three validator kinds:
 *  - `predict`     — multiple choice; `correct` is the index of the right option
 *  - `input`       — free text; case-insensitive match against any value in `accept`
 *  - `self-check`  — claim done after trying something in the demo
 */
export const TASKS_BY_SLUG: Record<string, Task[]> = {
  // -------------------------------------------------------------------
  // SECTION 1 — Fundamentals & Tooling
  // -------------------------------------------------------------------
  'angular-cli': [
    {
      prompt: 'Which CLI command runs the codemods that rewrite breaking-change code during a major upgrade?',
      validator: {
        kind: 'input',
        accept: ['ng update', 'ng-update'],
        explanation:
          'ng update is the migration-aware upgrade command. It pulls in the new versions AND runs schematics that rewrite your code where the API changed.',
      },
    },
    {
      prompt: 'Which command starts the dev server?',
      validator: {
        kind: 'predict',
        options: ['ng dev', 'ng serve', 'ng run', 'ng start'],
        correct: 1,
        explanation:
          'ng serve starts the dev server (since v17 it is the esbuild + Vite-based builder).',
      },
    },
  ],

  'component-anatomy': [
    {
      prompt: 'What is the default view-encapsulation mode for a component?',
      validator: {
        kind: 'predict',
        options: ['None', 'Emulated', 'ShadowDom', 'Native'],
        correct: 1,
        explanation:
          'Emulated is the default — Angular rewrites the component CSS with attribute selectors so styles do not leak.',
      },
    },
    {
      prompt: 'In a standalone component, dependencies (other components, directives, pipes) are declared in which metadata field?',
      validator: {
        kind: 'predict',
        options: ['declarations', 'imports', 'exports', 'providers'],
        correct: 1,
        explanation:
          'Standalone components have their own `imports: [...]` array. There are no declarations / exports — those belonged to NgModule.',
      },
    },
  ],

  'template-syntax': [
    {
      prompt: 'To set the HTML attribute `colspan` (which has no DOM property), what syntax do you use?',
      validator: {
        kind: 'predict',
        options: ['[attr.colspan]="3"', '[colspan]="3"', 'colspan="{{3}}"', '(colspan)="3"'],
        correct: 0,
        explanation:
          '[attr.x] sets an HTML attribute. [x] sets a DOM property — colspan has none, so [attr.colspan] is required.',
      },
    },
    {
      prompt: '`[(x)]="value"` is sugar for which expansion?',
      validator: {
        kind: 'predict',
        options: ['[x] + (xChange)', '[x] + [xChange]', '(x) + [xChange]', '(x) + (xChange)'],
        correct: 0,
        explanation:
          'Two-way binding is a property binding plus an event binding named xChange. You can implement the same pattern on your own components — or get it for free via a model() signal input.',
      },
    },
  ],

  'inputs-outputs': [
    {
      prompt: 'Which signal-based API creates a two-way-bindable input that supports `[(x)]` directly?',
      validator: {
        kind: 'input',
        accept: ['model', 'model()'],
        explanation:
          'model() returns a writable signal that also wires up the xChange output automatically — the modern equivalent of the @Input + @Output pair behind banana-in-a-box.',
      },
    },
    {
      prompt: 'What does `input.required<T>()` return?',
      validator: {
        kind: 'predict',
        options: ['A raw value', 'A readonly signal', 'An EventEmitter', 'An Observable'],
        correct: 1,
        explanation:
          'input() and input.required() return readonly signals. You read with x(); the parent sets the value via property binding.',
      },
    },
  ],

  'package-management': [
    {
      prompt: 'Which npm command should CI use for a reproducible install from the lockfile?',
      validator: {
        kind: 'input',
        accept: ['npm ci'],
        explanation:
          'npm ci installs strictly from package-lock.json — it errors if package.json and the lockfile drift, which is what you want in CI.',
      },
    },
    {
      prompt: 'Mixing both npm and yarn lockfiles in one repo:',
      validator: {
        kind: 'predict',
        options: [
          'Is recommended for monorepos',
          'Causes drift and conflicting resolutions',
          'Produces deterministic builds',
          'Is automatically reconciled by Node',
        ],
        correct: 1,
        explanation:
          'Pick one package manager per repo and commit its lockfile. Mixing them is a classic source of "works on my machine" drift.',
      },
    },
  ],

  // -------------------------------------------------------------------
  // SECTION 2 — Dependency Injection
  // -------------------------------------------------------------------
  'di-hierarchy': [
    {
      prompt: 'A component declares `providers: [CounterService]`. Each instance of that component receives:',
      validator: {
        kind: 'predict',
        options: [
          'The same root singleton',
          'A fresh instance per component instance',
          'A singleton per route',
          'null (must be re-bound)',
        ],
        correct: 1,
        explanation:
          'Component-scoped providers create a new instance per component instance, destroyed with the component.',
      },
    },
    {
      prompt: 'A lazy-loaded route creates:',
      validator: {
        kind: 'predict',
        options: [
          'A new child injector',
          'The same root injector',
          'No injector — it uses the parent',
          'A sibling injector to the root',
        ],
        correct: 0,
        explanation:
          'Lazy routes get a child injector. A service provided inside a lazy boundary is a distinct instance from the same service in root — the classic "why do I have two instances?" surprise.',
      },
    },
    {
      prompt: 'Open the live demo and confirm: the two leaves under the same scoped host share an instance id, while the two scoped hosts have different ids.',
      validator: {
        kind: 'self-check',
        explanation:
          'Each <app-di-scoped-host> overrides CounterService with its own provider, so each one gets its own id; its single child inherits that instance.',
      },
    },
  ],

  'provider-scopes': [
    {
      prompt: 'Why is `providedIn: \'root\'` usually preferred over registering in an NgModule?',
      validator: {
        kind: 'predict',
        options: ['It is faster', 'It is tree-shakable', 'It is thread-safe', 'It is mandatory in v21'],
        correct: 1,
        explanation:
          'providedIn: \'root\' is tree-shakable — if nothing injects the service, it is dropped from the bundle. Module providers cannot be tree-shaken.',
      },
    },
    {
      prompt: 'You need each form on the page to have its own isolated state service. Where do you provide it?',
      validator: {
        kind: 'predict',
        options: [
          'providedIn: \'root\'',
          'Route-level providers',
          'Component providers on the form component',
          'platformBrowser providers',
        ],
        correct: 2,
        explanation:
          'Component-level providers create a new instance per component instance and tear it down with the component — exactly what per-form state needs.',
      },
    },
  ],

  'injection-tokens': [
    {
      prompt: 'Which of these cannot be used as a DI key directly?',
      validator: {
        kind: 'predict',
        options: ['A class', 'A TypeScript interface', 'An InjectionToken', 'A string token via @Inject(\'name\')'],
        correct: 1,
        explanation:
          'Interfaces are erased at runtime — they do not exist as values, so they cannot be DI keys. Create an InjectionToken<T> instead.',
      },
    },
    {
      prompt: 'The flag `multi: true` is the mechanism behind which Angular built-in?',
      validator: {
        kind: 'predict',
        options: [
          'HTTP_INTERCEPTORS registration',
          'Route loadChildren',
          'Material theme palettes',
          'i18n translations',
        ],
        correct: 0,
        explanation:
          'multi: true collects many providers under one token. HTTP_INTERCEPTORS and validators are the canonical examples.',
      },
    },
  ],

  // -------------------------------------------------------------------
  // SECTION 3 — Reactivity & Change Detection
  // -------------------------------------------------------------------
  'rxjs-operators': [
    {
      prompt: 'Typeahead search — you only care about the latest term. Which operator?',
      validator: {
        kind: 'predict',
        options: ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'],
        correct: 0,
        explanation:
          'switchMap cancels the previous inner Observable when a new outer value arrives. Stale requests do not leak into the UI.',
      },
    },
    {
      prompt: 'A "Save" button that must never double-submit. Which operator?',
      validator: {
        kind: 'predict',
        options: ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'],
        correct: 3,
        explanation:
          'exhaustMap ignores new outer emissions while an inner Observable is still running — perfect for "do not start another save while one is in flight".',
      },
    },
    {
      prompt: 'A queue of file uploads where order matters and overlap is forbidden. Which operator?',
      validator: {
        kind: 'predict',
        options: ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'],
        correct: 2,
        explanation:
          'concatMap queues each inner Observable and runs them one at a time, in order.',
      },
    },
  ],

  'async-pipe': [
    {
      prompt: 'Does the async pipe unsubscribe automatically on component destroy?',
      validator: {
        kind: 'predict',
        options: ['Yes, always', 'Only for HttpClient', 'Only under OnPush', 'No, you must call .unsubscribe()'],
        correct: 0,
        explanation:
          'Yes — that is the whole point. The async pipe owns the subscription lifecycle.',
      },
    },
    {
      prompt: 'Under OnPush, when the async pipe receives a new emission, it triggers re-check by calling:',
      validator: {
        kind: 'predict',
        options: ['detectChanges()', 'markForCheck()', 'reattach()', 'nothing — it relies on Zone.js'],
        correct: 1,
        explanation:
          'The async pipe calls markForCheck() on emission so the OnPush component participates in the next CD cycle.',
      },
    },
  ],

  'subscription-management': [
    {
      prompt: 'Which modern v16+ operator ties a subscription to the component lifecycle and needs no destroyRef argument in an injection context?',
      validator: {
        kind: 'input',
        accept: ['takeUntilDestroyed', 'takeUntilDestroyed()'],
        explanation:
          'takeUntilDestroyed() is the idiomatic replacement for the takeUntil(destroy$) pattern.',
      },
    },
    {
      prompt: 'Which of these does NOT require manual unsubscribe?',
      validator: {
        kind: 'predict',
        options: ['router.events', 'form.valueChanges', 'HttpClient.get()', 'interval(1000)'],
        correct: 2,
        explanation:
          'HttpClient completes after one emission, so its subscription terminates on its own. The others are long-lived and will leak without teardown.',
      },
    },
  ],

  subjects: [
    {
      prompt: 'A new (late) subscriber should immediately receive the current state value. Which Subject?',
      validator: {
        kind: 'predict',
        options: ['Subject', 'BehaviorSubject', 'ReplaySubject(0)', 'AsyncSubject'],
        correct: 1,
        explanation:
          'BehaviorSubject requires an initial value and replays the current value to every new subscriber — the workhorse for reactive state.',
      },
    },
    {
      prompt: 'Which Subject emits only when the stream completes?',
      validator: {
        kind: 'predict',
        options: ['Subject', 'BehaviorSubject', 'ReplaySubject', 'AsyncSubject'],
        correct: 3,
        explanation:
          'AsyncSubject emits only its last value, and only on completion. Rarely useful in app code.',
      },
    },
  ],

  'change-detection': [
    {
      prompt: 'Under OnPush, `this.orders().push(newOrder)` (in-place mutation) triggers a re-check:',
      validator: {
        kind: 'predict',
        options: ['Yes', 'No — the input reference did not change'],
        correct: 1,
        explanation:
          'OnPush watches input references. To trigger re-check, replace the reference — e.g. orders.update(arr => [...arr, x]).',
      },
    },
    {
      prompt: 'Which of these does NOT mark an OnPush component dirty?',
      validator: {
        kind: 'predict',
        options: ['A new input reference', 'An internal (click) handler firing', 'async pipe emission', 'console.log inside the class'],
        correct: 3,
        explanation:
          'The first three are documented dirty triggers. Bare side effects in class methods are not — that is what would silently break a view under OnPush.',
      },
    },
  ],

  signals: [
    {
      prompt: 'Which interop helper converts an Observable into a signal you can read in a template?',
      validator: {
        kind: 'input',
        accept: ['toSignal', 'toSignal()'],
        explanation:
          'toSignal() (from @angular/core/rxjs-interop) adapts an Observable to a signal. Pair with initialValue to skip the undefined check.',
      },
    },
    {
      prompt: '`computed(fn)` is:',
      validator: {
        kind: 'predict',
        options: ['Eager — recomputes on every change', 'Lazy and memoized', 'Asynchronous', 'Deprecated since v18'],
        correct: 1,
        explanation:
          'computed() is lazy: it only re-evaluates when one of the signals it reads has changed AND something pulls the computed value.',
      },
    },
    {
      prompt: 'In the live demo above, click + and confirm an entry appears in the effect log on every change.',
      validator: {
        kind: 'self-check',
        explanation:
          'effect() re-runs whenever any signal it reads changes — that is the whole side-effect contract.',
      },
    },
  ],

  zoneless: [
    {
      prompt: 'In a v21 app created today with `ng new`, the default change-detection mode is:',
      validator: {
        kind: 'predict',
        options: ['Zoneful (Zone.js patches async APIs)', 'Zoneless (notification scheduler)', 'Hybrid', 'Opt-in only — Zone.js is still default'],
        correct: 1,
        explanation:
          'Zoneless became the default for new applications in v21. zone.js is no longer in the bundle by default.',
      },
    },
    {
      prompt: 'Under zoneless, a bare `setInterval(() => this.x++, 1000)` will:',
      validator: {
        kind: 'predict',
        options: [
          'Still refresh the view automatically',
          'NOT refresh the view — write the value into a signal or call markForCheck',
          'Run the callback but not the timer',
          'Throw at runtime',
        ],
        correct: 1,
        explanation:
          'Without Zone.js patching async APIs, raw setInterval cannot notify the scheduler. Either write into a signal or surface the value through an async pipe.',
      },
    },
  ],

  // -------------------------------------------------------------------
  // SECTION 4 — Directives, Forms & Routing
  // -------------------------------------------------------------------
  directives: [
    {
      prompt: 'The leading `*` in `*ngIf="cond"` is syntactic sugar for:',
      validator: {
        kind: 'predict',
        options: ['A comment node', 'An <ng-template> Angular stamps into the DOM', 'A pipe expression', 'A directive provider'],
        correct: 1,
        explanation:
          'Structural directives expand into <ng-template> blocks. That is also why only one structural directive is allowed per element.',
      },
    },
    {
      prompt: 'To reuse a hover-highlight behavior across many elements without copying logic into each component, prefer:',
      validator: {
        kind: 'predict',
        options: ['A shared component', 'An attribute directive', 'A pipe', 'A base class'],
        correct: 1,
        explanation:
          'Directives are the right tool for cross-cutting DOM behavior. Components own DOM structure; directives augment it.',
      },
    },
  ],

  'control-flow': [
    {
      prompt: 'In `@for (x of xs; track …)`, the track expression is:',
      validator: {
        kind: 'predict',
        options: ['Optional', 'Mandatory', 'Only needed for arrays > 100 items', 'Deprecated'],
        correct: 1,
        explanation:
          'track is mandatory — the v17+ control flow enforces it, which eliminates a classic list-rendering performance footgun.',
      },
    },
    {
      prompt: 'Which sub-block renders when the @for collection is empty?',
      validator: {
        kind: 'predict',
        options: ['@placeholder', '@empty', '@else', '@default'],
        correct: 1,
        explanation:
          '@empty { … } is the dedicated empty branch for @for. (@placeholder belongs to @defer, @else to @if, @default to @switch.)',
      },
    },
  ],

  'lifecycle-hooks': [
    {
      prompt: 'Which hook runs once after the first @Input values are set?',
      validator: {
        kind: 'predict',
        options: ['constructor', 'ngOnChanges', 'ngOnInit', 'ngAfterViewInit'],
        correct: 2,
        explanation:
          'ngOnInit is the standard place for initialization that depends on inputs. The constructor runs before inputs are bound.',
      },
    },
    {
      prompt: 'ngDoCheck fires:',
      validator: {
        kind: 'predict',
        options: ['Once on init', 'On destroy', 'On every change-detection cycle', 'Only when an input changes'],
        correct: 2,
        explanation:
          'ngDoCheck and the *Checked hooks fire every CD cycle and must be cheap — they are a classic performance trap.',
      },
    },
    {
      prompt: 'Trigger an unmount + remount in the demo above and confirm ngOnDestroy then ngOnInit fire in that order.',
      validator: {
        kind: 'self-check',
        explanation:
          'Destruction tears down the old instance (ngOnDestroy) and re-mount creates a fresh one (ngOnInit) — instance state does not survive.',
      },
    },
  ],

  'template-driven-forms': [
    {
      prompt: 'Which directive drives two-way binding on inputs in template-driven forms?',
      validator: {
        kind: 'input',
        accept: ['ngModel', '[(ngModel)]'],
        explanation:
          'ngModel is the two-way binding directive. It needs FormsModule imported on the component.',
      },
    },
    {
      prompt: 'Compared to reactive forms, template-driven forms are typically:',
      validator: {
        kind: 'predict',
        options: ['More testable', 'Less testable — form logic lives in HTML', 'Typed by default', 'Faster at runtime'],
        correct: 1,
        explanation:
          'Reactive forms expose a typed, synchronously-available object you can unit-test. Template-driven forms keep form logic in templates, which is harder to test.',
      },
    },
  ],

  'reactive-forms': [
    {
      prompt: 'A FormControl exposes which Observables?',
      validator: {
        kind: 'predict',
        options: ['value only', 'valueChanges only', 'statusChanges only', 'Both valueChanges and statusChanges'],
        correct: 3,
        explanation:
          'Both are exposed as Observables — great for dependent fields, autosave, and debounced validation.',
      },
    },
    {
      prompt: 'For a dynamic list of fields you can add or remove rows from, use which class?',
      validator: {
        kind: 'input',
        accept: ['FormArray'],
        explanation:
          'FormArray holds an ordered, mutable collection of controls — push() to add, removeAt() to drop.',
      },
    },
  ],

  'signal-forms': [
    {
      prompt: 'Signal Forms in v21 is:',
      validator: {
        kind: 'predict',
        options: ['Stable and recommended', 'Experimental — opt-in', 'Deprecated', 'Not released yet'],
        correct: 1,
        explanation:
          'Signal Forms shipped experimentally in v21. The team is gathering feedback; production code today still standardizes on reactive forms.',
      },
    },
    {
      prompt: 'Change the email or age in the demo above and confirm the `valid()` signal updates with no manual subscription.',
      validator: {
        kind: 'self-check',
        explanation:
          'computed() tracks the read signals automatically. No valueChanges.subscribe(), no markForCheck, no destroyRef.',
      },
    },
  ],

  routing: [
    {
      prompt: 'In a modern standalone app, how do you register the route table?',
      validator: {
        kind: 'predict',
        options: ['RouterModule.forRoot(routes)', 'provideRouter(routes)', '@NgModule({ providers: [...] })', 'app.config.routes = …'],
        correct: 1,
        explanation:
          'provideRouter(routes) — declared in the ApplicationConfig providers array — is the standalone equivalent of forRoot.',
      },
    },
    {
      prompt: 'Which type alias does a modern functional canActivate guard implement?',
      validator: {
        kind: 'input',
        accept: ['CanActivateFn'],
        explanation:
          'CanActivateFn is the function-shaped alternative to class-based CanActivate. It pairs with inject() for accessing services.',
      },
    },
  ],

  'lazy-loading': [
    {
      prompt: 'To lazy-load a single standalone component for a route, use:',
      validator: {
        kind: 'predict',
        options: ['loadChildren', 'loadComponent', 'RouterModule.forChild', 'loadRoute'],
        correct: 1,
        explanation:
          'loadComponent points at a single standalone component. loadChildren is for a Routes array.',
      },
    },
    {
      prompt: 'In the running app, navigate between two features. Confirm in DevTools → Network that a new JS chunk loads for each feature on first visit.',
      validator: {
        kind: 'self-check',
        explanation:
          'Each FeaturePage demo is mapped to its own dynamic import() in demo-loaders.ts, producing a separate chunk loaded on demand.',
      },
    },
  ],

  // -------------------------------------------------------------------
  // SECTION 5 — Modularity & State Management
  // -------------------------------------------------------------------
  'standalone-vs-ngmodule': [
    {
      prompt: 'In a standalone component, dependencies are declared in:',
      validator: {
        kind: 'predict',
        options: ['declarations', 'imports', 'exports', 'providers'],
        correct: 1,
        explanation:
          'Standalone replaces module declarations with a per-component imports array. exports is gone too.',
      },
    },
    {
      prompt: 'Which function bootstraps a standalone root component?',
      validator: {
        kind: 'input',
        accept: ['bootstrapApplication', 'bootstrapApplication()'],
        explanation:
          'bootstrapApplication(App, { providers: [...] }) replaces platformBrowserDynamic().bootstrapModule(AppModule).',
      },
    },
  ],

  'state-management': [
    {
      prompt: 'A new feature needs shared state across a handful of components. What should you reach for first?',
      validator: {
        kind: 'predict',
        options: [
          'NgRx store + actions + reducers + effects',
          'A service exposing signals (or a BehaviorSubject)',
          'A global window object',
          'localStorage',
        ],
        correct: 1,
        explanation:
          'Start with a service. Reach for a global store only when state coordination is genuinely hard (many writers, side-effect orchestration, time-travel debug).',
      },
    },
    {
      prompt: 'Within the NgRx family, the lighter signal-based option is:',
      validator: {
        kind: 'predict',
        options: ['SignalStore', 'EffectsModule', 'Reducer', 'ActionGroup'],
        correct: 0,
        explanation:
          'NgRx SignalStore (and ComponentStore) are lighter middle-ground options when a full Redux-style store is too much.',
      },
    },
  ],

  'code-reuse': [
    {
      prompt: 'The right reuse primitive for a date-formatting helper:',
      validator: {
        kind: 'predict',
        options: ['Service', 'Shared component', 'Attribute directive', 'Pure pipe'],
        correct: 3,
        explanation:
          'Pure pipes are memoized and cheap — the right tool for view transformations like formatting.',
      },
    },
    {
      prompt: 'The right reuse primitive for a hover-highlight DOM behavior:',
      validator: {
        kind: 'predict',
        options: ['Service', 'Shared component', 'Attribute directive', 'Pipe'],
        correct: 2,
        explanation:
          'Directives are for behavior attached to existing elements. They are under-used.',
      },
    },
  ],

  'smart-vs-presentational': [
    {
      prompt: 'A pure presentational component:',
      validator: {
        kind: 'predict',
        options: [
          'Injects services and fetches data',
          'Communicates only through @Input / @Output (or signal input/output)',
          'Owns its own route',
          'Uses NgRx selectors directly',
        ],
        correct: 1,
        explanation:
          'Presentational components are pure functions of their inputs — trivially testable and ideal for OnPush.',
      },
    },
    {
      prompt: 'Pairing presentational components with OnPush + immutable inputs lets Angular:',
      validator: {
        kind: 'predict',
        options: ['Re-render the whole tree on every event', 'Skip whole OnPush subtrees on each CD cycle', 'Disable change detection entirely', 'Opt out of routing'],
        correct: 1,
        explanation:
          'That is the central performance win: most of the tree stays clean and gets skipped on each cycle.',
      },
    },
  ],

  // -------------------------------------------------------------------
  // SECTION 6 — Build, Rendering & Architecture
  // -------------------------------------------------------------------
  'build-tools': [
    {
      prompt: 'The default Angular application builder in v17+ is built on:',
      validator: {
        kind: 'predict',
        options: ['Webpack', 'Rollup', 'esbuild (with Vite for the dev server)', 'gulp'],
        correct: 2,
        explanation:
          'The application builder uses esbuild for bundling and Vite for the dev server — a major rebuild-speed improvement over Webpack.',
      },
    },
    {
      prompt: 'Library builds (ng-packagr) use which bundler under the hood?',
      validator: {
        kind: 'predict',
        options: ['esbuild', 'Rollup', 'Webpack', 'Browserify'],
        correct: 1,
        explanation:
          'ng-packagr uses Rollup to emit clean, tree-shakable library output — the library equivalent of the app builder.',
      },
    },
  ],

  'http-interceptors': [
    {
      prompt: 'The modern way to register an HTTP interceptor in a standalone app is:',
      validator: {
        kind: 'predict',
        options: [
          'HTTP_INTERCEPTORS multi-provider',
          'withInterceptors([...]) passed to provideHttpClient',
          'An @Interceptor() class decorator',
          'In the Router config',
        ],
        correct: 1,
        explanation:
          'Functional interceptors registered via withInterceptors() in provideHttpClient() are the modern equivalent of the older HTTP_INTERCEPTORS multi-provider.',
      },
    },
    {
      prompt: 'Retry-with-backoff is appropriate for which kinds of errors?',
      validator: {
        kind: 'predict',
        options: ['4xx only', '5xx and network errors', 'All errors', 'Never retry'],
        correct: 1,
        explanation:
          '4xx errors are typically client problems that will keep failing — do not retry them. 5xx and network errors are transient and worth retrying with backoff.',
      },
    },
  ],

  'spa-vs-mpa': [
    {
      prompt: 'Which approach closes the SPA-vs-MPA gap on first paint and SEO while keeping rich client interactivity?',
      validator: {
        kind: 'predict',
        options: ['NgRx', 'SSR + hydration', 'ChangeDetectionStrategy.OnPush', 'Standalone components'],
        correct: 1,
        explanation:
          'SSR renders the first view on the server, hydration upgrades it into a live SPA — MPA-like first paint with SPA interactivity.',
      },
    },
    {
      prompt: 'A marketing site that must be SEO-friendly and first-paint fast, with little dynamic UI, is best served as:',
      validator: {
        kind: 'predict',
        options: ['Plain SPA', 'MPA or SSR-rendered', 'Pure client-side with no SSR', 'WebSocket-driven'],
        correct: 1,
        explanation:
          'MPA — or SSR with light hydration — wins on first paint, SEO and simplicity. Save full SPAs for app-like, behind-login experiences.',
      },
    },
  ],

  defer: [
    {
      prompt: '`@defer (on viewport) { … }` triggers when:',
      validator: {
        kind: 'predict',
        options: ['Component init', 'The deferred block scrolls into view', 'A timer fires', 'On hover'],
        correct: 1,
        explanation:
          'on viewport uses IntersectionObserver — the chunk loads the moment the block intersects the viewport.',
      },
    },
    {
      prompt: 'Which sub-block renders while the deferred chunk is being downloaded?',
      validator: {
        kind: 'predict',
        options: ['@placeholder', '@loading', '@error', '@empty'],
        correct: 1,
        explanation:
          '@placeholder is shown until the trigger fires; @loading is shown while the JS chunk is being fetched; @error if the fetch fails.',
      },
    },
  ],

  'ssr-hydration': [
    {
      prompt: 'Incremental hydration became stable in which Angular version?',
      validator: {
        kind: 'predict',
        options: ['v16', 'v17', 'v20', 'v21'],
        correct: 2,
        explanation:
          'Incremental hydration was stabilized in v20, with @defer-style triggers driving per-component hydration on demand.',
      },
    },
    {
      prompt: 'Which provider function enables client-side hydration of server-rendered markup?',
      validator: {
        kind: 'input',
        accept: ['provideClientHydration', 'provideClientHydration()'],
        explanation:
          'provideClientHydration() — optionally combined with withIncrementalHydration() — enables hydration in a standalone bootstrap.',
      },
    },
  ],

  performance: [
    {
      prompt: '`{{ formatPrice(item) }}` (a function call) in a template interpolation:',
      validator: {
        kind: 'predict',
        options: ['Runs once on init', 'Runs on every change-detection cycle', 'Is automatically memoized', 'Is forbidden by the compiler'],
        correct: 1,
        explanation:
          'Function calls in templates re-run on every CD cycle. Precompute with a pipe, computed signal, or class field.',
      },
    },
    {
      prompt: 'To render 10k rows efficiently, the right combination is:',
      validator: {
        kind: 'predict',
        options: ['trackBy + virtual scroll (CDK)', 'async pipe alone', 'OnPush + ngStyle', 'ngModel + manual detectChanges'],
        correct: 0,
        explanation:
          'Stable track keys prevent unnecessary re-render, and the CDK virtual scroll viewport renders only the visible rows.',
      },
    },
  ],

  testing: [
    {
      prompt: 'The default test runner in Angular v21 is:',
      validator: {
        kind: 'predict',
        options: ['Karma', 'Jest', 'Vitest', 'Jasmine'],
        correct: 2,
        explanation:
          'Vitest became the default in v21. Jest and Karma are still supported on existing projects.',
      },
    },
    {
      prompt: 'Which class do you use to fake HTTP calls inside component / service tests?',
      validator: {
        kind: 'input',
        accept: ['HttpTestingController'],
        explanation:
          'HttpTestingController (from @angular/common/http/testing) lets you assert on outgoing requests and provide synthetic responses.',
      },
    },
  ],

  'version-evolution': [
    {
      prompt: 'You are jumping from Angular v18 to v21. The recommended approach is:',
      validator: {
        kind: 'predict',
        options: [
          'v18 → v21 directly with --force',
          'One major at a time (v18 → v19 → v20 → v21), running ng update for each step',
          'Skip even-numbered majors',
          'Re-create the workspace from scratch',
        ],
        correct: 1,
        explanation:
          'Angular supports one-major-at-a-time upgrades. ng update applies codemods for each step — review diffs after each.',
      },
    },
    {
      prompt: 'When planning an upgrade, the most common blocker is usually:',
      validator: {
        kind: 'predict',
        options: ['TypeScript', 'Node version', 'Third-party Angular libraries lagging the new version', 'package-lock.json'],
        correct: 2,
        explanation:
          'Lagging third-party libraries (and their peer-dependency constraints) are the typical blocker. Inventory dependencies before committing to a target.',
      },
    },
  ],
};
