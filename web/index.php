<?php

require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

$app = new Silex\Application();
$base_url = "http://www.zaragoza.es/api/recurso/";
$default_format = "json";

/* providers */
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../views',
));

/* controllers */
$app->get('/', function () use ($app) {
	$data = null;
    return $app['twig']->render('app.html.twig', array(
        'data' => $data,
    ));
});

$app->get('/proxy', function (Request $request) use ($app) {
    
    global $base_url, $default_format;
    //$notIncludeFormatFor = ['factura/'];

    $resource = $request->query->get('resource');
    $params = $request->query->get('params');
    $method = urldecode($resource);					
    //$notIncludeFormat = false;

    /*foreach($notIncludeFormat as $elem) {
        if (strpos($method, $elem) !== false) {
            $notIncludeFormat = true;
        }
    }*/

    //$url = $notIncludeFormat ? $base_url . $method . "." . $default_format : $base_url . $method;
    $url =  $base_url . $method . "." . $default_format; 

    if ($params) $url = $url . $params; 
    //echo $url;
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_URL, $url); 
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)'); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1000);
    
    //sometimes Zaragoza API doesn't end.

	curl_setopt($ch, CURLOPT_TIMEOUT, 1000);

	$data = curl_exec($ch); 
	$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE); 
	curl_close($ch);

    $response = new Response($data); 
    $response->headers->set('Content-Type', 'application/json'); 
    return $response;

});

/* config */
    
$app['debug'] = true;

$app->run();