import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';

import type { SnippetLang } from '../../core/features/feature.model';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);

const LANG_LABELS: Record<SnippetLang, string> = {
  typescript: 'TypeScript',
  html: 'HTML',
  scss: 'SCSS',
  bash: 'Shell',
  json: 'JSON',
};

@Component({
  selector: 'app-code-block',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
})
export class CodeBlock {
  code = input.required<string>();
  language = input<SnippetLang>('typescript');
  label = input<string | undefined>(undefined);

  private codeEl = viewChild<ElementRef<HTMLElement>>('codeEl');
  private snackbar = inject(MatSnackBar);

  protected readonly highlighted = signal('');
  protected readonly languageLabel = computed(() => LANG_LABELS[this.language()]);

  constructor() {
    effect(() => {
      const code = this.code();
      const lang = this.language();
      const result = hljs.highlight(code, { language: lang, ignoreIllegals: true });
      this.highlighted.set(result.value);
    });
  }

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.snackbar.open('Snippet copied', undefined, { duration: 1500 });
    } catch {
      this.snackbar.open('Copy failed', undefined, { duration: 1500 });
    }
  }
}
