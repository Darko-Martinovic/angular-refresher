export type SnippetLang =
  | 'typescript'
  | 'html'
  | 'scss'
  | 'json'
  | 'bash';

export interface Snippet {
  language: SnippetLang;
  label?: string;
  code: string;
}

export interface ExplorePointer {
  label: string;
  path: string;
  note?: string;
}

export interface RefLink {
  label: string;
  url: string;
}

export type DemoKey =
  | 'template-syntax'
  | 'inputs-outputs'
  | 'signals'
  | 'change-detection'
  | 'rxjs-operators'
  | 'async-pipe'
  | 'subjects'
  | 'subscription-management'
  | 'directives'
  | 'control-flow'
  | 'lifecycle-hooks'
  | 'template-driven-forms'
  | 'reactive-forms'
  | 'signal-forms'
  | 'lazy-loading'
  | 'defer'
  | 'di-hierarchy'
  | 'injection-tokens'
  | 'http-interceptors'
  | 'smart-vs-presentational';

export interface CodeCase {
  call: string;
  expected: unknown;
  label?: string;
}

export type TaskValidator =
  | {
      kind: 'predict';
      options: string[];
      correct: number;
      explanation: string;
    }
  | {
      kind: 'input';
      accept: string[];
      explanation: string;
    }
  | {
      kind: 'self-check';
      explanation: string;
    }
  | {
      kind: 'code';
      starter: string;
      cases: CodeCase[];
      explanation: string;
    };

export interface Task {
  prompt: string;
  hint?: string;
  validator: TaskValidator;
}

export interface Feature {
  slug: string;
  section: string;
  title: string;
  tagline: string;
  summary: string;
  keyPoints: string[];
  snippets: Snippet[];
  pointers: ExplorePointer[];
  demoKey?: DemoKey;
  references: RefLink[];
  redFlags?: string[];
  version?: string;
  tasks?: Task[];
}

export interface FeatureSection {
  key: string;
  label: string;
  icon: string;
  description: string;
  order: number;
}
