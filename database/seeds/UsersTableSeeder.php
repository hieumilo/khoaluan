<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'superadmin',
                'email' => 'superadmin'.'@gmail.com',
                'password' => bcrypt('superadmin'),
                'address' => 'Đà Nẵng',
                'status' => 0,
                'level' => 0,
                'created_at' => new DateTime(),
            ],
            [
            	'name' => 'admin',
	            'email' => 'admin'.'@gmail.com',
	            'password' => bcrypt('admin'),
                'address' => 'Đà Nẵng',
                'status' => 0,
                'level' => 0,
	            'created_at' => new DateTime(),
            ],
            [
            	'name' => 'member',
	            'email' => 'member'.'@gmail.com',
	            'password' => bcrypt('12345'),
                'address' => 'Đà Nẵng',
                'status' => 0,
                'level' => 1,
	            'created_at' => new DateTime(),
            ]
	    ]);
    }
}
