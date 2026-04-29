<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\YearTraining;
use App\Http\Requests\YearTrainingRequest;
use App\Actions\YearTraining\GetYearTrainingsIndexDataAction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class YearTrainingController extends Controller
{
    public function index(GetYearTrainingsIndexDataAction $action): Response
    {
        $data = $action->execute();
        $data['flash'] = [
            'success' => session('success'),
            'error' => session('error'),
        ];

        return Inertia::render('SuperAdmin/YearTraining/YearTrainingIndex', $data);
    }

    public function create(): Response
    {
        return Inertia::render('SuperAdmin/YearTraining/YearTrainingCreate');
    }

    public function store(YearTrainingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        YearTraining::create($validated);

        return redirect()->route('year-trainings.index')->with('success', 'Année de formation créée avec succès.');
    }

    public function edit(YearTraining $yearTraining): Response
    {
        return Inertia::render('SuperAdmin/YearTraining/YearTrainingEdit', [
            'yearTraining' => new \App\Http\Resources\YearTrainingResource($yearTraining),
        ]);
    }

    public function update(YearTrainingRequest $request, YearTraining $yearTraining): RedirectResponse
    {
        $validated = $request->validated();

        $yearTraining->update($validated);

        return redirect()->route('year-trainings.index')->with('success', 'Année de formation mise à jour avec succès.');
    }

    public function destroy(YearTraining $yearTraining): RedirectResponse
    {
        $yearTraining->delete();

        return redirect()->back()->with('success', 'Année de formation supprimée avec succès.');
    }
}
