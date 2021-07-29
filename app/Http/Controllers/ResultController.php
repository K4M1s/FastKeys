<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Models\ResultData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $game = $request->get('game', null);

        $results = Result::latest()->take(10)->with('user');
        if ($game !== null) {
            $results = $results->where('game', '=', $game);
        }
        return $results->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'gamemode' => 'string|required',
            'originalText' => 'string|required',
            'speed' => 'numeric|required',
            'accuracy' => 'numeric|required',
            'typos' => 'numeric|required',
            'words' => 'json|required',
            'startTime' => 'numeric|required',
            'endTime' => 'numeric|required',
        ]);

        $textHash = sha1($data['originalText']);
        if ($textHash !== request()->cookie('textHash')) {
            return response('Invalid text', 400);
        }

        $result = new Result();
        $result->user_id = Auth::check() ? Auth::user()->id : null;
        $result->speed = $data['speed'];
        $result->accuracy = $data['accuracy'];
        $result->typos = $data['typos'];
        $result->game = $data['gamemode'];
        
        if($result->save() === false) {
            return response()->status(500);
        }

        $resultData = new ResultData();
        $resultData->result_id = $result->id;
        $resultData->data = $data['words'];

        if($resultData->save() === false) {
            $result->delete();
            return response()->status(500);
        }

        return response()->json($result, 200);
    }
}
