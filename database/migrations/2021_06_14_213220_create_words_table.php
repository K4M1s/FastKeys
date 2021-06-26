<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('words', function (Blueprint $table) {
            $table->id();
            $table->string('word', 64);
        });

        DB::table('words')->insert($this->getWordsFromFile());
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('words');
    }

    private function getWordsFromFile(): Array {
        $words = [];
        $file = fopen(base_path()."/resources/txt/top1000words.txt", "r") or die("Unable to open file!");
        while(!feof($file)) {
            array_push($words, ['word' => trim(fgets($file))]);
        }
        fclose($file);

        return $words;
    }
}
