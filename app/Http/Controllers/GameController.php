<?php

namespace App\Http\Controllers;

use App\Models\Word;
use joshtronic\LoremIpsum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{

    public function game($game) {
        switch($game) {
            case "loremipsum":
                return $this->loremIpsum();
            case "speedtest":
                return $this->speedtest();;
        }
        abort(404);
    }

    public function text($game) {
        switch($game) {
            case "loremipsum":
                $response = ['error' => false];
                $lorem = new LoremIpsum();
                $response['text'] = $lorem->words(50);
                return response()->json($response);
            case "speedtest":
                $response = ['error' => false];
                $top200Words = DB::table('words')->select(['word'])->limit(200)->get();
                $words = [];
                for ($i=0; $i<200; $i++) {
                    array_push($words, $top200Words[rand(0, $top200Words->count()-1)]->word);
                }
                $response['text'] = implode(' ', $words);
                return response()->json($response);
        }
        abort(404);
    }

    public function index() {
        return view('gamemodes.index');
    }

    private function loremIpsum() {
        return view('gamemodes.loremipsum');
    }

    private function speedtest() {
        return view('gamemodes.speedtest');
    }
}
