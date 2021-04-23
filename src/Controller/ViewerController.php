<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ViewerController extends AbstractController
{
    /**
     * @Route("/viewer", name="viewer")
     */
    public function index(): Response
    {
        return $this->render('viewer/index.html.twig', [
            'controller_name' => 'ViewerController',
        ]);
    }
}
