<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('email'); // admin, user
            $table->string('service')->nullable()->after('role'); // Marketing, RH, Comptabilité
            $table->string('avatar')->nullable()->after('service');
            $table->string('location')->default('Siège')->after('avatar');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'service', 'avatar', 'location']);
        });
    }
};