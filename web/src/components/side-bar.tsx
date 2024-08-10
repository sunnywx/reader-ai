// import * as Collapsible from '@radix-ui/react-collapsible';
import {
  ChevronDown,
  ChevronUp,
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  NotepadText,
  Bot,
  Settings,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import cs from 'clsx'

type NavItem = {
  name: string;
  icon: ReactNode;
  link: string;
};

const navs: NavItem[] = [
  { name: "Books", icon: <Home className="mr-4" />, link: "/" },
  { name: "Chat with book", icon: <Bot className="mr-4" />, link: "/chat" },
  { name: "Notebooks", icon: <NotepadText className="mr-4" />, link: "/notes" },
  { name: "Read Later", icon: <Clock className="mr-4" />, link: "/read-later" },
  { name: "Liked Books", icon: <ThumbsUp className="mr-4" />, link: "/liked" },
  { name: "Settings", icon: <Settings className="mr-4" />, link: "/settings" },
];

export const Sidebar = () => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  useEffect(() => {
    // Listen for route changes
    router.events.on("routeChangeComplete", handleRouteChange);

    // Cleanup the event listener on component unmount
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const handleRouteChange=(url: string)=> {
    console.log('page url changed: ', url)
    setActiveLink(url)
  }

  const isActive=(activeLink: string, curLink: string)=> {
    // console.log('check active link: ', activeLink, curLink)
    // special cases
    if(activeLink.includes('/book/') && curLink === '/') return true

    if(activeLink.includes('?p')){
      return activeLink.startsWith(curLink)
    }
    return activeLink === curLink
  }

  return (
    <div className="w-64 bg-slate-200 text-black h-screen overflow-y-auto">
      <div className="p-4">
        <nav>
          <ul className="space-y-2">
            {navs.map(({ name, icon, link }) => (
              <li
                key={name}
                onClick={(ev) => {
                  if(link === activeLink) return
                  router.push(link, undefined, { shallow: true });
                  setActiveLink(link)
                }}
              >
                <a
                  // href={link}
                  className={cs("flex items-center p-2 hover:bg-slate-300 rounded cursor-pointer",
                     {'bg-slate-300': isActive(activeLink, link)})}
                >
                  {icon}
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* <Collapsible.Root className="mt-6">
          <Collapsible.Trigger className="flex items-center p-2 hover:bg-slate-300 rounded w-full">
            <ChevronDown className="mr-4" />
            <span>Show More</span>
          </Collapsible.Trigger>
          <Collapsible.Content>
          </Collapsible.Content>
        </Collapsible.Root> */}

        {/* <div className="mt-6">
          <h3 className="font-semibold mb-2">MORE FROM YOUTUBE</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center p-2 hover:bg-gray-800 rounded">
                <Youtube className="mr-4" />
                YouTube Premium
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 hover:bg-gray-800 rounded">
                <Gamepad2 className="mr-4" />
                Gaming
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 hover:bg-gray-800 rounded">
                <Radio className="mr-4" />
                Live
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};
