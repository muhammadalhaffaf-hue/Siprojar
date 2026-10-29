<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kendala', function (Blueprint $table) {
            $table->enum('jenis_kendala', [
                'koneksi_putus',
                'bandwidth_kurang',
                'device',
                'topologi',
                'sosialisasi',
            ])->change();
        });

        $duplicateProfiles = DB::table('kendala')
            ->select('data_profiling_id')
            ->where('jenis_kendala', 'bandwidth_kurang')
            ->groupBy('data_profiling_id')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('data_profiling_id');

        foreach ($duplicateProfiles as $profilingId) {
            $duplicateIds = DB::table('kendala')
                ->where('data_profiling_id', $profilingId)
                ->where('jenis_kendala', 'bandwidth_kurang')
                ->orderBy('id')
                ->pluck('id');

            DB::table('kendala')
                ->whereIn('id', $duplicateIds->slice(1))
                ->update(['jenis_kendala' => 'koneksi_putus']);
        }
    }

    public function down(): void
    {
        DB::table('kendala')
            ->where('jenis_kendala', 'koneksi_putus')
            ->update(['jenis_kendala' => 'bandwidth_kurang']);

        Schema::table('kendala', function (Blueprint $table) {
            $table->enum('jenis_kendala', [
                'bandwidth_kurang',
                'device',
                'topologi',
                'sosialisasi',
            ])->change();
        });
    }
};
