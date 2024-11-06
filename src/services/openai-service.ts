import type {
	AITranslationService,
	AIServiceConfig,
	AIServiceResponse,
} from "../types/ai-service";

export class OpenAITranslationService implements AITranslationService {
	private apiKey: string;
	private model: string;

	constructor(config: AIServiceConfig) {
		this.apiKey = config.apiKey;
		this.model = config.model || "gpt-4";
	}

	async translate(
		text: string,
		targetLang: string,
	): Promise<AIServiceResponse> {
		try {
			const response = await fetch(
				"https://api.openai.com/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.apiKey}`,
					},
					body: JSON.stringify({
						model: this.model,
						messages: [
							{
								role: "system",
								content: `Translate the following text to ${targetLang}.`,
							},
							{
								role: "user",
								content: text,
							},
						],
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`OpenAI API error: ${response.statusText}`);
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const data: any = await response.json();
			return {
				text: data.choices[0].message.content,
				confidence: 0.95, // OpenAI doesn't provide confidence scores
			};
		} catch (error) {
			console.error("OpenAI translation error:", error);
			throw new Error("OpenAI translation failed");
		}
	}

	isSupported(targetLang: string): boolean {
		return true; // OpenAI supports all languages
	}
}
