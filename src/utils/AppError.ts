class AppError extends Error {
  public statusCode: number;
  public statusText: string;

  constructor() {
    super();
    this.statusCode = 500; // Default status code
    this.statusText = "error"; // Default status text
  }

  public create(
    message: string,
    statusCode: number,
    statusText: string
  ): AppError {
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
    return this;
  }
}

export default new AppError();
