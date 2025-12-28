# Share

<div align="center">

![Share Logo](public/assets/meta/android-chrome-192x192.png)

**A secure, real-time code sharing platform for developers**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

[Live Demo](https://share.tareqnmd.com) · [Report Bug](https://github.com/tareqnmd/code-share/issues) · [Request Feature](https://github.com/tareqnmd/code-share/issues)

</div>

---

## ✨ Features

- 🔐 **Secure Authentication** — Sign in with Google OAuth
- 📝 **Monaco Editor** — VS Code-powered code editing with syntax highlighting
- 🔄 **Auto-Save** — Intelligent debounced saving with beacon API fallback
- 🌐 **Public & Private Files** — Control who can see your code
- 👥 **Collaborative Editing** — Allow others to edit your files
- 📋 **One-Click Copy** — Copy code to clipboard instantly
- 🔗 **Easy Sharing** — Share files via URL
- 📊 **Storage Quotas** — User file limits with admin overrides
- 📱 **Responsive Design** — Works on all devices
- 🎨 **Dark Theme** — Beautiful, eye-friendly interface

---

## 🛠️ Tech Stack

| Category       | Technology                                                                  |
| -------------- | --------------------------------------------------------------------------- |
| **Framework**  | [Next.js 16](https://nextjs.org/) (App Router)                              |
| **Frontend**   | [React 19](https://react.dev/)                                              |
| **Language**   | [TypeScript 5](https://www.typescriptlang.org/)                             |
| **Styling**    | [Tailwind CSS 4](https://tailwindcss.com/)                                  |
| **Editor**     | [Monaco Editor](https://microsoft.github.io/monaco-editor/)                 |
| **Database**   | [MongoDB](https://www.mongodb.com/) + [Mongoose 9](https://mongoosejs.com/) |
| **Auth**       | [NextAuth.js 4](https://next-auth.js.org/)                                  |
| **Validation** | [Zod 4](https://zod.dev/)                                                   |
| **Icons**      | [Lucide React](https://lucide.dev/)                                         |
| **Fonts**      | Poppins, JetBrains Mono                                                     |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **MongoDB** Atlas account or local instance
- **Google Cloud** project with OAuth credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tareqnmd/code-share.git
   cd code-share
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Google OAuth (from Google Cloud Console)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # App URL (for SEO)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Variables

| Variable               | Description                   | Required |
| ---------------------- | ----------------------------- | -------- |
| `MONGODB_URI`          | MongoDB connection string     | ✅       |
| `NEXTAUTH_URL`         | Application URL for NextAuth  | ✅       |
| `NEXTAUTH_SECRET`      | Secret key for JWT encryption | ✅       |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID        | ✅       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret    | ✅       |
| `NEXT_PUBLIC_APP_URL`  | Public app URL (for metadata) | ❌       |

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 📁 Project Structure

```
code-share/
├── app/                    # Next.js App Router
│   ├── actions/            # Server Actions
│   ├── api/                # API Routes
│   ├── dashboard/          # User dashboard
│   ├── code/[id]/          # Code editor page
│   └── layout.tsx          # Root layout
│
├── components/             # React Components
│   ├── dashboard/          # Dashboard components
│   ├── editor/             # Editor components
│   ├── shared/             # Shared components
│   ├── ui/                 # Base UI components
│   └── icons/              # Icon components
│
├── enums/                  # TypeScript Enums
├── hooks/                  # Custom React Hooks
├── interfaces/             # TypeScript Interfaces
├── lib/                    # Core utilities
│   └── seo/                # SEO configuration
├── models/                 # Mongoose Models
├── utils/                  # Utility functions
└── public/                 # Static assets
```

> See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

---

## 📝 Usage

### Creating a File

1. Sign in with your Google account
2. Click **"Create a new file"** or navigate to Dashboard
3. Click the **"New File"** button
4. Start writing your code!

### File Settings

| Setting        | Options                                 | Description              |
| -------------- | --------------------------------------- | ------------------------ |
| **Language**   | JavaScript, TypeScript, HTML, CSS, JSON | Syntax highlighting mode |
| **Visibility** | Public, Private                         | Who can view the file    |
| **Edit Mode**  | Owner Only, Collaborative               | Who can edit the file    |

### Sharing Files

- **Public files**: Share the URL directly
- **Private files**: Only you can access them
- **Collaborative**: Anyone with the link can edit

---

## 🔒 Permissions

| Role      | Create Files   | View Public | View Private | Edit Own | Edit Collaborative |
| --------- | -------------- | ----------- | ------------ | -------- | ------------------ |
| **Guest** | ❌             | ✅          | ❌           | ❌       | ❌                 |
| **User**  | ✅ (max 5)     | ✅          | Own only     | ✅       | ✅                 |
| **Admin** | ✅ (unlimited) | ✅          | ✅           | ✅       | ✅                 |

---

## 🧪 Scripts

| Command            | Description               |
| ------------------ | ------------------------- |
| `npm run dev`      | Start development server  |
| `npm run build`    | Build for production      |
| `npm run start`    | Start production server   |
| `npm run lint`     | Run ESLint                |
| `npm run lint:fix` | Fix ESLint errors         |
| `npm run format`   | Format code with Prettier |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **lint-staged** for staged file linting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Tareq**

- Website: [tareqnmd.com](https://tareqnmd.com)
- GitHub: [@tareqnmd](https://github.com/tareqnmd)

---

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor that powers VS Code
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment platform

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ by [Tareq](https://github.com/tareqnmd)

</div>
