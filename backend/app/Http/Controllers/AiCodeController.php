<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiCodeController extends Controller
{
    public function processPrompt(Request $request)
    {
        $prompt = $request->input('user_input') 
               ?? $request->input('prompt') 
               ?? $request->input('code') 
               ?? $request->input('text') 
               ?? $request->input('query') 
               ?? collect($request->all())->first();

        if (!$prompt || empty(trim($prompt))) {
            return response()->json([
                'success' => false,
                'message' => 'The prompt field is empty.',
            ], 422)->header('Access-Control-Allow-Origin', '*')
                  ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                  ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $language = $request->input('language_used', $request->input('language', 'javascript'));
        $action = $request->input('action_type', $request->input('action', 'generate'));

        if (in_array($action, ['refactor', 'security'])) {
            $hasCodeIndicators = preg_match('/[\{\}\[\]\(\);\=]|function|class|def|const|let|var|echo|print|return|if|for|while|import|include|public|private/i', $prompt);
            
            if (!$hasCodeIndicators) {
                $errorMsg = "// ERROR: Refactor and Audit actions require actual source code, not plain text.\n"
                          . "// Please provide a valid code snippet to refactor or audit.";
                
                return response()->json([
                    'success' => true,
                    'data' => [
                        'id' => time(),
                        'action_type' => $action,
                        'user_input' => $prompt,
                        'ai_response' => $errorMsg,
                    ],
                    'result' => $errorMsg,
                    'response' => $errorMsg,
                    'code' => $errorMsg,
                ])->header('Access-Control-Allow-Origin', '*')
                  ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                  ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            }
        }

        // Zbulimi automatik i gjuhës nga vetë kodi
        $lowerPrompt = strtolower($prompt);
        $detectedLanguage = $language;

        if (str_contains($lowerPrompt, '<?php') || str_contains($lowerPrompt, 'namespace') || str_contains($lowerPrompt, 'public function') || str_contains($lowerPrompt, 'Illuminate')) {
            $detectedLanguage = 'php';
        } elseif (str_contains($lowerPrompt, 'import react') || str_contains($lowerPrompt, 'const ') || str_contains($lowerPrompt, 'console.log') || str_contains($lowerPrompt, '=>') || str_contains($lowerPrompt, 'useState')) {
            $detectedLanguage = 'javascript';
        } elseif (str_contains($lowerPrompt, 'def ') || str_contains($lowerPrompt, 'import os') || str_contains($lowerPrompt, 'print(')) {
            $detectedLanguage = 'python';
        } elseif (str_contains($lowerPrompt, '<html') || str_contains($lowerPrompt, '<div')) {
            $detectedLanguage = 'html';
        } elseif (str_contains($lowerPrompt, 'background-color') || str_contains($lowerPrompt, 'margin:') || str_contains($lowerPrompt, 'padding:')) {
            $detectedLanguage = 'css';
        }

        $systemPrompt = "You are an expert AI code assistant. Write clean, accurate code strictly in {$detectedLanguage}. Return ONLY raw executable code without markdown backticks.";

        if ($action === 'explain') {
            $systemPrompt = "You are a senior software engineer. Analyze and explain this {$detectedLanguage} code thoroughly, breaking down its logic, functions, and structure clearly in professional English.";
        } elseif ($action === 'refactor') {
            $systemPrompt = "Refactor, optimize, and clean up this {$detectedLanguage} code completely. Fix inefficiencies while preserving functionality. Return ONLY raw refactored code without markdown backticks.";
        } elseif ($action === 'security') {
            $systemPrompt = "Perform a deep security audit and bug analysis on this {$detectedLanguage} code. List vulnerabilities, logic errors, and security recommendations clearly in professional English.";
        }

        // Marrim historikun e mesazheve për të ruajtur kontekstin (memoren e bisedës)
        $historyMessages = $request->input('messages', []);
        $contextualPrompt = "";
        if (!empty($historyMessages)) {
            foreach ($historyMessages as $msg) {
                $role = ($msg['sender'] === 'user') ? 'User' : 'Assistant';
                $contextualPrompt .= "{$role}: {$msg['text']}\n";
            }
            $contextualPrompt .= "User: {$prompt}\nAssistant:";
        } else {
            $contextualPrompt = $prompt;
        }

        try {
            $response = Http::timeout(120)->post('http://127.0.0.1:11434/api/generate', [
                'model' => 'qwen2.5-coder:7b', // <--- Këtu u ndryshua në modelin 7B për logjikë dhe saktësi maksimale
                'prompt' => $contextualPrompt,
                'system' => $systemPrompt,
                'stream' => false,
                'options' => [
                    'temperature' => 0.1,
                    'num_ctx' => 4096,
                ],
            ]);

            if ($response->successful()) {
                $rawResult = $response->json('response');

                if ($action === 'generate' || $action === 'refactor') {
                    $cleanedResult = preg_replace('/^```[a-z]*\n/i', '', trim($rawResult));$cleanedResult = preg_replace('/```$/', '', trim($cleanedResult));
                    $finalOutput = trim($cleanedResult);
                } else {
                    $finalOutput = trim($rawResult);
                }

                return response()->json([
                    'success' => true,
                    'data' => [
                        'id' => time(),
                        'action_type' => $action,
                        'user_input' => $prompt,
                        'ai_response' => $finalOutput,
                    ],
                    'result' => $finalOutput,
                    'response' => $finalOutput,
                    'code' => $finalOutput,
                ])->header('Access-Control-Allow-Origin', '*')
                  ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                  ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            }

            return response()->json([
                'success' => false,
                'message' => 'Ollama did not respond successfully.',
            ], 500)->header('Access-Control-Allow-Origin', '*');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error communicating with Ollama: ' . $e->getMessage(),
            ], 500)->header('Access-Control-Allow-Origin', '*');
        }
    }

    public function getHistory()
    {
        return response()->json([
            'success' => true,
            'history' => [],
        ])->header('Access-Control-Allow-Origin', '*');
    }

    public function deleteHistory($id)
    {
        return response()->json([
            'success' => true,
            'message' => 'Successfully deleted',
        ])->header('Access-Control-Allow-Origin', '*');
    }
}