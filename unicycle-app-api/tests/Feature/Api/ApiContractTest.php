<?php

namespace Tests\Feature\Api;

use App\Models\Challenge;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ApiContractTest extends TestCase
{
    use RefreshDatabase;

    private function member(string $loginId): User
    {
        $avatar = DB::table('user_avatars')->insertGetId(['avatar_path' => '/avatar.webp']);

        $color = DB::table('colors')->insertGetId(['name' => 'Blue', 'color_path' => '/blue.webp']);

        return User::forceCreate([
            'name' => $loginId,
            'login_id' => $loginId,
            'password' => bcrypt('test-password'),
            'user_avatar_id' => $avatar,
            'color_id' => $color,
        ]);
    }

    public function test_public_pagination_and_authenticated_collection_contracts(): void
    {
        $this->getJson('/api/notices')->assertOk()->assertJsonStructure(['data', 'meta']);
        $this->getJson('/api/items')->assertUnauthorized()->assertJsonStructure(['message']);

        $reader = $this->member('reader');
        $this->actingAs($reader, 'web');
        $this->getJson('/api/user')->assertOk()->assertJsonPath('data.id', $reader->id);
        $this->getJson('/api/items')->assertOk()->assertExactJson(['data' => []]);
        $this->getJson('/api/notices')->assertOk()->assertJsonStructure(['data', 'meta']);
        $this->postJson('/api/notices', [])->assertForbidden()->assertJsonStructure(['message']);
    }

    public function test_web_session_endpoints_return_the_json_contract(): void
    {
        $member = $this->member('session-user');

        $this->postJson('/login', [])->assertUnprocessable()->assertJsonValidationErrors([
            'login_id', 'password',
        ]);
        $this->postJson('/login', [
            'login_id' => $member->login_id,
            'password' => 'test-password',
        ])->assertOk()->assertJsonPath('data.id', $member->id);
        $this->assertAuthenticatedAs($member, 'web');
        $this->postJson('/logout')->assertOk()->assertJsonStructure(['data', 'message']);
        $this->assertGuest('web');
    }

    public function test_likes_derive_both_users_and_accept_retries_and_legacy_fields(): void
    {
        $sender = $this->member('sender');
        $recipient = $this->member('recipient');
        $skill = Skill::forceCreate([
            'name' => 'Practice',
            'category' => '基礎',
            'avatar_path' => '/skill.webp',
            'description' => 'Practice skill',
        ]);
        $challenge = Challenge::create([
            'user_id' => $recipient->id,
            'skill_id' => $skill->id,
            'success_score' => 1,
        ]);

        $this->postJson('/api/likes', ['challenge_id' => $challenge->id])->assertUnauthorized();
        $this->actingAs($sender, 'web');
        $this->postJson('/api/likes', [])->assertUnprocessable()->assertJsonValidationErrors('challenge_id');
        $this->postJson('/api/likes', [
            'challenge_id' => $challenge->id,
            'from_user_id' => $recipient->id,
            'user_id' => $sender->id,
        ])->assertOk()->assertExactJson(['data' => null]);
        $this->postJson('/api/likes', ['challenge_id' => $challenge->id])->assertOk();

        $this->assertDatabaseCount('likes', 1);
        $this->assertDatabaseHas('likes', [
            'challenge_id' => $challenge->id,
            'from_user_id' => $sender->id,
            'user_id' => $recipient->id,
        ]);
    }
}
