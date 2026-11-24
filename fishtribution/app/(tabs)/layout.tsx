import BottomNav from '@/components/BottomNav'

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh w-full">
      <main>
        {children}
      </main>
      
      <div className="h-16 pb-safe w-full pointer-events-none" aria-hidden="true" />
      <BottomNav />
    </div>
  );
}
