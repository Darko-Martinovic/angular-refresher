import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostListener,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  color = input('rgba(96, 165, 250, 0.18)');
  enabled = input(true);
  private el = inject(ElementRef<HTMLElement>);

  @HostListener('mouseenter') onEnter() {
    if (this.enabled()) this.el.nativeElement.style.background = this.color();
  }
  @HostListener('mouseleave') onLeave() {
    this.el.nativeElement.style.background = '';
  }
}

@Component({
  selector: 'app-directives-demo',
  imports: [
    HighlightDirective,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="hint">
      Hover the cards. The <code>appHighlight</code> attribute directive applies a background color
      driven by a <code>signal input</code>.
    </p>

    <div class="config">
      <mat-form-field appearance="outline">
        <mat-label>Highlight color</mat-label>
        <input matInput [(ngModel)]="color" />
      </mat-form-field>
      <mat-slide-toggle [(ngModel)]="enabled">Directive enabled</mat-slide-toggle>
    </div>

    <div class="cards">
      @for (item of items; track item) {
        <div class="card" appHighlight [color]="color" [enabled]="enabled">
          <mat-icon fontSet="material-symbols-outlined">touch_app</mat-icon>
          <span>{{ item }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 1rem; }
    .hint { margin: 0; color: var(--text-secondary); line-height: 1.5; }
    .hint code { color: var(--accent-strong); font-family: 'JetBrains Mono', monospace; }
    .config { display: flex; gap: 1.25rem; align-items: center; flex-wrap: wrap; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.65rem; }
    .card { display: flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1rem;
            border: 1px solid var(--surface-border); border-radius: 10px;
            transition: background 0.2s ease; cursor: default;
            font-weight: 500; color: var(--text-primary); }
  `],
})
export class DirectivesDemo {
  protected color = 'rgba(96, 165, 250, 0.18)';
  protected enabled = true;
  protected readonly items = ['Hover me', 'Or me', 'Try me', 'And me'];
}
