<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Rruga e verifikimit të email-it që kërkon eventizmo i Registered
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return response()->json(['message' => 'Email-i u verifikua me sukses!']);
})->middleware(['signed'])->name('verification.verify');

// Rruga për të dërguar përsëri email-in e verifikimit (nëse duhet)
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return response()->json(['message' => 'Linku i verifikimit u dërgua përsëri!']);
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');