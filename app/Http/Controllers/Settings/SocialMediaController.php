<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SocialMedia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SocialMediaController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/Media', [
            'socialMedias' => auth()->user()->socialMedias,
        ]);
    }

    public function store(Request $request)
    {
        $platformDomains = [
            'github' => ['github.com'],
            'twitter' => ['twitter.com', 'x.com'],
            'linkedin' => ['linkedin.com', 'www.linkedin.com'],
            'facebook' => ['facebook.com', 'www.facebook.com'],
            'instagram' => ['instagram.com', 'www.instagram.com'],
            'youtube' => ['youtube.com', 'www.youtube.com'],
        ];

        $request->validate([
            'platform' => [
                'required',
                'in:github,twitter,linkedin,facebook,instagram,youtube,other',
                Rule::unique('social_media')->where(fn ($query) => $query->where('user_id', auth()->id())
                    ->where('platform', $request->platform)),
            ],
            'url' => [
                'required',
                'url',
                function ($attribute, $value, $fail) use ($request, $platformDomains): void {
                    if ($request->platform !== 'other') {
                        $valid = false;
                        foreach ($platformDomains[$request->platform] as $domain) {
                            if (str_contains($value, $domain)) {
                                $valid = true;

                                break;
                            }
                        }
                        if (! $valid) {
                            $fail("L'URL doit appartenir à l'un de ces domaines: ".implode(', ', $platformDomains[$request->platform]));
                        }
                    }
                },
            ],
            'display_name' => 'nullable|string|max:255',
        ], [
            'platform.unique' => 'Vous avez déjà ajouté ce réseau social',
        ]);

        auth()->user()->socialMedias()->create($request->only([
            'platform', 'url', 'display_name',
        ]));

        return back()->with('success', 'Réseau social ajouté avec succès');
    }

    public function update(Request $request, SocialMedia $socialMedia)
    {
        $platformDomains = [
            'github' => ['github.com'],
            'twitter' => ['twitter.com', 'x.com'],
            'linkedin' => ['linkedin.com', 'www.linkedin.com'],
            'facebook' => ['facebook.com', 'www.facebook.com'],
            'instagram' => ['instagram.com', 'www.instagram.com'],
            'youtube' => ['youtube.com', 'www.youtube.com'],
        ];

        $request->validate([
            'platform' => [
                'required',
                'in:github,twitter,linkedin,facebook,instagram,youtube,other',
                Rule::unique('social_media')->where(fn ($query) => $query->where('user_id', auth()->id())
                    ->where('platform', $request->platform)
                    ->where('id', '!=', $socialMedia->id)),
            ],
            'url' => [
                'required',
                'url',
                function ($attribute, $value, $fail) use ($request, $platformDomains): void {
                    if ($request->platform !== 'other') {
                        $valid = false;
                        foreach ($platformDomains[$request->platform] as $domain) {
                            if (str_contains($value, $domain)) {
                                $valid = true;

                                break;
                            }
                        }
                        if (! $valid) {
                            $fail("L'URL doit appartenir à l'un de ces domaines: ".implode(', ', $platformDomains[$request->platform]));
                        }
                    }
                },
            ],
            'display_name' => 'nullable|string|max:255',
        ]);

        $socialMedia->update($request->only(['platform', 'url', 'display_name']));

        return back()->with('success', 'Réseau social mis à jour avec succès');
    }

    public function destroy(SocialMedia $socialMedia)
    {
        $this->authorize('delete', $socialMedia);
        $socialMedia->delete();

        return back()->with('success', 'Media deleted successfully');
    }
}
