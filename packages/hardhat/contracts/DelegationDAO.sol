// SPDX-License-Identifier: UNLICENSED


pragma solidity >=0.8.0;

import "./StakingInterface.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract DelegationDAO is AccessControl{


    using SafeMath for uint256;

    bytes32 public constant MEMBER = keccak256("MEMBER"); 

    enum daoState  { COLLECTING, STAKING, REVOKING, REVOKED }

    daoState public currentState;

    mapping(address => uint256) public  memberStakes;

    uint256 public totalStake;

    ParachainStaking public staking;

    address public constant stakingPrecompileAddress = 0x0000000000000000000000000000000000000800;

    uint256 public mintDelegatorStk = 5 ether;

    address public target;

    event Deposit(address indexed _from, uint _value);

    event Withdrawal(address indexed _from, address indexed _to, uint _value);


    constructor(address _target, address admin){

        target = _target;
        staking = ParachainStaking(stakingPrecompileAddress);

        _setupRole(DEFAULT_ADMIN_ROLE, admin);

        _setupRole(MEMBER, admin);

        currentState = daoState.COLLECTING;
    }


    function grant_admin(address newAdmin) public
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlyRole(MEMBER)
        {
            grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
            grantRole(MEMBER, newAdmin);
        }

    function grant_member(address newMember) public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(MEMBER, newMember);
    }
    

    function remove_member ( address payable exMember) public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
            revokeRole(MEMBER, exMember);
    }

    function check_free_balance() public view onlyRole(MEMBER) returns(uint256)
    {
        return address(this).balance;
    }

    function change_target(address newCollator) public onlyRole(DEFAULT_ADMIN_ROLE){
        
        require(currentState==daoState.REVOKED || currentState==daoState.COLLECTING,
        "The DAO is not in the correct state to change the staking target.");
        target = newCollator;
    }

    function reset_dao() public onlyRole(DEFAULT_ADMIN_ROLE){
        currentState = daoState.COLLECTING;
    }


    function add_stake() external payable onlyRole(MEMBER){
        if(currentState == daoState.STAKING)
        {
            if(!staking.isDelegator(address(this))){
                revert("The DAO is in an inconsistent State");
            }

            memberStakes[msg.sender] = memberStakes[msg.sender].add(msg.value);
            totalStake = totalStake.add(msg.value);

            emit Deposit(msg.sender, msg.value);

            staking.delegatorBondMore(target, msg.value);
        }

        if(currentState==daoState.COLLECTING){
            memberStakes[msg.sender] = memberStakes[msg.sender].add(msg.value);
            totalStake = totalStake.add(msg.value);

            emit Deposit(msg.sender, msg.value);

            if(totalStake < mintDelegatorStk)
            {
                return;
            }
            else{
                staking.delegate(target, address(this).balance, staking.candidateDelegationCount(target), staking.delegatorDelegationCount(address(this)));
            }
        }
        else{
            revert("The Dao is not accepting new stakes in its current State");
        }


    }


    function schedule_Revoke() public onlyRole(DEFAULT_ADMIN_ROLE){
        require(currentState ==  daoState.STAKING,"The DAO is not in the correct state to schedule a revoke.");
        staking.scheduleRevokeDelegation(target);
        currentState = daoState.REVOKING;
    }


    function execute_revoke() internal onlyRole(MEMBER) returns(bool){
        require(currentState == daoState.REVOKING,"The DAO is not in the correct state to schedule a revoke.");
        staking.executeDelegationRequest(address(this),target);

        if(staking.isDelegator(address(this))){
            return false;
        }else{
            currentState== daoState.REVOKED;
            return true;
        }

    }

    function withdraw(address payable account) public onlyRole(MEMBER){
                require(currentState == daoState.STAKING,"The DAO is not in the correct state to schedule a revoke.");

                if(currentState == daoState.REVOKING){
                    bool result = execute_revoke();
                    require(result,"Exit delay period has not been finished yet.");
                }

                if(currentState==daoState.REVOKED || currentState==daoState.COLLECTING){
                    if(staking.isDelegator(address(this))){
                        revert("The DAO is in an inconsistent state.");
                    }

                    require(totalStake!=0,"Cannot divide by zero.");

                    uint amount = address(this).balance.mul(memberStakes[msg.sender]).div(totalStake);
                    require(check_free_balance()>=amount,"Not enough free balance for withdrawal");
                    Address.sendValue(account, amount);

                    totalStake = totalStake.sub(memberStakes[msg.sender]);
                    memberStakes[msg.sender] = 0;
                    emit Withdrawal(msg.sender, account, amount);
                }

    }

















}
