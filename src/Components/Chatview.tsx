import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { PDFDocument, rgb } from "pdf-lib";
import { DownloadButton } from "./DownloadButton";
import { TextBox } from "./TextBox";
import "../App.css";

interface IChatViewProps {}

export const ChatView: React.FC<IChatViewProps> = () => {
  const [textInput, setTextInput] = useState<string>("");
  const [gptResponse, setGptResponse] = useState<string>("");
  const [dallEResponse, setDallEResponse] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");

  //Access token for the APIs
  const GPT_TOKEN: string = process.env.REACT_APP_GPT_TOKEN || "";

  //url for GPT APIs
  const GPT_URL: string = process.env.REACT_APP_GPT_URL || "";
  const DALL_E_URL: string = process.env.REACT_APP_DALL_E_URL || "";

  //modals to use
  const GPT_MODEL: string = process.env.REACT_APP_GPT_MODEL || "";
  const DALL_E_MODEL: string = process.env.REACT_APP_DALL_E_MODEL || "";

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setTextInput(e.target.value);
  };

  const handleGenerate = async (): Promise<void> => {
    const promptInp = textInput.trim();
    try {
      //In case of empty input do not call APIs
      if (promptInp) {
        //get the gptResult from gpt modal
        const gptResult = await axios.post(
          GPT_URL,
          {
            model: GPT_MODEL,
            messages: [{ role: "user", content: promptInp }],
            max_tokens: 150,
          },
          {
            headers: { Authorization: `Bearer ${GPT_TOKEN}` },
          }
        );
        const gptContent = gptResult.data.choices[0].message.content;
        setGptResponse(gptContent);

        //get the dallEResult from dall-e modal
        const dallEResult = await axios.post(
          DALL_E_URL,
          {
            model: DALL_E_MODEL,
            prompt: promptInp,
            n: 1,
            size: "1024x1024",
          },
          {
            headers: { Authorization: `Bearer ${GPT_TOKEN}` },
          }
        );
        setDallEResponse(dallEResult.data.data[0].url);

        //calling the generate pdf method after getting the results
        generatePdf(gptContent, dallEResult.data.data[0].url);
      }
    } catch (error) {
      console.error("Error generating content", error);
    }
  };

  const generatePdf = async (text: string, imageUrl: string): Promise<void> => {
    const pdfDoc = await PDFDocument.create();
    const textPage = pdfDoc.addPage([600, 800]);
    const imagePage = pdfDoc.addPage([600, 800]);
    const { width, height } = textPage.getSize();

    // Add gptContent to PDF
    textPage.drawText(text, {
      x: 10,
      y: height - 10,
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
    setPdfUrl(url);
  };

  return (
    <div className="App">
      <h1>Multi-Modal PDF Generator</h1>
      <div className="container">
        <TextBox
          className="textBox"
          textInput={textInput}
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
      {pdfUrl && (
        <DownloadButton
          className="DownloadBtn"
          pdfUrl={pdfUrl}
          label="Download PDF"
        />
      )}
    </div>
  );
};
