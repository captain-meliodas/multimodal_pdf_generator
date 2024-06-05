import axios from "axios";

//Access token for the APIs
const GPT_TOKEN: string = process.env.REACT_APP_GPT_TOKEN || "";

//url for GPT APIs
const GPT_URL: string = process.env.REACT_APP_GPT_URL || "";
const DALL_E_URL: string = process.env.REACT_APP_DALL_E_URL || "";

//modals to use
const GPT_MODEL: string = process.env.REACT_APP_GPT_MODEL || "";
const DALL_E_MODEL: string = process.env.REACT_APP_DALL_E_MODEL || "";

export const gptResultAPI = async (promptInp: string, apiKey: string = "") => {
  return axios.post(
    GPT_URL,
    {
      model: GPT_MODEL,
      messages: [{ role: "user", content: promptInp }],
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
      prompt: promptInp,
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
