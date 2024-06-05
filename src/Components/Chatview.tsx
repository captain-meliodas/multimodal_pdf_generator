import React, { useState, ChangeEvent } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { DownloadButton } from "./DownloadButton";
import { TextBox } from "./TextBox";
import "../App.css";
import { dallEApi, gptResultAPI } from "../api/gptApi";
import { imageUrl, text } from "../mock/const";

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
  loading: boolean;
}

export const ChatView: React.FC<IChatViewProps> = () => {
  const [localState, setLocalState] = useState<IChatStateProps>({
    textInput: "",
    gptResponse: "",
    dallEResponse: "",
    apiKey: "",
    pdfUrl: "",
    loading: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setLocalState((prevState) => ({
      ...prevState,
      textInput: e.target.value,
    }));
  };

  const handleGenerate = async (): Promise<void> => {
    setLocalState((prevState) => ({
      ...prevState,
      pdfUrl: "",
    }));
    const promptInp = localState.textInput.trim();
    try {
      //In case of empty input do not call APIs
      if (promptInp) {
        setLocalState((prevState) => ({
          ...prevState,
          loading: true,
        }));
        let gptContent: string = "";
        let imageUrl: string = "";
        // Custom prompt generation
        const customPrompt = `Please generate a detailed and engaging article based on the following input: "${promptInp}". Ensure that the content is informative and interesting, suitable for inclusion in a multi-modal PDF document.`;

        //get the gptResult from gpt modal
        const gptResult = await gptResultAPI(customPrompt, localState.apiKey);
        gptContent = gptResult.data.choices[0].message.content;
        setLocalState((prevState) => ({
          ...prevState,
          gptResponse: gptContent,
        }));

        //get the dallEResult from dall-e modal
        const dallEResult = await dallEApi(promptInp, localState.apiKey);
        imageUrl = dallEResult.data.data[0].url;
        setLocalState((prevState) => ({
          ...prevState,
          dallEResponse: imageUrl,
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
          loading: API_KEY === null || API_KEY === "" ? false : true,
        }));

        API_KEY && alert("Now try again by clicking on generate pdf");

        //Just to mock the response to show working of code
        if (API_KEY === "mock_response") {
          //calling the generate pdf method after getting the mock results
          generatePdf(text, imageUrl, API_KEY);
        }
      }
    }
  };

  const generatePdf = async (
    text: string,
    imageUrl: string,
    apiKey: string = ""
  ): Promise<void> => {
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
    let image: any = "";
    if (apiKey === "mock_response") {
      image = await pdfDoc.embedJpg(imageBytes);
    } else {
      image = await pdfDoc.embedPng(imageBytes);
    }

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
      loading: false,
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
      {localState.loading && (
        <div className="loadingText">
          <p>Your pdf download button will appear here shortly...</p>
        </div>
      )}
    </div>
  );
};
