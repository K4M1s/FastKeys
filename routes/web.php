<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\TextController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [PageController::class, 'index'])->name('index');

Route::get('/game', [GameController::class, 'index'])->name('game/index');
Route::get('/game/loremipsum', [GameController::class, 'loremipsum'])->name('game/loremipsum');

Route::get('/text/{type}/{length}', [TextController::class, 'text']);