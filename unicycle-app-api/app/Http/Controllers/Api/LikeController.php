<?php

namespace App\Http\Controllers\Api;

use App\Models\Challenge;
use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'challenge_id' => ['required', 'integer', 'exists:challenges,id'],
        ]);

        $challenge = Challenge::findOrFail($validated['challenge_id']);

        // Older clients still send user IDs. Derive both IDs on the server.
        Like::firstOrCreate([
            'challenge_id' => $challenge->id,
            'from_user_id' => $request->user()->id,
        ], [
            'user_id' => $challenge->user_id,
        ]);

        return response()->json(['data' => null]);
    }
}
