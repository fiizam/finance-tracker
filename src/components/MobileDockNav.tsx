import * as React from "react";
import Dock, { type DockItem } from "@/components/ui/dock";
import {
  Home,
  List,
  Plus,
  TrendingUp,
  Settings,
} from "lucide-react";

interface MobileDockNavProps {
  currentPath?: string;
}

export default function MobileDockNav({ currentPath: initialPath = "" }: MobileDockNavProps) {
  const [currentPath, setCurrentPath] = React.useState<string>(initialPath);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const items: DockItem[] = [
    {
      label: "Home",
      icon: Home,
      isActive: currentPath === "/app" || currentPath === "/app/",
      onClick: () => {
        window.location.href = "/app";
      },
    },
    {
      label: "Transactions",
      icon: List,
      isActive: currentPath.startsWith("/app/transactions") && !currentPath.includes("/new"),
      onClick: () => {
        window.location.href = "/app/transactions";
      },
    },
    {
      label: "Add",
      icon: Plus,
      isPrimary: true,
      isActive: currentPath.includes("/transactions/new"),
      onClick: () => {
        window.location.href = "/app/transactions/new";
      },
    },
    {
      label: "Insights",
      icon: TrendingUp,
      isActive: currentPath.startsWith("/app/insights"),
      onClick: () => {
        window.location.href = "/app/insights";
      },
    },
    {
      label: "Settings",
      icon: Settings,
      isActive: currentPath.startsWith("/app/settings"),
      onClick: () => {
        window.location.href = "/app/settings";
      },
    },
  ];

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-3 inset-x-0 z-50 flex justify-center pointer-events-none px-3 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="pointer-events-auto">
        <Dock items={items} className="py-0" />
      </div>
    </nav>
  );
}
