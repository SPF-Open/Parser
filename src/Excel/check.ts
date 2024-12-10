/**
 * File: check.ts
 * Description: Handle quality check of Open Question and Multiple choice question.
 * Author: Benoit-Welsch
 * Date: 10/12/2024
 * 
 * Usage: With MCQ and QO object array
 * 
 * Notes:
 * - Check :
 *    - Empty question
 *    - Empty alternatives
 *    - No correct alternative
 *    - Multiple correct alternatives
 *    - Has a questions (?)
 *    - Compare mulitple language
 */

import { langageChoice } from "./in18";
import { MCQ } from "./MCQ";
import { OQ } from "./OQ";
import in18 from "./in18";

enum ErrorLevel {
  INFO = "INFO",
  WARNING = "WARNING",
  DANGER = "DANGER",
}

enum EmojiLevel {
  INFO = "ℹ️",
  WARNING = "⚠️",
  DANGER = "❌",
}

class Error {
  constructor(
    public message: { [key in langageChoice]: string },
    public level: ErrorLevel,
  ) { };

  toString(lang: langageChoice = "EN", emoji = false): string {
      return `${emoji ? EmojiLevel[this.level] : this.level} ${this.message[lang]}`;
  }
}

type Check = (Q: OQ | MCQ) => Error | false;

export const checks = (Q: (OQ | MCQ)[], rules: Check[]): Error[] => {
  const errors: Error[] = [];
  Q.forEach((q) => {
    rules.forEach((rule) => {
      const error = rule(q);
      if (error) errors.push(error);
    })
  });
  return errors;
}


export const hasText: Check = (Q) => {
  if (!Q.text.toString().trim()) {
    return new Error(in18.error.EmptyQuestion, ErrorLevel.DANGER)
  }
  return false;
}

export const hasAlternatives: Check = (Q) => {
  if (!(Q instanceof MCQ)) return false;
  if (Q.alt.length === 0) {
    return new Error(in18.error.EmptyAlternatives, ErrorLevel.DANGER)
  }
  return false;
}

export const hasOneCorrect: Check = (Q) => {
  if (!(Q instanceof MCQ)) return false;
  if (Q.alt.filter((alt) => alt.correct).length !== 1) {
    return new Error(in18.error.IncorectNumberOfAlternatives, ErrorLevel.DANGER)
  }
  return false;
}

export const hasQuestions: Check = (Q) => {
  if (!Q.text.toString().includes("?")) {
    return new Error(in18.error.NoQuestionMark, ErrorLevel.INFO)
  }
  return false;
}