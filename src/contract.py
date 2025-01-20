from algopy import (
    ARC4Contract,
    arc4,
    String,
)

class HelloWorld(ARC4Contract):
    def __init__(self) -> None:
        pass

    @arc4.abimethod
    def hello_world(self) -> String:
        return String("Hello, World!")