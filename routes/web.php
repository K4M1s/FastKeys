<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\TextController;
use Faker\Provider\ar_JO\Text;
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
Route::get('/game/{game}', [GameController::class, 'game'])->name('game');
Route::get('/game/{game}/text', [GameController::class, 'text'])->name('game/text');

Route::get('/result/{result}', [ResultController::class, 'index'])->name('result/index');

Route::middleware(['throttle:result'])->group(function () {
    Route::post('/result', [ResultController::class, 'store'])->name('result/store');
});


require __DIR__.'/auth.php';
