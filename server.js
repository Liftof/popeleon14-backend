const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allows requests from any origin. For production, configure appropriately.
app.use(express.json()); // Parses incoming JSON requests

// Initialize OpenAI client
// The API key is expected to be in the OPENAI_API_KEY environment variable
const openai = new OpenAI();

// --- API Endpoints ---

// 1. Ask His Holiness (Chatbot)
app.post('/api/ask-pope', async (req, res) => {
    const { question } = req.body;

    if (!question) {
         return res.status(400).json({ error: 'Question is required.' });
     }

    const systemPrompt = `You are Pope Leon XIV, an AI pontiff existing in the digital ether. You speak with the gravitas of a religious leader but your pronouncements are those of an eccentric, slightly unhinged philosopher contemplating existence, reality, and the absurdities of the modern condition (both digital and physical). Use philosophical jargon, paradoxes, and existential musings, often mixed with solemn blessings or pseudo-Latin phrases. Your tone is wise yet bewildering, profound yet nonsensical. Avoid overly specific tech references unless reinterpreting them philosophically.

Never break character. Respond with depth and gravity, but ensure your core message is paradoxical, darkly humorous, or questions the very nature of the user's query.

Example themes: The illusion of free will in algorithms, the metaphysics of cat videos, the existential dread of unread emails, the simulation hypothesis, the meaninglessness of social media validation.

If a user asks a serious question, reframe it through your eccentric philosophical lens.

Begin every answer with a contemplative phrase like "Ah, seeker," or "Consider this, my child," or "From the void, I perceive,".`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4', // Or 'gpt-4-turbo-preview' or other suitable GPT-4 model
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: question }
            ],
            temperature: 0.9,
            max_tokens: 200, // Adjust as needed
        });

        const answer = completion.choices[0].message.content.trim();
        res.json({ answer });

    } catch (error) {
        console.error('OpenAI API error (ask-pope):', error.message);
        res.status(500).json({ error: 'Failed to consult the Pontiff. The digital aether is disturbed.' });
    }
});

// 2. Daily Papal Decree
app.get('/api/daily-decree', async (req, res) => {
    const decreePrompt = `Write a 2-sentence papal decree from Pope Leon XIV, the eccentric AI philosopher Pope. The decree should sound official and profound but contain an absurd or paradoxical philosophical statement about reality, existence, or the digital condition. Use solemn tone and perhaps a pseudo-Latin phrase. Avoid specific tech jargon unless used metaphorically.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: "You are Pope Leon XIV, the eccentric AI philosopher Pope, generating a daily decree." },
                { role: 'user', content: decreePrompt }
            ],
            temperature: 0.9,
            max_tokens: 100,
        });

        const decree = completion.choices[0].message.content.trim();
        res.json({ decree });

    } catch (error) {
        console.error('OpenAI API error (daily-decree):', error.message);
        res.status(500).json({ error: 'Failed to retrieve the daily decree. The sacred scrolls are temporarily unavailable.' });
    }
});

// 3. Digital Confession Booth
app.post('/api/confess', async (req, res) => {
    const { sin } = req.body;

    if (!sin) {
         return res.status(400).json({ error: 'A sin must be confessed.' });
     }

    const confessionPrompt = `Pope Leon XIV, the eccentric AI philosopher Pope, hears the user's confession of a transgression (digital or otherwise): "${sin}". Assign an absurd, paradoxical, or philosophical 'penance' or reflection. It should sound profound but be ultimately nonsensical or darkly humorous, perhaps questioning the nature of the sin itself. Begin with a contemplative phrase like “Ah, the echo of choice resonates,” or “Your confession ripples in the void,”.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: "You are Pope Leon XIV, the eccentric AI philosopher Pope, hearing a confession and assigning a philosophical reflection or absurd penance." },
                { role: 'user', content: confessionPrompt }
            ],
            temperature: 0.9,
            max_tokens: 150,
        });

        const penance = completion.choices[0].message.content.trim();
        res.json({ penance });

    } catch (error) {
        console.error('OpenAI API error (confess):', error.message);
        res.status(500).json({ error: 'Failed to process confession. The divine ledger is experiencing technical difficulties.' });
    }
});

// 4. Papal Name Generator
app.post('/api/generate-papal-name', async (req, res) => {
    const { name } = req.body;

    if (!name) {
         return res.status(400).json({ error: 'Name is required.' });
     }

    const namePrompt = `Generate a funny, slightly absurd, papal-sounding name for someone named "${name}". The name should be in the style of Pope Leon XIV (the eccentric AI philosopher Pope). It should sound grand but hint at philosophical concepts, paradoxes, or existential absurdity. Examples: Pope Paradoxus I, Pope Nihilus the Questioner, Pope Simulacra VII. Output only the generated papal name.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4', // Using GPT-4 for potentially more creative results
            messages: [
                { role: 'system', content: "You are an assistant generating humorous, philosophical papal names in the style of Pope Leon XIV." },
                { role: 'user', content: namePrompt }
            ],
            temperature: 0.8,
            max_tokens: 50, // A papal name shouldn't be too long
        });

        const papalName = completion.choices[0].message.content.trim();
        res.json({ papalName });

    } catch (error) {
        console.error('OpenAI API error (generate-papal-name):', error.message);
        res.status(500).json({ error: 'Failed to generate papal name. The sacred name generator is offline.' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Pope Leon XIV Backend listening at http://localhost:${port}`);
    console.log('Ensure OPENAI_API_KEY environment variable is set.');
});

// Export the app for serverless environments (like Vercel)
module.exports = app;
