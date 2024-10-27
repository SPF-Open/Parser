import type { SparseSheet } from 'xlsx';
import { ColumnSettings, RowSettings, Txt } from './helper';

export interface ColumnSettingsOQ extends ColumnSettings {
  answer: 'C';
  pointPerElement: 'E';
  totalPoint: 'G';
}

const defaultRowSettings = {
  skip: 6,
  alternative: 5,
} satisfies RowSettings;

const defaultColumnSettings = {
  competency: 'A',
  dimension: 'B',
  indicator: 'B',
  name: 'C',

  question: 'D',
  answer: 'C',
  pointPerElement: 'E',
  totalPoint: 'G',
} satisfies ColumnSettingsOQ;

export class QO {
  constructor(
    public name: string,
    public text: Txt,
    public answer: Txt,
    public competency = '',
    public dimension = '',
    public indicator = '',
  ) {}

  static fromSHeet(
    sheet: SparseSheet,
    columns = defaultColumnSettings,
    rows = defaultRowSettings,
  ) {
    // Set default settings
    columns = { ...defaultColumnSettings, ...columns };
    rows = { ...defaultRowSettings, ...rows };

    const questions: QO[] = [];
    let currentRow = rows.skip;
    let currentQuestion = new QO('', new Txt(), new Txt(), '', '', '');

    const previousDataInfo = {
      competency: undefined,
      dimension: undefined,
      indicator: undefined,
    };

    while (sheet[columns.question + currentRow]) {
      const name = sheet[columns.name + currentRow];
      const question = sheet[columns.question + currentRow];
      currentQuestion = new QO(
        name ? name.w : '',
        question ? question : '',
        new Txt(),
        previousDataInfo.competency || '',
        previousDataInfo.dimension || '',
        previousDataInfo.indicator || '',
      );
      currentRow = currentRow + 3;
      const answer = sheet[columns.answer + currentRow];
      currentRow = currentRow + 2;
      if (answer) {
        currentQuestion.answer = answer;
        questions.push(currentQuestion);
      }
    }
    return questions;
  }
}
