import Select from "@/components/common/Select"
import { useSettings } from "@/context/SettingContext"
import useResponsive from "@/hooks/useResponsive"
import { editorFonts } from "@/resources/Fonts"
import { editorThemes } from "@/resources/Themes"
import { langNames } from "@uiw/codemirror-extensions-langs"
import { ChangeEvent, useEffect } from "react"

function SettingsView() {
    const {
        theme,
        setTheme,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        resetSettings,
    } = useSettings()
    const { viewHeight } = useResponsive()

    const handleFontFamilyChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setFontFamily(e.target.value)
    const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setTheme(e.target.value)
    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setLanguage(e.target.value)
    const handleFontSizeChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setFontSize(parseInt(e.target.value))

    useEffect(() => {
        const editor = document.querySelector(
            ".cm-editor > .cm-scroller",
        ) as HTMLElement
        if (editor !== null) {
            editor.style.fontFamily = `${fontFamily}, monospace`
        }
    }, [fontFamily])

    return (
        <div
            className="flex flex-col items-center gap-2 p-4 bg-[#0F1624] text-[#4C8BF5] font-bold"
            style={{ height: viewHeight }}
        >
            <h1 className="text-2xl">Settings</h1>

            {/* Choose Font Family option */}
            <div className="flex w-full items-end gap-2">
                <Select
                    onChange={handleFontFamilyChange}
                    value={fontFamily}
                    options={editorFonts}
                    title="Font Family"
                />
                
                {/* Choose font size option */}
                <select
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="rounded-md border-none bg-[#1E2A3A] px-4 py-2 text-[#4C8BF5] font-bold outline-none"
                    title="Font Size"
                >
                    {[...Array(13).keys()].map((size) => {
                        return (
                            <option key={size} value={size + 12}>
                                {size + 12}
                            </option>
                        )
                    })}
                </select>
            </div>

            {/* Choose theme option */}
            <Select
                onChange={handleThemeChange}
                value={theme}
                options={Object.keys(editorThemes)}
                title="Theme"
            />
            
            {/* Choose language option */}
            <Select
                onChange={handleLanguageChange}
                value={language}
                options={langNames}
                title="Language"
            />

            {/* Reset Button */}
            <button
                className="mt-auto w-full rounded-md border-none bg-[#4C8BF5] px-4 py-2 text-black font-bold hover:bg-[#3A7BE0] outline-none"
                onClick={resetSettings}
            >
                Reset to Default
            </button>
        </div>
    )
}

export default SettingsView
