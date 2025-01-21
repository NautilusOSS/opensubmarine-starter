from algopy import (
    ARC4Contract,
    arc4,
    String,
    subroutine,
    UInt64,
    urange
)

class HelloWorld(ARC4Contract):
    def __init__(self) -> None:
        pass

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