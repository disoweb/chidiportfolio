import { useState } from "react";
import { MessageCircle, X, Send, Bot, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from 'react';

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
      text: "Hi! my name is Chidi. I build high performance apps that help people and businesses grow at scale. What project can I help you with?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
            "I apologize, but I encountered an issue processing your request.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Chat API error:", errorData);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text:
            errorData.error ||
            "I apologize, but I encountered an issue processing your request. Please try again or contact me directly.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Connection issue. Please try again or book a free consultation directly through the form below.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // Close chat after navigation
    }
  };

  const renderMessageWithButtons = (content: string) => {
    const buttonRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = buttonRegex.exec(content)) !== null) {
      // Add text before the button
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      // Add the button with safe navigation
      const buttonText = match[1] || 'Click here';
      const buttonHref = match[2] || '';

      parts.push(
        <button
              key={match.index}
              onClick={() => handleNavigation(match && match[2] ? match[2] : '')}
              className="inline-flex items-center px-3 py-1 mx-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors break-words"
            >
          {buttonText}
        </button>
      );

      lastIndex = buttonRegex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [content];
  };

  const [currentInput, setCurrentInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!currentInput.trim() || isLoading) {
      return;
    }

    const userMessage = {
      role: 'user',
      content: currentInput.trim(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/ai_chat", {
        message: currentInput.trim(),
        context: "web_development_portfolio",
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = {
          role: 'assistant',
          content: data.response,
        };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      } else {
        console.error("Failed to fetch:", response.status);
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Failed to get response.' }]);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Failed to connect to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className={`fixed bottom-4 right-4 z-50 ${isOpen ? 'hidden' : 'block'}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </motion.div>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-2 right-2 left-2 sm:bottom-6 sm:right-6 sm:left-auto z-50 w-auto sm:w-96 h-[calc(100vh-1rem)] sm:h-[500px] bg-white rounded-lg shadow-2xl border overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">Digital Chidi AI</h3>
                <p className="text-xs sm:text-sm opacity-90 truncate">Ask me anything!</p>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMessages([]);
                    setCurrentInput('');
                  }}
                  className="text-white hover:bg-white/20 p-1 sm:p-2"
                  title="Clear chat"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-1 sm:p-2"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 md:p-4 overflow-y-auto">
            <div className="space-y-3 md:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[85%] ${
                      message.isUser
                        ? "flex-row-reverse space-x-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${
                        message.isUser
                          ? "bg-blue-600"
                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                      }`}
                    >
                      {message.isUser ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl min-w-0 ${
                        message.isUser
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-900 shadow-sm"
                      }`}
                    >
                      <div className="p-3">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {renderMessageWithButtons(message.text)}
                        </div>
                      </div>
                      <div
                        className={`px-3 pb-2 text-xs ${
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
            </div>
          </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about web development, pricing, timeline..."
                className="flex-1 rounded-xl border-gray-200 focus:border-blue-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}