<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Exception;

class AuthController extends Controller
{
    /**
     * Regjistrimi i një përdoruesi të ri.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password) // Enkriptimi i sigurt i fjalëkalimit (Bcrypt)
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success'      => true,
                'message'      => 'Përdoruesi u regjistrua me sukses!',
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => $user
            ], 201);

        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gabim gjatë regjistrimit.'], 500);
        }
    }

    /**
     * Identifikimi (Login) i përdoruesit ekzistues.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|string|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Mbrojtja nga sulmet kibernetike: Kontrolli i fjalëkalimit të enkriptuar
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kredencialet e dhëna nuk janë të sakta.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success'      => true,
            'message'      => 'Mirëseerdhët përsëri!',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user
        ], 200);
    }

    /**
     * Çkyçja (Logout) dhe fshirja e Token-it.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'U çkyçët me sukses!'
        ], 200);
    }
}
