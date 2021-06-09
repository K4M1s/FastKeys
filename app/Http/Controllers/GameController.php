<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index() {
        return view('gamemodes.index');
    }

    public function loremIpsum() {
        return view('gamemodes.loremipsum');
    }
}
