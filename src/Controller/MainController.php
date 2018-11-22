<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegisterType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class MainController extends Controller
{
    /**
     * @Route("/", name="home")
     */
    public function home(Request $request, UserPasswordEncoderInterface $passwordEncoder)
    {
        if(!$this->getUser()){
            return $this->redirectToRoute('user_register');
        } else {

            $user = new User();
            $form = $this->createForm(RegisterType::class, $user);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $user->setDateRegistered(new \DateTime());
                $user->setRoles(["ROLE_USER"]);

                //hash le mot de passe
                $hash = $passwordEncoder->encodePassword($user, $user->getPassword());
                $user->setPassword($hash);

                $em = $this->getDoctrine()->getManager();
                $em->persist($user);
                $em->flush();

                $this->addFlash("Success", "Votre compte à bien été créé !");

                /*//envoi de l'email
                $bucketMailer->sendRegistrationMail($user);*/

                return $this->redirectToRoute("home");
            }

            return $this->render('main/home.html.twig', [
                "form_register" => $form->createView(),
                "user" => $this->getUser(),
            ]);
        }

    }
}
