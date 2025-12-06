import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
              {/* <Logo /> */}
              <span className="sr-only">Web Book</span>
              <span>Web Book</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Your ultimate guide to building a Web Book with Gemini CLI.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="/book/docs/intro" className="text-sm text-muted-foreground hover:text-foreground">
                    Book
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Social</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Web Book Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
