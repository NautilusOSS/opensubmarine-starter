from algopy import (
    Account,
    Global,
    String,
    arc4,
    subroutine,
    UInt64,
)
from opensubmarine import Ownable

# See implementation of Ownable:
# https://github.com/Open-Submarine/opensubmarine-contracts/blob/main/src/opensubmarine/contracts/access/Ownable/contract.py

class HelloWorld(Ownable):
    """
    A simple Hello World smart contract that inherits from Ownable.
    """

    def __init__(self) -> None:
        # ownable state
        # Ownable has owner state which we must initialize
        self.owner = Global.creator_address  # set owner to creator

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

    # Ownable implements transfer method to transfer ownership
    # We can override it to add additional logic
    # For example, we can make it so that ownership is non-transferable
    @arc4.abimethod
    def transfer(self, new_owner: arc4.Address) -> None:
        pass
