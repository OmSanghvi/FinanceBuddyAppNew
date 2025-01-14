import { Loader2, Plus, Send } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import SelectedImages from "./selectedImages";
import { ChatRequestOptions, Message } from "ai";

type Props = {
    handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => void;
    input: string;
    isLoading: boolean;
    stop: () => void;
    addMessage: (newMessage: Message) => void; // Ensure this prop is typed correctly
    isDarkMode: boolean; // Add this prop
};

const InputForm = ({
                       handleInputChange,
                       handleSubmit,
                       input,
                       isLoading,
                       stop,
                       addMessage,
                       isDarkMode,
                   }: Props) => {
    const [images, setImages] = useState<string[]>([]);

    const handleImageSelection = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const imagePromises = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            imagePromises.push(
                new Promise<string>((resolve, reject) => {
                    reader.onload = (e) => {
                        const base64String = e.target?.result?.toString();
                        resolve(base64String as string);
                    };
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                })
            );
        }

        try {
            const base64Strings = await Promise.all(imagePromises);
            setImages((prevImages: string[]) => [
                ...prevImages,
                ...(base64Strings as string[]),
            ]);
        } catch (error) {
            console.error("Error reading image:", error);
        }
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();

                // Construct the new message according to the Message type from 'ai'
                const newMessage: Message = {
                    id: `${Date.now()}`, // Unique ID (consider using a proper UUID if necessary)
                    content: input, // This should correspond to the correct property from your Message type
                    role: "user", // Assuming the role is "user" for the input
                };

                // Call the provided handleSubmit function
                handleSubmit(event as FormEvent<HTMLFormElement>, {
                    data: {
                        images: JSON.stringify(images),
                    },
                });
            }}
            className="w-full flex flex-row gap-2 items-center h-full mt-5"
        >
            <div className="border flex flex-row relative">
                <Plus
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="cursor-pointer p-3 h-10 w-10 stroke-stone-500"
                />
                <SelectedImages images={images} setImages={setImages} />
            </div>
            <input
                className="hidden"
                id="fileInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelection}
            />
            <input
                type="text"
                placeholder={isLoading ? "Generating . . ." : "ask something . . . "}
                value={input}
                disabled={isLoading}
                onChange={handleInputChange}
                className={`border-b border-dashed outline-none w-full py-2 ${isDarkMode ? 'bg-gray-700 text-white placeholder-white' : 'bg-white text-black-500 placeholder-black'} placeholder-black text-right focus:placeholder-transparent disabled:bg-transparent`}
            />
            <button
                type="submit"
                className="rounded-full shadow-md border flex flex-row"
            >
                {isLoading ? (
                    <Loader2
                        onClick={stop}
                        className="p-3 h-10 w-10 stroke-stone-500 animate-spin"
                    />
                ) : (
                    <Send className="p-3 h-10 w-10 stroke-stone-500" />
                )}
            </button>
        </form>
    );
};

export default InputForm;