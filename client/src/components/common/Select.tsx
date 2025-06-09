import { ChangeEvent } from "react"
import { PiCaretDownBold } from "react-icons/pi"

interface SelectProps {
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    value: string
    options: string[]
    title?: string  // ✅ Label is now optional
}

function Select({ onChange, value, options, title }: SelectProps) {
    return (
        <div className="relative w-full">
            {title && <label className="mb-2 text-lg font-semibold text-blue-400">{title}</label>}
            
            <div className="relative">
                <select
                    className="w-full rounded-md border border-blue-400 bg-blue-100 px-4 py-2 text-black outline-none 
                               hover:bg-blue-200 focus:ring-2 focus:ring-blue-500"
                    value={value}
                    onChange={onChange}
                    aria-label={title || "Select an option"}
                >
                    {options.sort().map((option) => {
                        const value = option
                        const name = option.charAt(0).toUpperCase() + option.slice(1)

                        return (
                            <option key={name} value={value}>
                                {name}
                            </option>
                        )
                    })}
                </select>
                
                {/* Dropdown icon */}
                <PiCaretDownBold
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400"
                />
            </div>
        </div>
    )
}

export default Select
