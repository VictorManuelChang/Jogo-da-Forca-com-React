import { useCallback, useEffect, useState } from "react"

import words from "./wordList.json"
import { HangmanDrawing } from './Components/HangmanDrawing';
import { HangmanWord } from "./Components/HangmanWord";
import { Keyboard } from "./Components/Keyboard";


function App() {
  
  const [wordToGuess, setWordToGuess] = useState(() => {

    return words[Math.floor(Math.random() * words.length)];

  });
  
  const [guessedLetters, setGuessedLetters] = useState <string[]> ([]);
  
  const incorrectLetters = guessedLetters.filter(letter => 
    !wordToGuess.includes(letter))

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess
    .split("")
    .every(letter => guessedLetters.includes(letter)) //Se todas as letras advinhadas estiverem incluidas, então quere dizer que a gente ganhou

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return

    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters, isWinner, isLoser])


  useEffect (() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }
      document.addEventListener("keypress", handler)

      return () => { 
        document.removeEventListener("keypress", handler )
      }
    
  }, [guessedLetters ])


  return <div style={{
    maxWidth: "700px",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    margin: "0 auto",
    alignItems: "center"
  }}>
      <div  style={{fontSize: "2rem", textAlign: "center"}}>
        {isWinner && "Winner! Refresh to try again!"}
        {isLoser && "You lose! Refresh to try again!"}
      </div>
      <HangmanDrawing numberOfGuesses = {incorrectLetters.length} />
      <HangmanWord 
      reveal = {isLoser}
      guessedLetters={guessedLetters}  wordToGuess = {wordToGuess} />
      <div style={{alignSelf: "stretch"}}>
        <Keyboard 
        disabled = {isWinner || isLoser}
        activeLetters = {guessedLetters.filter(letter =>  wordToGuess.includes(letter))}
        inactiveletters={incorrectLetters}
        addGuessedLetter = {addGuessedLetter}
         />
      </div>
  </div>
  
}

export default App

