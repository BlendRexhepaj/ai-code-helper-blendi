<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AiCodeController;
use App\Http\Controllers\AuthController;

// Trajtimi automatik i preflight OPTIONS për CORS në çdo kërkesë API
Route::options('{any}', function () {
    return response()->json([], 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');

// Rrugët e Autentifikimit (Regjistrimi dhe Login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rrugët e mbrojtura me Sanctum (Kërkojnë token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);
});

// Rrugët e aplikacionit (AI)
Route::post('/ai/process', [AiCodeController::class, 'processPrompt']);
Route::get('/ai/history', [AiCodeController::class, 'getHistory']);
Route::delete('/ai/history/{id}', [AiCodeController::class, 'deleteHistory']);