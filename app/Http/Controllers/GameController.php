<?php

namespace App\Http\Controllers;

use joshtronic\LoremIpsum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cookie;

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
        $response = ['error' => false];
        Cookie::forget('textHash');
        switch($game) {
            case "loremipsum":
                $lorem = new LoremIpsum();
                $response['text'] = $lorem->words(40);

                break;
            case "speedtest":
                $top200Words = DB::table('words')->select(['word'])->limit(200)->get();
                $words = [];
                for ($i=0; $i<400; $i++) {
                    array_push($words, $top200Words[rand(0, $top200Words->count()-1)]->word);
                }
                $response['text'] = implode(' ', $words);

                break;
            default:
                abort(404);
        }
        return response()->json($response)->withCookie(cookie('textHash', sha1($response['text']), 2));
    }

    public function index() {
        return view('gamemodes.index');
    }

    public function loremIpsum() {
        return view('gamemodes.loremipsum');
    }

    public function speedtest() {
        return view('gamemodes.speedtest');
    }
}
