<?php

namespace App\Entity;

use App\Repository\ReportRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ReportRepository::class)
 */
class Report implements \JsonSerializable
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Watch::class, inversedBy="reports")
     * @ORM\JoinColumn(nullable=false)
     */
    private $watch;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="text")
     */
    private $payload;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWatch(): ?Watch
    {
        return $this->watch;
    }

    public function setWatch(?Watch $watch): self
    {
        $this->watch = $watch;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getPayload(): ?string
    {
        return $this->payload;
    }

    public function setPayload(string $payload): self
    {
        $this->payload = $payload;

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            "created_at" => $this->createdAt,
            "payload" => $this->payload
        ];
    }
}
