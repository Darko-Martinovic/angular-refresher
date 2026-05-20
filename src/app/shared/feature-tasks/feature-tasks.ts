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

type Answer = string | number | boolean | null;
interface TaskState {
  answer: Answer;
  submitted: boolean;
  hintOpen: boolean;
}

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
    return this.states()[i] ?? { answer: null, submitted: false, hintOpen: false };
  }

  protected setAnswer(i: number, value: Answer) {
    this.states.update((m) => ({
      ...m,
      [i]: { ...this.stateOf(i), answer: value, submitted: false },
    }));
  }

  protected toggleHint(i: number) {
    this.states.update((m) => ({
      ...m,
      [i]: { ...this.stateOf(i), hintOpen: !this.stateOf(i).hintOpen },
    }));
  }

  protected submit(i: number) {
    this.states.update((m) => ({
      ...m,
      [i]: { ...this.stateOf(i), submitted: true },
    }));
  }

  protected reset(i: number) {
    this.states.update((m) => ({
      ...m,
      [i]: { answer: null, submitted: false, hintOpen: this.stateOf(i).hintOpen },
    }));
  }

  protected isSubmitted(i: number): boolean {
    return this.stateOf(i).submitted;
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
    }
  }

  protected isCorrect(i: number, override?: Record<number, TaskState>): boolean {
    const states = override ?? this.states();
    const s = states[i] ?? { answer: null, submitted: false, hintOpen: false };
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
    }
  }

  protected isWrong(i: number): boolean {
    return this.isSubmitted(i) && !this.isCorrect(i);
  }
}
