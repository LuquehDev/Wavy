import Image from "next/image";
import Link from "next/link";
import { Home, Search, Library, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


const navItems = [
    { label: "Início", icon: <Home className="w-5 h-5" />, href: "/" },
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
        <aside className="flex flex-col justify-between min-h-screen w-64 bg-card text-foreground border-r">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                    <span className="text-xl font-semibold tracking-tight">Wavy</span>
                </div>
                <nav className="space-y-1 mb-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <Separator className="my-4" />
                <div className="flex flex-col gap-2">
                    <Popover>
                        <PopoverTrigger>
                            <Button variant="outline" className="w-full justify-start cursor-pointer border-dashed">
                                <Plus className="w-4 h-4 mr-2" />
                                Criar Playlist
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="p-4">
                                <input
                                    type="text"
                                    placeholder="Nome da Playlist"
                                    className="w-full p-2 border rounded-md"
                                />
                                <Button className="mt-2 w-full">Criar</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {playlists.map((playlist, i) => (
                        <Link
                            key={i}
                            href={`/playlist/${encodeURIComponent(playlist)}`}
                            className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 hover:bg-muted transition-colors"
                        >
                            {playlist}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="/logo.jpg" alt="Avatar" />
                        <AvatarFallback>LP</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Luiz Paiva</span>
                </div>
            </div>
        </aside>
    );
}
