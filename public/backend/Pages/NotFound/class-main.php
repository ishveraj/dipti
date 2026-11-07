<?php
namespace Pages\NotFound;

class Main extends \Engine\Base {
    protected function main(){ 
        global $neo;
        $neo::$pageSettings = array(
            'meta' => [
                'title' => 'Page not Found',
                'description' => 'Page not Found',
            ],
            'dontIndexPage' => TRUE,
        );    
    ?>
        <section>
            <div class="container">
                <lottie-player src="<?= SITE_URL . '/static/defaults/hub_404.json' ?>" background="transparent" speed="1" style="width: 200px;height:200px;margin-top:-100px;" class="lottie-tag" loop="" autoplay=""></lottie-player>
                
                <h1>404! Page not found!</h1>

                <p style="margin-top:0.5rem;">Ooopss, looks like you're lost, use the button below to get back to the site.</p>

                <div style="margin-top:1.5rem;">
                    <a href="<?= SITE_URL ?>" class="btn" style="background-color:rgba(159,99,255);color:#fff;padding:0.5rem 2rem;padding-bottom:0.6rem;transition:0.3s opacity ease;">Back to Site</a>
                </div>
            </div>
        </section>
    <?php }

    protected function style(){ ?>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

            * {
                font-family: 'Poppins', sans-serif;
                text-align: center;
                margin: 0;
            }

            body {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                -ms-flex-direction: column;
                flex-direction: column;
                min-height: 100vh;
                overflow-x: hidden;
                -webkit-tap-highlight-color: transparent;
            }

            main {
                display: flex;
                align-items: center;
                justify-content: center;
                -webkit-box-flex: 1;
                -ms-flex-positive: 1;
                flex-grow: 1;
                position: relative;
            }

            section {
                width: 100%;
            }

            .lottie-tag {
                display: block;
                margin: 0 auto;
            }

            h1 {
                font-weight: bolder;
                font-size: 2.5rem;
            }

            .btn {
                color: #fff;
                background-color: #CA90C0;
                font-size: 1rem;
                border-radius: 50px;
                position: relative;
                text-decoration: none;
                display: inline-block;
            }

            .btn:hover {
                opacity: 0.5;
            }
        </style>
    <?php }

    protected function scriptSrc(){
        return [
            'https://unpkg.com/@lottiefiles/lottie-player@1.5.7/dist/lottie-player.js'
        ];
    }
}