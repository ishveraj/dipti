<?php
namespace App\WP;
class Users {

    //* User roles that cannot visit CMS (public users)
    // Probably has custom frontend dashboard hence we hide CMS from them
    public static $public_users = [
        'member'
    ];

    function __construct(){  
        // Remove the count for number of users
        add_action( 'admin_head', function(){ 
            global $current_user, $pagenow;
            $post_type = get_post_type(); 

            // Disallow public users from visiting CMS
            if ( in_array( $current_user->roles[0], self::$public_users ) ){
                header('Location:' . SITE_URL );
            }

            //* Users listing
            if ( 
                $current_user->roles[0] != 'administrator'
                && $pagenow === 'users.php'
            ){
                // Hide some stuff using self::removeTags('#id, .class');
            }

            //* Users inner
            if ( 
                $current_user->roles[0] != 'administrator'
                && $pagenow === 'user-edit.php'
            ){
                // Hide some stuff using self::removeTags('#id, .class');
            }

            //* Add new users
            if ( 
                $current_user->roles[0] != 'administrator'
                && $pagenow === 'user-new.php'
            ){
                // Hide some stuff using self::removeTags('#id, .class');

            ?> 
                <script>
                    // Set default user if any
                    setTimeout(() => {
                        //$('#role option[value="member"]').prop('selected', true);
                    }, 1);
                </script>
            <?php
            }
        });

        //* Custom email template
        // Disable default password changed email notification (sent by custom Login module)
        add_filter( 'send_password_change_email', '__return_false' ); 

        // Custom reset password link
        add_action('retrieve_password_notification_email', function( $defaults, $key, $user_login, $user_data ){
            $body = '
            Hello ' . $user_login . ',<br><br>

            Please click the following link to reset your password:<br>
            <a href="'.SITE_URL.'/reset-password?r='.$key.'&u='.rawurlencode($user_login).'" target="_blank">Reset Password</a>';

            $email = \REST\_Public\_POST\Contact\Main::emailTemplate( $body );

            $defaults['subject'] = $email['sitename'] . ' Password Reset Request';
            $defaults['headers'] = array(
                'MIME-Version: 1.0',
                'Content-type: text/html; charset=iso-8859-1',
                $email['from']
            );
            $defaults['message'] = $email['body'];

            return $defaults;
        }, 99, 4);

        //* New user account notification
        add_action('wp_new_user_notification_email', function( $defaults, $user, $blogname ){
            //! Exit if user does not exist
            if (!$user) return;

            $key = get_password_reset_key( $user );

            $body = '
            Good Day,<br><br>

            We are thrilled to welcome you to New Website!<br><br>

            To get started, simply visit the following link to set your account password.<br>
            <a href="'.SITE_URL.'/reset-password?r='.$key.'&u='.rawurlencode($user->user_login).'" target="_blank">Set Password</a><br><br>
            
            You may login using your username <b>'. $user->user_login .'</b> or email <b>'. $user->user_email .'</b> after setting your password.';

            $email = \REST\_Public\_POST\Contact\Main::emailTemplate( $body );

            $defaults['subject'] = 'Welcome to ' . $email['sitename'];
            $defaults['headers'] = array(
                'MIME-Version: 1.0',
                'Content-type: text/html; charset=iso-8859-1',
                $email['from']
            );
            $defaults['message'] = $email['body'];

            return $defaults;
        }, 10, 3);
    }

    // Hide and remove tags by css ID or classname
    private static function removeTags($tags){
        ?>
            <style>
                <?= $tags ?> { display: none !important; }
            </style> 

            <script>
                $('<?= $hide ?>').remove();
            </script>
        <?php
    }
}