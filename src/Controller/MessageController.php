<?php

namespace App\Controller;

use App\Entity\Group;
use App\Entity\Member;
use App\Entity\Message;
use App\Entity\User;
use App\Form\GroupType;
use App\Form\MemberType;
use App\Form\MessageType;
use App\Form\SearchUserType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class MessageController extends Controller
{
    /**
     * @IsGranted("ROLE_USER")
     * @Route("/message", name="message")
     */
    public function message(Request $request)
    {
        $userRepository = $this->getDoctrine()->getRepository(User::class);
        $messageRepository = $this->getDoctrine()->getRepository(Message::class);

        $users = $userRepository->searchUser();

        $groups = $this->getUser()->getGroupCreated();

        $messages = $messageRepository->findBy(
            ["author" => $this->getUser()], //clauses where
            ["dateCreated" => "ASC"] //order by
        );

        $message = new Message();
        $messageForm = $this->createForm(MessageType::class, $message);
        $messageForm->handleRequest($request);

        $member = new Member();
        $memberForm = $this->createForm(MemberType::class, $member);
        $memberForm->handleRequest($request);

        $group = new Group();
        $groupForm = $this->createForm(GroupType::class, $group);
        $groupForm->handleRequest($request);

        $user = new User();
        $searchUserForm = $this->createForm(SearchUserType::class, $user);
        $searchUserForm->handleRequest($request);


/*        if($groupForm->isSubmitted() && $groupForm->isValid()){
            $group->setCreator($this->getUser());

            $em = $this->getDoctrine()->getManager();
            $em->persist($group);
            $em->flush();

            $this->addFlash("Success", "Votre groupe à bien été créé !");

            return $this->redirectToRoute("message");
        }*/

        //var_dump($messagesSend);

        return $this->render('message/home.html.twig', [
            'messages' => $messages,
            'users' => $users,
            'groups' => $groups,
            'memberForm' => $memberForm->createView(),
            'messageForm' => $messageForm->createView(),
            'searchUserForm' => $searchUserForm->createView(),
            'groupForm' => $groupForm->createView()
        ]);
    }
}
