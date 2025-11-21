export class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: Array<{ timestamp: Date; message: string; stack?: string }> =
    [];

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(error: Error | string, context?: string): void {
    const errorMessage = typeof error === "string" ? error : error.message;
    const errorStack = typeof error === "string" ? undefined : error.stack;

    this.errors.push({
      timestamp: new Date(),
      message: `${context ? `[${context}] ` : ""}${errorMessage}`,
      stack: errorStack,
    });

    if (process.env.NODE_ENV === "development") {
      console.error(`[${context || "Error"}]`, error);
    }
  }

  getErrors(): Array<{ timestamp: Date; message: string; stack?: string }> {
    return [...this.errors];
  }

  clear(): void {
    this.errors = [];
  }
}

export const errorLogger = ErrorLogger.getInstance();
