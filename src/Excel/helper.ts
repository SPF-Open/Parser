export const csvHeaders = [
  'name',
  'question',
  'shuffle',
  'language',
  'min_choices',
  'max_choices',
  'choice_1',
  'choice_2',
  'choice_3',
  'choice_4',
  'choice_1_score',
  'choice_2_score',
  'choice_3_score',
  'choice_4_score',
  'correct_answer',
  'metadata_Specdimension',
  'metadata_Speccompetence',
  'metadata_Specindicator',
];

export interface RowSettings {
  skip?: number;
  alternative?: number;
}

export interface ColumnSettings {
  competency?: string;
  dimension?: string;
  indicator?: string;
  name?: string;

  question?: string;
  correct?: string;
}

export interface PreviousDataInfo {
  competency: Txt;
  dimension: Txt;
  indicator: Txt;
}

export class Txt {
  constructor(
    public t: string = '',
    public v: string = '',
    public r: string = '',
    public h: string = '',
    public w: string = '',
  ) {}

  toString() {
    return this.v;
  }

  toHtml() {
    return this.h;
  }

  get value() {
    return this.v;
  }

  get html() {
    return this.h;
  }

  get text() {
    return this.v;
  }

  static fromObject(obj: any) {
    if (!obj) return new Txt();
    return new Txt(obj.t, obj.v, obj.r, obj.h, obj.w);
  }
}
