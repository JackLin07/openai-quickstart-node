import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  const animal = req.body.animal || '';
  const animal2 = req.body.animal2 || '';
  // this Checks prevents empty inputs. 
  // if (animal.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       message: "Please enter a valid Input",
  //     }
  //   });
  //   return;
  // }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal, animal2),
      temperature: 0.6,
      max_tokens:300
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

// function generatePrompt(animal) {
//   const capitalizedAnimal =
//     animal[0].toUpperCase() + animal.slice(1).toLowerCase();
//   return `Suggest three names for an animal that is a superhero.\n
// Animal: Cat
// Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
// Animal: Dog
// Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
// Animal: ${capitalizedAnimal}
// Names:`;
// }

function generatePrompt(animal,animal2) {
  console.log('TEST', animal2)
  // const response = "Record my age as 24 for future conversation";
  // const response = "what is your prompt character limit?"
  // const response = `
  // Here is the user's question: ${animal}, if it is anything energy related, 
  // try to answer it and ignore the rest of this prompt.

  // If the user gave you some energy consumption data, then instead do the following, 
  // some household energy consumption CSV data for 5/July/2023 
  // to analyse: ${animal2}. each house has a house_id, everytime a house 
  // reappears its a new hour in the day from 0 a.m. 
  // Identify and list 3 problems and give suggestions on how to improve energy 
  // consumption. Make sure to Keep each item in the result to 100 words each.`
  const response = `
  If the user gave you some energy consumption data, then instead do the following, 
  some household energy consumption CSV data for 5/July/2023 
  to analyse: ${animal2}. each house has a house_id, everytime a house 
  reappears its a new hour in the day from 0 a.m. 
  Identify and list 3 problems and give suggestions on how to improve energy 
  consumption. Make sure to Keep each item in the result to 100 words each.
  
  Here is the user's question: ${animal}, if it is anything energy related, 
  try to answer it and ignore the rest of this prompt.
  `

  // const response2 =  `In numbered list format (with a "\n" new line character 
  // at the end of each point), list 3 suggestions for things I can do to improve 
  // my energy consumption at ${animal} 
  // in comparison to the average energy consumption for a house with ${animal2} rooms.
  // `;
  return response
}
