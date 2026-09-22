<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('code_prompts', function (Blueprint $table) {
            $table->id();
            $table->string('action_type'); // prompt, explain, security_check
            $table->text('user_input');
            $table->text('ai_response')->nullable();
            $table->string('language_used')->default('javascript');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('code_prompts');
    }
};