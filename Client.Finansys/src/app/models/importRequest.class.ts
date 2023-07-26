import { ImportBank } from "./importBank.interface";

export class ImportRequest {
  importModel:ImportBank[];
  fileName: string;

  constructor(importModel: ImportBank[], fileName:string) {
    this.importModel = importModel;
    this.fileName = fileName;
  }
}
