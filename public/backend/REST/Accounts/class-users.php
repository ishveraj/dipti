<?php
namespace REST\Accounts;

class Users {
    // Authenticate & return user data on success
    public static function private_get_auth(){
        global $current_user;
        return [
            'access' => true,
            'user' => [
                'ID' => $current_user->ID,
                'email' => $current_user->user_email,
                'username' => $current_user->user_login,
                'data' => get_fields( 'user_' . $current_user->ID ),
            ],
        ];
        exit;
    }

    //* Sign in with username/email & password
    public static function public_post_sign_in(){
        // Check if credentials are valid
        $user = wp_authenticate( $_POST['uname'], $_POST['password'] );

        if ( is_wp_error( $user ) ){
            return [ 
                'status' => 'Email / Password is invalid.',
                'atk' => false,
            ];
            exit;
        }

        // Generate token
        $atk = \App\WP\Main::generateJWT( $user );
        
        return [ 
            'status' => 'redirect', // Use redirect string to redirect form 
            'atk' => $atk // Security token to call private REST APIs
        ];
        exit;
    }

    //* Register new account
    /*
    public static function public_post_register(){   
        if ( !is_email( $_POST['uname'] ) ){
            return [ 'status' => 'Email format is invalid. Please use a valid email address like example@gmail.com' ];
            exit;
        }

        $return = wp_insert_user([
            'user_pass'  => $_POST['password'],
            'user_login' => $_POST['uname'],
            'user_email' => $_POST['uname'],
            'role'       => 'customer'
        ]);

        // FAIL to insert
        if ( is_wp_error( $return ) ){
            return [ 'status' => $return->get_error_message()];
            exit;
        }

        return [ 'status' => 'redirect'];
        exit;
    }
    */

    //* Send request to reset password
    public static function public_post_request_password_reset(){
        $user = get_user_by('email', $_POST['email_address']);
        if ( !$user ){
            return [ 
                'status' => 'Account does not exist.',
                'err' => true,
            ];
            exit;
        }
        
        // Generate Reset link
        $resetkey = get_password_reset_key( $user );
        $to = $_POST['email_address'];

        $body = '
        Good day,
        <br/><br/>

        We received a request to reset your password.<br/>
        Please <a href="'.SITE_URL.'/account-recovery?r=' . $resetkey . '&u=' . $user->user_login.'">click here</a> to reset your password.
        ';
    
        $contact = new \REST\Contact\Main();
        $email = $contact->emailTemplate( $body );

        mail( 
            $to, 
            'Account Recovery - Reset Request', 
            $email['body'], 
            $email['headers']
        );

        return [ 
            'status' => 'Account recovery email sent. <br/>Please check your inbox.',
            'err' => false
        ];
        exit;
    }

    //* Check if reset link is valid
    public static function public_post_check_reset_link(){
        //! Return false if key & username not set
        if ( 
            empty( $_POST['key'] ) 
            || empty( $_POST['username'] ) 
        ){
            return ['isValid' => false];
            exit;
        }

        // Check first if password reset key exist using resetkey & username
        $user = check_password_reset_key( $_POST['key'], $_POST['username'] );

        //! Not valid stop & throw message
        if ( is_wp_error( $user ) ){
            return ['isValid' => false];
            exit;
        }

        return ['isValid' => true];
        exit;
    }

    //* Set new password for account
    public static function public_post_reset_password(){
        // Check first if password reset key exist using resetkey & username
        $user = check_password_reset_key( $_POST['r'], $_POST['u'] );

        //! Not valid stop & throw message
        if ( is_wp_error( $user ) ){
            return [ 
                'status' => 'Session has expired. Please use the Forgot Password feature at the login page.',
            ];
            exit;
        }

        // Reset password & clear activation key
        wp_update_user([
            'ID'         => $user->ID,
            'user_pass'  => $_POST['password'],
            'user_activation_key' => ''
        ]);

        // Send them an email
        $to = $user->user_email;

        $body = '
        Good day,
        <br/><br/>
        
        We would like to inform you that your password has been changed successfully.
        ';
    
        $contact = new \REST\Contact\Main();
        $email = $contact->emailTemplate( $body );

        mail( 
            $to, 
            'Account Recovery - Reset Successful', 
            $email['body'], 
            $email['headers']
        );

        // Logout all after reset
        $sessions = \WP_Session_Tokens::get_instance( $user->ID )->destroy_all();
        // Logout from WP
        wp_logout();

        return [ 
            'status' => 'redirect', 
        ];
        exit;
    }
}