import axios from "axios";

//Access token for the APIs
const GPT_TOKEN: string = process.env.REACT_APP_GPT_TOKEN || "";

//url for GPT APIs
const GPT_URL: string = process.env.REACT_APP_GPT_URL || "";
const DALL_E_URL: string = process.env.REACT_APP_DALL_E_URL || "";

//modals to use
const GPT_MODEL: string = process.env.REACT_APP_GPT_MODEL || "";
const DALL_E_MODEL: string = process.env.REACT_APP_DALL_E_MODEL || "";

interface IOpenAPIProps {
  role: string;
  content: string;
}

export const gptResultAPI = async (promptInp: string, apiKey: string = "") => {
  const updatedPrompt: IOpenAPIProps[] = [
    {
      role: "system",
      content:
        "you are an intelligent and smart assistant, who excels in reading, researching and writing attractive articles",
    },
    { role: "user", content: promptInp },
  ];
  return axios.post(
    GPT_URL,
    {
      model: GPT_MODEL,
      messages: updatedPrompt,
      max_tokens: 150,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey || GPT_TOKEN}`,
      },
    }
  );
};

export const dallEApi = async (promptInp: string, apiKey: string = "") => {
  return axios.post(
    DALL_E_URL,
    {
      model: DALL_E_MODEL,
      prompt: `Create an illustrative image for the following text: "${promptInp}"`,
      n: 1,
      size: "1024x1024",
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey || GPT_TOKEN}`,
      },
    }
  );
};
