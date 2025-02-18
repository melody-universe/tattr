import { PDFDocument, rgb } from "pdf-lib";
import { type ComponentProps, type ReactNode, useState } from "react";

import { Button } from "~/components/button";
import { Card } from "~/components/card";

export function PrinterTester(): ReactNode {
  const generateButtonProps = useGenerateButton();

  return (
    <Card>
      <p>Use this tool to test the margins of your printer.</p>
      <Button {...generateButtonProps} />
      <p>TODO:</p>
      <ul className="list-disc pl-3">
        <li>Add option for page size</li>
        <li>Add option for metric system</li>
      </ul>
    </Card>
  );
}

function useGenerateButton(): ComponentProps<typeof Button> {
  const [text, setText] = useState("Generate PDF");
  const [isGenerating, setIsGenerating] = useState(false);

  const onClick = (): void => {
    setIsGenerating(true);
    setText("Please hold.");

    (async (): Promise<void> => {
      const buffer = await generatePdf();
      downloadFile(buffer);
      finish();
    })().catch((error: unknown) => {
      console.error(error);
      finish();
    });

    function finish(): void {
      setIsGenerating(false);
      setText("Generate PDF");
    }
  };

  return { children: text, disabled: isGenerating, onClick };
}

async function generatePdf(): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage();
  page.setWidth(PAGE_WIDTH * 72);
  page.setHeight(PAGE_HEIGHT * 72);

  for (let i = 1; i * GRID_SIZE < PAGE_WIDTH; i++) {
    const x = i * GRID_SIZE * 72;
    const [color, thickness] =
      i % MAJOR_LINE_FREQUENCY === 0
        ? [rgb(0, 0, 0), 2]
        : [rgb(0.5, 0.5, 0.5), 1];

    page.drawLine({
      color,
      end: { x, y: PAGE_HEIGHT * 72 },
      start: { x, y: 0 },
      thickness,
    });
  }

  for (let i = 1; i * GRID_SIZE < PAGE_HEIGHT; i++) {
    const y = i * GRID_SIZE * 72;
    const [color, thickness] =
      i % MAJOR_LINE_FREQUENCY === 0
        ? [rgb(0, 0, 0), 2]
        : [rgb(0.5, 0.5, 0.5), 1];

    page.drawLine({
      color,
      end: { x: 0, y },
      start: { x: PAGE_WIDTH * 72, y },
      thickness,
    });
  }

  return doc.save();
}

// global page constants
// (eventually make these per-user settings)
const PAGE_WIDTH = 8.5;
const PAGE_HEIGHT = 11;

// constants for this tool
// (eventually make these customizeable)
const GRID_SIZE = 0.25;
const MAJOR_LINE_FREQUENCY = 4;

function downloadFile(buffer: ArrayBuffer): void {
  const link = document.createElement("a");
  const blob = new Blob([buffer], { type: "application/pdf" });
  link.href = URL.createObjectURL(blob);
  link.download = "test-page.pdf";
  link.click();
}
