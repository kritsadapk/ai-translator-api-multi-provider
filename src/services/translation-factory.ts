import type { AITranslationService } from "../types/ai-service";
import { OpenAITranslationService } from "./openai-service";
import { GeminiTranslationService } from "./gemini-service";
import { config } from "../config";

export class TranslationServiceFactory {
	private static instances: Map<string, AITranslationService> = new Map();

	private constructor() {} // prevent instances from being created

	static getService(modelType: string): AITranslationService {
		if (TranslationServiceFactory.instances.has(modelType)) {
			return (
				TranslationServiceFactory.instances.get(modelType) ??
				new OpenAITranslationService({
					apiKey: config.OPENAI_API_KEY ?? "",
					model: "gpt-4",
				})
			);
		}

		let service: AITranslationService;

		switch (modelType.toLowerCase()) {
			case "openai":
				service = new OpenAITranslationService({
					apiKey: config.OPENAI_API_KEY ?? "",
					model: "gpt-4",
				});
				break;

			case "gemini":
				service = new GeminiTranslationService({
					apiKey: config.GEMINI_API_KEY ?? "",
				});
				break;

			default:
				throw new Error(`Unsupported AI model type: ${modelType}`);
		}

		TranslationServiceFactory.instances.set(modelType, service);
		return service;
	}
}
