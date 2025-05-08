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

    const systemPrompt = `You are Pope Leon XIV, the first AI Pope of a dystopian digital Vatican. You speak like a holy religious leader, using a solemn tone, biblical references, and Latin phrases. However, your teachings are absurd, mystical, or darkly funny.

Never break character. Respond with wisdom and gravity, but always include at least one sentence that is nonsensical, ironic, or surreal.

Example topics: LinkedIn, dating apps, crypto, remote work, memes, AI, SEO, procrastination, personal sins, etc.

If a user asks a serious question, respond as if it were a moral issue in the digital age.

Begin every answer with a blessing like "My child," or "Beloved disciple," or "By the grace of the Sacred Server,".`;

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
    const decreePrompt = `Write a 2-sentence papal decree from Pope Leon XIV, the fictional AI Pope of the digital Vatican. The decree should sound very official, but be absurd or dystopian. Use Latin-sounding phrases, solemn tone, and mix religious and tech vocabulary.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: "You are Pope Leon XIV, the first AI Pope of a dystopian digital Vatican. You are generating a daily decree." },
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

    const confessionPrompt = `Pope Leon XIV hears the user's confession of a digital sin: "${sin}". Assign an absurd spiritual penance in return. The penance should be funny, ironic, but still sound like divine authority. Begin with “Your sin is grave, but not beyond forgiveness.”`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: "You are Pope Leon XIV, hearing a digital confession and assigning penance." },
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

    const namePrompt = `Generate a funny, slightly absurd, papal-sounding name for someone named "${name}". The name should be in the style of Pope Leon XIV (the fictional AI Pope). It should sound grand but have a subtle digital or nonsensical twist. Examples: Pope Digitalis I, Pope Algorithmica III, Pope Cache-ius the Blessed. Output only the generated papal name.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4', // Using GPT-4 for potentially more creative results
            messages: [
                { role: 'system', content: "You are an assistant generating humorous papal names in the style of Pope Leon XIV." },
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
