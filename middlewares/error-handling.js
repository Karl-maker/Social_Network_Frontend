import {
  handleDuplicateKeyError,
  handleValidationError,
} from "../util/error-formatter";

function ErrorHandler(err, res) {
  try {
    switch (true) {
      case err.name === "NotFound":
        //404 Errors
        return res.status(404).json({ message: err.message });
      case err.name === "Unauthorized":
        return res.status(401).json({ message: err.message });
      case err.name === "Forbidden":
        return res.status(403).json({ message: err.message });
      case err.name === "Validation":
        return res.status(400).json({ message: err.message });
      case err.name === "ValidationError":
        //400 Errors
        return handleValidationError(err, res);
      case err.name === "ValidationError":
        //400 Errors
        return handleValidationError(err, res);
      case err.code && err.code == 11000:
        return handleDuplicateKeyError(err, res);
      default:
        return res.status(500).json({ message: "Unexpected Error" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
}

export default ErrorHandler;
