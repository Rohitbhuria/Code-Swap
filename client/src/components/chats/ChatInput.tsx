import { useAppContext } from "@/context/AppContext";
import { useChatRoom } from "@/context/ChatContext";
import { useSocket } from "@/context/SocketContext";
import { ChatMessage } from "@/types/chat";
import { SocketEvent } from "@/types/socket";
import { formatDate } from "@/utils/formateDate";
import { FormEvent, useRef, useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";

import { v4 as uuidV4 } from "uuid";

function ChatInput() {
    const { currentUser } = useAppContext();
    const { socket } = useSocket();
    const { setMessages } = useChatRoom();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const inputVal = inputRef.current?.value.trim();

        if (inputVal && inputVal.length > 0) {
            const message: ChatMessage = {
                id: uuidV4(),
                message: inputVal,
                username: currentUser.username,
                timestamp: formatDate(new Date().toISOString()),
            };
            socket.emit(SocketEvent.SEND_MESSAGE, { message });
            setMessages((messages) => [...messages, message]);
            setIsTyping(false);

            if (inputRef.current) inputRef.current.value = "";
        }
    };

    return (
        <form onSubmit={handleSendMessage} className="flex items-center bg-gray-900 p-3 rounded-lg shadow-md w-full">
            <input
                type="text"
                className="flex-grow p-3 text-white bg-gray-800 rounded-lg outline-none placeholder-gray-400"
                placeholder="Type a message..."
                ref={inputRef}
                onChange={() => setIsTyping(true)}
            />
            <button
                className="ml-3 p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-all"
                type="submit"
            >

                <LuSendHorizontal size={24} />

            </button>
        </form>
    );
}

export default ChatInput;