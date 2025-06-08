import { useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";

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

  const renderMessageWithButtons = (text: string) => {
    // Pattern to match [Button Text](#section-id)
    const buttonPattern = /\[([^\]]+)\]\(#([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = buttonPattern.exec(text)) !== null) {
      // Ensure match has required parts
      if (!match[1] || !match[2]) continue;

      // Add text before the button
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add the button
      parts.push(
        <button
            key={match.index}
            onClick={() => handleNavigation(match[2] || '')}
            className="inline-flex items-center px-3 py-1 mx-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
          >
          {match[1]}
        </button>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last button
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 p-3 md:p-4 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
        size="icon"
      >
        {isOpen ? (
          <X className="w-5 h-5 md:w-6 md:h-6" />
        ) : (
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-20 top-20 md:bottom-24 md:right-8 md:top-auto md:left-auto md:w-96 md:h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-40 flex flex-col">
          {/* Header */}
          <div className="p-3 md:p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm md:text-base">
                  Chidi's AI Assistant
                </h3>
                <p className="text-xs md:text-sm text-blue-100">
                  Ask me anything about Chidi's work!
                </p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="md:hidden text-white hover:bg-blue-700"
              >
                <X className="w-4 h-4" />
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

          {/* Programming Illustrations */}
          {!isLoading && messages.length <= 3 && (
            <div className="px-4 pb-2">
              <div className="flex justify-center space-x-4 opacity-30">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 text-blue-400">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-400">Code</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 text-green-400">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 9.899C16.16 26.739 20 22.55 20 17V7l-8-5z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-400">Secure</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 text-purple-400">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-400">Fast</div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start px-4 pb-2">
              <div className="flex items-start space-x-2">
                <div className="p-2 rounded-full bg-gray-100">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
        </div>
      )}
    </>
  );
}