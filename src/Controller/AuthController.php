<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class AuthController extends AbstractController
{
    #[Route("/login", name: "app_login")]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        $lastUsername = $authenticationUtils->getLastUsername();
        $error = $authenticationUtils->getLastAuthenticationError();

        return $this->json([
            'status' => 'ok',
            'error' => $error,
            'data' => [
                'user' => $this->getUser(),
            ]
        ], 200, [], ['groups' => ['user']]);
    }

    #[Route('/signup')]
    public function signUp(
        UserPasswordHasherInterface $passwordHasher,
        UserRepository              $userRepository,
        Request                     $request
    ): Response
    {
        if ($request->getMethod() === 'POST') {
            $user = new User();
            $user->setLogin($request->get('login'));
            $user->setEmail($request->get('email'));
            $user->setPassword($passwordHasher->hashPassword($user, $request->get('password')));
            $userRepository->add($user, true);

            $email = $request->get('email');
            $this->addFlash('success', "Регистрация завершена! Мы отправили письмо на адрес $email.");

            return $this->json([
                'status' => 'ok',
                'data' => [
                    'user' => $user,
                ]
            ], 200, [], ['groups' => ['user']]);
        }

        return $this->json([
            'status' => 'ok',
        ]);
    }

    #[Route('/me')]
    public function me()
    {
        return $this->json([
            'status' => 'ok',
            'data' => [
                'user' => $this->getUser(),
            ]
        ], 200, [], ['groups' => ['user']]);
    }
}
