import Navbar from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import { baseMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { JetBrains_Mono, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-pt-sans',
	display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-jetbrains-mono',
	display: 'swap',
});

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${poppins.variable} ${jetbrainsMono.variable}`}
			suppressHydrationWarning
		>
			<body suppressHydrationWarning>
				<Providers>
					<div className="min-h-screen flex flex-col">
						<Navbar />
						<main className="flex-1 py-6">
							<div className="app-container">{children}</div>
						</main>
					</div>
					<Toaster theme="dark" position="bottom-right" richColors={true} />
				</Providers>
			</body>
		</html>
	);
}
