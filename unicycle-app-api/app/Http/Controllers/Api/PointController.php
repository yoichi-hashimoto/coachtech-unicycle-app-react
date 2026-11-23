<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Point;
use Illuminate\Support\Facades\DB;

class PointController
{
    public function index(){
        $points = Point::select('user_id',DB::raw('SUM(points) as total_points'))
        ->groupBy('user_id')
        ->get();

        return response()->json(['data' => $points]);
    }


}
