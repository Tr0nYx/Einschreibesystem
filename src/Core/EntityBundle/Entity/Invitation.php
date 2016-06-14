<?php
/**
 * Created by IntelliJ IDEA.
 * User: Andreas Ifland
 * Authors: Andreas Ifland
 * Date: 02.06.2016
 * Time: 10:27
 */
namespace Core\EntityBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * this class provides the entitys and methods for the invitation
 * @ORM\Entity 
*/
class Invitation
{
    /** @ORM\Id @ORM\Column(type="string", length=6) */
    protected $code;

    /** @ORM\Column(type="string", length=256) */
    protected $email;

    /**
     * When sending invitation set this value to 'true'
     *
     * It prevents sending invitations twice
     *
     * @ORM\Column(type="boolean")
     */
    protected $sent =false;
    /**
     * function to construct an invitation
     */
    public function __construct()
    {
        //generate identifier only once, here a 6 characters length code
        $this->code = substr(md5(uniqid(rand(), true)), 0, 6);
    }
    /**
     * function to get code of an invitaion
     */
    public function  getCode()
    {
        return $this->code;
    }

    /**
     * function to get sendstate of invitation
     */
    public function isSent()
    {
        return $this->sent;
    }
    /**
     * function to send invitation
     */
    public function send()
    {
        $this->sent = true;
    }

}
