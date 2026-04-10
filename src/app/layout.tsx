import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "NS Reset",
  description: "Nervous System Reset",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NS Reset",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#211E19",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NS Reset" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
          html, body { min-height: 100vh; min-height: 100dvh; }
          
          /* iPad responsive wrapper */
          .app-shell {
            max-width: 100%;
            margin: 0 auto;
            min-height: 100vh;
            min-height: 100dvh;
          }
          
          /* iPad and larger tablets */
          @media (min-width: 768px) {
            .app-shell {
              max-width: 540px;
              border-left: 1px solid rgba(201,169,110,0.08);
              border-right: 1px solid rgba(201,169,110,0.08);
            }
            body {
              font-size: 17px;
            }
          }
          
          /* iPad Pro / landscape */
          @media (min-width: 1024px) {
            .app-shell {
              max-width: 600px;
            }
          }
          
          /* Prevent rubber banding */
          body { overscroll-behavior: none; }
          
          /* Scrollbar */
          ::-webkit-scrollbar { width: 2px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.15); border-radius: 1px; }
          
          button { cursor: pointer; transition: transform 0.15s ease; font-family: inherit; }
          button:active { transform: scale(0.97); }
          textarea { font-family: inherit; }
          textarea:focus { outline: none; }
        `}</style>
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        background: "#211E19",
        color: "#E8DFD1",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        WebkitFontSmoothing: "antialiased",
        minHeight: "100vh",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
