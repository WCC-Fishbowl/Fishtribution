import BottomNav from '@/components/BottomNav'

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex flex-col w-full overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-6">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}
