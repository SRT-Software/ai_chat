'use client'
import ChatPage from "@/app/components/ChatPage";
import {ChatProvider} from "@/app/context/chatContext";

export default function Home() {

  return (
      <main>
          <ChatProvider>
              <ChatPage/>
          </ChatProvider>
      </main>
  )
}
