import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper: generate prompt for GPT
function generatePrompt(userData) {
    const {
        // 1️⃣ Personal Background
        age,
        gender,
        countryOfBirth,
        currentCountry,
        yearsAbroad,
        relationshipStatus,
        dependents,
        healthStatus,

        // 2️⃣ Education & Skills
        highestDegree,
        fieldsOfStudy,
        learningAbility,
        learningStyle,
        languagesSpoken,

        // 3️⃣ Career Trajectory
        totalExperience,
        mainFields,
        mostFulfillingRole,
        leastFulfillingRole,
        majorCareerShifts,
        currentJobTitle,
        jobSatisfaction,
        burnoutLevel,
        entrepreneurialExperience,
        leadershipExperience,

        // 4️⃣ Financial Situation
        currentIncome,
        savings,
        debts,
        desiredIncome,
        financialStress,
        financialGoal,

        // 5️⃣ Personality & Motivation
        strengths,
        weaknesses,
        motivation,
        workEnvironment,
        energySource,
        fulfillmentDefinition,

        // 6️⃣ Current Situation & Decision Point
        currentFocus,
        currentChallenges,
        openToStudy,
        studyFields,
        futureOutcome,
        riskTolerance,
        happinessLevel,
        stressLevel,
        relationshipImpact,
    } = userData;

    return `
You are a professional statistician and life coach specializing in human development forecasting.  
Based on the following structured personal profile, simulate and output **3 realistic, data-informed career trajectories** for the next 10–15 years.  
Each path must include **quantitative estimates** (probabilities, satisfaction, burnout risk, expected income for 2030 & 2040).  
Keep your tone **realistic, scientific, and probability-driven** — not motivational or idealistic.

PERSON PROFILE
────────────────────────
DEMOGRAPHICS
- Age: ${age}
- Gender: ${gender}
- Country of Birth: ${countryOfBirth}
- Current Country: ${currentCountry}
- Years Living Abroad: ${yearsAbroad}
- Relationship Status: ${relationshipStatus}
- Dependents: ${dependents}
- Health Status: ${healthStatus}

EDUCATION & SKILLS
- Highest Degree: ${highestDegree}
- Fields of Study: ${fieldsOfStudy}
- Learning Ability: ${learningAbility}
- Preferred Learning Style: ${learningStyle}
- Languages Spoken: ${languagesSpoken}

CAREER HISTORY
- Total Work Experience: ${totalExperience} years
- Main Professional Fields: ${mainFields}
- Most Fulfilling Role: ${mostFulfillingRole}
- Least Fulfilling Role: ${leastFulfillingRole}
- Major Career Shifts: ${majorCareerShifts}
- Current Job Title: ${currentJobTitle}
- Job Satisfaction (1–10): ${jobSatisfaction}
- Burnout / Fatigue Level (1–10): ${burnoutLevel}
- Entrepreneurial Experience: ${entrepreneurialExperience}
- Leadership Experience: ${leadershipExperience}

FINANCIAL CONTEXT
- Current Monthly Income: €${currentIncome}
- Savings: €${savings}
- Debts: €${debts}
- Desired Monthly Income: €${desiredIncome}
- Financial Stress Level (1–10): ${financialStress}
- Financial Goal: ${financialGoal}

PERSONALITY & VALUES
- Strengths: ${strengths}
- Weaknesses: ${weaknesses}
- Primary Motivation: ${motivation}
- Preferred Work Environment: ${workEnvironment}
- Energy Source: ${energySource}
- Definition of Fulfillment: ${fulfillmentDefinition}

CURRENT SITUATION & FUTURE GOALS
- Current Main Focus: ${currentFocus}
- Current Challenges: ${currentChallenges}
- Open to Studying Again: ${openToStudy}
- Fields of Study Interest: ${studyFields}
- Desired 5–10 Year Outcome: ${futureOutcome}
- Risk Tolerance (1–10): ${riskTolerance}
- Happiness Level (1–10): ${happinessLevel}
- Stress Level (1–10): ${stressLevel}
- Relationship Impact on Goals: ${relationshipImpact}

OUTPUT FORMAT (JSON ONLY)
────────────────────────
{
  "career_paths": [
    {
      "name": "",
      "feasibility": "",                // % probability (0–100%)
      "satisfaction": "",      // % subjective satisfaction
      "burnout_risk": "",               // % probability of burnout
      "financial_projection": { "2030": "", "2040": "" },
      "pros": "",
      "cons": "",
      "next_steps": ""
    }
  ],
  "bottom_line": ""                     // A concise summary of what’s most likely and advisable
}
`;
}

export default generatePrompt;


// API endpoint
app.post("/api/analyze", async (req, res) => {
    const userData = req.body;
    console.log(">>>>> button pressed")
    const prompt = generatePrompt(userData);
    //console.log(">>>>> generate prompt", userData)
    try {
        const completion = await client.chat.completions.create({
            model: "gpt-5-mini", // or "gpt-5" when available
            messages: [
                { role: "system", content: "You are a data-driven career analyst, statistician ans psychologist." },
                { role: "user", content: prompt },
            ],
            temperature: 1,
        });

        const result = completion.choices[0].message.content;
        console.log(">>>>> reult", result)
        res.json({ result });
    } catch (error) {
        console.error("Error from GPT:", error);
        res.status(500).json({ error: "GPT request failed" });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
