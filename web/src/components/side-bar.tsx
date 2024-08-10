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
  Settings
} from "lucide-react";
import { ReactNode } from "react";

type NavItem = {
  name: string;
  icon: ReactNode;
};

const navs: NavItem[] = [
  { name: "Home", icon: <Home className="mr-4" /> },
  // { name: "Explore", icon: <Compass className="mr-4" /> },
  { name: "Chat with book", icon: <Bot className="mr-4" /> },
  { name: "Notebooks", icon: <NotepadText className="mr-4" /> },
  // { name: "History", icon: <Clock className="mr-4" /> },
  // { name: "Your Books", icon: <PlaySquare className="mr-4" /> },
  { name: "Read Later", icon: <Clock className="mr-4" /> },
  { name: "Liked Books", icon: <ThumbsUp className="mr-4" /> },
  { name: "Settings", icon: <Settings className="mr-4" /> },
];

export const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-200 text-black h-screen overflow-y-auto">
      <div className="p-4">
        <nav>
          <ul className="space-y-2">
            {navs.map(({ name, icon }) => (
              <li key={name}>
                <a
                  href="#"
                  className="flex items-center p-2 hover:bg-slate-300 rounded"
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
