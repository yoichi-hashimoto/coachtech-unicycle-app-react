<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Color;

class ColorController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Color::with('user')->get()]);
    }
}
