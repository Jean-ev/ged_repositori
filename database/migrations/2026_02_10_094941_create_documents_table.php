<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nom affiché
            $table->string('original_name'); // Nom original du fichier
            $table->string('path'); // Chemin de stockage
            $table->string('type'); // pdf, image, spreadsheet, document, other
            $table->string('mime_type');
            $table->bigInteger('size'); // Taille en bytes
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('folder_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_favorite')->default(false);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Pour la corbeille
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};