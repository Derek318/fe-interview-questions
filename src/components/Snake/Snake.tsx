import { useEffect, useState, useRef, useMemo } from "react";
import { fruitEmojis } from "../../constants";
import { Typography } from "antd";
import "./Snake.css";

const downSound = require("../../audio/down_move.mp3");
const leftRightSound = require("../../audio/leftright_move.mp3");
const topSound = require("../../audio/top_move.mp3");
const fruitSound = require("../../audio/fruti.mp3");

const { Title } = Typography;

type Segment = {
  row: number;
  col: number;
};

type Fruit = { val: string } & Segment;

function Snake() {
  const boardSize = 15; // Number of rows and columns
  const half = Math.round(boardSize / 2);
  const cellSize = 600 / boardSize; // Calculate the size of each cell
  const moveDelay = 100; // Adjust the delay for snake movement (in milliseconds)
  // Use useMemo to memoize the startingSnake array
  const startingSnake = useMemo(
    () => [
      { row: half, col: half },
      { row: half, col: half - 1 },
      { row: half, col: half - 2 },
      { row: half, col: half - 3 },
    ],
    [half]
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState("right");
  const [fruit, setFruit] = useState<Fruit | null>(null);
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState<Segment[]>(
    gameStarted ? startingSnake : []
  );

  // Create Refs
  const animationFrameRef = useRef<number>();
  const lastTimestampRef = useRef<number>();

  // Create separate refs for each audio element
  const downSoundRef = useRef<HTMLAudioElement | null>(null);
  const leftRightSoundRef = useRef<HTMLAudioElement | null>(null);
  const topSoundRef = useRef<HTMLAudioElement | null>(null);
  const fruitSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // init Audio elements
    if (downSoundRef.current) {
      downSoundRef.current.src = downSound;
    }
    if (leftRightSoundRef.current) {
      leftRightSoundRef.current.src = leftRightSound;
    }
    if (topSoundRef.current) {
      topSoundRef.current.src = topSound;
    }
    if (fruitSoundRef.current) {
      fruitSoundRef.current.src = fruitSound;
    }
  }, []);

  useEffect(() => {
    // Initialize the snake when the game starts
    if (gameStarted && snake.length === 0) {
      setSnake(startingSnake);
      setGameOver(false);
      respawnFruit();
    }
  }, [gameStarted, startingSnake, snake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        // Start the game when the user presses an arrow key for the first time
        setGameStarted(true);
        setScore(0);
      }

      const upDownCheck = direction === "up" || direction === "down";
      const leftRightCheck = direction === "left" || direction === "right";
      switch (e.key) {
        case "ArrowUp":
          if (upDownCheck) {
            break;
          }
          setDirection("up");
          // Play the topSound
          if (topSoundRef.current) {
            topSoundRef.current.play();
          }
          break;
        case "ArrowDown":
          if (upDownCheck) {
            break;
          }
          setDirection("down");
          // Play the downSound
          if (downSoundRef.current) {
            downSoundRef.current.play();
          }
          break;
        case "ArrowLeft":
          if (leftRightCheck) {
            break;
          }
          setDirection("left");
          // Play the leftRightSound
          if (leftRightSoundRef.current) {
            leftRightSoundRef.current.play();
          }
          break;
        case "ArrowRight":
          if (leftRightCheck) {
            break;
          }
          setDirection("right");
          // Play the leftRightSound
          if (leftRightSoundRef.current) {
            leftRightSoundRef.current.play();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, gameStarted]);

  function isWallCollision(newHead: Segment) {
    const xCollide = newHead.col < 0 || newHead.col >= boardSize;
    const yCollide = newHead.row < 0 || newHead.row >= boardSize;
    return xCollide || yCollide;
  }

  function isBodyCollision(newHead: Segment) {
    return snake.some(
      (segment) => segment.row === newHead.row && segment.col === newHead.col
    );
  }

  function respawnFruit() {
    // Generate a random position for the fruit that is not occupied by the snake
    let newFruit: Fruit | null = null;
    do {
      const row = Math.floor(Math.random() * boardSize);
      const col = Math.floor(Math.random() * boardSize);
      const val = fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];
      newFruit = { val, row, col };
    } while (
      snake.some(
        // eslint-disable-next-line no-loop-func
        (segment) =>
          segment.row === newFruit!.row && segment.col === newFruit!.col
      )
    );

    setFruit(newFruit);
  }

  // Move the snake forward using requestAnimationFrame
  const moveSnake = (timestamp: number) => {
    if (!lastTimestampRef.current) {
      lastTimestampRef.current = timestamp;
    }

    const timeElapsed = timestamp - lastTimestampRef.current;

    if (timeElapsed >= moveDelay) {
      // Clone the current snake's body
      const newSnake = [...snake];
      // Calculate the new head position based on the current direction
      let newHead: Segment = { ...newSnake[0] };
      switch (direction) {
        case "up":
          newHead.row -= 1;
          break;
        case "down":
          newHead.row += 1;
          break;
        case "left":
          newHead.col -= 1;
          break;
        case "right":
          newHead.col += 1;
          break;
        default:
          break;
      }

      // Check if game over
      if (isBodyCollision(newHead) || isWallCollision(newHead)) {
        setGameStarted(false);
        setGameOver(true);
        setSnake([]); // Clear the snake
      } else {
        // Check if the snake collides with the fruit
        if (fruit && newHead.row === fruit.row && newHead.col === fruit.col) {
          // Increment the score
          setScore(score + 10);
          if (fruitSoundRef.current) {
            fruitSoundRef.current.play();
          }
          respawnFruit();
        } else {
          newSnake.pop();
        }
        newSnake.unshift(newHead);
        // Set the snake's state with the updated position
        setSnake(newSnake);
      }

      lastTimestampRef.current = timestamp;
    }

    // Schedule the next movement
    animationFrameRef.current = requestAnimationFrame(moveSnake);
  };

  useEffect(() => {
    // Start moving the snake initially
    if (gameStarted) {
      animationFrameRef.current = requestAnimationFrame(moveSnake);
    }

    return () => {
      // Cancel the animation frame when the component unmounts
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [direction, gameStarted, snake]);

  const renderRow = (rowIndex: number) => {
    const cells = [];
    for (let colIndex = 0; colIndex < boardSize; colIndex++) {
      const isBlack = (rowIndex + colIndex) % 2 === 0;
      const cellClassName = `cell${isBlack ? " black" : ""}`;
      const isSnakeSegment = snake.some(
        (segment) => segment.row === rowIndex && segment.col === colIndex
      );
      const isFruit = fruit && fruit.row === rowIndex && fruit.col === colIndex;

      cells.push(
        <div
          className={`tile ${cellClassName}`}
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          key={`${rowIndex}-${colIndex}`}
        >
          {/* Render fruit if it's present */}
          {isFruit && (
            <div
              className={"fruit"}
              style={{
                width: "100%",
                height: "100%",
                fontSize: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {fruit.val}
            </div>
          )}
          {/* Render snake segment if it's present */}
          {isSnakeSegment && (
            <div
              className={"snake-segment"}
              style={{
                backgroundColor: "green",
                // borderRadius: "20px",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Display smiley face on the snake's head */}
              {snake[0].row === rowIndex && snake[0].col === colIndex && (
                <span
                  className={`emoji ${direction}`}
                  style={{ fontSize: "12px" }}
                >
                  👁️👅👁️
                </span>
              )}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="row" key={rowIndex}>
        {cells}
      </div>
    );
  };

  const rows = [];
  for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
    rows.push(renderRow(rowIndex));
  }

  /** SNAKE GAME COMPONENT */
  return (
    <div>
      <Title level={4} style={{ textAlign: "center", marginBottom: "16px" }}>
        {gameStarted
          ? "Use arrow keys to control the snake"
          : "Press an arrow key to start the game"}
      </Title>
      <div className="score">Score: {score}</div>
      {gameOver ? (
        <div className="game-over-message">Game Over</div>
      ) : (
        <div className="checkerboard">{rows}</div>
      )}
      <audio ref={downSoundRef} />
      <audio ref={leftRightSoundRef} />
      <audio ref={topSoundRef} />
      <audio ref={fruitSoundRef} />
    </div>
  );
}

export default Snake;
