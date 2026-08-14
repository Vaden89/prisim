"use client";
import { useGSAP } from "@gsap/react";
import { LogOut } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Id } from "@repo/convex/dataModel";
import { authClient } from "@/lib/auth-client";
import gsap from "gsap";

export function ProfileCard({
  user,
}: {
  user: {
    _id: Id<"users">;
    _creationTime: number;
    authId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut();
    setIsOpen(false);
    router.push("/");
  };

  const handleToggle = () => {
    if (!isOpen) {
      setIsRendered(true);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useGSAP(() => {
    if (isOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -6, scale: 0.96, transformOrigin: "top right" },
        { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "power1.out" },
      );
    } else if (!isOpen && dropdownRef.current) {
      gsap.to(dropdownRef.current, {
        opacity: 0,
        y: -6,
        scale: 0.96,
        duration: 0.16,
        ease: "power1.in",
        onComplete: () => setIsRendered(false),
      });
    }
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={handleToggle}
        className="bg-outline-gray-200 w-10 h-10 text-sm rounded-full outline-none ring-tertiary transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {user?.firstName.charAt(0).toUpperCase() +
          user?.lastName.charAt(0).toUpperCase()}
      </button>
      {isRendered && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full z-50 mt-2  flex w-56 flex-col rounded-xl border border-outline-gray/50 bg-tertiary p-3 shadow-lg"
          role="menu"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggle}
              className="bg-outline-gray-200 w-10 h-10 text-sm rounded-full outline-none ring-tertiary transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2"
              aria-label="Open profile menu"
              aria-expanded={isOpen}
              aria-haspopup="menu"
            >
              {user?.firstName.charAt(0).toUpperCase() +
                user?.lastName.charAt(0).toUpperCase()}
            </button>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full mt-2 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive"
            role="menuitem"
          >
            <LogOut size={16} />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
