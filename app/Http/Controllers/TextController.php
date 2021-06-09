<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use joshtronic\LoremIpsum;

class TextController extends Controller
{
    private $availableTypes = ['lorem'];

    public function text($type, $length)
    {
        if (!in_array($type, $this->availableTypes)) {
            return response()->json(['error' => true, 'msg' => 'Unknow text type'], 400);
        }

        if ($length < 1 || $length > 400) {
            return response()->json(['error' => true, 'msg' => 'Length may be between 1 and 400'], 400);
        }

        $data = ['error' => false, 'text' => ''];

        switch($type) {
            case "lorem": 
                $lorem = new LoremIpsum();
                $data['text'] = $lorem->words($length);
                break;
        }
        
        return response()->json($data);
    }
}
