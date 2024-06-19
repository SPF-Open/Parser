import { it } from "bun:test";
import xlsx, { type SparseSheet } from "xlsx";
import { QCM, QO } from "../index";
import fs from "fs";

it('Should read a QCM file', () => {
  const buffer = fs.readFileSync("./ex/A2-1022-097_QCM.xlsx");
  const workSheet = xlsx.read(buffer)
  const QCMs = workSheet.SheetNames.map(name => {
    return { name, qcm: QCM.fromSHeet(workSheet.Sheets[name] as SparseSheet) };
  })
  fs.writeFileSync("./ex/A2-1022-097.json", JSON.stringify(QCMs, null, 2));
});

it('Should read a QO file', () => {
  const buffer = fs.readFileSync("./ex/A2-1022-129_QO.xlsx");
  const workSheet = xlsx.read(buffer)
  const QOs = workSheet.SheetNames.map(name => {
    return { name, qo: QO.fromSHeet(workSheet.Sheets[name] as SparseSheet) };
  })
  console.log(QOs[1].qo.length);
  fs.writeFileSync("./ex/A2-1022-129.json", JSON.stringify(QOs, null, 2));
});