export enum LogLevel {
	DEBUG = 'DEBUG',
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
}

interface LogContext {
	userId?: string;
	fileId?: string;
	action?: string;
	duration_ms?: number;
	status?: 'success' | 'error' | 'pending';
	error?: string;
	metadata?: Record<string, unknown>;
}

interface LogEntry {
	timestamp: string;
	level: LogLevel;
	service: string;
	message: string;
	context?: LogContext;
}

const SERVICE_NAME = 'code-share';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function formatLogEntry(entry: LogEntry): string {
	if (IS_PRODUCTION) {
		return JSON.stringify(entry);
	}

	const { timestamp, level, message, context } = entry;
	const contextStr = context ? ` ${JSON.stringify(context)}` : '';
	return `[${timestamp}] ${level}: ${message}${contextStr}`;
}

function createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
	return {
		timestamp: new Date().toISOString(),
		level,
		service: SERVICE_NAME,
		message,
		context,
	};
}

export const logger = {
	debug(message: string, context?: LogContext): void {
		if (IS_PRODUCTION) return;
		const entry = createLogEntry(LogLevel.DEBUG, message, context);
		console.debug(formatLogEntry(entry));
	},

	info(message: string, context?: LogContext): void {
		const entry = createLogEntry(LogLevel.INFO, message, context);
		console.info(formatLogEntry(entry));
	},

	warn(message: string, context?: LogContext): void {
		const entry = createLogEntry(LogLevel.WARN, message, context);
		console.warn(formatLogEntry(entry));
	},

	error(message: string, error?: Error | unknown, context?: LogContext): void {
		const errorMessage = error instanceof Error ? error.message : String(error);
		const errorStack = error instanceof Error ? error.stack : undefined;

		const entry = createLogEntry(LogLevel.ERROR, message, {
			...context,
			error: errorMessage,
			metadata: {
				...context?.metadata,
				stack: IS_PRODUCTION ? undefined : errorStack,
			},
		});

		console.error(formatLogEntry(entry));
	},

	action(
		action: string,
		status: 'success' | 'error',
		context?: Omit<LogContext, 'action' | 'status'>
	): void {
		const entry = createLogEntry(LogLevel.INFO, `Action: ${action}`, {
			...context,
			action,
			status,
		});
		console.info(formatLogEntry(entry));
	},

	auth(
		event: 'login' | 'logout' | 'login_failed',
		userId?: string,
		metadata?: Record<string, unknown>
	): void {
		const entry = createLogEntry(LogLevel.INFO, `Auth: ${event}`, {
			userId,
			action: `auth.${event}`,
			status: event === 'login_failed' ? 'error' : 'success',
			metadata,
		});
		console.info(formatLogEntry(entry));
	},

	security(event: string, context?: LogContext): void {
		const entry = createLogEntry(LogLevel.WARN, `Security: ${event}`, {
			...context,
			action: `security.${event}`,
		});
		console.warn(formatLogEntry(entry));
	},

	performance(
		operation: string,
		duration_ms: number,
		context?: Omit<LogContext, 'duration_ms'>
	): void {
		const level = duration_ms > 1000 ? LogLevel.WARN : LogLevel.INFO;
		const entry = createLogEntry(level, `Performance: ${operation}`, {
			...context,
			duration_ms,
		});

		if (level === LogLevel.WARN) {
			console.warn(formatLogEntry(entry));
		} else {
			console.info(formatLogEntry(entry));
		}
	},
};

export async function withTiming<T>(
	operation: string,
	fn: () => Promise<T>,
	context?: Omit<LogContext, 'duration_ms'>
): Promise<T> {
	const start = performance.now();

	try {
		const result = await fn();
		const duration_ms = Math.round(performance.now() - start);
		logger.performance(operation, duration_ms, { ...context, status: 'success' });
		return result;
	} catch (error) {
		const duration_ms = Math.round(performance.now() - start);
		logger.performance(operation, duration_ms, { ...context, status: 'error' });
		throw error;
	}
}

export default logger;
