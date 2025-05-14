import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="flex h-16 items-center p-2 justify-between">
      <div className="flex w-full items-center gap-1 lg:gap-2">
        <div className="flex items-center justify-center p-2 rounded-full bg-muted/60 hover:bg-muted transition-colors duration-200 ease-in-out">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={"/album.jpg"} alt={"Luiz Paiva"} />
                <AvatarFallback className="rounded-lg">LP</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="flex gap-2 p-2 items-center w-full">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={"/album.jpg"} alt={"Luiz Paiva"} />
                  <AvatarFallback className="rounded-lg">LP</AvatarFallback>
                </Avatar> 
                <span className="text-sm font-semibold">Luiz Paiva</span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
