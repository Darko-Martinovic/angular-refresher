import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nf">
      <mat-icon fontSet="material-symbols-outlined">explore_off</mat-icon>
      <h1>That feature is not in the registry.</h1>
      <p>The slug you followed doesn't match any entry in <code>feature-registry.ts</code>.</p>
      <a mat-raised-button color="primary" routerLink="/">
        <mat-icon fontSet="material-symbols-outlined">home</mat-icon>
        Back to home
      </a>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        padding: 2rem;
      }
      .nf {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        text-align: center;
        max-width: 480px;

        mat-icon {
          font-size: 3.5rem !important;
          width: 3.5rem !important;
          height: 3.5rem !important;
          color: var(--text-muted);
        }
        h1 {
          margin: 0;
          font-size: 1.45rem;
          color: var(--text-primary);
        }
        p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: var(--accent-strong);
          background: var(--surface-2);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }
      }
    `,
  ],
})
export class NotFound {}
