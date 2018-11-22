<?php

namespace App\Command;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class DummyDataCommand extends ContainerAwareCommand
{
    protected static $defaultName = 'app:dummy-data';
    protected $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        parent::__construct();
        $this->passwordEncoder = $passwordEncoder;
    }

    protected function configure()
    {
        $this
            ->setDescription('Loads dummy data in database named "slaque"')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);
        $faker = \Faker\Factory::create("fr_FR");
        $doctrine = $this->getContainer()->get('doctrine');
        $entityManager = $doctrine->getManager();
        $connection = $doctrine->getConnection();

        //vide la table
/*        $connection->query("SET FOREIGN_KEY_CHECKS = 0");
        $connection->query("TRUNCATE TABLE user");
        $connection->query("TRUNCATE TABLE message");
        $connection->query("TRUNCATE TABLE group");
        $connection->query("TRUNCATE TABLE group_user");
        $connection->query("TRUNCATE TABLE reaction");
        $connection->query("SET FOREIGN_KEY_CHECKS = 1");
        $io->text("tables truncated !");*/


        $io->text("Création des users");
        /*
         * Création de user bidons
         */
        $io->progressStart(200);
        for($i = 0; $i<200; $i++) {
            $user = new User();
            $user->setUsername($faker->userName);
            $user->setEmail($faker->email);

            //hash le mot de passe
            $hash = $this->passwordEncoder->encodePassword($user, "test");
            $user->setPassword($hash);

            $user->setDateRegistered($faker->dateTimeBetween("- 2 years"));
            $user->setRoles(["ROLE_USER"]);

            $entityManager->persist($user);
            $io->progressAdvance();
        }
        $io->progressFinish();
        $entityManager->flush();

        /*
         * Création de ...
         *
        $io->progressStart(1000);
        for($i = 0; $i<1000; $i++) {

            $io->progressAdvance();
        }
        $io->progressFinish();
        $entityManager->flush();
        */

        $io->success('Successfull !');
    }
}
