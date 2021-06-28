<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Models\ResultData;
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
        
        if($result->save() === false) {
            return response()->status(500);
        }

        $resultData = new ResultData();
        $resultData->result_id = $result->id;
        $resultData->data = $data['gamedata'];

        if($resultData->save() === false) {
            $result->delete();
            return response()->status(500);
        }

        return response()->json($result, 200);
    }
}
