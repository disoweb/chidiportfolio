import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Chidi. I specialize in building high-performance applications that drive growth. How can I assist with your project today? You can ask about my [Projects](#projects) or [Skills](#skills).",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/ai_chat", {
        message: inputValue,
        context: "web_development_portfolio",
      });
      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text:
            data.response ||
            "I'd be happy to help with that. Could you provide more details?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting. Feel free to email me directly at 99chidiso@gmail.com",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // ** FIX APPLIED HERE **
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const renderMessageContent = (content: string) => {
    const buttonRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
    const matches = Array.from(content.matchAll(buttonRegex));
    if (matches.length === 0) {
      return content;
    }
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    matches.forEach((match) => {
      const buttonText = match[1];
      const sectionId = match[2];
      if (match.index != null && match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      parts.push(
        <button
          key={match.index}
          onClick={() => handleNavigation(sectionId)}
          className="inline-flex items-center px-3 py-1 mx-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors duration-200"
        >
          {buttonText}
        </button>
      );
      if (match.index != null) {
        lastIndex = match.index + match[0].length;
      }
    });
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }
    return parts;
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hi! I'm Chidi. I specialize in building high-performance applications that drive growth. How can I assist with your project today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="font-sans">
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] h-[75vh] max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col sm:w-96 sm:h-[600px]"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 flex justify-between items-center">
              <div>
                <h2 className="text-white font-semibold text-md">
                  AI Assistant
                </h2>
                <p className="text-blue-100 text-xs">Web Development</p>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={clearChat}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Clear chat"
                >
                  <RefreshCw className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-3 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start max-w-[85%] ${
                        message.isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${
                          message.isUser
                            ? "bg-blue-500"
                            : "bg-gradient-to-r from-blue-500 to-indigo-500"
                        }`}
                      >
                        {message.isUser ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`mx-2 px-3 py-2 rounded-2xl ${
                          message.isUser
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white border border-gray-200 rounded-tl-none shadow-sm"
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap break-words">
                          {renderMessageContent(message.text)}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            message.isUser ? "text-blue-200" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex space-x-2">
                          <div
                            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-gray-200 p-2 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}