import React from "react";
import markdownit from "markdown-it";
import DOMPurify from 'dompurify';

/**
 * Props for the Markdown component.
 *
 * @typedef {Object} Props
 * @property {string} text - The markdown text to be rendered.
 */
type Props = {
  text: string;
};

const md = markdownit();

/**
 * Markdown component for rendering sanitized HTML from markdown text.
 *
 * This component takes markdown text as input, converts it to HTML, sanitizes it to prevent XSS attacks,
 * and then renders it as HTML.
 *
 * @param {Props} props - The properties for the Markdown component.
 * @returns {JSX.Element | null} The rendered Markdown component or null if the input is invalid.
 */
const Markdown = ({ text }: Props) => {
  // Check if text is a valid string
  if (typeof text !== 'string') {
    console.error("Invalid input: text should be a string");
    return null; // Or you could return a fallback UI
  }

  const htmlcontent = md.render(text);
  const sanitized = DOMPurify.sanitize(htmlcontent);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }}></div>;
};

export default Markdown;