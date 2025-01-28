import React from "react";
import Markdown from "./markdown";
import { Bot, User2 } from "lucide-react";
import { Message } from "ai";

/**
 * Props for the Messages component.
 *
 * @typedef {Object} Props
 * @property {Message[]} messages - An array of message objects to be displayed.
 * @property {boolean} isLoading - Indicates if the messages are currently loading.
 */
type Props = {
  messages: Message[],
  isLoading: boolean;
};

/**
 * Messages component for displaying a list of messages.
 *
 * This component renders a list of messages, each with a corresponding icon indicating
 * whether the message is from the user or the bot. It also handles the loading state
 * for the latest message.
 *
 * @param {Props} props - The properties for the Messages component.
 * @returns {JSX.Element} The rendered Messages component.
 */
const Messages = ({ messages, isLoading }: Props) => {
  return (
      <div
          id="chatbox"
          className="flex flex-col w-full text-left mt-4 gap-4 whitespace-pre-wrap"
      >
        {messages.map((m, index) => {
          return (
              <div
                  key={index} // Add a unique key for each message
                  className={`p-4 shadow-md rounded-md ml-10 relative ${
                      m.role === "user" ? "bg-stone-300" : ""
                  }`}
              >
                <Markdown text={m.content} />
                {m.role === "user" ? (
                    <User2 className="absolute -left-10 top-2 border rounded-full p-1 shadow-lg" />
                ) : (
                    <Bot
                        className={`absolute top-2 -left-10 border rounded-full p-1 shadow-lg stroke-[#0842A0] ${
                            isLoading && index === messages.length - 1
                                ? "animate-bounce"
                                : ""
                        }`}
                    />
                )}
              </div>
          );
        })}
      </div>
  );
};

export default Messages;