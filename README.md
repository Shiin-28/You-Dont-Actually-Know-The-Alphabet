# You Don't Actually Know The Alphabet

**You Don't Actually Know The Alphabet** is a fast-paced browser game that puts your ABCs to the test. Each round shows a simple statement like "M comes before K" or "R is between N and T," and you have just 3 seconds to decide if it's true or false. Get it right and the timer resets; get it wrong or run out of time and the game is over. It sounds easy, until you realize how often you have to sing the alphabet song in your head.

## How to Play

| Action | Keyboard | Touch |
| ------ | -------- | ----- |
| Answer **TRUE** | `←` Left arrow | Tap the left half of the screen |
| Answer **FALSE** | `→` Right arrow | Tap the right half of the screen |
| Start / Retry | `←`, `→` or `Space` | Tap anywhere |

- Every correct answer scores a point and resets the timer to **3 seconds**.
- A wrong answer or running out of time ends the game.
- Your best score for the session is shown on the start and game over screens.

### Statement Types

- `X comes before Y`
- `X comes after Y`
- `X is between Y and Z`

As time runs low, the timer turns red and the screen starts to shake.

## Getting Started

Requires [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
  layout.tsx            Root layout, font and page metadata
  page.tsx              Renders the game
  globals.css           Global styles and animations
components/
  Game.tsx              Input handling and screen switching
  StartScreen.tsx       Title screen
  PromptDisplay.tsx     Current statement, score and timer
  TimerBar.tsx          Countdown bar
  GameOverScreen.tsx    Final score and retry
hooks/
  useAlphabetEngine.ts  Game state, timer loop and prompt generation
```

## Built With

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
