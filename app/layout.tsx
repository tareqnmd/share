import Navbar from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import type { Metadata } from 'next';
import { JetBrains_Mono, Poppins } from 'next/font/google';
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

export const metadata: Metadata = {
	title: 'Share',
	description: 'Share code securely',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${poppins.variable} ${jetbrainsMono.variable}`}
		>
			<body>
				<Providers>
					<div className="min-h-screen flex flex-col">
						<Navbar />
						<main className="flex-1 py-6">
							<div className="app-container">{children}</div>
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
