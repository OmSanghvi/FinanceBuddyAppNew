import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";
import { scanReceipt } from "@/lib/receipt-scanner";
import { useRef } from "react";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

type Props = {
    onUpload: (results: any) => void;
    onImageUpload: (data: any) => void;
}

/**
 * Component for rendering the upload button.
 *
 * This component provides buttons for importing CSV files and images, and handles the file upload process.
 *
 * @param {Props} props - The component props.
 * @param {(results: any) => void} props.onUpload - The function to call when a CSV file is uploaded.
 * @param {(data: any) => void} props.onImageUpload - The function to call when an image file is uploaded.
 * @returns {JSX.Element} The rendered upload button component.
 */
export const UploadButton = ({ onUpload, onImageUpload }: Props) => {
    const newTransaction = useNewTransaction();
    const { CSVReader } = useCSVReader();
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Handles the file change event.
     *
     * This function processes the uploaded file, either scanning it if it's an image or logging an error for unsupported file types.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The file change event.
     */
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileType = file.type;
            if (fileType.startsWith("image/")) {
                try {
                    const scannedData = await scanReceipt(file);
                    onImageUpload(scannedData);
                    newTransaction.onOpen(scannedData);
                } catch (error) {
                    console.error("Error scanning receipt:", error);
                }
            } else {
                console.error("Unsupported file type");
            }
        }
    };

    /**
     * Handles the button click event.
     *
     * This function triggers the file input click event.
     */
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <CSVReader onUploadAccepted={onUpload}>
                {({ getRootProps }: any) => (
                    <Button size="sm" className="w-full lg:w-auto" {...getRootProps()}>
                        <Upload className="size-4 mr-2" />
                        Import CSV
                    </Button>
                )}
            </CSVReader>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
            />
            <Button size="sm" className="w-full lg:w-auto" onClick={handleButtonClick}>
                <Upload className="size-4 mr-2" />
                Import Image
            </Button>
        </div>
    );
};