import { Button } from "@repo/ui";
import Image from "next/image";
import Link from "next/link";
import { menu } from "../data/menu";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <div className="w-full border-b-[0.7px] border-outline-gray px-4 lg:px-24">
      <nav className="w-full p-4 lg:py-6 px-4 lg:px-12 flex items-center justify-between border-x-[0.7px] border-outline-gray">
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
        <button className="lg:hidden">
          <Menu />
        </button>
      </nav>
    </div>
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
