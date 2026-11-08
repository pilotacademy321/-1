export type Language = 'ar' | 'en';

export interface NavItem {
  id: string;
  label: Record<Language, string>;
  href: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  features: Array<{
    id: string;
    text: string;
  }>;
}
