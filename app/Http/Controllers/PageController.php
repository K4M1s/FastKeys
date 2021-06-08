<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * Page controller class
 */
class PageController extends Controller
{

    /**
     * Public page.
     */
    public function index()
    {
        return view('index');
    }
}
