<?php

namespace App\Controller;

use App\Entity\Task;
use App\Repository\TaskListRepository;
use App\Repository\TaskRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

class TaskController extends AbstractController
{
    #[Route("/tasks", methods: 'POST')]
    public function store(
        TaskRepository $taskRepository,
        TaskListRepository $taskListRepository,
        Request        $request
    ): Response
    {
        $taskListId = $request->get('taskListId');
        $taskList = $taskListRepository->find($taskListId);

        $task = new Task();

        $task->setTaskList($taskList);
        $task->setText($request->get('text'));
        $taskRepository->add($task, true);
        $taskId = $task->getId();

        return $this->json([
            'status' => 'ok',
            'data' => [
                'taskId' => $taskId,
                'taskListId' => $taskListId
            ]],
            200, [], ['groups' => ['taskLists']]
        );
    }

    #[Route("/tasks/{id}", methods: 'GET')]
    public function getTask(
        TaskRepository $taskRepository,
        Request         $request,
    )
    {
        $id = $request->get('id');
        $task = $taskRepository->find($id);

        $this->denyAccessUnlessGranted('view', $task->getTaskList()->getBoard());

        return $this->json([
            'status' => 'ok',
            'data' => [
                'task' => $task,
                'taskListId' => $task->getTaskList()->getId(),
                'boardId' => $task->getTaskList()->getBoard()->getId(),
            ]],
            200, [], ['groups' => ['taskList', 'taskLists']]
        );
    }

    #[Route("/tasks/{id}", methods: 'PUT')]
    public function editTask(
        TaskRepository $taskRepository,
        Task           $task,
        Request        $request
    ): Response
    {
        if ($request->get('text')) {
            $task->setText($request->get('text'));
        }

        if ($request->get('isDone') !== null) {
            $task->setIsDone($request->get('isDone'));
        }

        $taskRepository->add($task, true);

        $this->denyAccessUnlessGranted('edit', $task->getTaskList()->getBoard());

        return $this->json([
            'status' => 'ok',
            'data' => [
                'taskListId' => $task->getTaskList()->getId(),
                'taskText' => $task->getText(),
                'isDone' => $task->isIsDone(),
            ]],
            200, [], ['groups' => ['taskLists']]
        );
    }

    #[Route("/tasks/{id}", methods: 'DELETE')]
    public function removeTask(
        TaskRepository $taskRepository,
        int            $id
    ): Response
    {
        $task = $taskRepository->find($id);

        if ($task === null) {
            throw new NotFoundHttpException();
        }

        $this->denyAccessUnlessGranted('edit', $task->getTaskList()->getBoard());

        $taskRepository->remove($task, true);

        return $this->json(['status' => 'ok']);
    }
}