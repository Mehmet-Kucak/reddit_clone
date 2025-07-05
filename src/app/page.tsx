import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-svw h-[calc(100vh-60px)]">
        <Sidebar />
      </main>
    </>
  );
}
