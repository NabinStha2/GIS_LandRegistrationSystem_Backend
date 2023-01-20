class SetErrorResponse extends Error {
  constructor(value = "Not Found", status = 404) {
    super(value);
    this._meta_ = {
      error: value,
      status: status,
    };
  }
}

module.exports = { SetErrorResponse };
