import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Task } from '../../core/features/feature.model';
import { RunResult, runCode, formatValue } from './code-runner';

type Answer = string | number | boolean | null;
interface TaskState {
  answer: Answer;
  code: string | null;
  result: RunResult | null;
  running: boolean;
  submitted: boolean;
  hintOpen: boolean;
}

const EMPTY_STATE: TaskState = {
  answer: null,
  code: null,
  result: null,
  running: false,
  submitted: false,
  hintOpen: false,
};

@Component({
  selector: 'app-feature-tasks',
  imports: [
    FormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-tasks.html',
  styleUrl: './feature-tasks.scss',
})
export class FeatureTasks {
  /** Source feature slug — used as a reset key when the user navigates. */
  slug = input.required<string>();
  tasks = input.required<Task[]>();

  protected readonly formatValue = formatValue;

  protected readonly states = signal<Record<number, TaskState>>({});

  protected readonly completedCount = computed(() => {
    const s = this.states();
    return this.tasks().filter((_, i) => this.isCorrect(i, s)).length;
  });

  constructor() {
    effect(() => {
      // Reset all state whenever the slug changes
      this.slug();
      this.states.set({});
    });
  }

  protected stateOf(i: number): TaskState {
    return this.states()[i] ?? EMPTY_STATE;
  }

  protected codeOf(i: number): string {
    const t = this.tasks()[i];
    if (!t || t.validator.kind !== 'code') return '';
    const s = this.stateOf(i);
    return s.code ?? t.validator.starter;
  }

  private patch(i: number, patch: Partial<TaskState>) {
    this.states.update((m) => ({
      ...m,
      [i]: { ...this.stateOf(i), ...patch },
    }));
  }

  protected setAnswer(i: number, value: Answer) {
    this.patch(i, { answer: value, submitted: false });
  }

  protected setCode(i: number, code: string) {
    this.patch(i, { code, submitted: false, result: null });
  }

  protected resetCode(i: number) {
    const t = this.tasks()[i];
    if (!t || t.validator.kind !== 'code') return;
    this.patch(i, { code: t.validator.starter, result: null, submitted: false });
  }

  protected toggleHint(i: number) {
    this.patch(i, { hintOpen: !this.stateOf(i).hintOpen });
  }

  protected submit(i: number) {
    this.patch(i, { submitted: true });
  }

  protected reset(i: number) {
    const t = this.tasks()[i];
    const starter = t && t.validator.kind === 'code' ? t.validator.starter : null;
    this.patch(i, {
      answer: null,
      code: starter,
      result: null,
      submitted: false,
    });
  }

  protected async runTests(i: number): Promise<void> {
    const t = this.tasks()[i];
    if (!t || t.validator.kind !== 'code') return;
    const code = this.codeOf(i);
    this.patch(i, { running: true, result: null, submitted: false });
    const result = await runCode(code, t.validator.cases);
    this.patch(i, {
      running: false,
      result,
      submitted: true,
    });
  }

  protected isSubmitted(i: number): boolean {
    return this.stateOf(i).submitted;
  }

  protected isRunning(i: number): boolean {
    return this.stateOf(i).running;
  }

  protected canSubmit(i: number): boolean {
    const s = this.stateOf(i);
    const task = this.tasks()[i];
    if (!task) return false;
    switch (task.validator.kind) {
      case 'predict':
        return typeof s.answer === 'number';
      case 'input':
        return typeof s.answer === 'string' && s.answer.trim().length > 0;
      case 'self-check':
        return s.answer === true;
      case 'code':
        return !s.running && this.codeOf(i).trim().length > 0;
    }
  }

  protected isCorrect(i: number, override?: Record<number, TaskState>): boolean {
    const states = override ?? this.states();
    const s = states[i] ?? EMPTY_STATE;
    const task = this.tasks()[i];
    if (!task || !s.submitted) return false;
    switch (task.validator.kind) {
      case 'predict':
        return s.answer === task.validator.correct;
      case 'input': {
        const norm = (v: string) => v.trim().toLowerCase();
        if (typeof s.answer !== 'string') return false;
        const a = norm(s.answer);
        return task.validator.accept.some((acc) => norm(acc) === a);
      }
      case 'self-check':
        return s.answer === true;
      case 'code':
        return !!s.result && !s.result.fatal && s.result.passed === s.result.total;
    }
  }

  protected isWrong(i: number): boolean {
    return this.isSubmitted(i) && !this.isCorrect(i);
  }

  /** Handle Tab key in the code editor — insert 2 spaces instead of moving focus. */
  protected onEditorKeydown(i: number, e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const ta = e.target as HTMLTextAreaElement;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const value = ta.value;
    const indent = '  ';
    ta.value = value.substring(0, start) + indent + value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + indent.length;
    this.setCode(i, ta.value);
  }
}
