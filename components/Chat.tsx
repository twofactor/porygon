import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Be_Vietnam_Pro } from "next/font/google";

import styles from "../styles/Chat.module.css";

// const roboto = Roboto({
//   weight: '400',
//   subsets: ['latin'],
// })

const beVietnamPro = Be_Vietnam_Pro({
  weight: "400",
  subsets: ["latin"],
});

interface Message {
  id: number;
  user: "me" | "them";
  text: string;
}

const seeds: Message[] = [
  { id: 1, user: "me", text: "gggg" },
  { id: 2, user: "them", text: "swag" },
  { id: 3, user: "me", text: "yo" },
];

const seedsWithUpdatedIds = seeds.map((seed, i) => ({ ...seed, id: i + 1 }));

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(seedsWithUpdatedIds);
  const [sending, setSending] = useState(false);
  const [showNewMessagesButton, setShowNewMessagesButton] = useState(false);
  const [lastChangedIndex, setLastChangedIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const hiddenMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      const isAtBottom =
        chatBoxRef.current.scrollHeight - chatBoxRef.current.scrollTop <=
        chatBoxRef.current.clientHeight + 1;

      if (isAtBottom || messages[messages.length - 1].user === "me") {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        setShowNewMessagesButton(false);
      } else if (messages[messages.length - 1].user === "them") {
        if (chatBoxRef.current.scrollTop !== 0) {
          setShowNewMessagesButton(true);
        }
      }
    }
  }, [messages]);

  function handleScroll() {
    if (chatBoxRef.current) {
      const isAtBottom = chatBoxRef.current.scrollTop === 0;

      if (isAtBottom) {
        setShowNewMessagesButton(false);
      }
    }
  }

  function addMessage() {
    setSending(true);
    hiddenMessageRef.current
      ? (hiddenMessageRef.current.style.zIndex = "2")
      : null;
    let newId = messages.length
      ? Math.max(...messages.map((m) => m.id)) + 1
      : 1;
    let newMessage: Message = {
      id: newId,
      user: "me",
      text: inputValue,
    };

    setInputValue("");
    setLastChangedIndex(messages.length);
    setMessages([...messages, newMessage]);
    setSending(false);
  }

  function addMessageThem() {
    let newId = messages.length
      ? Math.max(...messages.map((m) => m.id)) + 1
      : 1;
    let newMessage: Message = {
      id: newId,
      user: "them",
      text: "swaggy",
    };

    setLastChangedIndex(messages.length);
    setMessages([...messages, newMessage]);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      addMessage();
    }
  }

  let animatingMessages = messages.slice(lastChangedIndex || 0);

  return (
    <>
      <AnimatePresence initial={false} mode="popLayout">
        <div className={beVietnamPro.className + " " + styles.chatBoxContainer}>
          {/* <button onClick={() => addMessageThem()}>lol</button> */}

          <div
            ref={chatBoxRef}
            onScroll={handleScroll}
            className={styles.chatBox}
          >
            <div style={{ flexGrow: 1 }}></div>
            <ul className={styles.messageList}>
              <AnimatePresence initial={false} mode="popLayout">
                {messages.map((message) => (
                  <motion.li
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, zIndex: 2 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      opacity: { duration: 0.2 },
                      layout: {
                        type: "spring",
                        // bounce: 0.4,
                        bounce: 0.12,
                        // duration: lastChangedIndex
                        //   ? animatingMessages.indexOf(message) * 0.15 + 0.85
                        //   : 1,
                        duration: 0.6,
                      },
                    }}
                    style={{
                      originX: message.user === "me" ? 1 : 0,
                      originY: 1,
                    }}
                    key={message.id}
                    layoutId={
                      message.user === "me"
                        ? "MessageID: " + message.id
                        : undefined
                    }
                  >
                    <div className={styles.messageItem}>
                      <div
                        className={`${styles.messageText} ${
                          message.user === "me"
                            ? styles.messageMe
                            : styles.messageThem
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
          <div className={styles.bottomControl}>
            {showNewMessagesButton && (
              <button
                onClick={() => {
                  if (chatBoxRef.current) {
                    chatBoxRef.current.scrollTop =
                      chatBoxRef.current.scrollHeight;
                  }
                }}
              >
                New Messages
              </button>
            )}

            {inputValue ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                layoutId={"MessageID: " + (messages.length + 1)}
                className={`${styles.hiddenMessage} ${styles.messageItem} ${styles.messageMe}`}
                ref={hiddenMessageRef}
              >
                {inputValue}
              </motion.div>
            ) : null}

            <motion.input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={styles.textInput}
              placeholder="Aa"
            />
            <motion.button
              onClick={addMessage}
              disabled={!inputValue.trim()}
              className={styles.sendButton}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="20px"
                height="20px"
                className={styles.sendIcon}
              >
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </AnimatePresence>
    </>
  );
}
