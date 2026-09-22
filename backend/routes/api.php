<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AiCodeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rruga kryesore ku do të dërgohen pyetjet (POST Method)
Route::post('/ai/process', [AiCodeController::class, 'processPrompt']);
