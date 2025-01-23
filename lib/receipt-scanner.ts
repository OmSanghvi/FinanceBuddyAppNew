import DocumentIntelligence, {
    AnalyzeOperationOutput,
    getLongRunningPoller,
    isUnexpected,
} from "@azure-rest/ai-document-intelligence";

export async function scanReceipt(file: File) {
    const endpoint = process.env.DOCUMENT_INTELLIGENCE_ENDPOINT;
    const apiKey = process.env.DOCUMENT_INTELLIGENCE_API_KEY;

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
            amount: amountString,};
    } else {
        throw new Error("Expected at least one receipt in the result.");
    }
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}