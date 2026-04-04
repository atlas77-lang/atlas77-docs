# Programming A Guessing Game

This chapter is a guided exercise.

Goals:

- Read input from the terminal
- Parse and compare values
- Use loops and conditions

Minimal loop structure:

```atlas77
import "std/io";

fun main() {
    let running: bool = true;
    while running {
        print("Guess: ");
        let guess = input();
        println(guess.c_str());
        // add parse + compare logic here
        break;
    }
}
```
