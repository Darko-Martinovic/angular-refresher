import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reactive-form-demo',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="form">
      <mat-form-field appearance="outline">
        <mat-label>Full name</mat-label>
        <input matInput formControlName="name" />
        @if (form.controls.name.touched && form.controls.name.invalid) {
          <mat-error>Name is required.</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" />
        @if (form.controls.email.touched && form.controls.email.invalid) {
          <mat-error>Valid email required.</mat-error>
        }
      </mat-form-field>

      <fieldset formArrayName="tags">
        <legend>Tags (FormArray)</legend>
        @for (ctrl of tags.controls; track $index) {
          <div class="tag-row">
            <mat-form-field appearance="outline" class="tag-field">
              <mat-label>Tag {{ $index + 1 }}</mat-label>
              <input matInput [formControlName]="$index" />
            </mat-form-field>
            <button mat-icon-button type="button" (click)="removeTag($index)" aria-label="Remove tag">
              <mat-icon fontSet="material-symbols-outlined">delete</mat-icon>
            </button>
          </div>
        }
        <button mat-stroked-button type="button" (click)="addTag()">
          <mat-icon fontSet="material-symbols-outlined">add</mat-icon>
          Add tag
        </button>
      </fieldset>

      <div class="actions">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Save
        </button>
        <span class="status">
          dirty: <strong>{{ form.dirty }}</strong> ·
          valid: <strong>{{ form.valid }}</strong>
        </span>
      </div>
    </form>

    <div class="live">
      <header>form.valueChanges (live)</header>
      <pre>{{ live() }}</pre>
    </div>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: 0.5rem; max-width: 460px; }
    fieldset { border: 1px solid var(--surface-border); border-radius: 10px;
               padding: 0.65rem 0.85rem; display: flex; flex-direction: column; gap: 0.4rem; }
    legend { padding: 0 0.4rem; color: var(--text-muted); font-size: 0.8rem; }
    .tag-row { display: flex; gap: 0.5rem; align-items: center; }
    .tag-field { flex: 1; }
    .actions { display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; }
    .status { color: var(--text-muted); font-size: 0.85rem; }
    .status strong { color: var(--accent-strong); }
    .live { background: var(--surface-2); border: 1px solid var(--surface-border);
            border-radius: 10px; margin-top: 1rem; }
    .live header { padding: 0.4rem 0.85rem; border-bottom: 1px solid var(--surface-border);
                   color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; }
    pre { margin: 0; padding: 0.6rem 0.85rem; font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem; color: var(--text-secondary); white-space: pre-wrap; }
  `],
})
export class ReactiveFormDemo {
  private fb = inject(FormBuilder);
  protected readonly form = this.fb.group({
    name: this.fb.control('Ada Lovelace', { validators: Validators.required, nonNullable: true }),
    email: this.fb.control('ada@example.com', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    tags: this.fb.array<FormControl<string>>([this.makeTagControl('analyst')]),
  });

  protected get tags() {
    return this.form.controls.tags as FormArray<FormControl<string>>;
  }

  protected readonly live = signal('');

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => this.live.set(JSON.stringify(v, null, 2)));
    this.live.set(JSON.stringify(this.form.value, null, 2));
  }

  private makeTagControl(initial = '') {
    return this.fb.control(initial, { validators: Validators.required, nonNullable: true });
  }

  addTag() {
    this.tags.push(this.makeTagControl(''));
  }
  removeTag(i: number) {
    this.tags.removeAt(i);
  }

  submit() {
    console.log('Saved', this.form.getRawValue());
  }
}
