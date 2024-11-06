export interface AIServiceConfig {
	apiKey: string;
	model?: string;
	maxTokens?: number;
}

export interface AIServiceResponse {
	text: string;
	confidence?: number;
}

export interface AITranslationService {
	translate(text: string, targetLang: string): Promise<AIServiceResponse>;
	isSupported(targetLang: string): boolean;
}
