import { Feature } from './feature.model';

export const FEATURES: Feature[] = [
  // =====================================================================
  // SECTION 1 — Fundamentals & Tooling
  // =====================================================================
  {
    slug: 'angular-cli',
    section: 'fundamentals',
    title: 'Angular CLI',
    tagline: 'Scaffold, build, serve and migrate from one consistent toolchain.',
    summary:
      'The CLI (ng) wraps schematics, the dev server and the production build pipeline. In v17+ the application builder is esbuild + Vite, dramatically faster than the legacy Webpack pipeline. ng update runs codemods that rewrite breaking-change code automatically — the single biggest reason Angular major upgrades are tractable.',
    keyPoints: [
      'ng new / ng generate scaffold workspace and components with wired-up boilerplate.',
      'ng serve uses esbuild + Vite (v17+), ng build uses esbuild for apps and Rollup (ng-packagr) for libraries.',
      'ng add wires up a library via its schematic (e.g. ng add @angular/material).',
      'ng update runs automated migration schematics across Angular majors.',
      'angular.json holds build targets, file replacements and budgets.',
    ],
    snippets: [
      {
        language: 'bash',
        label: 'Daily commands',
        code: `# Scaffold a new workspace
ng new my-app --routing --style=scss

# Generate a standalone component
ng g component features/orders --skip-tests

# Dev server with hot reload (esbuild + Vite)
ng serve

# Production build with budgets enforced
ng build

# Upgrade across an Angular major (runs codemods)
ng update @angular/cli @angular/core`,
      },
      {
        language: 'json',
        label: 'angular.json budgets',
        code: `"budgets": [
  { "type": "initial",           "maximumWarning": "500kB", "maximumError": "1MB" },
  { "type": "anyComponentStyle", "maximumWarning": "4kB",   "maximumError": "8kB" }
]`,
      },
    ],
    pointers: [
      { label: 'angular.json', path: 'angular.json', note: 'Build targets, budgets, file replacements.' },
      { label: 'package.json', path: 'package.json', note: 'CLI dependency, scripts.' },
    ],
    references: [
      { label: 'Angular CLI docs', url: 'https://angular.dev/tools/cli' },
      { label: 'update.angular.dev', url: 'https://update.angular.dev' },
    ],
    redFlags: [
      'Hand-rolls components instead of using ng generate.',
      'Treats Angular upgrades as manual rewrites — never runs ng update.',
    ],
  },
  {
    slug: 'component-anatomy',
    section: 'fundamentals',
    title: 'Component Anatomy',
    tagline: 'Decorator metadata, the class, the template and view encapsulation.',
    summary:
      'A component is a TypeScript class decorated with @Component that owns state and behavior and is paired with a template and (optionally) styles. The decorator metadata wires selector, template/templateUrl, styles and the changeDetection strategy. In modern Angular, standalone is the default — the component declares its own imports.',
    keyPoints: [
      'A component is a directive that has a template — directives are the more general primitive.',
      'View encapsulation defaults to Emulated: Angular rewrites CSS so styles do not leak across components.',
      'standalone: true (default in v17+) lets a component declare its own dependencies without an NgModule.',
      'ChangeDetectionStrategy.OnPush + immutable inputs is the modern performance baseline.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Standalone component (v17+)',
        code: `import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent {
  protected readonly orders = signal<Order[]>([]);
  readonly count = computed(() => this.orders().length);
}`,
      },
      {
        language: 'typescript',
        label: 'View encapsulation modes',
        code: `// Default — styles scoped via generated attribute selectors
encapsulation: ViewEncapsulation.Emulated

// Browser shadow DOM (true isolation)
encapsulation: ViewEncapsulation.ShadowDom

// No scoping — styles become global
encapsulation: ViewEncapsulation.None`,
      },
    ],
    pointers: [
      { label: 'src/app/app.ts', path: 'src/app/app.ts', note: 'Standalone root component with @Component metadata.' },
    ],
    references: [
      { label: 'Components guide', url: 'https://angular.dev/guide/components' },
    ],
    redFlags: ['Conflates component with module.', 'Thinks styles are always global.'],
  },
  {
    slug: 'template-syntax',
    section: 'fundamentals',
    title: 'Template Bindings',
    tagline: 'Interpolation, property, attribute, event and two-way binding.',
    summary:
      'Angular templates are HTML augmented with a small binding syntax that encodes both the direction of data flow and the target being bound. Property binding sets a DOM property; [attr.x] is for HTML attributes that have no DOM property. Two-way binding is sugar for property + (xChange) event.',
    keyPoints: [
      '{{ expr }} interpolation renders to textContent.',
      '[prop]="expr" sets a DOM property or component @Input.',
      '[attr.aria-label]="expr" sets an HTML attribute (no DOM property).',
      '(event)="handler($event)" listens to DOM events or @Outputs.',
      '[(x)]="value" expands to [x] + (xChange) — implementable on your own components.',
    ],
    snippets: [
      {
        language: 'html',
        label: 'All four binding forms',
        code: `<!-- Interpolation -->
<h1>Hello, {{ user().name }}</h1>

<!-- Property binding -->
<img [src]="avatarUrl" [alt]="user().name" />
<button [disabled]="isLoading()">Save</button>

<!-- Attribute binding (no DOM property exists) -->
<td [attr.colspan]="span" [attr.aria-label]="label">…</td>

<!-- Event binding -->
<button (click)="save($event)">Save</button>

<!-- Two-way binding (banana-in-a-box) -->
<input [(ngModel)]="user().name" />`,
      },
    ],
    pointers: [
      {
        label: 'TemplateSyntaxDemoComponent',
        path: 'src/app/features/template-syntax-demo/template-syntax-demo.ts',
        note: 'Live demo of each binding form.',
      },
    ],
    demoKey: 'template-syntax',
    references: [
      { label: 'Template syntax', url: 'https://angular.dev/guide/templates' },
    ],
  },
  {
    slug: 'inputs-outputs',
    section: 'fundamentals',
    title: 'Inputs & Outputs',
    tagline: 'Classic decorators and the modern signal-based input() / output() / model().',
    summary:
      'Parent-child communication is deliberately one-directional: data flows down through inputs, events bubble up through outputs. The signal-based input() / output() / model() APIs (v17.1+) integrate directly with the new reactivity model: input() returns a readonly signal, model() supports [(x)] directly.',
    keyPoints: [
      'Classic: @Input() x, @Output() saved = new EventEmitter().',
      'Modern: x = input<T>(), x = input.required<T>(), x = input(d, { transform: fn }).',
      'output() — saved = output<Payload>(), call saved.emit(x).',
      'model() — two-way bindable signal input: x = model(0) supports [(x)].',
      'viewChild() / contentChild() — signal-based queries replace @ViewChild / @ContentChild.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Signal-based inputs & outputs',
        code: `import { Component, input, output, model } from '@angular/core';

@Component({ selector: 'app-counter', template: \`
  <button (click)="dec()">-</button>
  <span>{{ count() }}</span>
  <button (click)="inc()">+</button>
\`})
export class CounterComponent {
  // Required signal input
  label = input.required<string>();
  // Two-way bindable signal input — parent uses [(count)]
  count = model(0);
  // Output signal
  changed = output<number>();

  inc() { this.count.update(c => c + 1); this.changed.emit(this.count()); }
  dec() { this.count.update(c => c - 1); this.changed.emit(this.count()); }
}`,
      },
      {
        language: 'html',
        label: 'Parent template',
        code: `<app-counter label="Items" [(count)]="itemCount" (changed)="onChange($event)" />`,
      },
    ],
    pointers: [
      {
        label: 'InputsOutputsDemoComponent',
        path: 'src/app/features/inputs-outputs-demo/inputs-outputs-demo.ts',
      },
    ],
    demoKey: 'inputs-outputs',
    references: [
      { label: 'Signal inputs', url: 'https://angular.dev/guide/signals/inputs' },
      { label: 'Model inputs', url: 'https://angular.dev/guide/signals/model' },
    ],
  },
  {
    slug: 'package-management',
    section: 'fundamentals',
    title: 'Package Management',
    tagline: 'package.json, lockfiles, peer constraints and ng update.',
    summary:
      'Angular framework packages must stay in lockstep on the same major version and have peer-dependency constraints on TypeScript, RxJS and zone.js (when present). ng update exists to move them as a coordinated set with automated migration schematics. Always commit your lockfile and use npm ci in CI for reproducible installs.',
    keyPoints: [
      'Caret (^) ranges allow minor/patch updates — lockfile pins the resolved tree.',
      'npm ci installs strictly from the lockfile — the CI default.',
      'Mixing npm and yarn lockfiles in one repo causes drift — pick one.',
      'Nx is the dominant choice for Angular monorepos with enforced module boundaries.',
    ],
    snippets: [
      {
        language: 'bash',
        label: 'Discipline',
        code: `# Reproducible CI install
npm ci

# Upgrade @angular/* as a coordinated set with codemods
ng update @angular/cli @angular/core

# Inspect what would change before committing
ng update --dry-run`,
      },
    ],
    pointers: [
      { label: 'package.json', path: 'package.json' },
      { label: 'package-lock.json', path: 'package-lock.json' },
    ],
    references: [
      { label: 'ng update guide', url: 'https://angular.dev/cli/update' },
    ],
    redFlags: [
      'Floats @angular/* versions independently and is surprised when builds break.',
      'Does not commit the lockfile.',
    ],
  },

  // =====================================================================
  // SECTION 2 — Dependency Injection
  // =====================================================================
  {
    slug: 'di-hierarchy',
    section: 'di',
    title: 'Injector Hierarchy',
    tagline: 'How Angular resolves dependencies up the component / module tree.',
    summary:
      'When a class asks for a dependency, Angular looks in the component injector, then its ancestors, then the module/root injector, until it finds a provider or throws NullInjectorError. Component-level providers create a fresh instance scoped to that component and its children — the basis of per-form-state services.',
    keyPoints: [
      'Resolution walks UP from the component to the root injector.',
      'Component providers → new instance per component (and children).',
      'Modifiers: @Optional, @Self, @SkipSelf, @Host control where resolution starts/stops.',
      'inject() function is the modern alternative to constructor injection — usable in field initializers and functional guards.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Constructor vs inject()',
        code: `// Classic constructor injection
constructor(private orders: OrderService) {}

// Modern inject() — works in field initializers, guards, interceptors
private orders = inject(OrderService);

// Modifiers
private parent = inject(ParentService, { optional: true, skipSelf: true });`,
      },
      {
        language: 'typescript',
        label: 'Component-scoped provider',
        code: `@Component({
  selector: 'app-order-form',
  providers: [FormStateService],   // new instance per <app-order-form>
  templateUrl: './order-form.html',
})
export class OrderFormComponent {
  private state = inject(FormStateService); // fresh per form
}`,
      },
    ],
    pointers: [
      {
        label: 'DiHierarchyDemoComponent',
        path: 'src/app/features/di-hierarchy-demo/di-hierarchy-demo.ts',
      },
    ],
    demoKey: 'di-hierarchy',
    references: [
      { label: 'Dependency injection', url: 'https://angular.dev/guide/di' },
    ],
    redFlags: [
      'Thinks every service is a global singleton regardless of where it is provided.',
      'Cannot explain why the same service can have two instances.',
    ],
  },
  {
    slug: 'provider-scopes',
    section: 'di',
    title: 'Provider Scopes',
    tagline: 'providedIn: \'root\' vs route-level vs component providers.',
    summary:
      'providedIn: \'root\' is tree-shakable and the right default for most services. Route-level providers (modern replacement for module providers) scope a service to a feature subtree. Component providers create a new instance per component instance — the right tool for genuinely per-instance state. Lazy-loaded routes create child injectors, which is the classic source of "why do I have two instances?" bugs.',
    keyPoints: [
      'providedIn: \'root\' — one app-wide singleton, tree-shakable, default.',
      'Route-level providers — one instance per lazy-loaded route subtree.',
      'Component providers — one instance per component instance (and children).',
      'Lazy-loaded routes create child injectors — a separate instance from root.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Three scopes',
        code: `// Root singleton — tree-shakable
@Injectable({ providedIn: 'root' })
export class OrderService {}

// Route-level — instance per lazy feature
export const routes: Routes = [
  {
    path: 'admin',
    providers: [AdminAuditLog],
    loadComponent: () => import('./admin/admin.page').then(m => m.AdminPage),
  },
];

// Component-scoped — instance per <app-order-form>
@Component({ providers: [FormStateService], ... })
export class OrderFormComponent {}`,
      },
    ],
    pointers: [
      { label: 'src/app/app.routes.ts', path: 'src/app/app.routes.ts' },
    ],
    references: [
      { label: 'Hierarchical injectors', url: 'https://angular.dev/guide/di/hierarchical-dependency-injection' },
    ],
  },
  {
    slug: 'injection-tokens',
    section: 'di',
    title: 'InjectionToken & Provider Recipes',
    tagline: 'Inject non-class values — config, primitives, interfaces.',
    summary:
      'Angular\'s DI keys are usually class types, but you often need to inject things that are not classes: a config object, a string, a feature flag, or an interface (which is erased at runtime and cannot serve as a DI key). InjectionToken creates a unique typed key for these. Provider recipes (useValue / useClass / useFactory / useExisting / multi) cover the rest.',
    keyPoints: [
      'You cannot inject an interface — it is erased at runtime.',
      'new InjectionToken<T>(\'name\') creates a typed key.',
      'multi: true collects several values under one token — how HTTP interceptors and validators are registered.',
      'useFactory with deps for computed configuration.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Configuration token',
        code: `import { InjectionToken, inject } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
  timeoutMs: number;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('api.config');

// Provide it
{ provide: API_CONFIG, useValue: { baseUrl: '/api', timeoutMs: 5000 } }

// Inject it
const config = inject(API_CONFIG);`,
      },
      {
        language: 'typescript',
        label: 'Provider recipes',
        code: `// Constant value
{ provide: API_BASE, useValue: '/api/v2' }

// Swap implementation
{ provide: Logger, useClass: ConsoleLogger }

// Computed at injection time
{ provide: ApiClient, useFactory: (cfg: ApiConfig) => new ApiClient(cfg), deps: [API_CONFIG] }

// Alias to another token
{ provide: NewToken, useExisting: OldToken }

// Multi — collect many under one token
{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }`,
      },
    ],
    pointers: [
      {
        label: 'InjectionTokensDemoComponent',
        path: 'src/app/features/injection-tokens-demo/injection-tokens-demo.ts',
      },
    ],
    demoKey: 'injection-tokens',
    references: [
      { label: 'InjectionToken', url: 'https://angular.dev/api/core/InjectionToken' },
    ],
  },

  // =====================================================================
  // SECTION 3 — Reactivity & Change Detection
  // =====================================================================
  {
    slug: 'rxjs-operators',
    section: 'reactivity',
    title: 'RxJS Flattening Operators',
    tagline: 'switchMap, mergeMap, concatMap, exhaustMap — the concurrency policy.',
    summary:
      'The four higher-order operators handle "an Observable that emits Observables" and differ in how they manage concurrency. Choosing the wrong one causes real bugs: mergeMap on a search box leaks stale results; switchMap on sequential writes can cancel an in-flight save.',
    keyPoints: [
      'switchMap — cancel previous inner; right for typeahead, route-param-driven fetches.',
      'mergeMap — run all concurrently; right when order does not matter (fan-out).',
      'concatMap — queue, one at a time; right when order matters and overlap is forbidden.',
      'exhaustMap — ignore new outers while an inner is running; right for "do not double-submit".',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Typeahead with switchMap',
        code: `searchControl.valueChanges.pipe(
  debounceTime(250),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term)),
).subscribe(results => this.results.set(results));`,
      },
      {
        language: 'typescript',
        label: 'Submit-once with exhaustMap',
        code: `submitClicks$.pipe(
  exhaustMap(() => this.api.save(this.form.value)),
).subscribe(saved => this.toast.show('Saved'));`,
      },
      {
        language: 'typescript',
        label: 'Sequential writes with concatMap',
        code: `from(uploadQueue).pipe(
  concatMap(file => this.api.upload(file)),  // one at a time, in order
).subscribe();`,
      },
    ],
    pointers: [
      {
        label: 'RxjsOperatorsDemoComponent',
        path: 'src/app/features/rxjs-operators-demo/rxjs-operators-demo.ts',
        note: 'Visual comparison of all four operators on the same input stream.',
      },
    ],
    demoKey: 'rxjs-operators',
    references: [
      { label: 'RxJS operators', url: 'https://rxjs.dev/guide/operators' },
    ],
    redFlags: [
      'Uses mergeMap for everything.',
      'Cannot give a concrete scenario where switchMap vs concatMap matters.',
    ],
  },
  {
    slug: 'async-pipe',
    section: 'reactivity',
    title: 'The async Pipe',
    tagline: 'Subscribe in the template and unsubscribe automatically.',
    summary:
      'The async pipe subscribes to an Observable (or Promise) directly in the template, renders the latest value and unsubscribes on component destroy. It also marks the component for check on emission, so it works correctly under OnPush. It eliminates the most common Angular memory leak.',
    keyPoints: [
      'Auto-unsubscribes on ngOnDestroy — no subscription bookkeeping.',
      'Calls markForCheck on emission — OnPush-friendly.',
      'Use as-aliasing pattern (data$ | async as data) to subscribe once.',
      'In v17+, toSignal() is an alternative — converts a stream to a signal for templates.',
    ],
    snippets: [
      {
        language: 'html',
        label: 'Subscribe once with as-alias',
        code: `@if (data$ | async; as data) {
  <h2>{{ data.title }}</h2>
  <p>{{ data.body }}</p>
} @else {
  <p>Loading…</p>
}`,
      },
      {
        language: 'typescript',
        label: 'toSignal interop',
        code: `import { toSignal } from '@angular/core/rxjs-interop';

readonly orders = toSignal(this.api.getOrders(), { initialValue: [] });
// In template: {{ orders().length }}`,
      },
    ],
    pointers: [
      {
        label: 'AsyncPipeDemoComponent',
        path: 'src/app/features/async-pipe-demo/async-pipe-demo.ts',
      },
    ],
    demoKey: 'async-pipe',
    references: [
      { label: 'AsyncPipe API', url: 'https://angular.dev/api/common/AsyncPipe' },
    ],
  },
  {
    slug: 'subscription-management',
    section: 'reactivity',
    title: 'Subscription Management',
    tagline: 'Prefer async pipe → takeUntilDestroyed → takeUntil(destroy$) → manual.',
    summary:
      'A subscription that outlives its component leaks. The async pipe is the best option when the value is consumed in the template. takeUntilDestroyed() (v16+) is the modern idiomatic operator for class-side subscriptions; takeUntil(destroy$) is the classic pattern in older codebases.',
    keyPoints: [
      'HttpClient completes after one emission — long-lived streams (router events, valueChanges, intervals, websockets) absolutely leak.',
      'takeUntilDestroyed() with no arguments works in an injection context.',
      'Pass a DestroyRef to use it outside injection context.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'takeUntilDestroyed (modern)',
        code: `import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ /* … */ })
export class OrdersComponent {
  private orders = inject(OrderService);

  constructor() {
    // Injection context — no destroyRef needed
    this.orders.changes$
      .pipe(takeUntilDestroyed())
      .subscribe(o => this.handle(o));
  }
}`,
      },
      {
        language: 'typescript',
        label: 'takeUntil(destroy$) (classic)',
        code: `private destroy$ = new Subject<void>();

ngOnInit() {
  this.stream$
    .pipe(takeUntil(this.destroy$))
    .subscribe(v => this.handle(v));
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}`,
      },
    ],
    pointers: [
      {
        label: 'SubscriptionManagementDemoComponent',
        path: 'src/app/features/subscription-management-demo/subscription-management-demo.ts',
        note: 'Toggle a leaky vs leak-safe subscription and watch the counter.',
      },
    ],
    demoKey: 'subscription-management',
    references: [
      { label: 'takeUntilDestroyed', url: 'https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed' },
    ],
    redFlags: ['Thinks subscriptions clean themselves up.', 'Believes all Observables complete automatically.'],
  },
  {
    slug: 'subjects',
    section: 'reactivity',
    title: 'Subjects — Subject, BehaviorSubject, Replay, Async',
    tagline: 'Multicast streams as the building block for reactive state.',
    summary:
      'A Subject is both an Observable and an Observer — you can push values into it and every emission goes to all current subscribers. The variants differ in what late subscribers receive: BehaviorSubject is the workhorse for reactive state with an initial + current value; ReplaySubject buffers the last N; AsyncSubject emits only on completion.',
    keyPoints: [
      'Subject — no initial value, no replay. Pure event bus.',
      'BehaviorSubject — initial value, replays current to new subscribers. State workhorse.',
      'ReplaySubject(N) — replays last N emissions.',
      'Expose .asObservable() to keep emission private.',
      'Signals now cover much of what BehaviorSubject-as-state used to do.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'BehaviorSubject as service state',
        code: `@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<Item[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  add(item: Item) {
    this.itemsSubject.next([...this.itemsSubject.value, item]);
  }
}`,
      },
    ],
    pointers: [
      {
        label: 'SubjectsDemoComponent',
        path: 'src/app/features/subjects-demo/subjects-demo.ts',
      },
    ],
    demoKey: 'subjects',
    references: [
      { label: 'Subjects', url: 'https://rxjs.dev/guide/subject' },
    ],
  },
  {
    slug: 'change-detection',
    section: 'reactivity',
    title: 'Change Detection: Zone.js & OnPush',
    tagline: 'How Angular re-evaluates bindings and decides what to re-check.',
    summary:
      'Change detection has a when (scheduling) and a how (execution). The classic when used Zone.js to monkey-patch every async API and fire CD over the whole tree. The how walks the tree top-down, re-evaluates each binding, compares to last value, and only mutates the specific DOM nodes whose values changed — checking is cheap, DOM updates are minimal.',
    keyPoints: [
      'Default strategy (CheckAlways) — every component checked every cycle.',
      'OnPush — component only re-checked when input ref changes, an internal event fires, async pipe emits, a read signal changes, or markForCheck() is called.',
      'OnPush + immutable data + async pipe is the long-standing performance pattern.',
      'detectChanges() runs CD for a subtree synchronously; markForCheck() schedules it for next cycle.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'OnPush component',
        code: `@Component({
  selector: 'app-order-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<span>{{ order().total | currency }}</span>\`,
})
export class OrderRowComponent {
  order = input.required<Order>();   // signal input — reads tracked precisely
}`,
      },
      {
        language: 'typescript',
        label: 'Immutable update (does mark OnPush)',
        code: `// New reference triggers CD on the OnPush child
this.orders.update(list => [...list, newOrder]);

// In-place mutation does NOT trigger OnPush
this.orders().push(newOrder); // BAD`,
      },
    ],
    pointers: [
      {
        label: 'ChangeDetectionDemoComponent',
        path: 'src/app/features/change-detection-demo/change-detection-demo.ts',
        note: 'Watch a counter increment under Default vs OnPush.',
      },
    ],
    demoKey: 'change-detection',
    references: [
      { label: 'Change detection', url: 'https://angular.dev/best-practices/runtime-performance' },
    ],
    redFlags: ['Thinks OnPush works with mutated objects.', 'Solves "view will not update" by calling detectChanges everywhere.'],
  },
  {
    slug: 'signals',
    section: 'reactivity',
    title: 'Signals — signal / computed / effect',
    tagline: 'Fine-grained reactivity that tracks reads.',
    summary:
      'A signal is a wrapper around a value that knows who reads it. Reading a signal in a template registers a dependency, so Angular can update precisely those bindings instead of re-checking a tree. computed() is lazy + memoized; effect() runs side effects when its read signals change. Signals are the foundation of zoneless Angular.',
    keyPoints: [
      'signal(v) — writable state; read with count(); update with set / update.',
      'computed(fn) — lazy, memoized; recomputes only when dependencies change AND a reader pulls.',
      'effect(fn) — runs on read-signal changes; for syncing to non-Angular code.',
      'Use sparingly — effects can chain unexpectedly; prefer computed for derived data.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'state → derived → side effect',
        code: `import { signal, computed, effect } from '@angular/core';

readonly count = signal(0);
readonly doubled = computed(() => this.count() * 2);

constructor() {
  effect(() => console.log('count is now', this.count()));
}

inc() { this.count.update(c => c + 1); }`,
      },
      {
        language: 'typescript',
        label: 'Signal-based state service',
        code: `@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<Item[]>([]);
  readonly items = this._items.asReadonly();
  readonly total = computed(() => this._items().reduce((s, i) => s + i.price, 0));

  add(item: Item) { this._items.update(list => [...list, item]); }
  clear() { this._items.set([]); }
}`,
      },
    ],
    pointers: [
      {
        label: 'SignalsDemoComponent',
        path: 'src/app/features/signals-demo/signals-demo.ts',
        note: 'Live counter + derived + effect log.',
      },
    ],
    demoKey: 'signals',
    references: [
      { label: 'Signals guide', url: 'https://angular.dev/guide/signals' },
    ],
    version: 'Stable since v17',
  },
  {
    slug: 'zoneless',
    section: 'reactivity',
    title: 'Zoneless Change Detection',
    tagline: 'Notification-driven scheduler — default in v21.',
    summary:
      'Zoneless drops Zone.js\'s blunt "something async happened" trigger and replaces it with explicit notifications: when a signal read in a template changes, when an event fires, when async pipe emits, or on markForCheck. The how of CD (top-down tree walk, OnPush semantics) is unchanged. Bundle drops ~10kB gzipped; stack traces clear of zone frames.',
    keyPoints: [
      'Stable in v20.2 via provideZonelessChangeDetection() — default for new apps in v21.',
      'No need to adopt signals everywhere — OnPush-heavy apps already work zoneless.',
      'Bare setTimeout / setInterval callbacks no longer refresh the view — surface results via signals or async pipe.',
      'NgZone.run / runOutsideAngular do not need to be removed; tests with fixture.detectChanges() largely keep working.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Zoneless bootstrap (v18+ opt-in, v21 default)',
        code: `import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
  ],
});`,
      },
      {
        language: 'typescript',
        label: 'Bridge non-Angular async into a signal',
        code: `private readonly elapsed = signal(0);

constructor() {
  setInterval(() => {
    // writing the signal notifies the zoneless scheduler
    this.elapsed.update(v => v + 1);
  }, 1000);
}`,
      },
    ],
    pointers: [
      { label: 'src/app/app.config.ts', path: 'src/app/app.config.ts', note: 'See the provideZonelessChangeDetection() provider.' },
    ],
    references: [
      { label: 'Zoneless guide', url: 'https://angular.dev/guide/zoneless' },
    ],
    version: 'Default in v21',
  },

  // =====================================================================
  // SECTION 4 — Directives, Forms & Routing
  // =====================================================================
  {
    slug: 'directives',
    section: 'forms-routing',
    title: 'Attribute vs Structural Directives',
    tagline: 'Behavior on an element vs DOM layout changes.',
    summary:
      'Attribute directives change the appearance or behavior of an element without adding or removing it (ngClass, ngStyle). Structural directives change DOM layout — *ngIf, *ngFor, *ngSwitch — and are sugar for an <ng-template>. Only one structural directive per element; in v17+ prefer the @if/@for control flow.',
    keyPoints: [
      '*ngIf desugars to an <ng-template> Angular stamps into the DOM.',
      'One structural directive per element — use <ng-container> or @if/@for blocks for combinations.',
      'Custom attribute directive: a class with a selector and host bindings/listeners.',
      'Custom structural directive: inject TemplateRef + ViewContainerRef.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Custom attribute directive',
        code: `import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  color = input('yellow');
  private el = inject(ElementRef<HTMLElement>);

  @HostListener('mouseenter') onEnter() { this.el.nativeElement.style.background = this.color(); }
  @HostListener('mouseleave') onLeave() { this.el.nativeElement.style.background = ''; }
}`,
      },
    ],
    pointers: [
      {
        label: 'DirectivesDemoComponent',
        path: 'src/app/features/directives-demo/directives-demo.ts',
      },
    ],
    demoKey: 'directives',
    references: [
      { label: 'Directives', url: 'https://angular.dev/guide/directives' },
    ],
  },
  {
    slug: 'control-flow',
    section: 'forms-routing',
    title: 'Built-in Control Flow — @if / @for / @switch',
    tagline: 'Block-syntax control flow, faster than the directive equivalents.',
    summary:
      'v17 introduced built-in control-flow blocks that live in the template language: @if/@else, @for (with mandatory track), @switch and @defer. No CommonModule import needed. The mandatory track expression in @for eliminates a classic list-rendering performance footgun.',
    keyPoints: [
      '@if (cond) { … } @else if (other) { … } @else { … }',
      '@for (x of xs; track x.id) { … } @empty { … } — track is mandatory.',
      '@switch (v) { @case (a) { … } @default { … } }',
      '@defer triggers — on viewport, on interaction, on idle, on timer, on hover (Section 6).',
    ],
    snippets: [
      {
        language: 'html',
        label: 'Modern control flow',
        code: `@if (user(); as u) {
  <h2>Welcome, {{ u.name }}</h2>
} @else {
  <p>Please sign in.</p>
}

@for (order of orders(); track order.id) {
  <app-order-row [order]="order" />
} @empty {
  <p>No orders yet.</p>
}

@switch (status()) {
  @case ('loading') { <app-spinner /> }
  @case ('error')   { <app-error /> }
  @default          { <app-data /> }
}`,
      },
    ],
    pointers: [
      {
        label: 'ControlFlowDemoComponent',
        path: 'src/app/features/control-flow-demo/control-flow-demo.ts',
      },
    ],
    demoKey: 'control-flow',
    references: [
      { label: 'Built-in control flow', url: 'https://angular.dev/guide/templates/control-flow' },
    ],
    version: 'v17+',
  },
  {
    slug: 'lifecycle-hooks',
    section: 'forms-routing',
    title: 'Lifecycle Hooks',
    tagline: 'ngOnInit, ngOnChanges, ngOnDestroy and the *Checked traps.',
    summary:
      'Angular calls hooks as components are created, change, and destroyed. ngOnInit is the standard place for initialization that depends on inputs; ngOnDestroy is where cleanup goes; ngOnChanges reacts to bound input changes. The *Checked and ngDoCheck hooks fire every CD cycle and must be cheap — they are a classic performance trap.',
    keyPoints: [
      'ngOnInit — runs once after first inputs are set; preferred over the constructor for non-DI work.',
      'ngOnChanges(changes: SimpleChanges) — fires for any bound @Input change.',
      'ngOnDestroy — runs before destruction; clean up timers, subscriptions, listeners.',
      'ngAfterViewInit — child views and viewChild queries are ready.',
      'ngDoCheck / *Checked — every CD cycle; keep cheap or avoid.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Typical hook usage',
        code: `@Component({ /* … */ })
export class OrderListComponent implements OnInit, OnDestroy {
  private orders = inject(OrderService);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.orders.load();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}`,
      },
    ],
    pointers: [
      {
        label: 'LifecycleDemoComponent',
        path: 'src/app/features/lifecycle-demo/lifecycle-demo.ts',
        note: 'Log of every hook firing on mount/update/destroy.',
      },
    ],
    demoKey: 'lifecycle-hooks',
    references: [
      { label: 'Lifecycle hooks', url: 'https://angular.dev/guide/components/lifecycle' },
    ],
    redFlags: ['Does data loading in the constructor.', 'Puts expensive logic in ngDoCheck.'],
  },
  {
    slug: 'template-driven-forms',
    section: 'forms-routing',
    title: 'Template-Driven Forms',
    tagline: 'ngModel-based; familiar but harder to test and scale.',
    summary:
      'Template-driven forms define the form in the template using directives (ngModel, ngForm). Angular builds the control objects implicitly. Convenient for trivial forms; the form logic lives in HTML which is harder to test and to grow.',
    keyPoints: [
      'Requires FormsModule import.',
      'ngModel for two-way binding; #form="ngForm" template ref.',
      'Use for the simplest forms only — anything non-trivial deserves reactive forms.',
    ],
    snippets: [
      {
        language: 'html',
        label: 'Login form (template-driven)',
        code: `<form #f="ngForm" (ngSubmit)="submit(f.value)">
  <input name="email" [(ngModel)]="model.email" required email />
  <input name="password" [(ngModel)]="model.password" required minlength="8" />
  <button [disabled]="f.invalid">Sign in</button>
</form>`,
      },
    ],
    pointers: [
      {
        label: 'TemplateDrivenFormDemoComponent',
        path: 'src/app/features/template-driven-form-demo/template-driven-form-demo.ts',
      },
    ],
    demoKey: 'template-driven-forms',
    references: [
      { label: 'Template-driven forms', url: 'https://angular.dev/guide/forms/template-driven-forms' },
    ],
  },
  {
    slug: 'reactive-forms',
    section: 'forms-routing',
    title: 'Reactive Forms',
    tagline: 'Typed, testable form model defined in the component class.',
    summary:
      'Reactive forms define the form model explicitly with FormControl / FormGroup / FormArray (typically via FormBuilder). The template binds to that model with [formGroup] and formControlName. The form is a typed, testable, synchronously-available object whose valueChanges and statusChanges are Observables.',
    keyPoints: [
      'Typed reactive forms (v14+) give compile-time safety.',
      'valueChanges / statusChanges are Observables — great for dependent fields, autosave.',
      'FormArray for dynamic add/remove rows.',
      'Custom validators are functions (sync) or returning Observables (async).',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Typed FormGroup',
        code: `import { FormBuilder, Validators } from '@angular/forms';

readonly form = inject(FormBuilder).group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
});

submit() {
  if (this.form.invalid) return;
  const { email, password } = this.form.getRawValue();
  this.auth.login(email, password);
}`,
      },
      {
        language: 'html',
        label: 'Template',
        code: `<form [formGroup]="form" (ngSubmit)="submit()">
  <mat-form-field>
    <mat-label>Email</mat-label>
    <input matInput formControlName="email" />
  </mat-form-field>
  <mat-form-field>
    <mat-label>Password</mat-label>
    <input matInput type="password" formControlName="password" />
  </mat-form-field>
  <button mat-raised-button [disabled]="form.invalid">Sign in</button>
</form>`,
      },
    ],
    pointers: [
      {
        label: 'ReactiveFormDemoComponent',
        path: 'src/app/features/reactive-form-demo/reactive-form-demo.ts',
      },
    ],
    demoKey: 'reactive-forms',
    references: [
      { label: 'Reactive forms', url: 'https://angular.dev/guide/forms/reactive-forms' },
    ],
  },
  {
    slug: 'signal-forms',
    section: 'forms-routing',
    title: 'Signal Forms (experimental, v21)',
    tagline: 'A signals-based forms API in developer preview.',
    summary:
      'Signal Forms (introduced experimentally in v21) build forms on top of signals — control state, value and validity are signals, so derived state composes naturally with computed() and effect(). Opt-in and experimental; production code today still standardizes on reactive forms.',
    keyPoints: [
      'Form state is signal-based — no manual subscription bookkeeping.',
      'Composes cleanly with the rest of the signals graph.',
      'Still experimental — API may change.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Shape (illustrative)',
        code: `// Experimental API — see Angular RFC for exact shape
const profile = formGroup({
  name: formField(''),
  email: formField('', [validator(emailRule)]),
});

const isValid = computed(() => profile.valid());
const value = computed(() => profile.value());`,
      },
    ],
    pointers: [
      {
        label: 'SignalFormDemoComponent',
        path: 'src/app/features/signal-form-demo/signal-form-demo.ts',
      },
    ],
    demoKey: 'signal-forms',
    references: [
      { label: 'Signal Forms RFC', url: 'https://github.com/angular/angular/discussions' },
    ],
    version: 'Experimental v21',
  },
  {
    slug: 'routing',
    section: 'forms-routing',
    title: 'Router — provideRouter, routerLink, guards, resolvers',
    tagline: 'URL → component, with functional guards and route-level providers.',
    summary:
      'The Router maps URL paths to components. Modern standalone apps register routes via provideRouter(routes) in the application config. Functional guards and resolvers (functions, not classes) replace the older class-based versions. Route-level providers scope services to a feature subtree.',
    keyPoints: [
      'provideRouter(routes) in app.config.ts is the modern entry point.',
      '<router-outlet> — placeholder for matched component.',
      'routerLink — declarative navigation; routerLinkActive for active CSS class.',
      'Functional guards: CanActivateFn / CanMatchFn / ResolveFn.',
      'ActivatedRoute exposes paramMap as an Observable — react without re-instantiating.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Routes config + functional guard',
        code: `import { Routes, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

const isAdmin: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAdmin() || inject(Router).parseUrl('/forbidden');
};

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then(m => m.Home) },
  {
    path: 'admin',
    canMatch: [isAdmin],
    providers: [AuditLog],
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
  },
  { path: '**', loadComponent: () => import('./not-found/not-found').then(m => m.NotFound) },
];`,
      },
    ],
    pointers: [
      { label: 'src/app/app.routes.ts', path: 'src/app/app.routes.ts' },
      { label: 'src/app/app.config.ts', path: 'src/app/app.config.ts', note: 'provideRouter call.' },
    ],
    references: [
      { label: 'Router guide', url: 'https://angular.dev/guide/routing' },
    ],
  },
  {
    slug: 'lazy-loading',
    section: 'forms-routing',
    title: 'Lazy Loading',
    tagline: 'loadComponent and loadChildren for code-splitting.',
    summary:
      'Lazy-loaded routes split features into separate bundles loaded only when their route activates. loadComponent loads a single standalone component; loadChildren loads a Routes array. This keeps the initial bundle small and creates a child injector — services provided in the lazy module are isolated.',
    keyPoints: [
      'loadComponent — point to a standalone component.',
      'loadChildren — point to a Routes array for nested routing.',
      'Lazy boundaries create child injectors — services declared inside are distinct from root.',
      'Prefetch with withPreloading(PreloadAllModules) when bandwidth is cheap.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Two ways to lazy-load',
        code: `// Single standalone component
{
  path: 'orders/:id',
  loadComponent: () => import('./order-detail/order-detail').then(m => m.OrderDetail),
}

// Nested routes module
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
}

// Preloading strategy
provideRouter(routes, withPreloading(PreloadAllModules))`,
      },
    ],
    pointers: [
      { label: 'src/app/app.routes.ts', path: 'src/app/app.routes.ts', note: 'All feature routes are lazy.' },
    ],
    references: [
      { label: 'Lazy loading', url: 'https://angular.dev/guide/routing/lazy-loading' },
    ],
  },

  // =====================================================================
  // SECTION 5 — Modularity & State Management
  // =====================================================================
  {
    slug: 'standalone-vs-ngmodule',
    section: 'modularity',
    title: 'Standalone vs NgModule',
    tagline: 'The structural shift away from NgModules.',
    summary:
      'Standalone components (stable v15+, default in v17+) declare their own dependencies in an imports array and need no enclosing module. Apps bootstrap a standalone root with bootstrapApplication() and configure cross-cutting concerns through functional providers — provideRouter, provideHttpClient. NgModules still exist; the two interoperate, so migration is incremental.',
    keyPoints: [
      'NgModule grouped declarations, imports, exports, providers — added boilerplate.',
      'standalone: true (default) makes dependencies explicit at the component level.',
      'bootstrapApplication + provide* functions replace the forRoot pattern.',
      'Standalone components and NgModules interoperate both directions.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Modern bootstrap',
        code: `import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
  ],
});`,
      },
    ],
    pointers: [
      { label: 'src/main.ts', path: 'src/main.ts' },
      { label: 'src/app/app.config.ts', path: 'src/app/app.config.ts' },
    ],
    references: [
      { label: 'Standalone components', url: 'https://angular.dev/guide/components/anatomy-of-components' },
    ],
  },
  {
    slug: 'state-management',
    section: 'modularity',
    title: 'State Management: Signals, BehaviorSubject, NgRx',
    tagline: 'Start with a service + signal. Reach for a store only when state coordination is hard.',
    summary:
      'Most apps should start with — and many should stay with — state in services exposed via signals (modern) or BehaviorSubject (older idiom). A dedicated store (NgRx, NGXS, NgRx SignalStore) earns its boilerplate only when many components read/write shared state, side effects need orchestration, or a single auditable state tree is required.',
    keyPoints: [
      'Default: a signal-based service. Simple, testable, tree-shakable.',
      'NgRx — store/actions/reducers/selectors/effects; Redux DevTools time travel.',
      'NGXS — class-decorator-based, lighter ergonomics.',
      'NgRx ComponentStore / SignalStore — middle-ground options.',
      'Adopting a global store too early is a common over-engineering mistake.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Signal-based store (the modern default)',
        code: `@Injectable({ providedIn: 'root' })
export class OrderStore {
  private readonly _orders = signal<Order[]>([]);
  readonly orders = this._orders.asReadonly();
  readonly count = computed(() => this._orders().length);

  add(o: Order)   { this._orders.update(list => [...list, o]); }
  remove(id: string) { this._orders.update(list => list.filter(o => o.id !== id)); }
}`,
      },
      {
        language: 'typescript',
        label: 'NgRx SignalStore (when you need more)',
        code: `import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withState({ orders: [] as Order[], loading: false }),
  withMethods((store, api = inject(OrderApi)) => ({
    async load() {
      patchState(store, { loading: true });
      const orders = await firstValueFrom(api.list());
      patchState(store, { orders, loading: false });
    },
  })),
);`,
      },
    ],
    pointers: [
      {
        label: 'OrderStore example',
        path: 'src/app/features/state-management-demo/state-management-demo.ts',
      },
    ],
    references: [
      { label: 'NgRx', url: 'https://ngrx.io' },
      { label: 'NgRx SignalStore', url: 'https://ngrx.io/guide/signals' },
    ],
    redFlags: ['Thinks every Angular app needs NgRx.', 'Cannot articulate what NgRx adds over a service.'],
  },
  {
    slug: 'code-reuse',
    section: 'modularity',
    title: 'Code Reuse — Services, Components, Directives, Pipes',
    tagline: 'Match the primitive to the kind of duplication.',
    summary:
      'Logic → service. UI → component. DOM behavior → directive. View transformation → pipe. A directive is the right tool for cross-cutting DOM behavior and is consistently under-used. Pure pipes are memoized and cheap; impure pipes recompute every CD cycle.',
    keyPoints: [
      'Services — reuse non-UI logic and state. Injectable, testable.',
      'Presentational components — reuse UI (design system).',
      'Directives — reuse DOM behavior (tooltip, autofocus, permission show/hide).',
      'Pipes — reuse view transformations (format, currency, custom display).',
      'Extract on the second or third repeat, not the first.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Pure pipe (memoized)',
        code: `@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    return name.split(/\\s+/).map(p => p[0]).join('').toUpperCase();
  }
}`,
      },
    ],
    pointers: [
      { label: 'src/app/shared/', path: 'src/app/shared/' },
    ],
    references: [
      { label: 'Pipes', url: 'https://angular.dev/guide/pipes' },
      { label: 'Directives', url: 'https://angular.dev/guide/directives' },
    ],
  },
  {
    slug: 'smart-vs-presentational',
    section: 'modularity',
    title: 'Smart vs Presentational Components',
    tagline: 'Push side effects up, keep leaves pure.',
    summary:
      'Smart (container) components inject services, fetch data and own state. Presentational (dumb) components receive everything via @Input and emit via @Output — pure functions of their inputs, trivially testable. Presentational components are ideal OnPush candidates; pushing data-fetching up keeps most of the tree fast and easy to test.',
    keyPoints: [
      'Smart — tied to a route or feature; knows about services.',
      'Presentational — pure input → view; ideal for OnPush + signal inputs.',
      'Maps onto smart-component-per-route structure.',
      'Do not over-apply to tiny apps.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Presentational (signal inputs + outputs)',
        code: `@Component({
  selector: 'app-order-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <span>{{ order().customer }}</span>
    <button (click)="remove.emit(order().id)">Remove</button>
  \`,
})
export class OrderRow {
  order = input.required<Order>();
  remove = output<string>();
}`,
      },
      {
        language: 'typescript',
        label: 'Smart container',
        code: `@Component({
  selector: 'app-orders-page',
  imports: [OrderRow],
  template: \`
    @for (o of store.orders(); track o.id) {
      <app-order-row [order]="o" (remove)="store.remove($event)" />
    }
  \`,
})
export class OrdersPage {
  store = inject(OrderStore);
}`,
      },
    ],
    pointers: [
      {
        label: 'SmartPresentationalDemoComponent',
        path: 'src/app/features/smart-presentational-demo/smart-presentational-demo.ts',
      },
    ],
    demoKey: 'smart-vs-presentational',
    references: [
      { label: 'Component design', url: 'https://angular.dev/best-practices' },
    ],
  },

  // =====================================================================
  // SECTION 6 — Build, Rendering & Architecture
  // =====================================================================
  {
    slug: 'build-tools',
    section: 'architecture',
    title: 'Build Pipeline — esbuild, Vite, Rollup, Webpack',
    tagline: 'The CLI hides the bundler; modern default is esbuild + Vite.',
    summary:
      'The CLI abstracts the bundler so most developers never write bundler config. Historically Webpack; since v17 the default application builder is esbuild + Vite, dramatically cutting cold-build and rebuild times. Libraries build through ng-packagr (Rollup) for clean, tree-shakable output.',
    keyPoints: [
      'esbuild + Vite — default app builder in v17+ (extremely fast).',
      'Rollup (via ng-packagr) — library builds.',
      'Webpack — legacy CLI default; still in older projects.',
      'gulp — task runner, not a bundler; legacy.',
      'angular.json budgets fail builds that exceed size limits.',
    ],
    snippets: [
      {
        language: 'json',
        label: 'Builder declaration in angular.json (v17+)',
        code: `"architect": {
  "build": {
    "builder": "@angular/build:application",
    "options": { "browser": "src/main.ts", "tsConfig": "tsconfig.app.json" }
  },
  "serve": {
    "builder": "@angular/build:dev-server"
  }
}`,
      },
    ],
    pointers: [
      { label: 'angular.json', path: 'angular.json' },
    ],
    references: [
      { label: 'esbuild migration', url: 'https://angular.dev/tools/cli/build-system-migration' },
    ],
  },
  {
    slug: 'http-interceptors',
    section: 'architecture',
    title: 'HttpClient & Interceptors',
    tagline: 'Functional interceptors for auth, error handling, retry, logging.',
    summary:
      'HttpClient returns Observables. The cross-cutting mechanism is HTTP interceptors — middleware in the request/response pipeline. Modern Angular registers them functionally via withInterceptors() in provideHttpClient(), rather than the older HTTP_INTERCEPTORS multi-provider.',
    keyPoints: [
      'Functional interceptors are functions returning Observable<HttpEvent>.',
      'Use for: token attach + 401 refresh, error mapping, retry with backoff (4xx exempted), correlation headers.',
      'Per-call concerns (catchError, map, switchMap, shareReplay) live in services.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Functional interceptor + provider',
        code: `import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  const authed = token ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } }) : req;
  return next(authed);
};

// In app.config.ts
provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))`,
      },
    ],
    pointers: [
      {
        label: 'HttpInterceptorDemoComponent',
        path: 'src/app/features/http-interceptor-demo/http-interceptor-demo.ts',
      },
    ],
    demoKey: 'http-interceptors',
    references: [
      { label: 'HttpClient', url: 'https://angular.dev/guide/http' },
    ],
  },
  {
    slug: 'spa-vs-mpa',
    section: 'architecture',
    title: 'SPA vs MPA',
    tagline: 'A spectrum, not a binary, since SSR + hydration arrived.',
    summary:
      'A SPA sends one shell and the client framework handles routing; rich interactivity but a larger initial JS payload and SEO challenges. An MPA renders a full HTML page per navigation; fast first paint and SEO-friendly but less fluid. Modern Angular SPAs can adopt SSR + incremental hydration to obtain MPA-like first-load while keeping rich client behavior.',
    keyPoints: [
      'SPA → app-like interactivity, large initial bundle, SEO challenges.',
      'MPA → fast first paint, simple model, less fluid.',
      'Angular SSR (Universal evolved) + hydration spans the gap.',
      'Incremental hydration (stable v20) hydrates components on demand.',
    ],
    snippets: [
      {
        language: 'bash',
        label: 'Enable SSR on a new project',
        code: `ng new my-app --ssr=true
# Or add to an existing app:
ng add @angular/ssr`,
      },
    ],
    pointers: [],
    references: [
      { label: 'Angular SSR', url: 'https://angular.dev/guide/ssr' },
    ],
  },
  {
    slug: 'defer',
    section: 'architecture',
    title: 'Deferrable Views — @defer',
    tagline: 'Lazy-load parts of a template declaratively.',
    summary:
      'A @defer block specifies a trigger (on viewport, on interaction, on idle, on timer, on hover) and Angular ships the block\'s dependencies in a separate chunk loaded only when the trigger fires. @placeholder, @loading and @error blocks describe the meantime. Pushes non-critical UI out of the initial bundle without hand-rolled lazy loading.',
    keyPoints: [
      'Triggers: on viewport, on interaction, on idle, on timer(Nms), on hover, on immediate.',
      'Sub-blocks: @placeholder (shown until trigger), @loading (during chunk fetch), @error.',
      'prefetch when (cond) — speculatively load the chunk.',
    ],
    snippets: [
      {
        language: 'html',
        label: '@defer with all sub-blocks',
        code: `@defer (on viewport; prefetch on idle) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder (minimum 200ms) {
  <div class="skeleton">Chart will appear when scrolled into view…</div>
} @loading (after 100ms; minimum 500ms) {
  <mat-progress-spinner mode="indeterminate" />
} @error {
  <p>Failed to load chart.</p>
}`,
      },
    ],
    pointers: [
      {
        label: 'DeferDemoComponent',
        path: 'src/app/features/defer-demo/defer-demo.ts',
      },
    ],
    demoKey: 'defer',
    references: [
      { label: 'Deferrable views', url: 'https://angular.dev/guide/templates/defer' },
    ],
    version: 'v17+',
  },
  {
    slug: 'ssr-hydration',
    section: 'architecture',
    title: 'SSR & Hydration',
    tagline: 'Server-rendered first paint, then hydrate into a live SPA.',
    summary:
      'Angular SSR renders the first view to HTML on the server, so users see content quickly and crawlers receive real markup, then hydrates that markup into a live client application. Incremental hydration (stable v20) hydrates components on demand by viewport or interaction, so the page becomes interactive where the user actually engages.',
    keyPoints: [
      'provideClientHydration() enables hydration.',
      'withIncrementalHydration() (v20+) hydrates per-component, on-trigger.',
      '@defer integrates with hydration triggers.',
      'Closes the SPA-vs-MPA gap on first paint and SEO.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Hydration providers',
        code: `import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(withIncrementalHydration()),
    provideRouter(routes),
  ],
});`,
      },
    ],
    pointers: [],
    references: [
      { label: 'Hydration', url: 'https://angular.dev/guide/hydration' },
      { label: 'Incremental hydration', url: 'https://angular.dev/guide/incremental-hydration' },
    ],
    version: 'Incremental hydration v20+',
  },
  {
    slug: 'performance',
    section: 'architecture',
    title: 'Performance Diagnosis',
    tagline: 'Measure first. OnPush, trackBy, virtual scroll, @defer.',
    summary:
      'Diagnose before optimizing: Angular DevTools profiler, Chrome Performance / Memory, source-map-explorer, Lighthouse. Usual culprits: change-detection thrash (fix with OnPush + immutable data + async pipe / signals), big initial bundle (lazy routes, @defer, budgets), large lists (trackBy and CDK virtual scroll), expensive template expressions (pure pipes, signals).',
    keyPoints: [
      'OnPush on presentational components — skip whole subtrees per CD cycle.',
      'track in @for (mandatory) — stable identity prevents re-render churn.',
      '@angular/cdk/scrolling — virtual scroll for thousands of rows.',
      'Avoid function calls in template interpolation (re-run every CD cycle).',
      'Signals enable fine-grained updates, reducing CD pressure further.',
    ],
    snippets: [
      {
        language: 'html',
        label: 'Virtual scrolling 10k rows',
        code: `<cdk-virtual-scroll-viewport itemSize="48" class="viewport">
  @for (row of rows; track row.id) {
    <div class="row">{{ row.label }}</div>
  }
</cdk-virtual-scroll-viewport>`,
      },
    ],
    pointers: [],
    references: [
      { label: 'Runtime perf', url: 'https://angular.dev/best-practices/runtime-performance' },
      { label: 'Angular DevTools', url: 'https://angular.dev/tools/devtools' },
    ],
  },
  {
    slug: 'testing',
    section: 'architecture',
    title: 'Testing — Unit, Component, E2E',
    tagline: 'TestBed for components, Vitest by default in v21, Cypress/Playwright for E2E.',
    summary:
      'Layered: unit tests for services and pipes (fast, no DOM); component tests via TestBed + ComponentFixture (render, set inputs, query DOM, assert); E2E in a real browser via Cypress or Playwright (Protractor is deprecated). v21 defaults to Vitest as the runner; Jest and Karma still supported on existing projects.',
    keyPoints: [
      'TestBed.configureTestingModule + ComponentFixture.',
      'HttpTestingController fakes HTTP.',
      'fakeAsync + tick for synchronous async assertions.',
      'Many fast unit tests, fewer component tests, a thin layer of E2E on critical paths.',
    ],
    snippets: [
      {
        language: 'typescript',
        label: 'Component test (Vitest)',
        code: `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderRow } from './order-row';

describe('OrderRow', () => {
  let fixture: ComponentFixture<OrderRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrderRow] }).compileComponents();
    fixture = TestBed.createComponent(OrderRow);
  });

  it('renders the customer name', () => {
    fixture.componentRef.setInput('order', { id: '1', customer: 'Ada Lovelace' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Ada Lovelace');
  });
});`,
      },
    ],
    pointers: [
      { label: 'src/app/app.spec.ts', path: 'src/app/app.spec.ts' },
    ],
    references: [
      { label: 'Testing guide', url: 'https://angular.dev/guide/testing' },
    ],
    version: 'Vitest default in v21',
  },
  {
    slug: 'version-evolution',
    section: 'architecture',
    title: 'Framework Evolution & Major Upgrades',
    tagline: 'One major at a time. ng update + update.angular.dev.',
    summary:
      'Treat a major upgrade as a project, not a version bump. update.angular.dev generates a step-by-step path; ng update runs codemods that rewrite breaking-change code automatically. Inventory third-party libraries first (they are usually the blocker). Separate the version upgrade from feature-pattern migrations (standalone, signals, control flow).',
    keyPoints: [
      'Upgrade one major at a time — Angular supports n → n+1.',
      'ng update applies automated migration schematics — review the diffs.',
      'Lagging third-party Angular libraries are the typical blocker.',
      'Goal is rarely "be on vN" — it is "unlock X / reduce maintenance burden".',
    ],
    snippets: [
      {
        language: 'bash',
        label: 'Major upgrade workflow',
        code: `# 1. Check the official path for your jump
# https://update.angular.dev (paste from/to versions)

# 2. Upgrade Angular as a coordinated set
ng update @angular/cli@21 @angular/core@21

# 3. Update first-party libraries (Material, CDK)
ng update @angular/material@21 @angular/cdk@21

# 4. Inspect codemod diffs, run the full test suite, ship one major at a time`,
      },
    ],
    pointers: [],
    references: [
      { label: 'update.angular.dev', url: 'https://update.angular.dev' },
      { label: 'Versioning & releases', url: 'https://angular.dev/reference/releases' },
    ],
  },
];
