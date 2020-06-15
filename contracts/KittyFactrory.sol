pragma solidity ^0.5.0;

contract KittyFactory {

    /*
    *   A new cat is born
    */
    event Birth(address owner, uint256 kittyId, uint256 mumId, uint256 dadId, uint256 genes);

    /*
    *   A cat has been transfer
    */
    event Transfer(address from, address to, uint256 tokenId);

    /*
    *   Here we will use the same structure as the original crypto kitties game
    *   As it fit exactly into two bit words
    */
    struct Kitty {

        uint256 genes;
        uint64 birthTime;
        uint64 reproductionCd;
        uint32 mumId;
        uint32 dadId;

        /*
        *   Store the dad id if the mum is virgin this value is 0
        */
        uint32 birthCertificatId;

        uint16 cooldownIndex;

        uint16 generation;
    }

    /*** CONSTANTS ***/

    uint32[7] public cooldowns = [
        uint32(1 minutes),
        uint32(2 minutes),
        uint32(5 minutes),
        uint32(10 minutes),
        uint32(30 minutes),
        uint32(1 hours),
        uint32(2 hours)
    ];

    // An approximation of currently how many seconds are in between blocks.
    uint256 public secondsPerBlock = 15;


    Kitty[] kitties;

    mapping (uint256 => address) public kittyIndexToOwner;
    mapping (address => uint256) ownershipTokenCount;


    function createKitty(
        uint256 _mumId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    )
        public
        returns (uint)
    {


        // New kitty starts with the same cooldown as parent gen/2
        uint16 cooldownIndex = uint16(_generation / 2);
        if (cooldownIndex > 6) {
            cooldownIndex = 7;
        }

        Kitty memory _kitty = Kitty({
            genes: _genes,
            birthTime: uint64(now),
            reproductionCd: 0,
            mumId: uint32(_mumId),
            dadId: uint32(_dadId),
            birthCertificatId: 0,
            cooldownIndex: cooldownIndex,
            generation: uint16(_generation)
        });
        uint256 newKittenId = kitties.push(_kitty) - 1;

        // It's probably never going to happen, 4 billion cats is A LOT, but
        // let's just be 100% sure we never let this happen.
        require(newKittenId == uint256(uint32(newKittenId)));

        // emit the birth event
        emit Birth(
            _owner,
            newKittenId,
            uint256(_kitty.mumId),
            uint256(_kitty.dadId),
            _kitty.genes
        );

        return newKittenId;
    }
}
