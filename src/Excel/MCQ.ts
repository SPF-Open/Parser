import type { SparseSheet } from 'xlsx';
import { CSV } from '@lv00/toolkit';
import {
  ColumnSettings,
  csvHeaders,
  PreviousDataInfo,
  RowSettings,
  Txt,
} from './helper';
import { lang, Lang } from '../langage';

export interface CSVSettingsQCM {
  language?: Lang;
  shuffle?: boolean;
  respectName?: boolean;
}

const defaultRowSettings = {
  skip: 7,
  alternative: 4,
} satisfies RowSettings;

const defaultColumnSettings = {
  competency: 'A',
  dimension: 'B',
  indicator: 'C',
  name: 'D',

  question: 'F',
  correct: 'G',
} satisfies ColumnSettings;

const defaultCSVSettings = {
  language: Lang.FR,
  shuffle: true,
  respectName: false,
};

export class MCQ {
  constructor(
    public name: Txt,
    public text: Txt,
    public alt: Alternative[],
    public competency: Txt = new Txt(),
    public dimension: Txt = new Txt(),
    public indicator: Txt = new Txt(),
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
      new Txt(),
      new Txt(),
      [],
      new Txt(),
      new Txt(),
      new Txt(),
    );

    const previousDataInfo = {
      competency: new Txt(),
      dimension: new Txt(),
      indicator: new Txt(),
    } as PreviousDataInfo;

    while (sheet[columns.question + currentRow]) {
      if ((currentRow - rows.skip) % 5 == 0 || currentRow == rows.skip) {
        if (columns.competency)
          previousDataInfo.competency = Txt.fromObject(
            sheet[columns.competency + currentRow],
          );
        if (columns.dimension)
          previousDataInfo.dimension = Txt.fromObject(
            sheet[columns.dimension + currentRow],
          );
        if (columns.indicator)
          previousDataInfo.indicator = Txt.fromObject(
            sheet[columns.indicator + currentRow],
          );

        currentQuestion = new MCQ(
          Txt.fromObject(sheet[columns.name + currentRow]),
          Txt.fromObject(sheet[columns.question + currentRow]),
          [],
          previousDataInfo.competency,
          previousDataInfo.dimension,
          previousDataInfo.indicator,
        );
        questions.push(currentQuestion);
      } else {
        const alt = new Alternative(
          Txt.fromObject(sheet[columns.question + currentRow]),
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
        ? mcq.name.toString()
        : lang[options.language].MCQ + ' ' + (i < 10 ? '0' + i : i);
      csv.addSequentially(name); // Name from the sheet or generated one
      csv.addSequentially(mcq.text.toString()); // Question prompt
      csv.addSequentially(options.shuffle ? '1' : '0'); // Shuffle
      csv.addSequentially(lang[options.language].locale); // Language
      csv.addSequentially('0'); // Minimum choices
      csv.addSequentially('1'); // Maximum choices
      mcq.alt.forEach((alt) => {
        csv.addSequentially(alt.text.toString());
      }); // Alternatives
      mcq.alt.forEach((alt) => {
        csv.addSequentially(alt.point.toString());
      }); // Points
      csv.addSequentially(
        'choice_' + (mcq.alt.findIndex((alt) => alt.correct) + 1),
      ); // Correct answer
      csv.addSequentially(mcq.competency.toString()); // Competency
      csv.addSequentially(mcq.dimension.toString()); // Dimension
      csv.addSequentially(mcq.indicator.toString()); // Indicator
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

  get isCorrect() {
    return this.correct;
  }

  get getPoint() {
    return this.point;
  }
}
