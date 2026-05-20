import { Type } from '@angular/core';
import { DemoKey } from './feature.model';

export const DEMO_LOADERS: Record<DemoKey, () => Promise<Type<unknown>>> = {
  'template-syntax': () =>
    import('../../features/template-syntax-demo/template-syntax-demo').then(
      (m) => m.TemplateSyntaxDemo,
    ),
  'inputs-outputs': () =>
    import('../../features/inputs-outputs-demo/inputs-outputs-demo').then(
      (m) => m.InputsOutputsDemo,
    ),
  signals: () =>
    import('../../features/signals-demo/signals-demo').then((m) => m.SignalsDemo),
  'change-detection': () =>
    import('../../features/change-detection-demo/change-detection-demo').then(
      (m) => m.ChangeDetectionDemo,
    ),
  'rxjs-operators': () =>
    import('../../features/rxjs-operators-demo/rxjs-operators-demo').then(
      (m) => m.RxjsOperatorsDemo,
    ),
  'async-pipe': () =>
    import('../../features/async-pipe-demo/async-pipe-demo').then((m) => m.AsyncPipeDemo),
  subjects: () =>
    import('../../features/subjects-demo/subjects-demo').then((m) => m.SubjectsDemo),
  'subscription-management': () =>
    import('../../features/subscription-management-demo/subscription-management-demo').then(
      (m) => m.SubscriptionManagementDemo,
    ),
  directives: () =>
    import('../../features/directives-demo/directives-demo').then((m) => m.DirectivesDemo),
  'control-flow': () =>
    import('../../features/control-flow-demo/control-flow-demo').then((m) => m.ControlFlowDemo),
  'lifecycle-hooks': () =>
    import('../../features/lifecycle-demo/lifecycle-demo').then((m) => m.LifecycleDemo),
  'template-driven-forms': () =>
    import('../../features/template-driven-form-demo/template-driven-form-demo').then(
      (m) => m.TemplateDrivenFormDemo,
    ),
  'reactive-forms': () =>
    import('../../features/reactive-form-demo/reactive-form-demo').then(
      (m) => m.ReactiveFormDemo,
    ),
  'signal-forms': () =>
    import('../../features/signal-form-demo/signal-form-demo').then((m) => m.SignalFormDemo),
  'lazy-loading': () =>
    import('../../features/lazy-loading-demo/lazy-loading-demo').then(
      (m) => m.LazyLoadingDemo,
    ),
  defer: () => import('../../features/defer-demo/defer-demo').then((m) => m.DeferDemo),
  'di-hierarchy': () =>
    import('../../features/di-hierarchy-demo/di-hierarchy-demo').then(
      (m) => m.DiHierarchyDemo,
    ),
  'injection-tokens': () =>
    import('../../features/injection-tokens-demo/injection-tokens-demo').then(
      (m) => m.InjectionTokensDemo,
    ),
  'http-interceptors': () =>
    import('../../features/http-interceptor-demo/http-interceptor-demo').then(
      (m) => m.HttpInterceptorDemo,
    ),
  'smart-vs-presentational': () =>
    import('../../features/smart-presentational-demo/smart-presentational-demo').then(
      (m) => m.SmartPresentationalDemo,
    ),
};
