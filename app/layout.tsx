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
	manifest: '/manifest.webmanifest',
	icons: {
		icon: [
			{
				url: '/assets/meta/favicon-16x16.png',
				sizes: '16x16',
				type: 'image/png',
			},
			{
				url: '/assets/meta/favicon-32x32.png',
				sizes: '32x32',
				type: 'image/png',
			},
		],
		apple: '/assets/meta/apple-touch-icon.png',
	},
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
				</Providers>
			</body>
		</html>
	);
}
