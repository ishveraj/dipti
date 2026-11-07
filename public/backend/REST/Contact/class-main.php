<?php
namespace REST\Contact;

class Main {
    public static function public_post_send_email(){
        $body = '
            Name: '. $_POST['name'] . '<br/>
            Email: '. $_POST['email'] . '<br/>
            Contact: '. $_POST['phone'] . '<br/>
            Message: '. $_POST['message']
        ;

        // Get email template
        $contact = new \REST\Contact\Main();
        $email = $contact->emailTemplate( $body );

        // PHPmailer code
        /*
        $contact->PHPMailer( 
            $email['to'], 
            'New Enquiry from ' . $email['sitename'],
            $email['body']
        );
        */

        // Default mail code
        /*
        mail( 
            $email['to'], 
            'New Enquiry from ' . $email['sitename'], 
            $email['body'], 
            $email['headers']
        );
        */

        return ['status' => 'Enquiry Details Successfully Sent. Thank you.'];
        exit;
    }

    /**
     * Global email template
     * 
     * Ensures consistency & ease of use for all emails going out
     * 
     * @param content body of email content
     * @param custom_headers additional headers
     */
    public function emailTemplate( $content, $custom_headers = false ){
        // Defaults
        $to = 'info@newsite.com';
        $headers = [
            'From: New Site <webenquiry@newsite.com>',
            //'CC: webenquiry@newsite.com',
            //'BCC: webenquiry@newsite.com',
        ];

        // Global settings
        $sitename = get_field( 'site_settings_sitename', 'site-settings' );
        $logo = get_field( 'site_settings_logo', 'site-settings' );

        // Additional headers if provided
        if ( $custom_headers ) $headers = array_merge( $headers, $custom_headers );

        // Default type headers
        $type_headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
        ];

        $headers = array_merge( $type_headers, $headers );
        $headers = implode( "\r\n", $headers );

        // Default styling
        $default_p  = 'padding:0;margin:0;font-family: Roboto, Sans-serif;color:#000;font-size:16px;';
        $default_td_width = 'width: 130px;';
        $default_td = 'padding:16px;';
        $default_table = 'width:768px;margin-left:auto;margin-right:auto;';

        $email_header = '<table style="border-bottom:1px solid #ccc;width:774px;background-color:#fff;margin:0 auto;">
        <tr>
            <td style="padding:16px"><img src="' . $logo['url'] . '" style="height:42px;"/></td>
        </tr>
        </table>';

        $body = '<table style="' . $default_table . 'border:1px solid #ccc;">
            <tr>
                <td style="' . $default_td . '">
                    <p style="' . $default_p . '">
                    ' . $content . '<br><br>
                    Thank you,<br>
                    ' . $sitename . '
                    </p>
                </td>
            </tr>
        </table>';

        return [
            'to' => $to,
            'headers' => $headers,
            'body' => '<html><body>'.$email_header.$body.'</body></html>',
            'sitename' => $sitename,
        ];
    }

    /**
     * PHPMailer
     * Requires SMTP settings
     */
    public function PHPMailer( $to, $subject, $body ){
        require_once BACKEND_PATH . 'App/PHPMailer/src/Exception.php';
        require_once BACKEND_PATH . 'App/PHPMailer/src/PHPMailer.php';
        require_once BACKEND_PATH .'App/PHPMailer/src/SMTP.php';
        if ( empty( $mail ) ) $mail = new \PHPMailer\PHPMailer\PHPMailer();

        try {
            $mail->isSMTP(); // Set mailer to use SMTP
            $mail->Host = 'smtp.office365.com'; // Microsoft SMTP

            // IF authentication needed
            $mail->SMTPAuth = true;
            $mail->Username = 'test@email.com';
            $mail->Password = 'xxx';

            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;
            $mail->Subject = $subject;
            $mail->setFrom('test@email.com', 'Test Email From');
            $mail->addAddress( $to ); // To
            $mail->isHTML(true);
            $mail->Body = $body;
            
            // If has any attachment
            if (isset($_FILES['upload']) && $_FILES['upload']['error'] == UPLOAD_ERR_OK) {
                $mail->addAttachment($_FILES['upload']['tmp_name'], $_FILES['upload']['name']);
            }

            if ($mail->Send()) {
                return 'Email sent successfully';
            } else {
                return 'Mailer Error: ' . $mail->ErrorInfo;
            }
        } 
        catch (Exception $e) {
            return 'Message could not be sent. Mailer Error: '. $mail->ErrorInfo;
        }
    }

    public function uploadFile( $input_file ){
        // Input file name is attachment (multiple)
        if ( isset( $input_file['error'] ) && is_array( $input_file['error'] ) ){
            $isFileInvalid = false; // File valid by default
            $wordpress_upload_dir = \wp_upload_dir();
            $successful_file_uploads = array();

            foreach ( $input_file['error'] as $fileType => $errors ){
                if ( $isFileInvalid ) break; //! Stop if failed

                if ( $errors === UPLOAD_ERR_OK ){
                    //! Stop if file size exceeded 5MB
                    if ( $input_file['size'][$fileType] > 26214400 ){
                        $isFileInvalid = 'File size exceeded 25MB';
                        break;
                    }

                    // Load into WP Media
                    $uploadWP_instance = new self();
                    $file = $uploadWP_instance->uploadIntoWPMedia( 
                        $input_file['tmp_name'][$fileType], 
                        $input_file['name'][$fileType],
                        $wordpress_upload_dir,
                        $fileType
                    );

                    //! Stop if extension mime not allowed
                    if ( !$file['isOK'] ){
                        $isFileInvalid = 'File type ' . $file['reason'] . ' is not allowed';
                        break;
                    }

                    array_push( $successful_file_uploads, $file );
                } 
                // Error 4 means no file uploads hence no issues
                elseif ( $errors != 4 ) {
                    //! Error uploading file
                    $isFileInvalid = 'Uploading files failed';
                    break;
                }
            }
        }

        // Use this to add file attachments into acf (use the file_id only)
        if ( !$isFileInvalid ){
            $uploadedFiles = array();
            if ( !empty( $successful_file_uploads ) ){
                foreach ( $successful_file_uploads as $sfu ){
                    $uploadedFiles[] = $sfu['file_id'];
                }
            }

            return [
                'err' => false,
                'files'  => $uploadedFiles, 
            ];
        }

        //! File upload failed
        return [
            'err' => $isFileInvalid,
            'files'  => array(), 
        ];
    }

    public function uploadIntoWPMedia( $tmp_name, $name, $wordpress_upload_dir, $inputLabel ){
        $j = 1; // number of tries when the file with the same name is already exists
        $file_path = $wordpress_upload_dir['path'] . '/' . $name;
        $mime_instance = new self();
        $file_mime = $mime_instance->custom_mime_content_type_from_tmp( $name );

        //! IF extension not allowed
        if ( !$file_mime['isOK'] ){
            return [
               'isOK' => false,
               'reason' => $file_mime['mime'],
            ];
        }

        // Double check same file names
        while( file_exists( $file_path ) ) {
            $j++;
            $file_path = $wordpress_upload_dir['path'] . '/' . $j . '_' . $name;
        }

        if( \move_uploaded_file( $tmp_name, $file_path ) ) {
            $upload_id = \wp_insert_attachment( array(
                'guid'           => $file_path, 
                'post_mime_type' => $file_mime['mime'],
                'post_title'     => preg_replace( '/\.[^.]+$/', '', $name ),
                'post_content'   => '',
                'post_status'    => 'inherit',
            ), $file_path );

            // wp_generate_attachment_metadata() won't work if you do not include this file
            require_once( ABSPATH . 'wp-admin/includes/image.php' );
            \wp_update_attachment_metadata( $upload_id, \wp_generate_attachment_metadata( $upload_id, $file_path ) );

            return [
                'isOK' => true,
                'full_url' => $wordpress_upload_dir['url'] . '/' . basename( $file_path ),
                'file_name' => basename( $file_path ),
                'file_id' => $upload_id,
                'label' => $inputLabel,
            ];
        }
    }

    // Get file mime type
    public function custom_mime_content_type_from_tmp( $name ){
        $mime_types = array(
            'txt' => 'text/plain',
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'csv' => 'text/csv',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp', // Add support for "webp" extension
            // Add more file extensions and their corresponding MIME types as needed
        );
    
        $file_extension = pathinfo( $name, PATHINFO_EXTENSION );
        $lowercase_extension = strtolower( $file_extension );
    
        if ( array_key_exists( $lowercase_extension, $mime_types ) ){
            return [
                'isOK' => true,
                'mime' => $mime_types[ $lowercase_extension ],
            ];
        } 
        //! Extension not allowed
        else {
            return [
                'isOK' => false,
                'mime' => $lowercase_extension,
            ];
        }
    }
}