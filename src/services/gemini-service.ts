import type {
	AITranslationService,
	AIServiceConfig,
	AIServiceResponse,
} from "../types/ai-service";

export class GeminiTranslationService implements AITranslationService {
	private apiKey: string;

	constructor(config: AIServiceConfig) {
		this.apiKey = config.apiKey;
	}

	async translate(
		text: string,
		targetLang: string,
	): Promise<AIServiceResponse> {
		try {
			const response = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						contents: [
							{
								parts: [
									{
										text: `Translate the following text to ${targetLang}: ${text}`,
									},
								],
							},
						],
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`Gemini API error: ${response.statusText}`);
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const data: any = await response.json();
			return {
				text: data.candidates[0].content.parts[0].text,
				confidence: data.candidates[0].safetyRatings[0].probability,
			};
		} catch (error) {
			console.error("Gemini translation error:", error);
			throw new Error("Gemini translation failed");
		}
	}

	isSupported(targetLang: string): boolean {
		// Add language support check if needed
		return true;
	}
}
