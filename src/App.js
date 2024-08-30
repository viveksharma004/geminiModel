import React, { useState, useEffect } from "react";
import sampleImage from "./image.png";
import { RxCrossCircled } from "react-icons/rx";
import ReactMarkdown from "react-markdown";
import { RingLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";
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

  // const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  const connecting = async () => {
    try {
      const res = await fetch("http://localhost:8000/", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const response = await res.json();
      if (response.message === "connected") {
        console.log("Connected to the Server");
      }
    } catch (e) {
      console.log("Server Connection Failed");
      console.log(e);
    }
  };

  useEffect(() => {
    if (image && image.size > 5 * 1024 * 1024) {
      alert(`Image size too large. Maximum allowed size is ${5}MB.`);
      return;
    }
    connecting();
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

      const response = await fetch("https://gemini-model-server.onrender.com/gemini", options);
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
      <div className="app ">
        <section className="flex flex-col mt-10 gap-1 md:flex-row md:flex-nowrap sm:flex-row sm:flex-wrap  lg:flex-row lg:flex-nowrap">
          {/* <div className="max-h-[90%] w-[38%]"> */}
            <div
              className=" shadow-lg lg:w-[42vw] h-[92vh]  bg-white border  border-1  dark:bg-gray-600 dark:border-gray-600 flex flex-col 
                gap-4 p-4 rounded-xl
                border-[#00095]  hover:shadow-xl hover:dark:border-gray-900 hover:border-3
                transition ease-out sm:w-[90vw] sm:h-[92vh] md:w-[45vw]"
              >
              <div className="max-h-[88%] min-h-[88%]   min-w-full dark:bg-gray-500 rounded-md">
                <img
                  className="h-full w-full rounded-md"
                  src={image ? URL.createObjectURL(image) : sampleImage}
                  alt="Image-You-Uploaded"
                />
              </div>
              <div className="">
                <span className="text-[#cacaca]">To ask questions !!! </span>
                {/* <div className=""> */}
                  <div className="rounded-md  imageInput text-center bg-white  ">
                    <label htmlFor="files" className="text-[#342f2f]">
                      <span className="font-semibold">Upload an Image :</span>
                      <span className="p-1 pl-6 pr-6 h-full border border-1 rounded-md text-[#342f2f] bg-[#b2b1b177]">
                        Upload Here
                      </span>
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
              {/* </div> */}
            </div>
          {/* </div> */}

          <div
            className=" shadow-lg lg:w-[58vw] h-[92vh]   bg-white border  border-1  dark:bg-gray-600 dark:border-gray-600 flex flex-col 
            gap-4 p-4 rounded-xl
            border-[#00095]  hover:shadow-xl hover:dark:border-gray-900 hover:border
             transition ease-out sm:w-[90vw] sm:h-[92vh] md:w-[45vw]"
            >
            <div className="max-h-[88%] min-h-[88%] w-full overflow-auto rounded-md relative">
              {loading ? (
                <RingLoader
                  color="#7e9eda"
                  speedMultiplier={1}
                  size={70}
                  className="absolute top-[46%] left-[46%]"
                />
              ) : (
                <div className={response ? "answer overflow-y-auto" : ""}>
                  <ReactMarkdown children={`${response ? response : ""}`} />
                </div>
              )}
              {error && <p className="answer">{error}</p>}
            </div>

            <div className="text-[#cacaca] ">
              <div className="relative ">
              What do you want to know about the image?
              {/* <div className="relative w-full "> */}
                <button
                  onClick={() => {
                    if (response) {
                      copyToClipboard(response);
                    }
                  }}
                  className="absolute left-[95%] bottom-[4px] hover:border hover:border-1  hover:text-slate-700  hover:border-slate-700  pl-1 pr-1 rounded-xl hover:bg-slate-500"
                >
                  <TbClipboardText
                    size={24}
                    className="text-slate-400 rounded-md  hover:text-slate-700"
                  />
                </button>
              {/* </div> */}
              </div>
              {/* <div> */}
                {/* <div className=" "> */}
                  <div className="input-container">
                    <input
                      value={value}
                      placeholder="What is in the image..."
                      onChange={(e) => {
                        setValue(e.target.value);
                      }}
                      onKeyDown={handleKeyDown} // Add onKeyDown event listener
                      className="max-w-[87.5%]"
                    />
                    <div className="relative w-[2.5%] cross bg-[#FFFF]">
                      <span
                        className="absolute top-[28%] right-[15%]"
                        onClick={() => {
                          setValue("");
                        }}
                      >
                        <RxCrossCircled size={18} className="text-slate-400 hover:text-[#484747]"/>
                      </span>
                    </div>
                    {!error && (
                      <button onClick={analyzeImage} className="text-[#403b3b]">
                        Ask Me
                      </button>
                    )}
                    {error && <button onClick={clear}>Reset</button>}
                  </div>
                {/* </div> */}
              {/* </div> */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
