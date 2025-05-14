import Image from "next/image";
import Link from "next/link";
import { Home, Search, Library, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


const navItems = [
    { label: "Início", icon: <Home className="w-5 h-5" />, href: "/home" },
    { label: "Buscar", icon: <Search className="w-5 h-5" />, href: "/buscar" },
    { label: "Biblioteca", icon: <Library className="w-5 h-5" />, href: "/biblioteca" },
];

const playlists = [
    "Minhas Favoritas",
    "Trabalho Focus",
    "Chill no Fim de Tarde",
    "Funk do RJ"
];

export default function SideBar() {
    return (
        <aside className="flex flex-col justify-between h-full w-64 min-w-64 bg-black/30 text-foreground border-r shadow-lg">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                    <span className="text-xl font-semibold tracking-tight">Wavy</span>
                </div>
                <nav className="space-y-1 mb-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center rounded-md gap-3 px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <Separator className="my-4" />
                <div className="flex flex-col gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start cursor-pointer border-dashed ">
                                <Plus className="w-4 h-4 mr-2" />
                                Criar Playlist
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side="right" className="bg-sidebar">
                            <div className="flex flex-col p-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-semibold" htmlFor="input">Nova</label>
                                    <input
                                        id="input"
                                        type="text"
                                        placeholder="Funk do RJ"
                                        className="w-full p-2 border rounded-lg"

                                    />
                                </div>
                                <Button className="mt-2 w-full">Criar</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {playlists.map((playlist, i) => (
                        <Link
                            key={i}
                            href={`/playlist/${encodeURIComponent(playlist)}`}
                            className="text-sm text-muted-foreground rounded-sm hover:text-foreground px-2 py-1 hover:bg-muted transition-colors"
                        >
                            {playlist}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}
