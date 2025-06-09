import ChatInput from "@/components/chats/ChatInput";
import ChatList from "@/components/chats/ChatList";
import useResponsive from "@/hooks/useResponsive";

const ChatsView = () => {
    const { viewHeight } = useResponsive();

    return (
        <div
            className="flex flex-col w-full gap-2 p-4 overflow-hidden max-h-full min-h-[400px] bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md"
            style={{ height: viewHeight || "100vh" }}
        >
            {/* Header */}
            <h1 className="text-xl font-semibold text-blue-400 font-bold">
                Chat Section
            </h1>

            {/* Chat List */}
            <div className="flex-grow overflow-y-auto">
                <ChatList />
            </div>

            {/* Chat Input */}
            <div className="border-t pt-2">
                <ChatInput />
            </div>
        </div>
    );
};

export default ChatsView;
