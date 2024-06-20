import type { SparseSheet } from 'xlsx';

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

const defaultRowSettings = {
  skip: 6,
  alternative: 5,
};

const defaultColumnSettings = {
  competency: 'A',
  dimension: 'B',
  indicator: 'B',
  name: 'C',

  question: 'D',
  answer: 'C',
  pointPerElement: 'E',
  totalPoint: 'G',
};

export class QO {
  constructor(
    public name: string,
    public text: string,
    public answer: string,
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
    let currentQuestion = new QO('', '', '', '', '', '');

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
        question ? question.w : '',
        previousDataInfo.competency || '',
        previousDataInfo.dimension || '',
        previousDataInfo.indicator || '',
      );
      currentRow = currentRow + 3;
      const answer = sheet[columns.answer + currentRow];
      currentRow = currentRow + 2;
      if (answer) {
        currentQuestion.answer = answer.w;
        questions.push(currentQuestion);
      }
    }
    return questions;
  }
}
