import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

export type ExportFormat = "pdf" | "txt" | "docx";

interface ExportOptions {
  inputText: string;
  resultText: string;
  mode: "translate" | "summarize";
  targetLanguage?: string;
}

/**
 * Check if text contains Arabic characters
 */
const containsArabic = (text: string): boolean => {
  const arabicPattern =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
};

/**
 * Load Amiri Arabic font for PDF generation
 * Using Google Fonts CDN to fetch the font
 */
const loadArabicFont = async (): Promise<string | null> => {
  try {
    // Fetch Amiri Regular font from Google Fonts
    const fontUrl =
      "https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.ttf";
    const response = await fetch(fontUrl);
    if (!response.ok) {
      console.warn("Failed to load Arabic font");
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return base64;
  } catch (error) {
    console.warn("Error loading Arabic font:", error);
    return null;
  }
};

/**
 * Export result to TXT file
 */
export const exportToTxt = (options: ExportOptions): void => {
  const { inputText, resultText, mode, targetLanguage } = options;

  let content = `3ssila AI - ${
    mode === "translate" ? "Translation" : "Summary"
  } Export\n`;
  content += `${"=".repeat(50)}\n\n`;
  content += `Date: ${new Date().toLocaleString()}\n`;
  if (mode === "translate" && targetLanguage) {
    content += `Target Language: ${targetLanguage}\n`;
  }
  content += `\n${"=".repeat(50)}\n\n`;
  content += `ORIGINAL TEXT:\n${"-".repeat(30)}\n${inputText}\n\n`;
  content += `${
    mode === "translate" ? "TRANSLATED" : "SUMMARIZED"
  } TEXT:\n${"-".repeat(30)}\n${resultText}\n`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `3ssila-${mode}-${Date.now()}.txt`);
};

/**
 * Export result to PDF file
 */
export const exportToPdf = async (options: ExportOptions): Promise<void> => {
  const { inputText, resultText, mode, targetLanguage } = options;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let yPosition = 20;

  // Check if text contains Arabic
  const hasArabic = containsArabic(inputText) || containsArabic(resultText);
  let fontName = "helvetica";

  // Load and register Arabic font if needed
  if (hasArabic) {
    const arabicFontBase64 = await loadArabicFont();
    if (arabicFontBase64) {
      doc.addFileToVFS("Amiri-Regular.ttf", arabicFontBase64);
      doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
      fontName = "Amiri";
    }
  }

  // Title
  doc.setFontSize(18);
  doc.setFont(fontName, "bold");
  doc.text(
    `3ssila AI - ${mode === "translate" ? "Translation" : "Summary"}`,
    margin,
    yPosition
  );
  yPosition += 10;

  // Date and language
  doc.setFontSize(10);
  doc.setFont(fontName, "normal");
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleString()}`, margin, yPosition);
  yPosition += 5;
  if (mode === "translate" && targetLanguage) {
    doc.text(`Target Language: ${targetLanguage}`, margin, yPosition);
    yPosition += 5;
  }
  yPosition += 10;

  // Original text section
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont(fontName, "bold");
  doc.text("Original Text:", margin, yPosition);
  yPosition += 7;

  doc.setFont(fontName, "normal");
  doc.setFontSize(11);
  const inputLines = doc.splitTextToSize(inputText, maxWidth);

  // Determine text alignment based on content
  const inputIsArabic = containsArabic(inputText);

  for (const line of inputLines) {
    if (yPosition > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPosition = 20;
    }
    if (inputIsArabic) {
      // Right-align Arabic text
      doc.text(line, pageWidth - margin, yPosition, { align: "right" });
    } else {
      doc.text(line, margin, yPosition);
    }
    yPosition += 6;
  }

  yPosition += 10;

  // Result section
  doc.setFontSize(12);
  doc.setFont(fontName, "bold");
  if (yPosition > doc.internal.pageSize.getHeight() - 30) {
    doc.addPage();
    yPosition = 20;
  }
  doc.text(
    `${mode === "translate" ? "Translated" : "Summarized"} Text:`,
    margin,
    yPosition
  );
  yPosition += 7;

  doc.setFont(fontName, "normal");
  doc.setFontSize(11);
  const resultLines = doc.splitTextToSize(resultText, maxWidth);

  // Determine text alignment based on content
  const resultIsArabic = containsArabic(resultText);

  for (const line of resultLines) {
    if (yPosition > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPosition = 20;
    }
    if (resultIsArabic) {
      // Right-align Arabic text
      doc.text(line, pageWidth - margin, yPosition, { align: "right" });
    } else {
      doc.text(line, margin, yPosition);
    }
    yPosition += 6;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount} - Generated by 3ssila AI`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  doc.save(`3ssila-${mode}-${Date.now()}.pdf`);
};

/**
 * Export result to DOCX file
 */
export const exportToDocx = async (options: ExportOptions): Promise<void> => {
  const { inputText, resultText, mode, targetLanguage } = options;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: `3ssila AI - ${
                  mode === "translate" ? "Translation" : "Summary"
                }`,
                bold: true,
                size: 36,
              }),
            ],
            spacing: { after: 200 },
          }),
          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${new Date().toLocaleString()}`,
                size: 20,
                color: "666666",
              }),
            ],
          }),
          // Target language (if translation)
          ...(mode === "translate" && targetLanguage
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Target Language: ${targetLanguage}`,
                      size: 20,
                      color: "666666",
                    }),
                  ],
                  spacing: { after: 400 },
                }),
              ]
            : [
                new Paragraph({
                  children: [],
                  spacing: { after: 400 },
                }),
              ]),
          // Original text header
          new Paragraph({
            children: [
              new TextRun({
                text: "Original Text:",
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          }),
          // Original text content
          ...inputText.split("\n").map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 22,
                  }),
                ],
              })
          ),
          // Spacer
          new Paragraph({
            children: [],
            spacing: { after: 400 },
          }),
          // Result header
          new Paragraph({
            children: [
              new TextRun({
                text: `${
                  mode === "translate" ? "Translated" : "Summarized"
                } Text:`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          }),
          // Result content
          ...resultText.split("\n").map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 22,
                  }),
                ],
              })
          ),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `3ssila-${mode}-${Date.now()}.docx`);
};

/**
 * Helper function to download a blob as a file
 */
const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export result to the specified format
 */
export const exportResult = async (
  format: ExportFormat,
  options: ExportOptions
): Promise<void> => {
  switch (format) {
    case "txt":
      exportToTxt(options);
      break;
    case "pdf":
      await exportToPdf(options);
      break;
    case "docx":
      await exportToDocx(options);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};
