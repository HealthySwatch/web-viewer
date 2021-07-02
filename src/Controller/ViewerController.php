<?php

namespace App\Controller;

use App\Entity\Watch;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ViewerController extends AbstractController
{
    /**
     * @Route("/viewer/{shareId}", name="viewer")
     */
    public function view(string $shareId): Response
    {
        $watchRepository = $this->getDoctrine()->getRepository(Watch::class);
        $watch = $watchRepository->findOneBy([
           "shareId" => $shareId,
           "shareEnabled" => true
        ]);
        if ($watch) {
            return $this->render('viewer/index.html.twig', ['reports' => $watch->getReports(), 'name' => $watch->getName()]);
        }
        return $this->render('viewer/404.html.twig', [], new Response('', 404));
    }
}
