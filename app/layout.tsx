import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "./lib/auth-context";
import { ThemeProvider } from "./lib/theme-context";
import { NotificationProvider } from "./lib/notification-context";
import ThemeModal from "./components/ThemeModal";
import NotificationCenter from "./components/NotificationCenter";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CompanyDash — Work Management",
  description: "Role-based company dashboard for managing users, tasks, and workflows.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('cdash_theme_mode');
                  if (!mode) {
                    mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', mode);

                  var color = localStorage.getItem('cdash_theme_color');
                  if (color) document.documentElement.setAttribute('data-color', color);

                  var shades = localStorage.getItem('cdash_shades');
                  if (shades) {
                    var parsed = JSON.parse(shades);
                    for (var k in parsed) {
                      document.documentElement.style.setProperty(k, parsed[k]);
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              {children}
              <ThemeModal />
              <NotificationCenter />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

