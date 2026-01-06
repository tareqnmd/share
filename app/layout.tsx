import Analytics from '@/components/analytics/components/Analytics';
import Navbar from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import StructuredData from '@/components/StructuredData';
import { baseMetadata, generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { JetBrains_Mono, Poppins } from 'next/font/google';

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
	const organizationSchema = generateOrganizationSchema();
	const websiteSchema = generateWebsiteSchema();

	return (
		<html
			lang="en"
			className={`${poppins.variable} ${jetbrainsMono.variable}`}
			suppressHydrationWarning
		>
			<head>
				<StructuredData data={[organizationSchema, websiteSchema]} />
				<Analytics />
			</head>
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
