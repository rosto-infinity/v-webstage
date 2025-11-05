<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Présences - {{ $user->name }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.6;
        }

        .container {
            padding: 20px;
        }

        /* En-tête */
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 15px;
        }

        .header h1 {
            color: #1E40AF;
            font-size: 24px;
            margin-bottom: 5px;
        }

        .header .subtitle {
            color: #666;
            font-size: 12px;
        }

        .header .period {
            color: #059669;
            font-size: 13px;
            font-weight: bold;
            margin-top: 5px;
        }

        /* Info utilisateur */
        .user-info {
            background: #F3F4F6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #3B82F6;
        }

        .user-info h2 {
            color: #1F2937;
            font-size: 16px;
            margin-bottom: 10px;
        }

        .user-details {
            display: table;
            width: 100%;
        }

        .user-detail-row {
            display: table-row;
        }

        .user-detail-label {
            display: table-cell;
            padding: 5px 10px;
            font-weight: bold;
            color: #4B5563;
            width: 25%;
        }

        .user-detail-value {
            display: table-cell;
            padding: 5px 10px;
            color: #1F2937;
        }

        /* Statistiques */
        .stats-container {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }

        .stats-row {
            display: table-row;
        }

        .stat-box {
            display: table-cell;
            background: white;
            border: 2px solid #E5E7EB;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            margin: 0 5px;
            width: 20%;
        }

        .stat-box:first-child {
            margin-left: 0;
        }

        .stat-box:last-child {
            margin-right: 0;
        }

        .stat-value {
            font-size: 24px;
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 10px;
            color: #6B7280;
            text-transform: uppercase;
        }

        .stat-present .stat-value { color: #059669; }
        .stat-absent .stat-value { color: #DC2626; }
        .stat-late .stat-value { color: #F59E0B; }
        .stat-rate .stat-value { color: #3B82F6; }
        .stat-avg .stat-value { color: #8B5CF6; }

        /* Tableau */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        thead {
            background: #1E40AF;
            color: white;
        }

        th {
            padding: 10px 8px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        tbody tr {
            border-bottom: 1px solid #E5E7EB;
        }

        tbody tr:nth-child(even) {
            background: #F9FAFB;
        }

        tbody tr:hover {
            background: #F3F4F6;
        }

        td {
            padding: 8px;
            font-size: 10px;
        }

        /* Badges de statut */
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: bold;
            text-align: center;
        }

        .badge-present {
            background: #D1FAE5;
            color: #065F46;
        }

        .badge-absent {
            background: #FEE2E2;
            color: #991B1B;
        }

        .badge-late {
            background: #FEF3C7;
            color: #92400E;
        }

        /* Footer */
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            font-size: 9px;
            color: #9CA3AF;
        }

        /* Section vide */
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #9CA3AF;
        }

        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- En-tête -->
        <div class="header">
            <h1>Rapport de Présences</h1>
            <p class="subtitle">Généré le : {{ $date }}</p>
            @isset($period)
                <p class="period">{{ $period }}</p>
            @endisset
        </div>

        <!-- Informations utilisateur -->
        <div class="user-info">
            <h2>👤 Informations de l'utilisateur</h2>
            <div class="user-details">
                <div class="user-detail-row">
                    <div class="user-detail-label">Nom :</div>
                    <div class="user-detail-value">{{ $user->name }}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Email :</div>
                    <div class="user-detail-value">{{ $user->email }}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Matricule :</div>
                    <div class="user-detail-value">{{ $user->id }}</div>
                </div>
            </div>
        </div>

        <!-- Statistiques -->
        <div class="stats-container">
            <div class="stats-row">
                <div class="stat-box stat-present">
                    <span class="stat-value">{{ $stats['presents'] }}</span>
                    <span class="stat-label">Présent(s)</span>
                </div>
                <div class="stat-box stat-absent">
                    <span class="stat-value">{{ $stats['absents'] }}</span>
                    <span class="stat-label">Absent(s)</span>
                </div>
                <div class="stat-box stat-late">
                    <span class="stat-value">{{ $stats['lates'] }}</span>
                    <span class="stat-label">Retard(s)</span>
                </div>
                <div class="stat-box stat-rate">
                    <span class="stat-value">{{ $stats['presence_rate'] }}%</span>
                    <span class="stat-label">Taux présence</span>
                </div>
                <div class="stat-box stat-avg">
                    <span class="stat-value">{{ $stats['average_late_minutes'] }}m</span>
                    <span class="stat-label">Retard moyen</span>
                </div>
            </div>
        </div>

        <!-- Tableau des présences -->
        @if($presences->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th style="width: 8%;">Date</th>
                        <th style="width: 10%;">Arrivée</th>
                        <th style="width: 10%;">Départ</th>
                        <th style="width: 8%;">Retard</th>
                        <th style="width: 12%;">Statut</th>
                        <th style="width: 52%;">Motif d'absence</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($presences as $presence)
                        <tr>
                            <td>{{ \Carbon\Carbon::parse($presence->date)->format('d/m/Y') }}</td>
                            <td>{{ $presence->arrival_time ?? '-' }}</td>
                            <td>{{ $presence->departure_time ?? '-' }}</td>
                            <td>
                                @if($presence->late_minutes > 0)
                                    <strong style="color: #F59E0B;">{{ $presence->late_minutes }} min</strong>
                                @else
                                    -
                                @endif
                            </td>
                            <td>
                                @if(is_null($presence->arrival_time) && is_null($presence->departure_time))
                                    <span class="badge badge-absent">Absent</span>
                                @elseif($presence->late_minutes > 0)
                                    <span class="badge badge-late">Retard</span>
                                @else
                                    <span class="badge badge-present">Présent</span>
                                @endif
                            </td>
                            <td>
                                {{ $presence->absenceReason ? $presence->absenceReason->name : '-' }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Total -->
            <div style="margin-top: 20px; padding: 15px; background: #F3F4F6; border-radius: 8px; text-align: center;">
                <strong style="color: #1F2937; font-size: 12px;">
                    📊 Total des enregistrements : {{ $presences->count() }}
                </strong>
            </div>
        @else
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p><strong>Aucune présence enregistrée</strong></p>
                <p>Aucune donnée disponible pour cette période.</p>
            </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p><strong>{{ config('app.name', 'Application') }}</strong></p>
            <p>Document confidentiel - Usage interne uniquement</p>
            <p>Généré automatiquement le {{ $date }}</p>
        </div>
    </div>
</body>
</html>