import type { SparseSheet } from "xlsx";

export interface RowSettingsQO {
  skip?: number;
  alternative?: number,
}

export interface ColumnSettingsQCM {
  competency?: string;
  dimension?: string;
  indicator?: string;
  name?: string;

  question?: string;
  correct?: string;
}

const defaultRowSettings = {
  skip: 7,
  alternative: 4,
}

const defaultColumnSettings = {
  competency: 'A',
  dimension: 'B',
  indicator: 'C',
  name: 'D',

  question: 'F',
  correct: 'G',
}

export class QCM {
  constructor(
    public name: string,
    public text: string,
    public alt: Alternative[],
    public competency = "",
    public dimension = "",
    public indicator = "") { }


  public addAlt(alt: Alternative) {
    this.alt.push(alt);
  }

  static fromSHeet(sheet: SparseSheet, columns = defaultColumnSettings, rows = defaultRowSettings) {
    // Set default settings
    columns = { ...defaultColumnSettings, ...columns, }
    rows = { ...defaultRowSettings, ...rows, }

    const questions: QCM[] = [];
    let currentRow = rows.skip;
    let currentQuestion = new QCM('', '', [], '', '', '')

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

        currentQuestion = new QCM(
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
          (sheet[columns.correct + currentRow] &&
            sheet[columns.correct + currentRow].h &&
            (sheet[columns.correct + currentRow].h.toLowerCase().trim() === 'x'))
        )
        currentQuestion.addAlt(alt);
      }
      currentRow++;
    }
    return questions;
  }
}

export class Alternative {
  constructor(public text: string, public correct: boolean, public point: number | "auto" = "auto") {
    this.point = point === "auto" ? (correct ? 3 : 0) : point;
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