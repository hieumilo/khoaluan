<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use App\User;
use App\Notification;
use App\Social;
use Validator;
use DateTime;
use Hash;
use GuzzleHttp;
use Config;
use DB;

class AuthenticateController extends Controller
{
    /**
     * đăng nhập
     * @param  Request $request [các dữ liệu mà client gửi lên]
     * @return [type]           [description]
     */
    public function authenticate(Request $request)
    {
        // grab credentials from the request
        $credentials = $request->only('email', 'password');

        try {
            // attempt to verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Email hoặc mật khẩu không đúng'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        $user = User::where('email','=',$request->email)->first();
        if($user->status == 1) {
            return response()->json(['error' => 'Tài khoản bị khóa'], 401);
        }

        // all good so return the token
        return response()->json(['token' => $token]);
    }

    /**
     * Get signed in user's profile.
     */
    public function getAuthenticatedUser()
	{
	    try {

	        if (! $user = JWTAuth::parseToken()->authenticate()) {
	            return response()->json(['user_not_found'], 404);
	        }

	    } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

	        return response()->json(['token_expired'], $e->getStatusCode());

	    } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

	        return response()->json(['token_invalid'], $e->getStatusCode());

	    } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

	        return response()->json(['token_absent'], $e->getStatusCode());

	    }

	    // the token is valid and we have found the user via the sub claim
	    return response()->json(['user' => $user],200);
	}

    public function getUserNotification()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;

        $count_noti = Notification::where('user_id','=',$user_id)->where('type','<>',0)
                        ->where('status','=',0)->count();

        $notifications = Notification::where('user_id','=',$user_id)->where('type','<>',0)
                        ->orderBy('created_at','desc')->get(['id', 'content', 'created_at', 'status']);

        return response()->json([
            'notifications' => $notifications,
            'count' => $count_noti
        ],200);
    }

    public function getUserChangeNoti($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;

        $noti = Notification::where('id',$id)->first();
        $noti->status = 1;
        $noti->updated_at = new DateTime();
        $noti->save();

        $count_noti = Notification::where('user_id','=',$user_id)->where('type','<>',0)
                        ->where('status','=',0)->count();

        return response()->json([
            'success' => 'đã đọc tin',
            'restaurant_id' => $noti->restaurant_id,
            'count' => $count_noti
        ],200);
    }

    /**
     * Create new Account.
     */
    public function signup(Request $request)
    {
        $rules = [
            'name'     => 'required',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required',
            'repassword' => 'required|same:password',
            'address'  => 'required',
        ];
        $messages = [
            'name.required' => 'Tên người dùng không được để trống',
            'email.required' => 'Email không được để trống',
            'email.email' => 'Email không đúng định dạng',
            'email.unique' => 'Email đã được sử dụng',
            'password.required' => 'Mật khẩu không được để trống',
            'repassword.required' => 'Nhập lại mật khẩu không được để trống',
            'repassword.same' => 'Nhập lại mật khẩu không trùng với mật khẩu',
            'address.required' => 'Địa chỉ không được để trống'
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        // dd(json_encode($validator));
        if ($validator->fails()) {
            return Response()->json([
                'error' => $validator->messages()
            ], 422);
        }

        $user             = new User;
        $user->name       = $request->name;
        $user->email      = $request->email;
        $user->password   = Hash::make($request->password);
        $user->address    = $request->address;
        $user->status     = 0;
        $user->level      = 1;
        $user->created_at = new DateTime();
        $user->save();

        return response()->json([
            'message' => 'user Created Succesfully',
            'data' => $user
            ], 200);
    }

    public function change_pass(Request $request)
    {
        $rules = [
            'password' => 'required',
        ];
        $messages = [
            'password.required' => 'Mật khẩu không được để trống',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return Response()->json([
                'error' => $validator->messages()
            ], 422);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $current_pass = $user->password;

        if(Hash::check($request->password, $current_pass)) {

            $rules = [
                'newpass' => 'required',
                'renewpass' => 'required|same:newpass',
            ];
            $messages = [
                'newpass.required' => 'Mật khẩu mới không được để trống',
                'renewpass.required' => 'Nhập lại mật khẩu mới không được để trống',
                'renewpass.same' => 'Nhập lại mật khẩu mới không trùng với mật khẩu mới',
            ];
            $validator = Validator::make($request->all(), $rules, $messages);
            // dd(json_encode($validator));
            if ($validator->fails()) {
                return Response()->json([
                    'error' => $validator->messages()
                ], 422);
            }

            $user->password = Hash::make($request->newpass);
            $user->updated_at = new DateTime();
            $user->save();

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'Đổi mật khẩu thành công',
                'token' => $token
            ], 200);
        } else {
            return response()->json([
                'er' => 'mật khẩu không chính xác'
            ], 400);
        }



        
    }

    /**
     * Login with Facebook.
     */
    public function facebook(Request $request)
    {
        $client = new GuzzleHttp\Client();

        $params = [
            'code' => $request->code,
            'client_id' => $request->clientId,
            'redirect_uri' => $request->redirectUri,
            'client_secret' => Config::get('app.facebook_secret')
        ];

        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->request('GET', 'https://graph.facebook.com/v2.5/oauth/access_token', [
            'query' => $params
        ]);
        $accessToken = json_decode($accessTokenResponse->getBody(), true);

        // Step 2. Retrieve profile information about the current user.
        $fields = 'id,email,first_name,last_name,link,name,picture';
        $profileResponse = $client->request('GET', 'https://graph.facebook.com/v2.5/me', [
            'query' => [
                'access_token' => $accessToken['access_token'],
                'fields' => $fields
            ]
        ]);
        $profile = json_decode($profileResponse->getBody(), true);
        ////////////////////
        // return response()->json(['data' => $profile]);

        $social = social::where('provider_user_id',$profile['id'])->where('provider','facebook')->first();

        if($social) {
            $user = User::where('id',$social->id_user)->first();

            $token = JWTAuth::fromUser($user);

            return Response()->json(['token' => $token],200);
        } else {
            DB::beginTransaction();
            try {
                $user             = new User;
                $user->name       = $profile['name'];
                $user->email      = $profile['email'];
                $user->status     = 0;
                $user->level      = 1;
                $user->created_at = new DateTime();
                $user->save();

                $social = new Social;
                $social->provider_user_id = $profile['id'];
                $social->provider = 'facebook';
                $social->id_user = $user->id;
                $social->save();

                DB::commit();

                return Response()->json(['token' => $token],200);
            } catch (Exception $e) {
                DB::rollBack();
                return Response()->json([
                    'error' => 'Đã có lỗi xảy ra',
                    'data' => $e->getMessage()
                ], 422);
            }
            
        }
    }
}
