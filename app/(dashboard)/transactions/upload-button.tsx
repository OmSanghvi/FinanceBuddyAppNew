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

export const UploadButton = ({ onUpload, onImageUpload }: Props) => {
    const newTransaction = useNewTransaction();
    const { CSVReader } = useCSVReader();
    const fileInputRef = useRef<HTMLInputElement>(null);

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