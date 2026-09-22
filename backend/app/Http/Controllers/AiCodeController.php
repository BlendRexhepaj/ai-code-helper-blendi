<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CodePrompt;
use Illuminate\Support\Facades\Validator;
use OpenAI\Laravel\Facades\OpenAI;
use Exception;

class AiCodeController extends Controller
{
    /**
     * Proceson kërkesat e AI duke u lidhur realisht me OpenAI API.
     */
    public function processPrompt(Request $request)
    {
        // 1. Validimi i të dhënave të hyra
        $validator = Validator::make($request->all(), [
            'action_type'   => 'required|in:generate,explain,security',
            'user_input'    => 'required|string|min:3',
            'language_used' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'status'  => 'gabim_validimi',
                'errors'  => $validator->errors()
            ], 422);
        }

        $actionType = $request->input('action_type');
        $userInput  = $request->input('user_input');
        $language   = $request->input('language_used', 'javascript');

        // Formatimi i Prompt-it në mënyrë që AI të kthejë vetëm kod ose shpjegim të pastër
        $systemInstruction = "You are an expert AI Code Helper named Blendi AI. ";
        if ($actionType === 'generate') {
            $systemInstruction .= "Generate efficient and secure clean code in {$language} based on the user's request. Return only the code inside code blocks.";
        } elseif ($actionType === 'explain') {
            $systemInstruction .= "Explain the provided {$language} code line by line clearly in Albanian language.";
        } elseif ($actionType === 'security') {
            $systemInstruction .= "Audit the following {$language} code for cyber security vulnerabilities (OWASP Top 10). Provide findings and recommendations in Albanian language.";
        }

        // 2. ERROR HANDLING: Lidhja me OpenAI API përmes Try-Catch
        try {
            // Kontrolli nëse çelësi është plotësuar
            if (empty(env('OPENAI_API_KEY'))) {
                throw new Exception("Çelësi i OpenAI API nuk është konfiguruar te skedari .env!");
            }

            // Thirrja reale e modelit gpt-4o-mini
            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => $systemInstruction],
                    ['role' => 'user', 'content' => $userInput],
                ],
                'temperature' => 0.2,
            ]);

            $aiResponse = $response->choices->message->content;

        } catch (Exception $e) {
            // Error Handling: Nëse OpenAI dështon (psh. skadon çelësi, s'ka internet, etj.)
            return response()->json([
                'success' => false,
                'status'  => 'gabim_api_openai',
                'message' => 'Dështoi komunikimi me OpenAI API. Ju lutem kontrolloni konfigurimin.',
                'error_details' => $e->getMessage()
            ], 500);
        }

        // 3. Ruajtja e historikut të saktë në databazën MySQL
        $promptLog = new CodePrompt();
        $promptLog->action_type   = $actionType;
        $promptLog->user_input    = $userInput;
        $promptLog->ai_response   = $aiResponse;
        $promptLog->language_used = $language;
        $promptLog->save();

        // 4. JSON Response për Postman dhe Frontend
        return response()->json([
            'success'   => true,
            'status'    => 'sukses',
            'author'    => 'Blendi',
            'data'      => [
                'id'            => $promptLog->id,
                'action_type'   => $promptLog->action_type,
                'user_input'    => $promptLog->user_input,
                'ai_response'   => $promptLog->ai_response,
                'language_used' => $promptLog->language_used,
                'created_at'    => $promptLog->created_at->toIso8601String()
            ]
        ], 200);
    }
}
