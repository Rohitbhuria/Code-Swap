import { FileSystemItem, Id } from "@/types/file"
import { v4 as uuidv4 } from "uuid"

const initialCode = `
// CPP CODE
#include<iostream>
using namespace std;
int main(){
    cout<<"Hello World";
    return 0;
}
`

export const initialFileStructure: FileSystemItem = {
    name: "root",
    id: uuidv4(),
    type: "directory",
    children: [
        {
            id: uuidv4(),
            type: "file",
            name: "practice.cpp",
            content: initialCode,
        },
    ],
}

// 🔍 Function to find a parent directory by ID
export const findParentDirectory = (
    directory: FileSystemItem,
    parentDirId: Id
): FileSystemItem | null => {
    if (directory.id === parentDirId && directory.type === "directory") {
        return directory
    }

    if (directory.type === "directory" && directory.children) {
        for (const child of directory.children) {
            const found = findParentDirectory(child, parentDirId)
            if (found) return found
        }
    }
    return null
}

// 📂 Check if file exists in a directory (Case-insensitive)
export const isFileExist = (parentDir: FileSystemItem, name: string) => {
    if (!parentDir.children) return false
    return parentDir.children.some(
        (file) => file.name.toLowerCase() === name.toLowerCase()
    )
}

// 🔍 Get a file by its ID
export const getFileById = (
    fileStructure: FileSystemItem,
    fileId: Id
): FileSystemItem | null => {
    const findFile = (directory: FileSystemItem): FileSystemItem | null => {
        if (directory.id === fileId) return directory
        if (directory.children) {
            for (const child of directory.children) {
                const found = findFile(child)
                if (found) return found
            }
        }
        return null
    }
    return findFile(fileStructure)
}

// 📂📑 Sort directories and files alphabetically
export const sortFileSystemItem = (item: FileSystemItem): FileSystemItem => {
    if (item.type === "directory" && item.children) {
        let directories = item.children.filter((child) => child.type === "directory")
        let files = item.children.filter((child) => child.type === "file")

        directories.sort((a, b) => a.name.localeCompare(b.name))
        files.sort((a, b) => a.name.localeCompare(b.name))

        directories = directories.map(sortFileSystemItem)

        item.children = [
            ...directories.filter((dir) => dir.name.startsWith(".")), // Hidden directories first
            ...directories.filter((dir) => !dir.name.startsWith(".")),
            ...files.filter((file) => file.name.startsWith(".")), // Hidden files first
            ...files.filter((file) => !file.name.startsWith(".")),
        ]
    }
    return item
}
