<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class GetUsersIndexDataAction
{
    public function execute(): array
    {
        /** @var LengthAwarePaginator $paginatedUsers */
        $paginatedUsers = User::latest()->paginate(7);

        return [
            'users' => $paginatedUsers,
            'totalUsers' => User::count(),
        ];
    }
}
