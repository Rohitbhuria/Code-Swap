import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS } from "@/types/user"
import { ChangeEvent, FormEvent, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import logo from "@/assets/logo.svg"

const FormComponent = () => {
    const location = useLocation()
    const { currentUser, setCurrentUser, status, setStatus } = useAppContext()
    const { socket } = useSocket()

    const usernameRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const createNewRoomId = () => {
        setCurrentUser({ ...currentUser, roomId: uuidv4() })
        toast.success("Created a new Room Id")
        usernameRef.current?.focus()
    }

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCurrentUser({ ...currentUser, [name]: value })
    }

    const validateForm = () => {
        if (currentUser.username.trim().length === 0) {
            toast.error("Enter your username")
            return false
        } else if (currentUser.roomId.trim().length === 0) {
            toast.error("Enter a room id")
            return false
        } else if (currentUser.roomId.trim().length < 5) {
            toast.error("ROOM Id must be at least 5 characters long")
            return false
        } else if (currentUser.username.trim().length < 3) {
            toast.error("Username must be at least 3 characters long")
            return false
        }
        return true
    }

    const joinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === USER_STATUS.ATTEMPTING_JOIN) return
        if (!validateForm()) return
        toast.loading("Joining room...")
        setStatus(USER_STATUS.ATTEMPTING_JOIN)
        socket.emit(SocketEvent.JOIN_REQUEST, currentUser)
    }

    useEffect(() => {
        if (currentUser.roomId.length > 0) return
        if (location.state?.roomId) {
            setCurrentUser({ ...currentUser, roomId: location.state.roomId })
            if (currentUser.username.length === 0) {
                toast.success("Enter your username")
            }
        }
    }, [currentUser, location.state?.roomId, setCurrentUser])

    useEffect(() => {
        if (status === USER_STATUS.DISCONNECTED && !socket.connected) {
            socket.connect()
            return
        }

        const isRedirect = sessionStorage.getItem("redirect") || false

        if (status === USER_STATUS.JOINED && !isRedirect) {
            sessionStorage.setItem("redirect", "true")
            navigate(`/editor/${currentUser.roomId}`, {
                state: { username: currentUser.username },
            })
        } else if (status === USER_STATUS.JOINED && isRedirect) {
            sessionStorage.removeItem("redirect")
            setStatus(USER_STATUS.DISCONNECTED)
            socket.disconnect()
            socket.connect()
        }
    }, [currentUser, location.state?.redirect, navigate, setStatus, socket, status])

    return (
        <div className="flex w-full max-w-[500px] flex-col items-center justify-center gap-6 p-6 sm:w-[500px] sm:p-10 bg-[#0F1624] rounded-lg shadow-lg">
            <img src={logo} alt="Code Swap Logo" className="w-2/3 max-w-[300px]" />
            <form onSubmit={joinRoom} className="flex w-full flex-col gap-4">
                {/* Room ID Input */}
                <input
                    type="text"
                    name="roomId"
                    placeholder="Room ID"
                    className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={handleInputChanges}
                    value={currentUser.roomId}
                />
                {/* Username Input */}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={handleInputChanges}
                    value={currentUser.username}
                    ref={usernameRef}
                />
                {/* Join Button */}
                <button
                    type="submit"
                    className="mt-2 w-full rounded-md bg-[#0077B6] px-6 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-[#005F91] focus:ring-4 focus:ring-blue-300"
                >
                    Join
                </button>
            </form>
            {/* Generate Room ID */}
            <button
                className="mt-2 text-blue-400 hover:text-blue-300 underline transition duration-200"
                onClick={createNewRoomId}
            >
                Generate Unique Room ID
            </button>
        </div>
    )
}

export default FormComponent
