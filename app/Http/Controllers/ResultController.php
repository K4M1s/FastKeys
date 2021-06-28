<?php

namespace App\Http\Controllers;

use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResultController extends Controller
{
    public function index(Result $result)
    {
        return response()->json($result->user);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'speed' => 'numeric|required',
            'accuracy' => 'numeric|required',
            'gamemode' => 'string|required',
            'gamedata' => 'json|required'
        ]);

        $result = new Result();
        $result->user_id = Auth::check() ? Auth::user()->id : null;
        $result->speed = $data['speed'];
        $result->accuracy = $data['speed'];
        $result->game = $data['gamemode'];
        $result->save();

        return response()->json($result, 200);
    }
}
