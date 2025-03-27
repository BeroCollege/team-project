import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"]
});

export const metadata = {
  title: "My Project",
  description: "My really cool project",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={montserrat.className}>
          {children}
        </body>
      </html>
  );
}
