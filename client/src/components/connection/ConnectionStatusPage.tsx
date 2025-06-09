import { useNavigate } from "react-router-dom"

function ConnectionStatusPage() {
    return (
        <div className="flex h-screen min-h-screen flex-col items-center justify-center gap-6 px-4 text-center bg-gray-900 text-white">
            <ConnectionError />
        </div>
    )
}

const ConnectionError = () => {
    const navigate = useNavigate()

    const handleReload = () => window.location.reload()
    const handleNavigateHome = () => navigate("/")

    return (
        <div className="flex flex-col items-center gap-4">
            <span className="text-lg font-semibold text-red-400">
                ⚠ Oops! Something went wrong. Please check your connection and try again.
            </span>
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    className="rounded-md bg-blue-500 px-6 py-2 font-bold text-white transition-all duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
                    onClick={handleReload}
                >
                    🔄 Try Again
                </button>
                <button
                    className="rounded-md bg-green-500 px-6 py-2 font-bold text-white transition-all duration-300 hover:bg-green-600 focus:ring-2 focus:ring-green-400"
                    onClick={handleNavigateHome}
                >
                    🏠 Go to Home
                </button>
            </div>
        </div>
    )
}

export default ConnectionStatusPage
