<?php

namespace App\Repository;

use App\Entity\Group;
use App\Entity\Member;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Group|null find($id, $lockMode = null, $lockVersion = null)
 * @method Group|null findOneBy(array $criteria, array $orderBy = null)
 * @method Group[]    findAll()
 * @method Group[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GroupRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Group::class);
    }

    public function getGroup(User $user = null, Group $group = null)
    {
        //Version en Query Builder
        $qb = $this->createQueryBuilder('g');
        $qb->select('g');
        $qb->leftJoin('g.members', 'm');
        //->andWhere('w.dateCreated >= 2018')
        //$qb->addOrderBy('g.members', 'ASC');
        if($user) {
            $qb->andWhere('g.creator = :user OR m.user = :member');
            $qb->setParameter('user', $user);
            $qb->setParameter('member', $user);
        }
        if($group) {
            $qb->andWhere('g.id = :groupe');
            $qb->setParameter('groupe', $group->getId());
        }

        $query = $qb->getQuery();
        $users = $query->getResult();

        return $users;
    }

    // /**
    //  * @return Group[] Returns an array of Group objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('g.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Group
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
