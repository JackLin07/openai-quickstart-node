import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Papa from 'papaparse'

// Main driver
export default function Home() {
  // configure useState
  const [input, setInput] = useState("");
  // const [input2, setInput2] = useState("");
  const [result, setResult] = useState();
  const [userData,setUserData] = useState();

  // setup .csv importing
  const fetchLocalCsv = async(path) => {
    const response = await fetch(path)
    const csv = await response.text()
    return csv
  }
  // function for import table from directory
  const getCsvData = async () => {
    const data = Papa.parse(
      await fetchLocalCsv('/data/Table_data_2.csv')
    )
    setUserData(data?.data)
  }
  // import call for csv
  useEffect(() => {
    getCsvData()
  },[])
  // console.log(userData)

  // Request submission to call for ChatGPT API
  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ animal: input, animal2:userData.toString() }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log(data.result)
      setResult(data.result);
      
      // setInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  // 
  const suggestions = result?.split('\n\n').map((point, index) => (
    <p key={index}>{point}</p>
  ));

  // Page layout
  return (
    <div>
      <Head>
        <title>Powerwise Energy Advice</title>
        {/* <link rel="icon" href="/dog.png" /> */}
      </Head>

      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon} /> */}
        <h3>Power Saving Moves</h3>
        <form onSubmit={onSubmit}>
          {/* <input> */}
          <textarea
            type="text"
            name="animal"
            placeholder="Identify and list 3 problems and give suggestions on how to improve energy 
            consumption. Make sure to Keep each item in the result to 100 words each."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: '100%',
              height: '80px',
              padding: '10px',
              marginBottom: '20px',
              fontSize: '16px',
              border: '2px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical',
              borderRadius: '5px',
              overflow: 'hidden'
            }}
          />
          {/* </input> */}
          
          {/* <input
            type="text"
            name="animalTwo"
            placeholder="Number of Bedrooms"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
          /> */}
          <input type="submit" value="Request Suggestions" />
        </form>
        <div>{suggestions}</div>
      </main>
    </div>
  );
}
