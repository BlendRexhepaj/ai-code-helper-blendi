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
     * Proceson kërkesat e AI dhe i ruan në DB duke i lidhur me përdoruesin e loguar.
     */
    public function processPrompt(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'action_type'   => 'required|in:generate,explain,security',
            'user_input'    => 'required|string|min:3',
            'language_used' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $actionType = $request->input('action_type');
        $userInput  = $request->input('user_input');
        $language   = $request->input('language_used', 'javascript');

        $systemInstruction = "You are an expert AI Code Helper named Blendi AI. ";
        if ($actionType === 'generate') {
            $systemInstruction .= "Generate efficient and secure clean code in {$language}. Return only code.";
        } elseif ($actionType === 'explain') {
            $systemInstruction .= "Explain the provided {$language} code line by line clearly in Albanian.";
        } elseif ($actionType === 'security') {
            $systemInstruction .= "Audit the following {$language} code for security flaws in Albanian.";
        }

        try {
            if (empty(env('OPENAI_API_KEY'))) {
                throw new Exception("OpenAI Key missing.");
            }

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
            // Përgjigje fallback për mënyrën testuese (kur OpenAI nuk ka kredite)
            $aiResponse = "// [Mënyra Testuese - Error Kreditesh OpenAI]\n// Kjo përgjigje u ruajt në databazë si historik për llogarinë tuaj:\n// Kërkesa: " . $userInput;
        }

        // Ruajtja në Databazë (Lidhja me përdoruesin e vërtetë të loguar)
        $promptLog = new CodePrompt();
        $promptLog->user_id       = auth()->id(); // ID-ja merret në mënyrë të sigurt nga Sanctum Token
        $promptLog->action_type   = $actionType;
        $promptLog->user_input    = $userInput;
        $promptLog->ai_response   = $aiResponse;
        $promptLog->language_used = $language;
        $promptLog->save();

        return response()->json([
            'success' => true,
            'status'  => 'sukses',
            'author'  => 'Blendi',
            'data'    => $promptLog
        ], 200);
    }

    /**
     * Merr historikun e pyetjeve nga databaza VETËM për përdoruesin e loguar.
     */
    public function getHistory()
    {
        // Merr 10 pyetjet e fundit që i përkasin ekzaktësisht këtij përdoruesi
        $history = CodePrompt::where('user_id', auth()->id())
                             ->orderBy('created_at', 'desc')
                             ->take(10)
                             ->get();

        return response()->json([
            'success' => true,
            'author'  => 'Blendi',
            'history' => $history
        ], 200);
    }
}
