import { Skeleton } from "@/components/ui/skeleton"
import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-card border-r border-border hidden md:block">
        <div className="p-6">
          <Skeleton className="h-8 w-full mb-4" />
          <ul className="space-y-3">
            <li className="h-8 w-full rounded-md bg-muted" />
            <li className="h-8 w-full rounded-md bg-muted" />
            <li className="h-8 w-full rounded-md bg-muted" />
          </ul>
        </div>
      </aside>

      <main className="flex-1">
        <header className="bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-40" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-20" />
                </div>
            </div>
        </header>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
              <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoadingState;