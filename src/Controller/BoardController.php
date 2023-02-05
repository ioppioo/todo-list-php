<?php

namespace App\Controller;

use App\Entity\Board;
use App\Entity\TaskList;
use App\Entity\User;
use App\Repository\BoardRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Entity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class BoardController extends AbstractController
{
    #[Route("/boards", methods: 'POST')]
    public function store(
        BoardRepository $boardRepository,
        Request         $request
    )
    {
        $board = new Board();

        $board->setUser($this->getUser());
        $board->setTitle($request->get('title'));
        $boardRepository->add($board, true);
        $boardId = $board->getId();

        return $this->json([
            'status' => 'ok',
            'data' => ['boardId' => $boardId]]);
    }

    #[Route("/boards", methods: 'GET')]
    public function getBoardsList()
    {
        /** @var User $user */
        $user = $this->getUser();
        $boards = $user->getBoards();

        return $this->json([
            'status' => 'ok',
            'data' => [
                'boards' => $boards,
            ]],
            200, [], ['groups' => ['boards']]
        );
    }

    #[Route("/boards/{id}", methods: 'GET')]
    public function getBoard(
        BoardRepository $boardRepository,
        Request         $request,
    )
    {
        $id = $request->get('id');
        $board = $boardRepository->find($id);

        $this->denyAccessUnlessGranted('view', $board);

        $taskLists = $board->getTaskLists();

        return $this->json([
            'status' => 'ok',
            'data' => [
                'taskLists' => $taskLists,
                'id' => $board->getId(),
                'title' => $board->getTitle(),
            ]],
            200, [], ['groups' => ['taskLists']]
        );
    }

    #[Route("/boards/{id}", methods: 'PUT')]
    public function editBoard(
        BoardRepository $boardRepository,
        int             $id,
        Request         $request
    ): Response
    {
        $board = $boardRepository->find($id);

        $board->setTitle($request->get('title'));
        $boardRepository->add($board, true);

        $this->denyAccessUnlessGranted('edit', $board);

        return $this->json([
            'status' => 'ok',
            'data' => [
                'id' => $id,
                'board' => $board,
            ]],
            200, [], ['groups' => ['boards']]
        );
    }

    #[Route("/boards/{id}", name: 'boards_removeBoard', methods: 'DELETE')]
    public function removeBoard(
        BoardRepository $boardRepository,
        int             $id
    ): Response
    {
        $board = $boardRepository->find($id);

        $this->denyAccessUnlessGranted('edit', $board);

        $boardRepository->remove($board, true);

        return $this->json(['status' => 'ok']);
    }
}