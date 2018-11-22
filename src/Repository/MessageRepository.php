<?php

namespace App\Repository;

use App\Entity\Message;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Message|null find($id, $lockMode = null, $lockVersion = null)
 * @method Message|null findOneBy(array $criteria, array $orderBy = null)
 * @method Message[]    findAll()
 * @method Message[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Message::class);
    }

    public function getUserMessages(User $user, User $receiver)
    {
        //Version en Query Builder
        $qb = $this->createQueryBuilder('m');
        $qb->select('m');
        //->andWhere('w.dateCreated >= 2018')
        $qb->addOrderBy('m.dateCreated', 'ASC');
        $qb->andWhere('m.receiver = :receiver OR m.receiver = :receiver2');
        $qb->setParameter('receiver', $receiver);
        $qb->setParameter('receiver2', $user);
        $qb->andWhere('m.author = :user OR m.author = :user2');
        $qb->setParameter('user', $user);
        $qb->setParameter('user2', $receiver);

        $query = $qb->getQuery();
        $users = $query->getResult();

        return $users;
    }

    // /**
    //  * @return Message[] Returns an array of Message objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Message
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
