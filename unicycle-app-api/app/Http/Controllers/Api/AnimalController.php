<?php

namespace App\Http\Controllers\Api;

use App\Models\Animal;

class AnimalController extends Controller
{
        public function index()
    {
        return response()->json(['data' => Animal::all()]);
    }
}
