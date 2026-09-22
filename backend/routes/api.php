<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AiCodeController;
use App\Http\Controllers\AuthController;

/* Rrugët Publike (Pa Login) */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/* Rrugët e Mbrojtura (Kërkojnë Bearer Token të vlefshëm) */
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/ai/process', [AiCodeController::class, 'processPrompt']);
    Route::get('/ai/history', [AiCodeController::class, 'getHistory']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
