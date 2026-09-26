import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fruit Games — El Kratos Embassy",
  description: "Live Fruit Games arena for El Kratos Embassy.",
};

export default function FruitGamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#070709", color: "#f4f1ea" }}>
      <style>{`
        .fg-shell { min-height: 100vh; background: #070709; color: #f4f1ea; display: flex; flex-direction: column; }
        .fg-kicker { margin: 0 0 8px; color: #db154c; font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; }
        .fg-shell h1 { margin: 0; font-size: clamp(32px, 4vw, 56px); font-weight: 800; letter-spacing: -0.04em; }
        .fg-muted { color: #9a9aa3; }
        .fg-top { display: flex; justify-content: space-between; align-items: flex-end; padding: 22px 4vw 0; }
        .fg-stage { position: relative; width: 100%; aspect-ratio: 5 / 4; }
      `}</style>
      {children}
    </div>
  );
}
