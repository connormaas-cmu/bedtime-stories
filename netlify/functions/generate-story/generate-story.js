async function openaiSetup() {
    const module = await import('openai')
    const key = process.env.TEXT_API_KEY
    return new module({ apiKey: key });
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
    const openai = await openaiSetup()

    throw new Error("test")

    try {
        const { prompt } = JSON.parse(event.body);
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });
  
        const story = response.data.choices[0].message.content;

        return {
            statusCode: 200,
            body: JSON.stringify({ story }),
        };

    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};

module.exports = { handler }
