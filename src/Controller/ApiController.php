<?php

namespace App\Controller;

use App\Entity\Group;
use App\Entity\Member;
use App\Entity\Message;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends Controller
{
    /**
     * @Route("/api/message/last", name="api_get_last_message")
     */
    public function getLastMessage(Request $request)
    {
        $userRepository = $this->getDoctrine()->getRepository(User::class);
        $groupRepository = $this->getDoctrine()->getRepository(Group::class);
        //var_dump($request->get('message'));
        //une instance de notre entité
        $message = new Message();

        $message->setContent($request->get('message'));
        $message->setDateCreated(new \DateTime());
        $message->setAuthor($this->getUser());
        if($request->get('receiver')) {
            $message->setReceiver($userRepository->findOneBy(['id' => $request->get('receiver')]));
        } else if ($request->get('groupId')) {
            $message->setGroupe($groupRepository->findOneBy(['id' => $request->get('groupId')]));
        }

        //Sauvegarde
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($message);
        $entityManager->flush();


        $messageRepository = $this->getDoctrine()->getRepository(Message::class);

        $messages = $messageRepository->findBy(
            [], //clauses where
            ["dateCreated" => "DESC"], //order by
            1, //limit
            0 //offset
        );

        return new JsonResponse($messages);
    }

    /**
     * @Route("/api/user/message", name="api_get_messages")
     */
    public function getMessages(Request $request)
    {
        if($request->get('receiver')) {
            $userRepository = $this->getDoctrine()->getRepository(User::class);
            $messageRepository = $this->getDoctrine()->getRepository(Message::class);

            $user = $this->getUser();
            $receiver = $userRepository->findOneBy(['id' => $request->get('receiver')]);

            $messages = $messageRepository->getUserMessages($user, $receiver);

            return new JsonResponse($messages);
        } else if ($request->get('groupId')) {
            $groupRepository = $this->getDoctrine()->getRepository(Group::class);

            $group = $groupRepository->findOneBy(['id' => $request->get('groupId')]);

            return new JsonResponse($group);
        }

        return null;
    }

    /**
     * @Route("/api/user/search", name="api_search_user")
     */
    public function searchUser(Request $request){
        $search = $request->get('search');

        $userRepository = $this->getDoctrine()->getRepository(User::class);

        $users = $userRepository->searchUser($this->getUser(), $search);

        return new JsonResponse($users);
    }

    /**
     * @Route("api/group/create", name="api_create_group")
     */
    public function createGroup(Request $request){
        $group = new Group();
        $member = new Member();

        /*            var_dump($request->get('groupName'));
                    die();*/


        $group->setName($request->get('groupName'));
        $group->setCreator($this->getUser());
        $member->setUser($this->getUser());
        $member->setGroupe($group);
        $group->addMember($member);

        //Sauvegarde
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($group);
        $entityManager->persist($member);
        $entityManager->flush();

        //$this->addFlash("Success", "Votre groupe à bien été créé !");

        $groupRepository = $this->getDoctrine()->getRepository(Group::class);

        $groups = $groupRepository->findBy(
            ["creator" => $this->getUser()], //clauses where
            [] //order by
        );

        return new JsonResponse($groups);
    }

    /**
     * @Route("api/group/show", name="api_show_group")
     */
    public function showGroup(Request $request){
        $groupRepository = $this->getDoctrine()->getRepository(Group::class);

        $group = $groupRepository->findOneBy(['id' => $request->get('id')]);

        return new JsonResponse($group);
    }

    /**
     * @Route("/api/member/add", name="api_add_member")
     */
    public function addMember(Request $request)
    {
        $userRepository = $this->getDoctrine()->getRepository(User::class);
        $groupRepository = $this->getDoctrine()->getRepository(Group::class);
        //var_dump($request->get('message'));

        //une instance de notre entité
        $member = new Member();
        $group = $groupRepository->findOneBy(['id' => $request->get('groupId')]);

        $member->setUser($userRepository->findOneBy(['id' => $request->get('userId')]));
        $group->addMember($member);

        //Sauvegarde
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($member);
        $entityManager->flush();



        return new JsonResponse($group);
    }
}
