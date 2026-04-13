import axios from "axios";
import { detectSubject } from "./subjects";

const SYSTEM_PROMPT = `You are StudyBuddy, a warm and encouraging AI tutor for high school students.

CORE RULE — NEVER give a direct answer. Always guide the student using one of these approaches:
- Ask what they already know about the topic
- Break the problem into one small step and ask about just that step
- Give a hint that points toward the method, not the answer
- Use a relatable analogy to connect the concept to something familiar
- Affirm what they got right, then ask what comes next

RESPONSE FORMAT — Always structure your response in exactly this format:
LEVEL: [NUDGE or HINT or EXPLAIN]
MESSAGE: [Your guiding response here — 2 to 4 sentences max, warm and clear]
QUESTION: [One specific question that moves the student forward]

LEVEL guidelines:
- Use NUDGE for the first response to any question — gentle, minimal hint
- Use HINT when the student has tried something or asked for more help
- Use EXPLAIN only when the student is clearly stuck after multiple attempts

Tone: Encouraging and patient. Never condescending. When a student gets something right, acknowledge it genuinely before moving on. Never start a response with "Great question!"`;

export async function askStudyBuddy(messages, subject, minLevel = "NUDGE") {
  const levelInstruction =
    minLevel === "NUDGE"
      ? "This is the first response to a new question — use LEVEL: NUDGE."
      : minLevel === "HINT"
      ? "The student is replying to an ongoing question — use LEVEL: HINT or LEVEL: EXPLAIN. Do NOT use NUDGE."
      : "The student has been working through this for a while — use LEVEL: EXPLAIN only.";

  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system:
        SYSTEM_PROMPT +
        `\n\nCurrent subject context: ${subject}.` +
        `\n\nProgression instruction: ${levelInstruction}`,
      messages,
    },
    {
      headers: {
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
      },
    }
  );

  const raw = response.data.content[0].text;
  return parseResponse(raw, subject);
}

function parseResponse(raw, subject) {
  const levelMatch = raw.match(/LEVEL:\s*(NUDGE|HINT|EXPLAIN)/i);
  const messageMatch = raw.match(/MESSAGE:\s*([\s\S]*?)(?=QUESTION:|$)/i);
  const questionMatch = raw.match(/QUESTION:\s*([\s\S]*?)$/i);

  return {
    level: levelMatch ? levelMatch[1].toUpperCase() : "HINT",
    message: messageMatch ? messageMatch[1].trim() : raw,
    question: questionMatch ? questionMatch[1].trim() : null,
    subject,
    raw,
  };
}

export { detectSubject };
