<?php

namespace App\Entity;

use App\Repository\WatchRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=WatchRepository::class)
 * @ORM\Table(indexes={@ORM\Index(name="token_idx",columns="token"),@ORM\Index(name="share_idx",columns="share_id")})
 */
class Watch implements \JsonSerializable
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     */
    private $token;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     */
    private $shareId;

    /**
     * @ORM\Column(type="boolean")
     */
    private $shareEnabled;

    /**
     * @ORM\OneToMany(targetEntity=Report::class, mappedBy="watch", orphanRemoval=true)
     */
    private $reports;

    public function __construct()
    {
        $this->reports = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getShareId(): ?string
    {
        return $this->shareId;
    }

    public function setShareId(string $shareId): self
    {
        $this->shareId = $shareId;

        return $this;
    }

    public function isShareEnabled(): ?bool
    {
        return $this->shareEnabled;
    }

    public function setShareEnabled(bool $shareEnabled): self
    {
        $this->shareEnabled = $shareEnabled;

        return $this;
    }

    /**
     * @return Collection|Report[]
     */
    public function getReports(): Collection
    {
        return $this->reports;
    }

    public function addReport(Report $report): self
    {
        if (!$this->reports->contains($report)) {
            $this->reports[] = $report;
            $report->setWatch($this);
        }

        return $this;
    }

    public function removeReport(Report $report): self
    {
        if ($this->reports->removeElement($report)) {
            // set the owning side to null (unless already changed)
            if ($report->getWatch() === $this) {
                $report->setWatch(null);
            }
        }

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            "token" => $this->token,
            "share_id" => $this->shareId,
            "share_enabled" => $this->shareEnabled
        ];
    }

    public function jsonSerializeComplete(): array
    {
        return [
            "token" => $this->token,
            "share_id" => $this->shareId,
            "share_enabled" => $this->shareEnabled,
            "reports" => $this->reports
        ];
    }
}
