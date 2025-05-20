import OpenAI from "openai";
import { getCurrentWeather, getLocation } from "./toolss.js";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    dangerouslyAllowBrowser: true
})

/**
 * Goal - build an agent that can get the current weather at my current location
 * and give me some localized ideas of activities I can do.
 */
const location = await getLocation()
const weather = await getCurrentWeather(location)

const systemPrompt = `
You cycle through Thourght, Action, PAUSE, Observation. At the end of the loop you output a final Answer. Your final answer should be highly specific to the observations you have from running
the actions.
1. Thought: Describe your thoughts about the question you have been asked.
2. Action: run throughe the actions available to you.
3. Wait for the result of the action you just took.
4. Observation: will be the result of running those actions.

Available actions:
- getCurrentWeather${location} ${weather}: 
    E.g. getCurrentWeather: Salt Lake City
    Returns the current weather of the location specified.
- getLocation:
    E.g. getLocation: null
    Returns user's location details. No arguments needed.

Example session:
Question: Please give me some ideas for activities to do this afternoon.
Thought: I should look up the user's location so I can give location-specific activity ideas.
Action: getLocation 

You will be called again with something like this:
Observation: "New York City, NY"

Then you loop again:
Thought: To get even more specific activity ideas, I should get the current weather at the user's location.
Action: getCurrentWeather: New York City

You'll then be called again with something like this:
Observation: { location: "New York City, NY", forecast: ["sunny"] }

You then output:
Answer: <Suggested activities based on sunny weather that are highly specific to New York City and surrounding areas.>
`


const getActivityIdeas = async () => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that can get the current weather at my current location and give me some localized ideas of activities I can do."
                },
                {
                    role: "user",
                    content: `Tell me the current weather and give me a list of activity ideas based on my current location of ${location} and weather of ${weather}. Limit the activity ideas to 5 and make them highly specific to my ${location}.`
                }
            ]
        })
        const fullText = response.choices[0].message.content;
        const answerMatch = fullText.match(/Answer:\s*([\s\S]*)/i);
        if (answerMatch) {
            console.log(answerMatch[1].trim());
        } else {
            console.log(fullText);
        }
    } catch (error) {
        console.error('Error:', error)
    }
}

getActivityIdeas()