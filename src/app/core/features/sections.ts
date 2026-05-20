import { FeatureSection } from './feature.model';

export const SECTIONS: FeatureSection[] = [
  {
    key: 'fundamentals',
    label: 'Fundamentals & Tooling',
    icon: 'build',
    description:
      'CLI, components, templates, the bindings vocabulary and package management — the daily surface of Angular.',
    order: 1,
  },
  {
    key: 'di',
    label: 'Dependency Injection',
    icon: 'hub',
    description:
      'The injector hierarchy, provider scopes, and InjectionTokens for everything that is not a class.',
    order: 2,
  },
  {
    key: 'reactivity',
    label: 'Reactivity & Change Detection',
    icon: 'sync',
    description:
      'RxJS, Signals, the Zone.js model, OnPush, and the modern zoneless scheduler that drives v21 by default.',
    order: 3,
  },
  {
    key: 'forms-routing',
    label: 'Directives, Forms & Routing',
    icon: 'edit_note',
    description:
      'Attribute and structural directives, the v17+ control flow, both forms approaches, and the router.',
    order: 4,
  },
  {
    key: 'modularity',
    label: 'Modularity & State Management',
    icon: 'apps',
    description:
      'Standalone components, NgRx vs services, code-reuse primitives, and the smart/presentational pattern.',
    order: 5,
  },
  {
    key: 'architecture',
    label: 'Build, Rendering & Architecture',
    icon: 'architecture',
    description:
      'esbuild builder, @defer, SSR with hydration, SPA vs MPA, performance, testing and major upgrades.',
    order: 6,
  },
];
