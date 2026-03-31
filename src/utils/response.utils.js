export function response(code, message, data = {}) {
  return {
    statusCode: code,
    message,
    data,
  };
}
