import Users from "@/components/common/Users"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import useResponsive from "@/hooks/useResponsive"
import { USER_STATUS } from "@/types/user"
import toast from "react-hot-toast"
import { GoSignOut } from "react-icons/go"
import { IoShareOutline } from "react-icons/io5"
import { LuCopy } from "react-icons/lu"
import { useNavigate } from "react-router-dom"

function UsersView() {
    const navigate = useNavigate()
    const { viewHeight } = useResponsive()
    const { setStatus } = useAppContext()
    const { socket } = useSocket()

    const copyURL = async () => {
        const url = window.location.href
        try {
            await navigator.clipboard.writeText(url)
            toast.success("URL copied to clipboard")
        } catch (error) {
            toast.error("Unable to copy URL to clipboard")
            console.error(error)
        }
    }

    const shareURL = async () => {
        const url = window.location.href
        try {
            await navigator.share({ url })
        } catch (error) {
            toast.error("Unable to share URL")
            console.error(error)
        }
    }

    const leaveRoom = () => {
        socket.disconnect()
        setStatus(USER_STATUS.DISCONNECTED)
        navigate("/", { replace: true })
    }

    return (
        <div
            className="flex flex-col p-4 bg-[#0F1624] text-[#4C8BF5] font-bold"
            style={{ height: viewHeight }}
        >
            <h1 className="text-2xl">Users</h1><br /><hr /><br />
            
            {/* List of connected users */}
            <Users />
            
            <div className="flex flex-col items-center gap-4 pt-4">
                <div className="flex w-full gap-4">
                    {/* Share URL button */}
                    <button
                        className="flex flex-grow items-center justify-center rounded-md bg-[#4C8BF5] p-3 text-black font-bold hover:bg-[#3A7BE0]"
                        onClick={shareURL}
                        title="Share Link"
                    >
                        <IoShareOutline size={26} />
                    </button>
                    
                    {/* Copy URL button */}
                    <button
                        className="flex flex-grow items-center justify-center rounded-md bg-[#4C8BF5] p-3 text-black font-bold hover:bg-[#3A7BE0]"
                        onClick={copyURL}
                        title="Copy Link"
                    >
                        <LuCopy size={22} />
                    </button>
                    
                    {/* Leave room button */}
                    <button
                        className="flex flex-grow items-center justify-center rounded-md bg-red-600 p-3 text-white font-bold hover:bg-red-700"
                        onClick={leaveRoom}
                        title="Leave room"
                    >
                        <GoSignOut size={22} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UsersView
