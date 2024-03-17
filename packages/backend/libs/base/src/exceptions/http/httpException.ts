import { TRPC_ERROR_CODE_KEY } from "@trpc/server/dist/rpc";

const TRPC_ERROR_CODES_BY_KEY = {
  /**
   * Invalid JSON was received by the server.
   * An error occurred on the server while parsing the JSON text.
   */
  PARSE_ERROR: -32700,
  /**
   * The JSON sent is not a valid Request object.
   */
  BAD_REQUEST: -32600, // 400

  // Internal JSON-RPC error
  INTERNAL_SERVER_ERROR: -32603,
  NOT_IMPLEMENTED: -32603,

  // Implementation specific errors
  UNAUTHORIZED: -32001, // 401
  FORBIDDEN: -32003, // 403
  NOT_FOUND: -32004, // 404
  METHOD_NOT_SUPPORTED: -32005, // 405
  TIMEOUT: -32008, // 408
  CONFLICT: -32009, // 409
  PRECONDITION_FAILED: -32012, // 412
  PAYLOAD_TOO_LARGE: -32013, // 413
  UNPROCESSABLE_CONTENT: -32022, // 422
  TOO_MANY_REQUESTS: -32029, // 429
  CLIENT_CLOSED_REQUEST: -32099 // 499
} as const;

interface HttpExceptionInput {
  /**
   * Error status code used in trpc
   */
  statusCode: TRPC_ERROR_CODE_KEY;
  /**
   * Error status (e.g. 400)
   */
  status: number;
  /**
   * Error code used to identify the error type
   */
  errorCode: string;
}

export class HttpException extends Error {
  statusCode: TRPC_ERROR_CODE_KEY;
  code: number;
  status: number;
  errorCode: string;

  constructor(input: HttpExceptionInput, message: string, cause?: Error) {
    super(message);
    this.name = "HttpException";
    this.cause = cause;
    this.statusCode = input.statusCode;
    this.code = TRPC_ERROR_CODES_BY_KEY[input.statusCode];
    this.status = input.status;
    this.errorCode = input.errorCode;
  }
}
