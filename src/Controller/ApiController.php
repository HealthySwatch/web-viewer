<?php

namespace App\Controller;

use App\Entity\Report;
use App\Entity\Watch;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Uid\Uuid;

/**
 * @Route("/api/v1", name="api_")
 */
class ApiController extends AbstractController
{

    /**
     * @Route("/watch", name="watch_create", methods={"POST"})
     *
     */
    public function createWatch(): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $watch = new Watch();
        $watch->setToken(bin2hex(Uuid::v4()->toBinary()));
        $watch->setShareId(bin2hex(Uuid::v4()->toBinary()));
        $watch->setShareEnabled(false);
        $entityManager->persist($watch);
        $entityManager->flush();
        return $this->json($watch, 201);
    }

    /**
     * @Route("/watch/{token}", name="watch_read", methods={"GET"})
     *
     */
    public function getWatch(string $token): Response
    {
        $watchRepository = $this->getDoctrine()->getRepository(Watch::class);
        $watch = $watchRepository->findOneBy(['token' => $token]);
        if ($watch) {
            return $this->json($watch, 200);
        }
        return $this->json([
            'message' => "no matching watch for this token",
        ], 404);
    }

    /**
     * @Route("/watch/{token}/reports", name="watch_reports_read", methods={"GET"})
     *
     */
    public function getWatchReports(string $token): Response
    {
        $watchRepository = $this->getDoctrine()->getRepository(Watch::class);
        $watch = $watchRepository->findOneBy(['token' => $token]);
        if ($watch) {
            return $this->json($watch->getReports(), 200);
        }
        return $this->json([
            'message' => "no matching watch for this token",
        ], 404);
    }

    /**
     * @Route("/watch/{token}", name="watch_update", methods={"PATCH"})
     *
     */
    public function updateWatch(Request $request, string $token): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $watchRepository = $this->getDoctrine()->getRepository(Watch::class);
        $body = json_decode($request->getContent());
        $watch = $watchRepository->findOneBy(['token' => $token]);
        if ($watch) {
            if (isset($body->share_enabled)) {
                $watch->setShareEnabled($body->share_enabled);
            }
            $entityManager->persist($watch);
            $entityManager->flush();
            return $this->json($watch, 200);
        }
        return $this->json([
            'message' => "no matching watch for this token",
        ], 404);
    }

    /**
     * @Route("/viewer", name="report_create", methods={"POST"})
     *
     */
    public function createReport(Request $request): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $watchRepository = $this->getDoctrine()->getRepository(Watch::class);
        $body = json_decode($request->getContent());
        $watch = $watchRepository->findOneBy(['token' => $body->token]);
        if ($watch) {
            $report = new Report();
            $report->setWatch($watch);
            $report->setCreatedAt(new \DateTime());
            $report->setPayload($body->payload);
            $entityManager->persist($report);
            $entityManager->flush();
            return $this->json($report, 200);
        }
        return $this->json([
            'message' => "no matching watch for this token",
        ], 404);
    }
}
