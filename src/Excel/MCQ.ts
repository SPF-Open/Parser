import type { SparseSheet } from 'xlsx';
import { CSV } from '@lv00/toolkit';
import { csvHeaders } from './helper';
import { lang, Lang } from '../langage';

export interface RowSettingsQO {
  skip?: number;
  alternative?: number;
}

export interface ColumnSettingsQCM {
  competency?: string;
  dimension?: string;
  indicator?: string;
  name?: string;

  question?: string;
  correct?: string;
}

export interface CSVSettingsQCM {
  language?: Lang;
  shuffle?: boolean;
  respectName?: boolean;
}

const defaultRowSettings = {
  skip: 7,
  alternative: 4,
};

const defaultColumnSettings = {
  competency: 'A',
  dimension: 'B',
  indicator: 'C',
  name: 'D',

  question: 'F',
  correct: 'G',
};

const defaultCSVSettings = {
  language: Lang.FR,
  shuffle: true,
  respectName: false,
};

interface Txt {
  t: string;
  v: string;
  r: string;
  h: string;
  w: string;
}

export class MCQ {
  constructor(
    public name: string,
    public text: Txt,
    public alt: Alternative[],
    public competency = '',
    public dimension = '',
    public indicator = '',
  ) {}

  public addAlt(alt: Alternative) {
    this.alt.push(alt);
  }

  static fromSHeet(
    sheet: SparseSheet,
    columns = defaultColumnSettings,
    rows = defaultRowSettings,
  ) {
    // Set default settings
    columns = { ...defaultColumnSettings, ...columns };
    rows = { ...defaultRowSettings, ...rows };

    const questions: MCQ[] = [];
    let currentRow = rows.skip;
    let currentQuestion = new MCQ(
      '',
      { t: '', v: '', r: '', h: '', w: '' },
      [],
      '',
      '',
      '',
    );

    const previousDataInfo = {
      competency: undefined,
      dimension: undefined,
      indicator: undefined,
    };

    while (sheet[columns.question + currentRow]) {
      if ((currentRow - rows.skip) % 5 == 0 || currentRow == rows.skip) {
        if (columns.competency)
          previousDataInfo.competency = sheet[columns.competency + currentRow]
            ? sheet[columns.competency + currentRow]
            : previousDataInfo.competency;
        if (columns.dimension)
          previousDataInfo.dimension = sheet[columns.dimension + currentRow]
            ? sheet[columns.dimension + currentRow]
            : previousDataInfo.dimension;
        if (columns.indicator)
          previousDataInfo.indicator = sheet[columns.indicator + currentRow]
            ? sheet[columns.indicator + currentRow]
            : previousDataInfo.indicator;

        currentQuestion = new MCQ(
          sheet[columns.name + currentRow],
          sheet[columns.question + currentRow],
          [],
          previousDataInfo.competency,
          previousDataInfo.dimension,
          previousDataInfo.indicator,
        );
        questions.push(currentQuestion);
      } else {
        const alt = new Alternative(
          sheet[columns.question + currentRow],
          sheet[columns.correct + currentRow] &&
            sheet[columns.correct + currentRow].h &&
            sheet[columns.correct + currentRow].h.toLowerCase().trim() === 'x',
        );
        currentQuestion.addAlt(alt);
      }
      currentRow++;
    }
    return questions;
  }

  static toCSV(MCQ: MCQ[], options = defaultCSVSettings) {
    options = { ...defaultCSVSettings, ...options };
    const csv = new CSV({ header: csvHeaders });
    MCQ.forEach((mcq, i) => {
      i++;
      const name = options.respectName
        ? mcq.name
        : lang[options.language].MCQ + ' ' + (i < 10 ? '0' + i : i);
      csv.addSequentially(name); // Name from the sheet or generated one
      csv.addSequentially(mcq.text.v); // Question prompt
      csv.addSequentially(options.shuffle ? '1' : '0'); // Shuffle
      csv.addSequentially(lang[options.language].locale); // Language
      csv.addSequentially('0'); // Minimum choices
      csv.addSequentially('1'); // Maximum choices
      mcq.alt.forEach((alt) => {
        csv.addSequentially(alt.text.v);
      }); // Alternatives
      mcq.alt.forEach((alt) => {
        csv.addSequentially(alt.point.toString());
      }); // Points
      csv.addSequentially(
        'choice_' + (mcq.alt.findIndex((alt) => alt.correct) + 1),
      ); // Correct answer
      csv.addSequentially(mcq.competency); // Competency
      csv.addSequentially(mcq.dimension); // Dimension
      csv.addSequentially(mcq.indicator); // Indicator
    });
    return csv;
  }
}

export class Alternative {
  constructor(
    public text: Txt,
    public correct: boolean,
    public point: number | 'auto' = 'auto',
  ) {
    this.point = point === 'auto' ? (correct ? 3 : -1) : point;
  }

  get toString() {
    return this.text;
  }

  get isCorrect() {
    return this.correct;
  }

  get getPoint() {
    return this.point;
  }
}
