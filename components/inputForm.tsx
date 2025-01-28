import { Loader2, Plus, Send } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import SelectedImages from "./selectedImages";
import { ChatRequestOptions, Message } from "ai";

/**
 * Props for the InputForm component.
 *
 * @typedef {Object} Props
 * @property {function} handleInputChange - Function to handle input change events.
 * @property {function} handleSubmit - Function to handle form submission.
 * @property {string} input - The current input value.
 * @property {boolean} isLoading - Indicates if the form is in a loading state.
 * @property {function} stop - Function to stop the loading state.
 * @property {function} addMessage - Function to add a new message.
 * @property {boolean} isDarkMode - Indicates if the dark mode is enabled.
 */
type Props = {
    handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => void;
    input: string;
    isLoading: boolean;
    stop: () => void;
    addMessage: (newMessage: Message) => void;
    isDarkMode: boolean;
};

/**
 * InputForm component for handling user input and form submission.
 *
 * This component includes an input field, image selection, and a submit button.
 * It handles image selection and form submission, and displays a loading state when necessary.
 *
 * @param {Props} props - The properties for the InputForm component.
 * @returns {JSX.Element} The rendered InputForm component.
 */
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

    /**
     * Handles the selection of images and converts them to base64 strings.
     *
     * @param {ChangeEvent<HTMLInputElement>} event - The change event from the file input.
     */
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