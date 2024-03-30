import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";

export default function Home() {
  return (
    <main className="background-gradient flex min-h-screen max-w-full flex-col items-center justify-center gap-4 p-4">
      <Header />
      <ChatSection />
    </main>
  );
}
