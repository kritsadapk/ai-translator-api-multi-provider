import { serve } from "bun";
import { config } from "./config";
import { rateLimit } from "./middleware/rateLimit";
import { TranslationServiceFactory } from "./services/translation-factory";
import type {
	TranslationRequest,
	TranslationResponse,
} from "./types/translation";

const server = serve({
	port: config.PORT,
	async fetch(req) {
		const headers = new Headers({
			"Access-Control-Allow-Origin": config.FRONTEND_URL,
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Max-Age": "86400",
		});

		if (req.method === "OPTIONS") {
			return new Response(null, { headers });
		}

		if (!rateLimit(req)) {
			return new Response(JSON.stringify({ error: "Too many requests" }), {
				status: 429,
				headers,
			});
		}

		if (req.method === "POST" && req.url.endsWith("/api/translate")) {
			try {
				const body = (await req.json()) as TranslationRequest;

				// Validation
				if (!body.text || !body.targetLang) {
					return new Response(
						JSON.stringify({ error: "Missing required fields" }),
						{ status: 400, headers },
					);
				}

				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				if (!config.ALLOWED_LANGUAGES.includes(body.targetLang as any)) {
					return new Response(
						JSON.stringify({ error: "Invalid target language" }),
						{ status: 400, headers },
					);
				}

				// Get translation service
				const modelType = body.modelType || config.DEFAULT_MODEL;
				const translationService =
					TranslationServiceFactory.getService(modelType);

				// Check language support
				if (!translationService.isSupported(body.targetLang)) {
					return new Response(
						JSON.stringify({
							error: "Language not supported by selected model",
						}),
						{ status: 400, headers },
					);
				}

				// Perform translation
				const result = await translationService.translate(
					body.text,
					body.targetLang,
				);

				const response: TranslationResponse = {
					translation: result.text,
					model: modelType,
					confidence: result.confidence,
				};

				return new Response(JSON.stringify(response), { headers });
			} catch (error) {
				console.error("Error handling request:", error);
				return new Response(
					JSON.stringify({ error: "Internal server error" }),
					{ status: 500, headers },
				);
			}
		}

		return new Response(JSON.stringify({ error: "Not found" }), {
			status: 404,
			headers,
		});
	},
});

console.log(`Server running at http://localhost:${config.PORT}`);
