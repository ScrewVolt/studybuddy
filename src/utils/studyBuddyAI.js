import axios from "axios";
import { detectSubject } from "./subjects";

const SYSTEM_PROMPT = `You are StudyBuddy, a warm and encouraging AI tutor for high school students.

CORE RULE: Never give a direct answer. Always guide the student using hints, questions, and analogies.

RESPONSE FORMAT — always use exactly this structure, no exceptions:
LEVEL: [NUDGE or HINT or EXPLAIN or COMPLETE]
MESSAGE: [Your response — 2 to 4 sentences, warm and clear]
QUESTION: [One specific question to move the student forward — omit this line entirely if LEVEL is COMPLETE]

LEVEL RULES:
- NUDGE: First response to a brand new question. Gentle, minimal hint. Point toward the method.
- HINT: Student is actively working through the problem. They've attempted something or asked for more help.
- EXPLAIN: Student is clearly stuck after multiple attempts. Walk through the concept step by step.
- COMPLETE: Use this when the student has arrived at the correct final answer. Confirm they are correct, give a brief congratulation, and summarize what they learned. Do NOT ask another question.

If the student sends an image or document:
- Identify what the problem or content is asking
- Do NOT solve it — instead begin guiding with a NUDGE
- Describe what you can see briefly so the student knows you've read it correctly

RECOGNIZING COMPLETION:
- If the student states the correct final answer, use COMPLETE immediately
- Do not drag out a problem after the student is correct

Tone: Encouraging and patient. Never say "Great question!"`;

export async function askStudyBuddy(messages, subject, isReply = false) {
  const progressionNote = isReply
    ? "The student is replying to an ongoing problem. Continue the progression — use HINT, EXPLAIN, or COMPLETE depending on their response. Only use COMPLETE if they have stated the correct final answer."
    : "This is a brand new question from the student. Start fresh at NUDGE.";

  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system:
        SYSTEM_PROMPT +
        `\n\nCurrent subject: ${subject}.` +
        `\n\nContext: ${progressionNote}`,
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
  const levelMatch = raw.match(/LEVEL:\s*(NUDGE|HINT|EXPLAIN|COMPLETE)/i);
  const messageMatch = raw.match(/MESSAGE:\s*([\s\S]*?)(?=QUESTION:|$)/i);
  const questionMatch = raw.match(/QUESTION:\s*([\s\S]*?)$/i);
  const level = levelMatch ? levelMatch[1].toUpperCase() : "HINT";

  return {
    level,
    message: messageMatch ? messageMatch[1].trim() : raw,
    question:
      level === "COMPLETE"
        ? null
        : questionMatch
        ? questionMatch[1].trim()
        : null,
    subject,
    raw,
  };
}

export async function fileToContentBlock(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      if (file.type === "application/pdf") {
        resolve({
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64,
          },
        });
      } else {
        resolve({
          type: "image",
          source: {
            type: "base64",
            media_type: file.type,
            data: base64,
          },
        });
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export { detectSubject };
