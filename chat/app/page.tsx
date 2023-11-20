'use client'
import ChatPage from "@/app/components/ChatPage";
import {ChatProvider} from "@/app/context/chatContext";

export default function Home() {

  return (
      <main style={{backgroundColor:"#F5F5F5"}}>
          <ChatProvider>
              <ChatPage/>
          </ChatProvider>
      </main>
  )
}
