import DocumentIntelligence, {
    AnalyzeOperationOutput,
    getLongRunningPoller,
    isUnexpected,
} from "@azure-rest/ai-document-intelligence";

/**
 * Scans a receipt file and extracts relevant information.
 *
 * This function uses the Azure Document Intelligence service to analyze a receipt file.
 * It extracts the transaction date, merchant name, and total amount from the receipt.
 *
 * @param {File} file - The receipt file to be scanned.
 * @returns {Promise<object>} An object containing the extracted receipt information.
 * @throws {Error} If the environment variables for endpoint and API key are not set, or if the analysis fails.
 */
export async function scanReceipt(file: File) {
    const endpoint = "https://reciept.cognitiveservices.azure.com/";
    const apiKey = "3KI4Blz06L9gKQZNqxgyazrNGHiJl1QsBCveVISPZWmtuM0jI8puJQQJ99BAACrJL3JXJ3w3AAALACOGdzVU";

    if (!endpoint || !apiKey) {
        throw new Error("Environment variables for endpoint and API key must be set.");
    }

    const client = DocumentIntelligence(endpoint, { key: apiKey });

    const fileBuffer = new Uint8Array(await readFileAsArrayBuffer(file));

    const initialResponse = await client
        .path("/documentModels/{modelId}:analyze", "prebuilt-receipt")
        .post({
            contentType: "application/octet-stream",
            body: fileBuffer,
        });

    if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
    }

    const poller = getLongRunningPoller(client, initialResponse);
    const analyzeResult = ((await poller.pollUntilDone()).body as AnalyzeOperationOutput).analyzeResult;

    const documents = analyzeResult?.documents;
    const document = documents && documents[0];

    if (document) {
        const amountString = document.fields?.["Total"]?.content || "0";

        return {
            date: new Date(document.fields?.["TransactionDate"]?.valueDate || ""),
            payee: document.fields?.["MerchantName"]?.valueString || "",
            amount: amountString,
        };
    } else {
        throw new Error("Expected at least one receipt in the result.");
    }
}

/**
 * Reads a file as an ArrayBuffer.
 *
 * This function uses the FileReader API to read the contents of a file as an ArrayBuffer.
 *
 * @param {File} file - The file to be read.
 * @returns {Promise<ArrayBuffer>} A promise that resolves to the file's contents as an ArrayBuffer.
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}