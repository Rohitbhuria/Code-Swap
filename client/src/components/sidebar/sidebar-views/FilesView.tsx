import { useState } from "react";
import FileStructureView from "@/components/files/FileStructureView";
import { useFileSystem } from "@/context/FileContext";
import useResponsive from "@/hooks/useResponsive";
import { FileSystemItem } from "@/types/file";
import cn from "classnames";
import { BiArchiveIn } from "react-icons/bi";
import { TbFileUpload } from "react-icons/tb";
import { v4 as uuidV4 } from "uuid";
import { toast } from "react-hot-toast";

function FilesView() {
    const { downloadFilesAndFolders, updateDirectory } = useFileSystem();
    const { viewHeight, minHeightReached } = useResponsive();
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenDirectory = async () => {
        try {
            setIsLoading(true);

            if ("showDirectoryPicker" in window) {
                const directoryHandle = await window.showDirectoryPicker();
                await processDirectoryHandle(directoryHandle);
                return;
            }

            if ("webkitdirectory" in HTMLInputElement.prototype) {
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.webkitdirectory = true;

                fileInput.onchange = async (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) {
                        const structure = await readFileList(files);
                        updateDirectory("", structure);
                    }
                };

                fileInput.click();
                return;
            }

            toast.error("Your browser does not support directory selection.");
        } catch (error) {
            console.error("Error opening directory:", error);
            toast.error("Failed to open directory");
        } finally {
            setIsLoading(false);
        }
    };

    const processDirectoryHandle = async (directoryHandle: FileSystemDirectoryHandle) => {
        try {
            toast.loading("Getting files and folders...");
            const structure = await readDirectory(directoryHandle);
    
            // Debugging - Console me file structure print karo
            console.log("📁 Updated File Structure:", structure);
    
            updateDirectory("", structure);
            toast.dismiss();
            toast.success("Directory loaded successfully");
        } catch (error) {
            console.error("❌ Error processing directory:", error);
            toast.error("Failed to process directory");
        }
    };
    

    const readDirectory = async (directoryHandle: FileSystemDirectoryHandle): Promise<FileSystemItem[]> => {
        const children: FileSystemItem[] = [];
        const blackList = ["node_modules", ".git", ".vscode", ".next"];

        for await (const entry of directoryHandle.values()) {
            if (entry.kind === "file") {
                const file = await entry.getFile();
                children.push({
                    id: uuidV4(),
                    name: entry.name,
                    type: "file",
                    content: await readFileContent(file),
                });
            } else if (entry.kind === "directory" && !blackList.includes(entry.name)) {
                children.push({
                    id: uuidV4(),
                    name: entry.name,
                    type: "directory",
                    children: await readDirectory(entry),
                    isOpen: false,
                });
            }
        }
        return children;
    };

    const readFileList = async (files: FileList): Promise<FileSystemItem[]> => {
        const children: FileSystemItem[] = [];
        const blackList = ["node_modules", ".git", ".vscode", ".next"];

        for (const file of Array.from(files)) {
            const pathParts = file.webkitRelativePath.split("/");

            if (pathParts.some((part) => blackList.includes(part))) continue;

            const newFile: FileSystemItem = {
                id: uuidV4(),
                name: file.name,
                type: "file",
                content: await readFileContent(file),
            };

            if (pathParts.length > 1) {
                const directoryPath = pathParts.slice(0, -1).join("/");
                let targetDirectory = children.find(
                    (item) => item.name === directoryPath && item.type === "directory"
                ) as FileSystemItem | undefined;

                if (!targetDirectory) {
                    targetDirectory = {
                        id: uuidV4(),
                        name: directoryPath,
                        type: "directory",
                        children: [],
                        isOpen: false,
                    };
                    children.push(targetDirectory);
                }

                targetDirectory.children.push(newFile);
            } else {
                children.push(newFile);
            }
        }
        return children;
    };

    const readFileContent = async (file: File): Promise<string> => {
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

        if (file.size > MAX_FILE_SIZE) {
            return `File too large: ${file.name} (${Math.round(file.size / 1024)} KB)`;
        }
        

        try {
            return await file.text();
        } catch (error) {
            console.error(`Error reading file ${file.name}:`, error);
            return `Error reading file: ${file.name}`;
        }
    };

    return (
        <div
            className="flex select-none flex-col gap-1 px-4 py-2 bg-[#0F1624] text-[#F8F8F8]"
            style={{ height: viewHeight, maxHeight: viewHeight }}
        >
            <FileStructureView />
            <div
                className={cn("flex min-h-fit flex-col justify-end pt-2", {
                    hidden: minHeightReached,
                })}
            >
                <hr className="border-gray-600" />
                <button
                    className="mt-2 flex w-full justify-start rounded-md p-2 transition-all bg-[#4C8BF5] text-black font-bold hover:bg-[#3A7BE0] disabled:bg-gray-700"
                    onClick={handleOpenDirectory}
                    disabled={isLoading}
                >
                    <TbFileUpload className="mr-2" size={24} />
                    {isLoading ? "Loading..." : "Open File/Folder"}
                </button>
                <br />
                <button
                    className="flex w-full justify-start rounded-md p-2 transition-all bg-[#4C8BF5] text-black font-bold hover:bg-[#3A7BE0]"
                    onClick={downloadFilesAndFolders}
                >
                    <BiArchiveIn className="mr-2" size={22} /> Download Code
                </button>
            </div>
        </div>
    );
}

export default FilesView;
