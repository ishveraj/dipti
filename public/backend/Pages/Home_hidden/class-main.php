<?php
namespace Pages\Home;

class Main extends \Engine\Base {
    // Load external CSS
    protected function styleSrc(){
        return [ 
            //PATH . 'assets/css/example.css' 
        ];
    }

    // Load external JS
    protected function scriptSrc(){
        return [ 
            //PATH . 'assets/js/example.js' 
        ];
    }

    // Main code for page
    protected function main(){ 
        global $neo;
        
        /**
         * Page settings (Can remove if not using)
         * setting $processOnly to true will remove HTML
         * and execute PHP only
         * @example 
            $neo::$pageSettings = array(
                'meta' => [
                    'title' => 'Home',
                    'description' => 'This is the home page',
                ],
                'body' => [
                    'class' => 'navbar-space',
                    'id'    => 'body-id'
                ],
                'main' => [
                    'class' => 'main-class',
                    'id'    => 'main-id'
                ],
                'dontIndexPage' => true,
            );

            $neo::$processOnly = true;
        */      
    ?>
    <section>
        <div class="container">
            <h1 class="mt-5">Heading 1</h1>
            <h2 class="mt-2">Heading 2</h2>
            <h3 class="mt-2">Heading 3</h3>

            <p class="mt-5">Lorem Ipsum is <strong>simply dummy</strong> text of the printing and typesetting industry. Lorem Ipsum has <a href="#" class="anchor">been the industry's</a> standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type <em>specimen book.</em> </p>
        </div>
    </section>
    <?php }

    protected function script(){ ?>
    <script>
    </script>
    <?php }

    protected function style(){ ?>
    <style>
    </style>
    <?php }
}