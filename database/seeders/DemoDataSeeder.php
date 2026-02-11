<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Folder;
use App\Models\Document;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un utilisateur admin
        $admin = User::create([
            'name' => 'Sophie Martin',
            'email' => 'admin@docflow.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'service' => 'Marketing',
            'location' => 'Siège',
        ]);

        // Créer un utilisateur normal
        $user = User::create([
            'name' => 'Thomas Dubois',
            'email' => 'user@docflow.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'service' => 'Comptabilité',
            'location' => 'Siège',
        ]);

        // Créer des dossiers
        $folders = [
            [
                'name' => 'Contrats 2024',
                'workspace' => 'Juridique',
                'color' => '#2563EB',
                'is_favorite' => true,
                'user_id' => $admin->id,
            ],
            [
                'name' => 'Factures 2024',
                'workspace' => 'Comptabilité',
                'color' => '#F59E0B',
                'is_favorite' => true,
                'user_id' => $admin->id,
            ],
            [
                'name' => 'Ressources Marketing',
                'workspace' => 'Marketing',
                'color' => '#10B981',
                'is_favorite' => true,
                'user_id' => $admin->id,
            ],
            [
                'name' => 'Projets en cours',
                'workspace' => 'Marketing',
                'color' => '#8B5CF6',
                'is_favorite' => false,
                'user_id' => $admin->id,
            ],
            [
                'name' => 'Projet Alpha',
                'workspace' => null,
                'color' => '#2563EB',
                'is_favorite' => false,
                'user_id' => $user->id,
            ],
            [
                'name' => 'Design Assets',
                'workspace' => null,
                'color' => '#EC4899',
                'is_favorite' => false,
                'user_id' => $user->id,
            ],
        ];

        foreach ($folders as $folderData) {
            Folder::create($folderData);
        }

        // Créer des documents fictifs
        $documents = [
            [
                'name' => 'Cahier des charges V2',
                'original_name' => 'Cahier_des_charges_V2.pdf',
                'path' => 'documents/demo.pdf',
                'type' => 'pdf',
                'mime_type' => 'application/pdf',
                'size' => 2400000, // 2.4 MB
                'user_id' => $admin->id,
                'folder_id' => 1,
                'status' => 'approved',
            ],
            [
                'name' => 'Maquette Site Web',
                'original_name' => 'Maquette_Site_Web.png',
                'path' => 'documents/demo.png',
                'type' => 'image',
                'mime_type' => 'image/png',
                'size' => 5800000, // 5.8 MB
                'user_id' => $user->id,
                'folder_id' => null,
                'status' => 'approved',
            ],
            [
                'name' => 'Budget Prévisionnel 2025',
                'original_name' => 'Budget_Prévisionnel_2025.xlsx',
                'path' => 'documents/demo.xlsx',
                'type' => 'spreadsheet',
                'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'size' => 850000, // 850 KB
                'user_id' => $user->id,
                'folder_id' => 2,
                'status' => 'pending',
            ],
            [
                'name' => 'Compte Rendu Réunion',
                'original_name' => 'Compte_Rendu_Reunion.docx',
                'path' => 'documents/demo.docx',
                'type' => 'document',
                'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'size' => 1200000, // 1.2 MB
                'user_id' => $admin->id,
                'folder_id' => 3,
                'status' => 'approved',
            ],
            [
                'name' => 'Contrat Prestation Signé',
                'original_name' => 'Contrat_Prestation_Signé.pdf',
                'path' => 'documents/demo.pdf',
                'type' => 'pdf',
                'mime_type' => 'application/pdf',
                'size' => 3100000, // 3.1 MB
                'user_id' => $admin->id,
                'folder_id' => 1,
                'status' => 'approved',
            ],
            [
                'name' => 'Proposition Commerciale V2',
                'original_name' => 'Proposition_Commerciale_V2.pdf',
                'path' => 'documents/demo.pdf',
                'type' => 'pdf',
                'mime_type' => 'application/pdf',
                'size' => 2100000, // 2.1 MB
                'user_id' => $admin->id,
                'folder_id' => null,
                'status' => 'approved',
                'is_favorite' => true,
            ],
        ];

        foreach ($documents as $docData) {
            Document::create($docData);
        }

        $this->command->info('✅ Données de démonstration créées avec succès !');
        $this->command->info('📧 Email admin: admin@docflow.com');
        $this->command->info('📧 Email user: user@docflow.com');
        $this->command->info('🔑 Mot de passe: password');
    }
}