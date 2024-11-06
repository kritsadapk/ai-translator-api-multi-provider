export interface TranslationRequest {
	text: string;
	targetLang: string;
	modelType: "openai" | "gemini" | string;
}

export interface TranslationResponse {
	translation: string;
	model: string;
	confidence?: number;
}
