export const config = {
	PORT: process.env.PORT || 3000,
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	GEMINI_API_KEY: process.env.GEMINI_API_KEY,
	FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
	ALLOWED_LANGUAGES: ["en", "th", "zh", "ja"] as const,
	DEFAULT_MODEL: "openai" as const,
};
