type ApiLogBase = {
  request_id: string;
  route: string;
  method: string;
};

type ApiLogSuccess = ApiLogBase & {
  status: number;
  duration_ms: number;
  details?: Record<string, unknown>;
};

type ApiLogError = ApiLogBase & {
  status: number;
  duration_ms: number;
  error_code: string;
  error_message: string;
};

export function logApiStart(base: ApiLogBase): void {
  safeLog("info", "api_request_start", base);
}

export function logApiSuccess(payload: ApiLogSuccess): void {
  safeLog("info", "api_request_success", payload);
}

export function logApiError(payload: ApiLogError): void {
  safeLog("error", "api_request_error", payload);
}

function safeLog(level: "info" | "error", event: string, payload: Record<string, unknown>): void {
  const logEntry = {
    level,
    event,
    ts: new Date().toISOString(),
    ...payload
  };

  try {
    const output = JSON.stringify(logEntry);
    if (level === "error") {
      console.error(output);
      return;
    }
    console.log(output);
  } catch (serializationError) {
    console.error("log_serialization_failed", serializationError);
  }
}
