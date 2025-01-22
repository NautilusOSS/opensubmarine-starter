from algopy import (
    Global,
    String,
    arc4,
    subroutine,
    UInt64,
    BigUInt,
    Txn,
)
from opensubmarine import ARC200Token, arc200_Transfer
from opensubmarine.utils.algorand import require_payment
from opensubmarine.utils.types import Bytes32, Bytes8


class HelloWorld(ARC200Token):
    """
    A simple Hello World smart contract that inherits from Ownable.
    """

    def __init__(self) -> None:
        # arc200 state
        self.name = String()
        self.symbol = String()
        self.decimals = UInt64()
        self.totalSupply = BigUInt()

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

    @arc4.abimethod
    def mint(
        self,
        receiver: arc4.Address,
        name: Bytes32,
        symbol: Bytes8,
        decimals: arc4.UInt8,
        totalSupply: arc4.UInt256,
    ) -> None:
        """
        Mint tokens
        """
        assert Txn.sender == Global.creator_address, "must be creator"
        assert self.name == "", "name not initialized"
        assert self.symbol == "", "symbol not initialized"
        assert self.totalSupply == 0, "total supply not initialized"
        payment_amount = require_payment(Txn.sender)
        assert payment_amount >= 28500, "payment amount accurate"
        self.owner = Global.creator_address
        self.name = String.from_bytes(name.bytes)
        self.symbol = String.from_bytes(symbol.bytes)
        self.decimals = decimals.native
        self.totalSupply = totalSupply.native
        self.balances[receiver.native] = totalSupply.native
        arc4.emit(
            arc200_Transfer(
                arc4.Address(Global.zero_address),
                receiver,
                totalSupply,
            )
        )
