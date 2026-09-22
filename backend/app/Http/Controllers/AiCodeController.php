<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CodePrompt;
use Illuminate\Support\Facades\Validator;

class AiCodeController extends Controller
{
    /**
     * Proceson kërkesat e AI dhe kthen përgjigje JSON.
     */
    public function processPrompt(Request $request)
    {
        // 1. Validimi i të dhënave të hyra (Input Validation)
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
        $aiResponse = "";

        // 2. Simulimi i Logjikës së AI bazuar në llojin e kërkesës
        if ($actionType === 'generate') {
            $aiResponse = "// AI Kodi i Gjeneruar nga Blendi AI v1.2:\n\nfunction llogaritPagesen(ditet, tarifa) {\n    return ditet * tarifa;\n}";
        } elseif ($actionType === 'explain') {
            $aiResponse = "// AI Shpjegimi rresht për rresht:\n1. Ky funksion pranon dy variabla hyrëse.\n2. Multiplikon ditët me tarifën e caktuar.\n3. Kthen vlerën totale.";
        } elseif ($actionType === 'security') {
            $aiResponse = "// Raporti i Sigurisë Kibernetike:\n[STATUS] Skanimi i kodit u krye.\n[REKOMANDIM] Nuk u gjetën rreziqe. Kodi është i pastër.";
        }

        // 3. Ruajtja e historikut në databazën MySQL (ai_code_helper_db)
        $promptLog = new CodePrompt();
        $promptLog->action_type   = $actionType;
        $promptLog->user_input    = $userInput;
        $promptLog->ai_response   = $aiResponse;
        $promptLog->language_used = $language;
        $promptLog->save();

        // 4. JSON Response (Përgjigjja standarde për Postman dhe Frontend)
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
