<?php

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
        Schema::table('stages', function (Blueprint $table) {
            $table->string('type_stage')->nullable()->after('diplome');
            $table->foreignId('year_training_id')->nullable()->after('type_stage')->constrained('year_trainings')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stages', function (Blueprint $table) {
            $table->dropForeign(['year_training_id']);
            $table->dropColumn(['year_training_id', 'type_stage']);
        });
    }
};
