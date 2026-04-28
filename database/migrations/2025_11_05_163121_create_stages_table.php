<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('titre');
            $table->string('url_github')->nullable();
            $table->json('images'); // Stockera un tableau d'URLs ou de chemins
            $table->enum('diplome', [
                'CAP',
                'BEP',
                'BAC',
                'BAC_PRO',
                'BTS',
                'DUT',
                'LICENCE',
                'LICENCE_PRO',
                'DQP',
                'CQP',
                'DEUST',
                'AUTRE',
            ]);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stages');
    }
};
