import { AppLogo } from "@/components/app-logo";
import { AppSidebarNav } from "@/components/app-sidebar-nav";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="group-data-[collapsed=icon]:justify-center">
            <div className="flex items-center gap-3 p-2 group-data-[collapsed=icon]:p-0">
                <AppLogo className="size-8 text-primary" />
                <span className="text-xl font-bold font-headline group-data-[collapsed=icon]:hidden">Data Skill Builder</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <AppSidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="p-4 border-b flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 md:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
                <AppLogo className="w-6 h-6 text-primary" />
                <h1 className="text-lg font-semibold font-headline">Data Skill Builder</h1>
            </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
