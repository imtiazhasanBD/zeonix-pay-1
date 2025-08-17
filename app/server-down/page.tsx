"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ServerDownPage() {
  const [checking, setChecking] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);

  async function check() {
    try {
      setChecking(true);
      const res = await fetch("/api/health", { cache: "no-store" });
      setOk(res.ok);
      if (res.ok) window.location.replace("/"); // back to app
    } catch {
      setOk(false);
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    const t = setInterval(check, 15000); // auto retry every 15s
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Service temporarily unavailable</h1>
        <p className="text-muted-foreground">
          Our server is down or unreachable. We’ll retry periodically.
        </p>
        <div className="space-x-2">
          <Button onClick={check} disabled={checking} className="bg-customViolet hover:bg-customViolet/90 text-white">
            {checking ? "Checking…" : "Try again"}
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
        {ok === false && <p className="text-xs text-muted-foreground">Still down. Please try again later.</p>}
      </div>
    </div>
  );
}
