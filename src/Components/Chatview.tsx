import React, { useState, ChangeEvent } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { DownloadButton } from "./DownloadButton";
import { TextBox } from "./TextBox";
import "../App.css";
import { dallEApi, gptResultAPI } from "../api/gptApi";

enum ErrorCodes {
  INSUFFICIENT_QUOTA = "insufficient_quota",
  INVALID_API_KEY = "invalid_api_key",
}
interface IChatViewProps {}
interface IChatStateProps {
  textInput: string;
  gptResponse: string;
  dallEResponse: string;
  apiKey: string;
  pdfUrl: string;
}

export const ChatView: React.FC<IChatViewProps> = () => {
  const [localState, setLocalState] = useState<IChatStateProps>({
    textInput: "",
    gptResponse: "",
    dallEResponse: "",
    apiKey: "",
    pdfUrl: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setLocalState((prevState) => ({
      ...prevState,
      textInput: e.target.value,
    }));
  };

  const handleGenerate = async (): Promise<void> => {
    const promptInp = localState.textInput.trim();
    try {
      //In case of empty input do not call APIs
      if (promptInp) {
        //get the gptResult from gpt modal
        const gptResult = await gptResultAPI(promptInp, localState.apiKey);
        const gptContent = gptResult.data.choices[0].message.content;
        setLocalState((prevState) => ({
          ...prevState,
          gptResponse: gptContent,
        }));

        //get the dallEResult from dall-e modal
        const dallEResult = await dallEApi(promptInp, localState.apiKey);
        setLocalState((prevState) => ({
          ...prevState,
          dallEResponse: dallEResult.data.data[0].url,
        }));

        //calling the generate pdf method after getting the results
        generatePdf(gptContent, dallEResult.data.data[0].url);
      }
    } catch (error: any) {
      console.error("Error generating content", error);
      if (
        error?.response?.data?.error?.code === ErrorCodes.INSUFFICIENT_QUOTA ||
        error?.response?.data?.error?.code === ErrorCodes.INVALID_API_KEY
      ) {
        const API_KEY = prompt(
          "Look's like GPT API key is invalid or quota is expired, still you can paste your OpenAPI key here to continue using application or wait for some time."
        );
        setLocalState((prevState) => ({
          ...prevState,
          apiKey: API_KEY || "",
        }));
      }
    }
  };

  const generatePdf = async (text: string, imageUrl: string): Promise<void> => {
    const pdfDoc = await PDFDocument.create();
    const textPage = pdfDoc.addPage([600, 800]);
    const imagePage = pdfDoc.addPage([600, 800]);
    const size = textPage.getSize();

    // Add gptContent to PDF
    textPage.drawText(text, {
      x: 10,
      y: size.height - 10,
      size: 12,
      color: rgb(0, 0, 0),
      maxWidth: 580,
      wordBreaks: [" "],
    });

    // Fetch and add png image to PDF from dallEResult
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
    const image = await pdfDoc.embedPng(imageBytes);

    imagePage.drawImage(image, {
      x: imagePage.getWidth() / 2 - 500 / 2,
      y: imagePage.getHeight() / 2 - 400 / 2,
      width: 500,
      height: 400,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    //create the blob url for downloading the pdf
    const url = URL.createObjectURL(blob);
    setLocalState((prevState) => ({
      ...prevState,
      pdfUrl: url,
    }));
  };

  return (
    <div className="App">
      <h1>Multi-Modal PDF Generator</h1>
      <div className="container">
        <TextBox
          className="textBox"
          textInput={localState.textInput}
          placeholder="Enter your prompt here"
          handleInputChange={handleInputChange}
        />
        <button className="chatBtn" onClick={handleGenerate}>
          Generate pdf
        </button>
      </div>
      <div className="subText">
        <strong>Note: </strong>
        <p>
          After clicking on generate pdf button with prompt text a download url
          will be provided below
        </p>
      </div>
      {localState.pdfUrl && (
        <DownloadButton
          className="DownloadBtn"
          pdfUrl={localState.pdfUrl}
          label="Download PDF"
        />
      )}
    </div>
  );
};
