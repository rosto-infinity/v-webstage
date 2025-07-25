<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tableau de présence</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin-bottom: 10px;
        }
        .header p {
            margin: 5px 0;
            font-size: 14px;
            color: #555;
        }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <!-- En-tête centré -->
    <div class="header">
        <h1>Tableau de présence de : {{ $user->name }}</h1>
        <p>Généré le : {{ $date }}</p>
        
        <p>E-mail : {{ $user->email }}</p>
        <p>Nombre de jours de stage : {{ $totalDays }} jours</p>
        {{-- <p>Nombre de Semaine effectuées en stage : {{ $weekNumber }}</p>
        <p>Nombre de Mois en stage : {{ $monthName }}</p> --}}
        <p>Nombre d'heures de retard : {{ $totalLateHours }} heures</p>
        <p>Nombre de jours d'absence : {{ $totalAbsenceDays }} jours</p>
    </div>

    <!-- Tableau des présences -->
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Arrivée</th>
                <th>Départ</th>
                <th>Retard</th>
                <th>Statut</th>
                <th>Motif</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($presences as $presence)
                <tr>
                    <td>{{ $presence->id }}</td>
                    <td>{{ $presence->date }}</td>
                    <td>{{ $presence->user ? $presence->user->name : '-' }}</td>
                    <td>{{ $presence->user ? $presence->user->email : '-' }}</td>
                    <td>{{ $presence->arrival_time ?? '-' }}</td>
                    <td>{{ $presence->departure_time ?? '-' }}</td>
                    <td>{{ $presence->late_minutes ? $presence->late_minutes.' min' : '-' }}</td>
                    <td>
                        @if(is_null($presence->arrival_time) && is_null($presence->departure_time))
                            Absent
                        @elseif($presence->late_minutes > 0)
                            Retard
                        @else
                            Présent
                        @endif
                    </td>
                    <td>{{ $presence->absenceReason ? $presence->absenceReason->name : '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
