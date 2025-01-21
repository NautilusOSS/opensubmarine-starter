from algopy import (
    Global,
    String,
    arc4,
)

from opensubmarine import Ownable


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

    # Ownable implements transfer method to transfer ownership
    # We can override it to add additional logic
    # For example, we can make it so that ownership is non-transferable
    @arc4.abimethod
    def transfer(self, new_owner: arc4.Address) -> None:
        pass
