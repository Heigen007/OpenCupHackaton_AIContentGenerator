const express = require("express");
require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors")
const Replicate = require("replicate")

const PORT = 3000
const model = "prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb";

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const configuration = new Configuration({
    apiKey: process.env['API_KEY'],
});
const openai = new OpenAIApi(configuration);

const replicate = new Replicate({
    auth: process.env['AUTH'],
});

function makeQuestion(obj){
    var {textType, selectedNumber, about} = obj
    var finalText = ""
    if(textType == "story"){
        finalText = "Write me a story consist of "+ selectedNumber + " parts about " + about +
            ". Each part should have the name of the picture(NAME:) and clear and long description of the description of a picture(DESCRIPTION:)"
    } else if(textType == "article") {
        finalText = "Write me an article consist of "+ selectedNumber + " parts about " + about +
            ". Each part should have the name of the picture(NAME:) and clear and long description of the description of a picture(DESCRIPTION:)"
    }
    return finalText
}

async function makeRequest(question){
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        temperature:0.7,
        max_tokens:3400,
        top_p:1,
        frequency_penalty:0,
        presence_penalty:0
    });
    return response.data
}

async function analyseText(text, pictureType){
    var realNames = []
    var realDescriptions = []
    var imageNames = text.split("NAME: ")
    var descriptionNames = text.split("DESCRIPTION:")
    imageNames.shift()
    descriptionNames.shift()
    for (const el of imageNames) {
        realNames.push(el.split("DESCRIPTION:")[0].split("PART")[0].split("Part")[0])
    }
    for (const el of descriptionNames) {
        realDescriptions.push(el.split("NAME:")[0].split("PART")[0].split("Part")[0])
    }
    try {
        // Map the imageNames array to an array of promises
        const imagePromises = descriptionNames.map((imageName) => getUrl(imageName, pictureType));
    
        // Wait for all promises to resolve, collecting the resulting URLs
        const imageURLs = await Promise.all(imagePromises);
    
        // Combine image names and URLs into an object
        const namedImageURLs = []
        for (let i = 0; i < imageURLs.length; i++) {
            namedImageURLs.push(imageURLs[i][0])
        }
    
        var response = ""
        for (let i = 0; i < realDescriptions.length; i++) {
            response += "<p>" + realDescriptions[i] + "</p>"
            response += `<img src="${namedImageURLs[i]}" alt="Generated Image" class="img-fluid">`
        }
        return response
    } catch (error) {
        console.error('An error occurred while processing images:', error);
        return error
    }
}

app.post("/makeRequest", async (req, res) => {
    var result = await makeRequest(makeQuestion(req.body))
    result = await analyseText(result.choices[0].text, req.body.pictureType)
    res.send({ answer: result })
})

async function getUrl(prompt, pictureType){
    if(pictureType == "original")
        pictureType = ""
    prompt = "mdjrny-v4 " + pictureType + " style " + prompt
    const input = { prompt };
    const output = await replicate.run(model, { input });
    return output
}

 
app.listen(PORT, () => console.log("Started on port " + PORT));