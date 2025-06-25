export class DocumentError extends Error {
  statusCode = 400;

  constructor(message: string = "Document is error") {
    super(message);
    this.name = "DocumentError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
