"use client";
import React, { useState, useRef, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@ui/button";
import { Textarea } from "@ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { ScrollArea } from "@ui/scroll-area";
import { Loader2, Send, Bookmark, Sparkles, Clipboard, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const AethraBotChat = () => {
  const saveBotNote = useMutation(api.documents.saveBotNote);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const { user } = useClerk();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if browser supports speech synthesis
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load available voices
  useEffect(() => {
    if (isSpeechSupported) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices.filter(voice => voice.lang.includes('en')));
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, [isSpeechSupported]);

  // Sample predefined prompts
  const predefinedPrompts = [
    "Summarize my notes about...",
    "Generate study notes about...",
    "Create bullet points for...",
    "Explain this concept simply...",
    "Convert this to markdown..."
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Improved text-to-speech functionality
  const handleSpeak = (text: string, index: number) => {
    if (!isSpeechSupported) {
      toast.error('Text-to-speech not supported in your browser');
      return;
    }

    // Stop any ongoing speech
    handleStopSpeaking();

    try {
      // Remove markdown formatting for cleaner speech
      const cleanText = text.replace(/[#*_`~\[\]]/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      // Select a voice (prefer English voices)
      if (voices.length > 0) {
        utterance.voice = voices[0]; // Use first available English voice
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentSpeakingIndex(index);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentSpeakingIndex(null);
      };

      utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event);
        setIsSpeaking(false);
        setCurrentSpeakingIndex(null);
        toast.error('Error reading message aloud');
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error initializing speech:', error);
      toast.error('Failed to initialize speech');
    }
  };

  const handleStopSpeaking = () => {
    if (isSpeechSupported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentSpeakingIndex(null);
  };

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      handleStopSpeaking();
    };
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/aethrabot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          system: `You are AethraBot, an AI assistant for note-taking. The user is ${user?.fullName || 'a student'}. 
          Provide concise, well-structured responses. Format responses in markdown when appropriate. 
          For notes, use headings, bullet points, and clear organization.`
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.candidates[0].content.parts[0].text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response from AethraBot');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    let prompt = '';
    switch (action) {
      case 'summarize':
        prompt = 'Summarize the following notes: [paste your notes here]';
        break;
      case 'expand':
        prompt = 'Expand these bullet points into detailed notes: [paste your points here]';
        break;
      case 'quiz':
        prompt = 'Create a quiz based on these notes: [paste your notes here]';
        break;
      case 'format':
        prompt = 'Format these notes with proper headings and markdown: [paste your notes here]';
        break;
      default:
        prompt = 'Help me with my notes: [describe what you need]';
    }
    setInput(prompt);
    setIsOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const saveToNotes = async (content: string) => {
    try {
      // Remove markdown formatting for the title
      const title = content.split('\n')[0].replace(/[#*_`~\[\]]/g, '').substring(0, 50);
      
      await saveBotNote({
        title: title || "AethraBot Note",
        content,
      });
      toast.success("Note saved to your workspace!");
    } catch (error) {
      toast.error("Failed to save note");
      console.error(error);
    }
  };

  const renderMarkdown = (content: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-4 mb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-3 mb-1" {...props} />,
        p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-3" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-3" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        code: (props) => {
  const { inline, className, children, ...rest } = props as {
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
  };

  if (inline) {
    return (
      <code className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 text-sm" {...rest}>
        {children}
      </code>
    );
  }

  return (
    <pre className="bg-gray-800 rounded-md p-3 my-2 overflow-x-auto">
      <code className="text-white" {...rest}>
        {children}
      </code>
    </pre>
  );
},
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:text-gray-300 my-3" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse my-3" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="border px-4 py-2 text-left bg-gray-100 dark:bg-gray-700" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border px-4 py-2" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-96 h-[600px] flex flex-col shadow-xl border-primary/20">
          <CardHeader className="p-4 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">AethraBot Assistant</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-primary"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="flex border-b">
              <Button
                variant={activeTab === 'chat' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('chat')}
                className="rounded-b-none"
              >
                Chat
              </Button>
              <Button
                variant={activeTab === 'notes' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('notes')}
                className="rounded-b-none"
              >
                Notes Tools
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            {activeTab === 'chat' ? (
              <>
                <ScrollArea className="h-[400px] p-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Sparkles className="mx-auto h-8 w-8 mb-2" />
                      <p>Ask AethraBot to help with your notes!</p>
                      {!isSpeechSupported && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                          Text-to-speech not available in your browser
                        </p>
                      )}
                      <div className="mt-4 space-y-2">
                        {predefinedPrompts.map((prompt, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start"
                            onClick={() => {
                              setInput(prompt);
                              setIsOpen(true);
                            }}
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary text-secondary-foreground'
                            } ${
                              currentSpeakingIndex === index && isSpeaking 
                                ? 'ring-2 ring-blue-500' 
                                : ''
                            }`}
                          >
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              {message.role === 'assistant' ? (
                                renderMarkdown(message.content)
                              ) : (
                                <p>{message.content}</p>
                              )}
                            </div>
                            <div className="flex justify-end space-x-2 mt-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-primary"
                                onClick={() => copyToClipboard(message.content)}
                                title="Copy to clipboard"
                              >
                                <Clipboard className="h-3 w-3" />
                              </Button>
                              {message.role === 'assistant' && isSpeechSupported && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-primary"
                                  onClick={() => {
                                    if (isSpeaking && currentSpeakingIndex === index) {
                                      handleStopSpeaking();
                                    } else {
                                      handleSpeak(message.content, index);
                                    }
                                  }}
                                  title={isSpeaking && currentSpeakingIndex === index ? "Stop reading" : "Read aloud"}
                                >
                                  {isSpeaking && currentSpeakingIndex === index ? (
                                    <VolumeX className="h-3 w-3" />
                                  ) : (
                                    <Volume2 className="h-3 w-3" />
                                  )}
                                </Button>
                              )}
                              {message.role === 'assistant' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-primary"
                                  onClick={() => saveToNotes(message.content)}
                                  title="Save to notes"
                                >
                                  <Bookmark className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <form onSubmit={handleSubmit} className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask AethraBot anything about your notes..."
                      className="flex-1 resize-none"
                      rows={2}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="p-4">
                <h3 className="font-medium mb-4">Note Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('summarize')}
                    className="h-24 flex-col"
                  >
                    <Bookmark className="h-5 w-5 mb-1" />
                    Summarize
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('expand')}
                    className="h-24 flex-col"
                  >
                    <Sparkles className="h-5 w-5 mb-1" />
                    Expand
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('quiz')}
                    className="h-24 flex-col"
                  >
                    <Clipboard className="h-5 w-5 mb-1" />
                    Create Quiz
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('format')}
                    className="h-24 flex-col"
                  >
                    <span className="mb-1">#</span>
                    Format
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
          size="icon"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default AethraBotChat;