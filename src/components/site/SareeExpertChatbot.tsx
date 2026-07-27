import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Heart, RefreshCw, MessageCircle } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/site-data";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";
import { Link } from "@tanstack/react-router";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  products?: Product[];
  quickReplies?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "bot",
    text: "Namaste! I am Aisha, your personal Mumbai Bazar Saree Stylist. 🌸 How may I assist you with your drape today?",
    timestamp: "Just now",
    quickReplies: [
      "✨ Suggest a Wedding Saree",
      "🌿 Soft Silks for Everyday",
      "📜 How to verify Silk Mark?",
      "✂️ Need Blouse Stitching",
    ],
  },
];

export function SareeExpertChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      generateResponse(text);
      setIsTyping(false);
    }, 900);
  };

  const generateResponse = (userText: string) => {
    const lower = userText.toLowerCase();
    let replyText = "";
    let matchedProducts: Product[] = [];
    let quickReplies: string[] = [];

    if (lower.includes("wedding") || lower.includes("bridal") || lower.includes("trousseau") || lower.includes("reception")) {
      replyText = "For wedding functions and grand bridal trousseaus, I strongly recommend our pure gold zari Kanjivarams and royal Banarasi brocades. Here are our top handwoven bridal drapes:";
      matchedProducts = PRODUCTS.filter((p) => p.category.includes("wedding-sarees")).slice(0, 3);
      quickReplies = ["Custom Blouse Options", "Book Video Call Consultation", "Other Weaves"];
    } else if (lower.includes("everyday") || lower.includes("office") || lower.includes("soft") || lower.includes("daily")) {
      replyText = "For effortless daily wear and long office hours, our lightweight soft silks and tissue drapes offer zero-fatigue comfort with elegant sheen:";
      matchedProducts = PRODUCTS.filter((p) => p.category.includes("everyday-sarees")).slice(0, 3);
      quickReplies = ["Care Instructions", "Festive Sarees", "Silk Mark Info"];
    } else if (lower.includes("silk mark") || lower.includes("pure") || lower.includes("quality") || lower.includes("verify")) {
      replyText = "Every silk saree at Mumbai Bazar carries the official Silk Mark certification tag. Each piece is independently laboratory-tested for 100% pure mulberry silk and authentic zari content!";
      quickReplies = ["Browse Pure Silks", "Care Guide", "Speak to Stylist"];
    } else if (lower.includes("blouse") || lower.includes("stitching") || lower.includes("fall")) {
      replyText = "All our sarees come with a coordinating unstitched blouse piece (0.80m–0.90m). Fall and pico edging are complimentary! For custom blouse tailoring, our stylists record your exact measurements via WhatsApp.";
      quickReplies = ["Bridal Sarees", "WhatsApp Concierge", "Main Boutique"];
    } else if (lower.includes("festive") || lower.includes("puja") || lower.includes("diwali") || lower.includes("party")) {
      replyText = "For grand pujas and evening celebrations, vibrant jewel-toned Banarasis and metallic tissue silks create an enchanting presence:";
      matchedProducts = PRODUCTS.filter((p) => p.category.includes("festive-edit")).slice(0, 3);
      quickReplies = ["Wedding Sarees", "Care Guide"];
    } else {
      replyText = `Thank you for asking! I've curated a few of our most loved handwoven pieces for you. Is there a specific occasion, color, or weave region you have in mind?`;
      matchedProducts = PRODUCTS.slice(0, 2);
      quickReplies = ["Wedding Sarees", "Everyday Soft Silks", "Speak to Live Stylist"];
    }

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      products: matchedProducts.length > 0 ? matchedProducts : undefined,
      quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  const handleAddToCart = (p: Product) => {
    addItem({
      id: p.id,
      name: p.name,
      price: parsePriceToNumber(p.price),
      priceLabel: p.price,
      image: p.img,
      weave: p.weave,
    });
    openCart();
  };

  const waMsg = encodeURIComponent("Hello Mumbai Bazar Concierge, I am chatting with Aisha on your website and would like live stylist assistance.");

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex items-center gap-3 border border-gold/60 bg-maroon px-4 py-3 text-ivory shadow-[0_10px_25px_-5px_rgba(66,23,30,0.4)] transition-all duration-300 hover:bg-wine hover:scale-105"
        >
          <div className="relative">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/20 text-gold font-serif font-bold text-sm">
              A
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-maroon" />
          </div>

          <div className="text-left">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-gold">Saree Stylist AI</span>
            <span className="block font-serif text-xs">Chat with Aisha</span>
          </div>

          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Window Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[580px] max-h-[85vh] border border-gold/60 bg-ivory shadow-[0_25px_60px_-15px_rgba(66,23,30,0.35)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Chat Header */}
          <div className="border-b border-gold/40 bg-wine px-5 py-4 text-ivory flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/20 border border-gold/40 text-gold font-serif font-bold text-base">
                  A
                </span>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-wine" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-base text-ivory font-medium">Aisha</h3>
                  <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider bg-gold/20 text-gold px-1.5 py-0.5 rounded font-semibold">
                    <Sparkles className="h-2.5 w-2.5" /> Stylist
                  </span>
                </div>
                <p className="text-[11px] text-ivory/80">Mumbai Bazar Heritage Concierge</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-ivory/70 hover:text-ivory p-1 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-beige/10">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-maroon text-ivory rounded-tl-lg rounded-tr-lg rounded-bl-lg border border-gold/30"
                      : "bg-ivory text-ink rounded-tr-lg rounded-br-lg rounded-bl-lg border border-gold/50 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Product Cards Carousel in Chat */}
                  {m.products && m.products.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-gold/30">
                      {m.products.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 border border-gold/40 bg-beige/30 p-2 text-left"
                        >
                          <img src={p.img} alt={p.name} className="h-14 w-12 object-cover border border-gold/40 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] uppercase tracking-widest text-gold-deep block truncate">{p.weave}</span>
                            <h4 className="font-serif text-xs text-ink font-medium truncate">{p.name}</h4>
                            <span className="text-xs font-semibold text-maroon block mt-0.5">{p.price}</span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(p)}
                            className="p-2 bg-maroon text-ivory hover:bg-wine shrink-0 text-[10px] font-semibold tracking-wider uppercase"
                            title="Add to Bag"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1.5 ${m.sender === "user" ? "text-ivory/70" : "text-taupe"}`}>
                    {m.timestamp}
                  </span>
                </div>

                {/* Quick Reply Chips */}
                {m.quickReplies && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                    {m.quickReplies.map((qr) => (
                      <button
                        key={qr}
                        onClick={() => handleSend(qr)}
                        className="border border-gold/50 bg-ivory hover:bg-maroon hover:text-ivory text-ink px-2.5 py-1 text-[10px] font-medium transition-colors"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-taupe bg-ivory p-3 border border-gold/40 rounded-lg w-max">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-maroon" />
                <span>Aisha is consulting the weavers...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Transfer to Live Stylist Banner */}
          <div className="border-t border-gold/40 bg-beige/40 px-4 py-2 flex items-center justify-between">
            <span className="text-[10px] text-taupe flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" /> Human Stylists On Call
            </span>
            <a
              href={`https://wa.me/919999999999?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] uppercase font-semibold tracking-wider text-maroon hover:text-gold-deep flex items-center gap-1"
            >
              <MessageCircle className="h-3 w-3" /> Live WhatsApp
            </a>
          </div>

          {/* Input Footer */}
          <div className="border-t border-gold/50 bg-ivory p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about weaves, saree drape, care..."
                className="flex-1 border border-gold/50 bg-beige/20 px-3 py-2 text-xs text-ink placeholder:text-taupe focus:border-maroon focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="grid h-8 w-8 place-items-center bg-maroon text-ivory disabled:opacity-40 hover:bg-wine transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
