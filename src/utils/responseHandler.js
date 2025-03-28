class SuccessResponse {
  constructor(status, payload, message = "Operation Successful") {
    this.status = status;
    this.payload = payload;
    this.message = message;
  }
}

export { SuccessResponse };
