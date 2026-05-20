import { Injectable, computed, signal } from '@angular/core';
import { FEATURES } from './feature-registry';
import { SECTIONS } from './sections';
import { TASKS_BY_SLUG } from './feature-tasks-data';
import { Feature, FeatureSection } from './feature.model';

interface GroupedSection {
  section: FeatureSection;
  features: Feature[];
}

const FEATURES_WITH_TASKS: Feature[] = FEATURES.map((f) => ({
  ...f,
  tasks: TASKS_BY_SLUG[f.slug] ?? [],
}));

@Injectable({ providedIn: 'root' })
export class FeatureService {
  private readonly _features = signal(FEATURES_WITH_TASKS);
  private readonly _sections = signal(SECTIONS);

  readonly features = this._features.asReadonly();
  readonly sections = this._sections.asReadonly();

  readonly grouped = computed<GroupedSection[]>(() => {
    const features = this._features();
    return [...this._sections()]
      .sort((a, b) => a.order - b.order)
      .map((section) => ({
        section,
        features: features.filter((f) => f.section === section.key),
      }));
  });

  bySlug(slug: string): Feature | undefined {
    return this._features().find((f) => f.slug === slug);
  }

  sectionByKey(key: string): FeatureSection | undefined {
    return this._sections().find((s) => s.key === key);
  }

  neighbors(slug: string): { prev?: Feature; next?: Feature } {
    const flat = this.grouped().flatMap((g) => g.features);
    const idx = flat.findIndex((f) => f.slug === slug);
    return {
      prev: idx > 0 ? flat[idx - 1] : undefined,
      next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : undefined,
    };
  }
}
