import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI with provided key:', err);
  }
}

// African-Context & Multilingual Fallback Knowledge Base
const LOCAL_AFRICAN_ANALOGIES: Record<string, { en: string; sw: string; sheng: string }> = {
  'scalability': {
    en: 'Think of a Matatu or Danfo stage during rush hour in Nairobi or Lagos. Vertical scaling (scaling up) is buying a 50-seater bus instead of a 14-seater van. Horizontal scaling (scaling out) is deploying 10 more matatus on the route to carry the crowd!',
    sw: 'Fikiria kituo cha matatu wakati wa msongamano. Scaling up (wima) ni kununua basi kubwa la abiria 50 badala ya gari ndogo ya 14. Scaling out (usawa) ni kuongeza matatu 10 zaidi barabarani kubeba abiria wote bila kuchelewa!',
    sheng: 'Ni ka vile matatu stage jioni tao. Scaling up ni kubuy manyanga kubwa ya 50-seater badala ya nganya ndogo. Scaling out ni kuleta mathree zingine kumi kwa line!',
  },
  'elasticity': {
    en: 'Imagine M-Pesa or mobile money during salary week or Eid/Christmas shopping. At midnight on payday, millions of transactions flood in. With cloud elasticity, extra servers boot up automatically to process transfers without crashing, then de-provision the next day so you don’t pay idle costs.',
    sw: 'Fikiria huduma ya M-Pesa siku ya mishahara au sikukuu. Mamilioni ya watu wanatuma pesa kwa wakati mmoja. Elasticity inaruhusu seva kujiongeza zenyewe kiotomatiki kuhudumia wote bila mtandao kukatika, kisha kupungua kazi ikiisha.',
    sheng: 'Ni ka venye M-Pesa hujaa siku ya mshahara. Saa saba usiku transactions zikipanda, cloud inajiongeza servers automatic. Watu wakilala, inashuka chini ndio usilipe doo za bure!',
  },
  'regions': {
    en: 'An Azure Region is like an entire metropolitan technology hub (such as South Africa North in Johannesburg). Availability Zones are separate independent data centers within that region (like having one data center in Sandton, another in Midrand, and a third in Rosebank with separate power substations and diesel generators).',
    sw: 'Eneo la Azure (Region) ni kama mji mzima wa kiteknolojia. Availability Zones ni vituo tofauti vya kompyuta ndani ya eneo hilo vyenye umeme na intaneti tofauti, kiasi kwamba kimoja kikiungua vingine viwili vinaendelea kufanya kazi.',
    sheng: 'Region ni kama mtaa mzima ka Nairobi. Availability Zones ni maboma tatu tofauti—moja Westlands, ingine Upperhill, na ingine Kilimani—ziko na stima na majenereta zao tofauti!',
  },
  'shared-responsibility': {
    en: 'Think of renting a stall in Kariakoo or Gikomba market. On-premises is building your own shop from scratch (cement, roof, security guard). IaaS is renting an empty stall with roof & power (you bring your own shelves, locks, and stock). PaaS is renting a fully furnished kiosk. SaaS is using a digital marketplace like Jumia where you just list your products!',
    sw: 'Ni kama kukodi duka sokoni Kariakoo. On-premises ni kujenga jengo lako mwenyewe kuanzia msingi. IaaS ni kukodi kibanda chenye paa na stima (wewe unaleta kufuli na bidhaa). PaaS ni kibanda kilichokamilika. SaaS ni kama kutumia Jumia ambapo unauza tu bila kujali jengo!',
    sheng: 'Ni ka biashara ya Gikomba au Toi market. On-prem ni kujenga boma yako mwenyewe. IaaS ni kurent kibanda kiko na stima, we ulete kufuli zako na stock. SaaS ni ka kutumia Jumia ama Instagram shop tu!',
  },
};

// API Endpoint for AI Study Buddy
app.post('/api/study-buddy/ask', async (req, res) => {
  try {
    const { question, language = 'en', topicContext = '' } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Try Gemini API if initialized
    if (ai) {
      try {
        const langInstructions =
          language === 'sw'
            ? 'Respond in clear, natural Swahili (Kiswahili) mixed with relevant English technical terms in parentheses.'
            : language === 'sheng'
            ? 'Respond in lively, youth-friendly Kenyan Sheng / East African slang while maintaining technical accuracy.'
            : language === 'fr'
            ? 'Respond in clear, natural French.'
            : 'Respond in clear, encouraging English with African real-world analogies.';

        const prompt = `You are "JazaCloud", an encouraging AI Study Buddy for the AZ-900 Microsoft Azure Fundamentals exam, created for African learners and students in the #1MillionDevs movement.
Your goal is to explain cloud concepts simply, concisely, and memorably using relatable African context (like M-Pesa, Safaricom, solar microgrids, matatus, local e-commerce, market trading, agriculture IoT).
${langInstructions}

User Question: "${question}"
Topic Context: "${topicContext}"

Keep your response under 180 words. Format with:
1. Short core explanation
2. Real-world relatable analogy
3. Quick exam tip`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response && response.text) {
          return res.json({
            answer: response.text,
            model: 'gemini-3.8-flash',
            provider: 'Gemini AI',
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local curriculum knowledge base:', geminiError?.message);
      }
    }

    // Fallback response using curated analogies
    const lowerQ = question.toLowerCase();
    let matchedAnalogy = LOCAL_AFRICAN_ANALOGIES['scalability'];

    if (lowerQ.includes('elastic') || lowerQ.includes('spike') || lowerQ.includes('black friday')) {
      matchedAnalogy = LOCAL_AFRICAN_ANALOGIES['elasticity'];
    } else if (lowerQ.includes('zone') || lowerQ.includes('region') || lowerQ.includes('pair')) {
      matchedAnalogy = LOCAL_AFRICAN_ANALOGIES['regions'];
    } else if (lowerQ.includes('iaas') || lowerQ.includes('paas') || lowerQ.includes('saas') || lowerQ.includes('shared')) {
      matchedAnalogy = LOCAL_AFRICAN_ANALOGIES['shared-responsibility'];
    }

    const langKey = (language === 'sw' ? 'sw' : language === 'sheng' ? 'sheng' : 'en') as 'en' | 'sw' | 'sheng';
    const fallbackText = matchedAnalogy[langKey] || matchedAnalogy.en;

    return res.json({
      answer: `${fallbackText}\n\n💡 Exam Tip: Remember that in the AZ-900 exam, questions test understanding through real scenarios rather than word-for-word definitions!`,
      model: 'curated-study-buddy-engine',
      provider: 'CloudReady Offline Buddy',
    });
  } catch (err: any) {
    console.error('Study Buddy API error:', err);
    res.status(500).json({ error: 'Failed to process question', details: err?.message });
  }
});

// Mount Vite in development or serve static build in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CloudReady server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
