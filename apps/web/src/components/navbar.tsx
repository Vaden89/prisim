"use client";
import { Button } from "@repo/ui";
import Image from "next/image";
import Link from "next/link";
import { menu } from "../data/menu";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const value = isOpen ? "hidden" : "";
    document.documentElement.style.overflow = value;
    document.body.style.overflow = value;
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative z-50 w-full bg-background border-b-[0.7px] border-outline-gray/50 px-4 lg:px-24">
        <nav className="w-full p-4 lg:py-6 px-4 lg:px-12 flex items-center justify-between border-x-[0.7px] border-outline-gray/50">
          <div className="flex items-center gap-8">
            <Image
              width={105}
              height={40}
              loading="eager"
              alt="Prisim Logo"
              src="/images/logo.svg"
            />
            <div className="hidden lg:flex items-center gap-10 mt-3">
              {menu.map((item, index) => (
                <NavLink key={index} text={item.label} href={item.href} />
              ))}
            </div>
          </div>
          <Button className="bg-primary/30 hover:bg-primary/40 hover:border text-primary rounded-full hidden lg:flex">
            Get Early Access
          </Button>
          <button
            onClick={() => setIsOpen((p) => !p)}
            className="lg:hidden text-dark-gray"
            aria-label="Toggle menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </div>

      {/* MOBILE NAV MENU */}
      <div
        className={`p-4 fixed inset-0 z-40 bg-background h-full lg:hidden transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="h-full pt-15 pb-8 justify-between flex flex-col border-x-[0.7px] border-outline-gray/50 lg:hidden">
          <div className="flex flex-col">
            {menu.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-4 py-6 border-b-[0.7px] border-outline-gray/50"
              >
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center text-2xl leading-[120%] tracking-[-4%] text-dark-gray"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
          <div className="px-4">
            <Button className="bg-primary/30 hover:bg-primary/40 hover:border text-primary rounded-full w-full py-3">
              Get Early Access
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({
  text,
  active,
  href,
}: {
  text: string;
  active?: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`${active ? "text-primary" : "text-dark-gray"} nav-link`}
    >
      {text}
    </Link>
  );
}
