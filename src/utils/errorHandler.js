class CustomError extends Error {
  constructor(status, message = "An error occurred") {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export { CustomError };
