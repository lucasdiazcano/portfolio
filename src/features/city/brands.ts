export type CompanyId = 'bbva' | 'education' | 'globant' | 'hipotecario' | 'johnson-and-johnson';

export interface CompanyBrand {
  accent: string;
  ink: string;
  name: string;
  surface: string;
}

/** Room palettes inspired by company colors; the education room uses a separate editorial palette. */
export const COMPANY_BRANDS: Record<CompanyId, CompanyBrand> = {
  bbva: {
    accent: '#345cff',
    ink: '#ffffff',
    name: 'BBVA',
    surface: '#08178c',
  },
  education: {
    accent: '#ecb984',
    ink: '#fff4e5',
    name: 'Formacion / Education',
    surface: '#513c60',
  },
  globant: {
    accent: '#c1d72f',
    ink: '#ffffff',
    name: 'Globant',
    surface: '#202a35',
  },
  hipotecario: {
    accent: '#f87520',
    ink: '#515151',
    name: 'Banco Hipotecario',
    surface: '#f6f3ec',
  },
  'johnson-and-johnson': {
    accent: '#ef2b14',
    ink: '#d9230f',
    name: 'Johnson & Johnson',
    surface: '#fffaf3',
  },
};
