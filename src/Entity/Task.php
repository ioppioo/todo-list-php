<?php

namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
class Task
{
    #[Groups(['taskLists', 'taskList'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Groups(['taskLists', 'taskList'])]
    #[ORM\Column(length: 255)]
    private string $text;

    #[Groups(['taskLists'])]
    #[ORM\Column]
    private bool $isDone = false;

    #[ORM\ManyToOne(targetEntity: TaskList::class, inversedBy: "tasks")]
    private TaskList $taskList;

    public function getId(): int
    {
        return $this->id;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function setText(string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function isIsDone(): bool
    {
        return $this->isDone;
    }

    public function setIsDone(bool $isDone): self
    {
        $this->isDone = $isDone;

        return $this;
    }

    public function getTaskList(): TaskList
    {
        return $this->taskList;
    }

    public function setTaskList(TaskList $taskList): Task
    {
        $this->taskList = $taskList;
        return $this;
    }
}
