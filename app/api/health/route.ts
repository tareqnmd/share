import { HttpStatus } from '@/enums/http-status.enum';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

interface HealthCheck {
	status: 'ok' | 'error';
	latency_ms?: number;
	error?: string;
}

interface HealthResponse {
	status: 'healthy' | 'unhealthy' | 'degraded';
	timestamp: string;
	version: string;
	uptime: number;
	checks: {
		database: HealthCheck;
		memory: HealthCheck;
	};
}

async function checkDatabase(): Promise<HealthCheck> {
	const start = performance.now();

	try {
		await connectDB();

		if (!mongoose.connection.db) {
			return { status: 'error', error: 'Database not connected' };
		}

		await mongoose.connection.db.admin().ping();
		const latency_ms = Math.round(performance.now() - start);

		return { status: 'ok', latency_ms };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return { status: 'error', error: errorMessage };
	}
}

function checkMemory(): HealthCheck {
	try {
		const memUsage = process.memoryUsage();
		const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
		const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
		const usagePercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);

		if (usagePercent > 90) {
			return {
				status: 'error',
				error: `High memory usage: ${usagePercent}% (${heapUsedMB}MB / ${heapTotalMB}MB)`,
			};
		}

		return { status: 'ok' };
	} catch {
		return { status: 'error', error: 'Failed to check memory' };
	}
}

export async function GET() {
	const checks = {
		database: await checkDatabase(),
		memory: checkMemory(),
	};

	const allHealthy = Object.values(checks).every((check) => check.status === 'ok');
	const anyError = Object.values(checks).some((check) => check.status === 'error');

	let status: HealthResponse['status'];
	if (allHealthy) {
		status = 'healthy';
	} else if (anyError) {
		status = 'unhealthy';
	} else {
		status = 'degraded';
	}

	const response: HealthResponse = {
		status,
		timestamp: new Date().toISOString(),
		version: process.env.npm_package_version || '0.1.0',
		uptime: Math.round(process.uptime()),
		checks,
	};

	return NextResponse.json(response, {
		status: status === 'healthy' ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR,
		headers: {
			'Cache-Control': 'no-cache, no-store, must-revalidate',
		},
	});
}
