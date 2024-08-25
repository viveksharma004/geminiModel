import React, { useState, useEffect } from "react";
import sampleImage  from "./image.png";
import { RxCrossCircled } from "react-icons/rx";
import ReactMarkdown from "react-markdown";
import { RingLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify"
import copy from "copy-to-clipboard"
import { TbClipboardText } from "react-icons/tb";

function App() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const uploadImage = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  useEffect(() => {
    if (image && image.size > MAX_IMAGE_SIZE) {
      alert(
        `Image size too large. Maximum allowed size is ${
          MAX_IMAGE_SIZE / (1024 * 1024)
        }MB.`
      );
      return;
    }
  }, [image]);

  const analyzeImage = async () => {
    if (!image) {
      setError("Image must be Selected First");
      return;
    }

    try {
      setLoading(true);
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
          image: imageData,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };

      // console.log("Image data: ",imageData);
      // console.log("value::::",value);

      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      setResponse(data);
    } catch (error) {
      console.error(error);
      setError("Something went Wrong!!!");
    }
    setLoading(false);
  };

  const clear = () => {
    setImage(null);
    setImageData(null);
    setValue("");
    setResponse("");
    setError("");
  };

  // Function to handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      analyzeImage();
    }
  };


  const copyToClipboard = (response) => {
    console.log(response);
    let copyText = response;
    let isCopy = copy(copyText);
    if (isCopy) {
      toast.success("Copied to Clipboard");
    }
  };

  return (
    <>
      <div className="app">
        <section className="search-section flex flex-row mt-10 gap-1">
          <div className="" inputTaker of image>
            <div
              className=" shadow-lg w-[650px] h-[850px]  bg-white border  border-1  dark:bg-gray-600 dark:border-gray-600 flex flex-col 
                gap-3 p-4 rounded-xl
                border-[#00095]  hover:shadow-xl hover:dark:border-gray-900 hover:border-3
                transition ease-out"
            >
              <div className="max-h-[718px] min-h-[718px] w-full flex justify-center dark:bg-gray-500 rounded-md">
                <img
                  className="h-full w-full"
                  src={image ? URL.createObjectURL(image) : sampleImage}
                  alt="Img You Uploaded"
                />
              </div>
              <div className="mt-[10px]">
                {`To ask questions !!! `}
                <div className="extra-info input-container bg-white ">
                  <div className="rounded-md  imageInput ">
                    <label htmlFor="files" className="text-[#342f2f]">
                      <span className="font-semibold">Upload an Image</span> :
                      <span className="p-2 pl-6 pr-6 h-full border border-1 rounded-md text-[#342f2f] bg-[#b2b1b177]">
                        Upload Here
                      </span>{" "}
                    </label>
                    <input
                      onChange={uploadImage}
                      id="files"
                      accept="image/*"
                      type="file"
                      className="w-[40%]"
                      hidden
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            second
            container
            className=" shadow-lg w-[1200px] max-h-[850px]   bg-white border  border-1  dark:bg-gray-600 dark:border-gray-600 flex flex-col 
            gap-3 p-4 rounded-xl
            border-[#00095]  hover:shadow-xl hover:dark:border-gray-900 hover:border
             transition ease-out"
          >
            <div ResponseDiv className="max-h-[718px] min-h-[718px] overflow-auto rounded-md ">
              {
                loading?<RingLoader
                  color="#7e9eda"
                  speedMultiplier={1}
                  size={75}
                  className="loader absolute mt-[360px] ml-[510px]"/>:
                  <div className={response?"answer":""}>
                    <ReactMarkdown children={`${response ? response : ""}`} />
                  </div>
                }
                {error && <p className="answer">{error}</p>}
                
            </div>
            <div>
            <button onClick={() => {
                    if(response){
                      copyToClipboard(response)
                    }
                  }
                } className="absolute ml-[1080px] mt-[-15px] border border-1 border-slate-700 hover:border-slate-900 p-1 pl-2 pr-2 rounded-lg hover:bg-slate-500">
                    <TbClipboardText size={30}
                    className="text-slate-700 rounded-md"/>
                </button>
              <div className="mt-[10px]">
                What do you want to know about the image?
              </div>
              <div>
                <div className="input-container">
                  <input
                    value={value}
                    placeholder="What is in the image..."
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    onKeyDown={handleKeyDown} // Add onKeyDown event listener
                  />
                  <span
                    className="absolute ml-[1000px] mt-[15px]"
                    onClick={() => {
                      setValue("");
                    }}
                  >
                    <RxCrossCircled size={24} />
                  </span>

                  {!error && (
                    <button onClick={analyzeImage} className="text-[#342f2f]">
                      Ask Me
                    </button>
                  )}
                  {error && <button onClick={clear}>Reset</button>}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
