import Navbar from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import { baseMetadata } from '@/lib/seo';
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
					<div className="min-h-screen grid grid-rows-[auto_1fr]">
						<Navbar />
						<div className="py-6 app-container">{children}</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
