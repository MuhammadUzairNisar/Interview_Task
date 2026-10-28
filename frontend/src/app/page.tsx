import { LayoutGrid } from "lucide-react";
import { TaskBoard } from "@/components/board/TaskBoard";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-on-primary shadow-card">
              <LayoutGrid className="size-4" aria-hidden />
            </span>
            <span className="text-base font-bold tracking-tight text-foreground">Workboard</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <TaskBoard />
      </main>
    </>
  );
}
