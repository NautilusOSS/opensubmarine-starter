from algopy import (
    Account,
    Global,
    String,
    arc4,
    subroutine,
    UInt64,
)
from opensubmarine import Stakeable

# See implementation of Stakeable:
# https://github.com/Open-Submarine/opensubmarine-contracts/blob/main/src/opensubmarine/contracts/participation/Stakable/contract.py


class HelloWorld(Stakeable):
    """
    A simple Hello World smart contract that inherits from Ownable.
    """

    def __init__(self) -> None:
        # ownable state
        # Ownable has owner state which we must initialize
        # Note that Stakeable inherits from Ownable
        self.owner = Global.creator_address  # set owner to creator
        # stakeable state
        # Stakeable has delegate state which we must initialize
        self.delegate = Account()  # zero address
        self.stakeable = bool(1)  # 1 (Default unlocked)

    @arc4.abimethod
    def hello_world(self) -> String:
        return String("Hello, World!")

    @arc4.abimethod
    def hello_you(self, you: String) -> String:
        return "Hello, " + you

    @arc4.abimethod
    def hello_you_again(self, you: String, depth: UInt64) -> String:
        return "Hello, " + self.repeat(you, depth)

    @subroutine
    def repeat(self, you: String, depth: UInt64) -> String:
        if depth == 0:
            return String("")
        elif depth == 1:
            return you
        else:
            return you + ", " + self.repeat(you, depth - 1)
