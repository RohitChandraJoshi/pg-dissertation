import React, { useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";

function App() {
  const [text, setText] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [keywords, setKeywords] = useState("");
  const [summarizedtext, setSummarizedtext] = useState("");
  const [loading, setLoading] = useState(false);

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    if(!isValidInput(areaOfInterest) || !isValidInput(keywords)){
      alert("please enter values for area of Interest and keywords");
      setLoading(false);
      return;
    }
    
    const prompt = generatePrompt(areaOfInterest,keywords);

    openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.6,
        max_tokens: 100,
      })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          setSummarizedtext(res?.data?.choices[0]?.text);
        }
      })
      .catch((err) => {
        console.log(err, "An error occurred");
      });
  };

  const isValidInput = (input, fieldName) => {
    const isValid = typeof input === "string" && input.trim() !== "";
    if (!isValid) {
      console.error(`${fieldName} is invalid. Type: ${typeof input}, Value: "${input}"`);
    }
    return isValid;
  };
  

  const generatePrompt = (areaOfInterest, keywords) => {
    return `recomend 5 research topics for area of interest : ${areaOfInterest} and \nKeywords: ${keywords}\n`;
  };

  return (
    <div className="App_">
      <div className="header">
        <h1 className="header_text">
          <span className="text_active">Topic Recommender</span>
        </h1>
        <h2 className="header_summary">Get Recommended Topic for your Research work using AI.</h2>
      </div>
      <div className="container">
        <div className="text_form">
          <form>
            <label>Area of Interest</label>
            <input
              type="text"
              placeholder="Enter your area of interest"
              value={areaOfInterest}
              onChange={(e) => setAreaOfInterest(e.target.value)}
            />
            
            <label>Keywords</label>
            <input
              type="text"
              placeholder="Enter keywords (comma-separated)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </form>
        </div>
        <div>
          <button type="button" onClick={handleSubmit}>
            {loading ? "Loading..." : "Topics"}
          </button>
        </div>
        <div className="summarized_text">
          <label>Recommended Topics</label>
          <textarea
            placeholder="Topics"
            cols={80}
            rows={14}
            value={summarizedtext}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
