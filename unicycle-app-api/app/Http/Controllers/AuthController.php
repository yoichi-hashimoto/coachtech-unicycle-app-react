<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController
{
    public function login(Request $request){
    $credentials = $request->validate([
        'login_id' => ['required','string'],
        'password'=>['required','string'],
    ]);

    if(!Auth::attempt($credentials)){
        return response()->json([
            'message'=>'ログインに失敗しました',
        ],401);
    }

    $request ->session()->regenerate();
    return response()->json([
    'message'=>'ログインしました',
    'data' => new UserResource($request->user()),
    ]);
    }

    public function logout(Request $request){
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'data' => null,
            'message'=>'ログアウトしました',
        ]);
    }

}
